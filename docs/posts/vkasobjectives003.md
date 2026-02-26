---
date: '2025-09-6'
category:
  - Graphics
tag:
  - Vulkan
  - Graphics
  - Programming
  - CS
sidebar: 'heading'
---

# Vulkan API By Objectives, Understanding Vulkan

## Basic Objective

When learning Vulkan my first objective was to render a 3D model with textures. To achieve it I
followed the [Vulkan Tutorial](https://vulkan-tutorial.com/) that teaches exactly that. (Very
recommendable!)

But after following the tutorial I had Knowledge about Vulkan API but not real understanding. So to
get it I have been modifying that first example to into a scene system + a scene renderer.

In this post I want to clarify some basics of a Graphics API that might be very clear for
experienced graphics programmers but where hard to get for me.

## What is a Graphics API

A graphics API is a library that generates instructions for the GPU. The GPU uses a limited set of
instructions like the CPU that would be very difficult to write directly. The API generates and
sends the instructions at runtime, most of the calls to API functions translate to instructions send
to the GPU.

I like to think that the GPU is like a secondary computer I can send commands to. This is because
like any computer the GPU has memory and processing units. Also as any computer with memory
management, memory must be allocated and freed and objects living in that memory must be
initialized.

```cpp
VkBufferCreateInfo createInfo{};
...
createInfo.size = 16;
...
VkBuffer buffer;
vkCreateBuffer(device, &createInfo, nullptr, &buffer);
```

This example is a simplification of a Vulkan API call that allocates and initializes a buffer of 16
bytes in the GPU. The call also initializes the buffer object that in truth is just a unique number
that identifies the newly created buffer to use it in future calls.
