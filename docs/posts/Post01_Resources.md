---
date: '2025-08-13'
category:
  - Programming
tag:
  - Programming
  - C++
  - SWD
sidebar: 'heading'
---

# Resources and Resource Management in my Scene Representation Library

## Introduction

While I was learning how to do a GPU renderer, I realized the need for data structures to represent
the scene which the renderer was to render. I wanted the following requirements for the representation system:

- Represent polygonal meshes with an arbitrary number of attributes of a set of types (in the vertices for now).
- Represent Shaders that use the attributes (vertices) and parameters (uniforms) as inputs.
- Represent Materials as a concrete assignment of values to the parameters of the
  shader.

> [NOTE]: Parameters can be assigned values or (pointers/handles), as there are parameter types
> like textures, which should be shared between materials.

- Represents other resources like:
  - Models (mesh + material)
  - Lights
  - Cameras
  - Textures
  - For now, these three...

- A way to represent a scene tree with a transform hierarchy.

At the time of designing, I read **Handles are better pointers** post and became quite convinced, so I built a
resource system with managers and handles. In this post, I want to describe this Resource system which I have ended up
using to store all shared resources.

## The Resource

```cpp
class Resource {
   public:
    // rid 0 means null
    Resource() : _rid(0) {};
    Resource(std::string name, uint32_t rid) : _name(name), _rid(rid) {}

    // copy/assign
    Resource(const Resource& other) = delete;
    Resource& operator=(const Resource& other) = delete;

    // move
    Resource(Resource&& other) = default;
    Resource& operator=(Resource&& other) = default;

    const std::string& getName() const { return _name; }
    uint32_t getRID() const { return _rid; }

    void setFlags(ResourceFlags flags) { _flags = _flags | flags; }

    void unsetFlag(ResourceFlags flags) {
        _flags = _flags & (~flags);  // 1010 0010 -> 1101 & 1010
    }

   private:
    std::string _name;
    uint32_t _rid;
    uint32_t _flags;
};
```

The code above is the whole Resource type, intended to be inherited from the concrete resource types like
(materials, textures, meshes...). I have to admit that now, I would never write getters for the `name` and
the `rid`, as I don't see the purpose (probably I wrote this close to an OOP class in school).

The main feature of the resource is the `rid`, which can be used as a way of ensuring no uses after free,
as every resource ever created (of the same type) will get its unique ID. About the `flags` attribute, I created it
to mark resources as dirty or new to notify dependent systems, like the renderer, of the change. Finally, the `name` is
just useful if the resource has to be displayed in a UI or for debugging purposes.

The creation of resources needs to be controlled, as the `rid` must be assigned properly. Also, I didn't want for every
resource to live in a random place in memory, and I wanted to work with handles. To comply with all my requirements, it was
clear I needed to implement pools of resources, which I called `ResourceManager`.

```cpp
// Manager class to allocate and get instances of a type of resource
template <typename T, typename TH>
class ResourceManager {
    static_assert(std::is_base_of_v<ResourceHandle, TH>,
                  "The ResourceHandle type must be based of ResourceHandle");
    static_assert(std::is_base_of_v<Resource, T>,
                  "The Resource type must be based of Resource");
    static_assert(std::is_constructible_v<T, std::string, uint32_t>,
                  "The Resource must have this constructor");
    static_assert(
        std::is_default_constructible_v<T>,
        "The Resource must be default constructible with a call to Resource()");
```

These first lines of code define the class with two template parameters: `T` for the type to be stored and `TH` for
the handle type. Following the class declaration, you can see four static asserts which ensure the types of the handle
and the resource are derived respectively from `ResourceHandle` and `Resource` and that the Resource has a default constructor
(needed for default initialization) and a constructor taking the `rid` and `name` of the resource.

```cpp
private:
std::vector<T> _resources;
std::list<size_t> _free_indexes;
// 0 is reserved for null
uint32_t _nextid = 1;
};
```

You can see in the code above that there are just three attributes: a vector of `T` to store all the instances (it is a vector, but it should be
initialized with enough room to avoid needing to resize), a linked list of free indexes (of the vector) to allow for deletion of instances, and
finally a `_nextid` attribute which stores the next available ID (for the creation of a new resource).

In the code below, there are all the methods which modify these attributes to provide the functionality of the manager.

```cpp
   public:
    ResourceManager(size_t initial_size = 0) {
        _resources.reserve(initial_size + 1);
        _resources.push_back(T());
    }

    TH create(std::string name) {
        size_t index = _resources.size();
        if (not _free_indexes.empty()) {
            _resources[_free_indexes.front()] = T(name, _nextid);
            index = _free_indexes.front();
            _free_indexes.pop_front();
        } else {
            _resources.push_back(T(name, _nextid));
        }
        auto h = TH(_nextid, index);
        _nextid++;
        return h;
    }

    T& get(const TH& handle) {
        assert(handle.getRID() == _resources[handle.getIndex()].getRID());
        return _resources[handle.getIndex()];
    }

    T& getRelated(const ResourceHandle& handle) {
        assert(handle.getRID() == _resources[handle.getIndex()].getRID());
        return _resources[handle.getIndex()];
    }

    std::vector<T>& getAll() { return _resources; }
    void clear() {
        _resources.clear();
        while (!_free_indexes.empty()) _free_indexes.pop_front();
    }

    void destroy(const TH& handle) {
        _resources[handle.getIndex()] = T();
        _free_indexes.push_front(handle.getIndex());
    }
```

In the `create` method appears the need for the static assert enshuring the existence of a (name, rid) constructor.
Aside from this basic methods I also implemented a standard iterator, the code of which
I will not show as it is long and just a "nice-to-have".

The way I intend for the manager and resources to be used is the following:

```cpp
    ResourceManager<Mesh, MeshHandle> mg;
    MeshHandle h1 = mg.create("Mesh1");
    MeshHandle h2 = mg.create("Mesh2");

    Mesh& m1 = mg.get(h1);
    Mesh& m2 = mg.get(h2);

    m1.addVertex();
```

You can see two resources, in this case meshes, are created and then the handles are used to
get the actual instances to modify. I marked as deleted the copy and assign constructors of the
resources to avoid the easy mistake of copying instead of taking a reference from the `get()`
method return, which would result in the actual instance not being modified (it happened to me).
Instead, the move constructor must exist as otherwise the type wouldn't be compatible with
the resize operation of the `std::vector`.

```cpp
// copy/assign
Resource(const Resource& other) = delete;
Resource& operator=(const Resource& other) = delete;
```

Thank you for reading until the end. If you have any questions or suggestions for improvement,
you can write me through [LinkedIn](https://www.linkedin.com/in/guillem-baldi-6238432a1/) or
open an issue in [GitHub](https://github.com/gbg4812/SceneEquipament.git).
