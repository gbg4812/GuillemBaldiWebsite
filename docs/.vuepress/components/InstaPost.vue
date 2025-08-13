<template>
  <div class="instagram-post">
    <blockquote
      class="instagram-media"
      :data-instgrm-permalink="url"
      data-instgrm-version="14"
      style="background: #fff; border: 0; margin: 1rem auto; max-width: 540px; width: 100%"
    ></blockquote>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

const props = defineProps({
  url: {
    type: String,
    required: true,
  },
})

onMounted(() => {
  if (window.instgrm) {
    window.instgrm.Embeds.process()
  } else {
    const script = document.createElement('script')
    script.src = '//www.instagram.com/embed.js'
    script.async = true
    script.onload = () => window.instgrm.Embeds.process()
    document.body.appendChild(script)
  }
})
</script>
