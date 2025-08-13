import comp from "/home/guillemb/Projects/GuillemBaldiWebsite/docs/.vuepress/.temp/pages/index.html.vue"
const data = JSON.parse("{\"path\":\"/\",\"title\":\"Home\",\"lang\":\"en-US\",\"frontmatter\":{\"home\":true,\"title\":\"Home\",\"heroImage\":\"./teapot.png\",\"actions\":[{\"text\":\"Notes\",\"link\":\"/notes/\",\"type\":\"primary\"}],\"features\":[{\"title\":\"Computer Science\",\"details\":\"I am studying computer science but  in my university it is called informatics engineering. I Always think is the same but maybe I'm wrong...\"},{\"title\":\"VFX\",\"details\":\"Before starting my B.E. in CS I wanted to be a VFX artist (I liked technical work like simulations and procedural modeling), so I spent a year learning the tools and techniques but in the end i realized that my passion was in building the tools.\"},{\"title\":\"Music and Dance\",\"details\":\"I have conservatory studies in flute and I have learned to like \\\"classical\\\" music a lot. Also, I have been dancing from the age of 5 in my city \\\"esbart\\\" (An \\\"esbart\\\" is a traditional dance center, mine explores the modernitzation of tradition ).\"}],\"footer\":\"MIT Licensed | Copyright © 2018-present VuePress Community\"},\"headers\":[],\"git\":{},\"filePathRelative\":\"README.md\"}")
export { comp, data }

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updatePageData) {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ data }) => {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  })
}
