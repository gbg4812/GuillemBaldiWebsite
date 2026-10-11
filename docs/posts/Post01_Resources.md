---
date: '2025-08-13'
update: '2026-09-15'
category:
  - Programming
tag:
  - Programming
  - C++
  - SWD
sidebar: 'heading'
---

# Resources and Resource Management in My Scene Representation Library

[GitHub](https://github.com/gbg4812/SceneEquipament.git)

## Introduction

While I was learning how to build a GPU renderer, I realized the need for data structures to
represent the scene to render. The following are some requirements of the representation system:

- Represent polygonal meshes with an arbitrary number of attributes of a set of types (in the
  vertices for now).
- Represent shaders that use the attributes (vertices) and parameters (uniforms) as inputs.
- Represent materials as a concrete assignment of values to the parameters of the shader.

> [NOTE]: Parameters can be assigned values or handles, as there are parameter types like textures,
> which should be shared between materials.

- Represent other resources like:
  - Models (mesh + material)
  - Lights
  - Cameras
  - Textures
- A way to represent a scene tree with a transform hierarchy.
- A way to flag and queue the resources for update.

At the time of designing, I read the
[Handles are better pointers](https://floooh.github.io/2018/06/17/handles-vs-pointers.html) post and
became quite convinced, so I built a resource system with managers (dense array pools) and handles.
In this post, I want to describe this resource system, which I ended up using to store all the
resources.

## The Resource

### IDs

The resources stored in the managers are uniquely identified by a `uint32` ID. The ID is composed of
the index in the array where the resource is stored plus a generation counter. More precisely, the
index takes the 20 least significant bits and the generation takes the upper 12 bits. This means
that managers can hold up to 1 million instances and there are 4,000 generations, so it is pretty
difficult for the generation counter to wrap around and misverify an old ID.

Here are some utility macros to build and unpack IDs:

```cpp
#define BUILD_ID(gen, idx) (gen << 20) | (idx & 0x000FFFFF)
#define GEN(rid) (rid >> 20)
#define INDEX(rid) (rid & 0x000FFFFF)
```

### The Resource Base Type

The `Resource` class is intended to be inherited by concrete resource types like materials,
textures, meshes, etc. It exposes an interface to access the raw ID or the typed ID (the handle) and
a `name` attribute, which is useful if the resource needs to be displayed in a UI or used for
debugging purposes.

To avoid accidentally copying a whole resource, the copy constructor and copy assignment operator
are deleted.

```cpp
template <typename TH>
class Resource {
    static_assert(std::is_base_of_v<ResourceHandle, TH>,
                  "TH must be based on ResourceHandle");

   public:
    // constructors all resources will need to implement
    Resource() {}
    Resource(uint32_t rid) : _rid(rid) {}
    Resource(std::string name, uint32_t rid) : _name(name), _rid(rid) {}

    // deleted copy utilities
    Resource(const Resource& other) = delete;
    Resource& operator=(const Resource& other) = delete;

    Resource(Resource&& other) = default;
    Resource& operator=(Resource&& other) = default;

    // accessors (encapsulated extensibility)
    const std::string& getName() const { return _name; }
    uint32_t getRID() const { return _rid; }
    TH getHandle() const { return _rid; }

   private:
    std::string _name;
    uint32_t _rid = 0;
};

```

The code below shows the handle type, which simply wraps the `uint32` ID with some utility methods
and a type. One useful method is the `bool` operator, which allows for syntax like `if(handle)` to
check if a handle is null (resource ID 0 is considered null). Like the `Resource` class, the
`ResourceHandle` class is also intended to be inherited by classes like `MeshHandle` or
`MaterialHandle` to add type safety to the handles of different resources.

```cpp
class ResourceHandle {
    uint32_t _rid = 0;

   public:
    ResourceHandle(uint32_t rid) : _rid(rid) {}
    ResourceHandle(uint32_t gen, uint32_t idx) : _rid(BUILD_ID(gen, idx)) {}
    ResourceHandle() : _rid(0) {};
    uint32_t getRID() const { return _rid; }
    uint32_t getIndex() const { return INDEX(_rid); }
    uint32_t getGen() const { return GEN(_rid); }

    bool operator==(const ResourceHandle& other) const {
        return (other._rid == _rid);
    }

    explicit operator bool() const { return INDEX(_rid); }
};

```

The creation of resources needs to be controlled, as the `rid` must be assigned properly. Also, I
didn't want every resource to live in a random place in memory, and I wanted to work with handles.
To comply with all my requirements, it was clear I needed to implement a dense array of resources,
which I called `ResourceManager`.

```cpp
// Manager class to allocate and get instances of a type of resource
template <typename T, typename TH>
class ResourceManager {
    static_assert(std::is_base_of_v<ResourceHandle, TH>,
                  "The TH type must be based of ResourceHandle");
    static_assert(std::is_base_of_v<Resource<TH>, T>,
                  "The T type must be based of Resource");
    static_assert(std::is_constructible_v<T, std::string, uint32_t>,
                  "The T type must have this constructor");
    static_assert(
        std::is_default_constructible_v<T>,
        "The T type must be default constructible with a call to Resource()");

```

These first lines of code define the class with two template parameters: `T` for the type to be
stored and `TH` for the handle type. Following the class declaration, you can see four static
assertions that ensure the types of the handle and the resource are derived respectively from
`ResourceHandle` and `Resource` and that the Resource has a default constructor (needed for default
initialization) and a constructor taking the `rid` and `name` of the resource.

```cpp
private:
    std::Hive<T> _resources;
    std::list<size_t> _free_indexes;
};

```

You can see in the code above that the class has just two attributes: a `Hive` of `T` to store all
the instances and a linked list of free indices to track the slots that are deallocated. In the code
below are all the methods that modify these attributes to provide the functionality of the manager.

> [NOTE]: The `Hive` container allocates chunks of memory when needed, so it is resizable like a
> vector but does not move already-allocated elements. This has the advantage that references or
> pointers to elements of the Hive are not invalidated just by resizing the container, making it
> less error-prone. It also allows the programmer to balance the cost in memory with the cost in
> performance by adjusting the chunk size.

The constructor initializes element 0 (null) and reserves the initial size:

```cpp
   public:
    ResourceManager(size_t initial_size = 20) {
        _resources.reserve(initial_size + 1);
        _resources.push_back(T());
    }

```

The `nextIndex` method returns either the first free index in the list or the next index at the end
of the hive:

```cpp
    uint32_t nextIndex() const {
        if (not _free_indexes.empty()) {
            return _free_indexes.front();
        } else {
            return _resources.size();
        }
    }

```

There are two creation methods: the one taking a name is intended for the creation of resources. The
other takes just a handle and is intended to allocate a resource that will be an extension of the
named resource with the same handle. This pattern is similar to the Entity Component System
architecture, as it allows extending the data related to an RID without coupling them.

```cpp
    TH create(const std::string& name) {
        size_t index = _resources.size();
        if (not _free_indexes.empty()) {
            index = _free_indexes.front();
            _resources[index] =
                T(name, BUILD_ID(GEN(_resources[index].getRID()), index));
            _free_indexes.pop_front();
        } else {
            _resources.push_back(T(name, BUILD_ID(0, index)));
        }
        return _resources[index].getHandle();
    }

    TH create(TH handle) {
        if (handle.getIndex() >= _resources.size())
            _resources.resize(handle.getIndex() + 1);
        else
            assert(not INDEX(_resources[handle.getIndex()]
                                 .getRID()));  // ensure we are creating on an
                                               // empty spot
        _resources[handle.getIndex()] = T(handle.getRID());
        return handle;
    }

```

The `get` method returns a reference to access the resource instance. It checks that the index is in
bounds and the generation matches.

```cpp
    T& get(TH handle) {
        assert(handle.getIndex() != 0);
        assert(handle == _resources[handle.getIndex()].getHandle());
        return _resources[handle.getIndex()];
    }

```

Finally, the `destroy` method adds the index of the handle to the free indices list and increments
the generation.

```cpp
    void destroy(TH handle) {
        assert(handle.getIndex() != 0);
        assert(handle == _resources[handle.getIndex()].getHandle());
        _resources[handle.getIndex()] = T(BUILD_ID(handle.getGen() + 1, 0));
        _free_indexes.push_front(handle.getIndex());
    }
};

```

Aside from these basic methods, I also implemented a standard iterator that ignores empty slots,
allowing easy iteration over the whole container.

The way I intend for the manager and resources to be used is as follows:

```cpp
    ResourceManager<Mesh, MeshHandle> mg;
    Mesh& m1 = mg.create("Mesh1");
    Mesh& m2 = mg.create("Mesh2");

    m1.addVertex();

    ResourceManager<Model, ModelHandle> md_mg;
    Model& md = md_mg.create("Model1");
    md.setMesh(m1.getHandle());

    // etc

```

Thank you for reading until the end. If you have any questions or suggestions for improvement, you
can reach out to me via [LinkedIn](https://www.linkedin.com/in/guillem-baldi-6238432a1/) or open an
issue on [GitHub](https://github.com/gbg4812/SceneEquipament.git).
