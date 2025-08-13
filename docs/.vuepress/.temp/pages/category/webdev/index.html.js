import comp from "/home/guillemb/Projects/GuillemBaldiWebsite/docs/.vuepress/.temp/pages/category/webdev/index.html.vue"
const data = JSON.parse("{\"path\":\"/category/webdev/\",\"title\":\"Category WebDev\",\"lang\":\"en-US\",\"frontmatter\":{\"title\":\"Category WebDev\",\"sidebar\":false,\"blog\":{\"type\":\"category\",\"name\":\"WebDev\",\"key\":\"category\"},\"layout\":\"Category\"},\"headers\":[],\"git\":{},\"filePathRelative\":null,\"excerpt\":\"\"}")
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
