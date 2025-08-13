export const redirects = JSON.parse("{}")

export const routes = Object.fromEntries([
  ["/", { loader: () => import(/* webpackChunkName: "index.html" */"/home/guillemb/Projects/GuillemBaldiWebsite/docs/.vuepress/.temp/pages/index.html.js"), meta: {"title":"Home"} }],
  ["/get-started.html", { loader: () => import(/* webpackChunkName: "get-started.html" */"/home/guillemb/Projects/GuillemBaldiWebsite/docs/.vuepress/.temp/pages/get-started.html.js"), meta: {"title":"Get Started"} }],
  ["/posts/article1.html", { loader: () => import(/* webpackChunkName: "posts_article1.html" */"/home/guillemb/Projects/GuillemBaldiWebsite/docs/.vuepress/.temp/pages/posts/article1.html.js"), meta: {"_blog":{"title":"The purpose of this website","author":"","date":"2025-8-13","category":["Personal"],"tag":["Personal"],"excerpt":"\n<h2>As a notebook for me</h2>\n<p>I'm frequently learning new things (it's like an addiction), but I often forget to take notes and\nthe new knowledge slips from my mind. So this website will be a place for me to write down the\nthings I learn and I want to keep in mind.</p>\n<h2>As a way of sharing</h2>"},"title":"The purpose of this website"} }],
  ["/404.html", { loader: () => import(/* webpackChunkName: "404.html" */"/home/guillemb/Projects/GuillemBaldiWebsite/docs/.vuepress/.temp/pages/404.html.js"), meta: {"title":""} }],
  ["/category/", { loader: () => import(/* webpackChunkName: "category_index.html" */"/home/guillemb/Projects/GuillemBaldiWebsite/docs/.vuepress/.temp/pages/category/index.html.js"), meta: {"title":"Categories"} }],
  ["/tag/", { loader: () => import(/* webpackChunkName: "tag_index.html" */"/home/guillemb/Projects/GuillemBaldiWebsite/docs/.vuepress/.temp/pages/tag/index.html.js"), meta: {"title":"Tags"} }],
  ["/notes/", { loader: () => import(/* webpackChunkName: "notes_index.html" */"/home/guillemb/Projects/GuillemBaldiWebsite/docs/.vuepress/.temp/pages/notes/index.html.js"), meta: {"title":""} }],
  ["/timeline/", { loader: () => import(/* webpackChunkName: "timeline_index.html" */"/home/guillemb/Projects/GuillemBaldiWebsite/docs/.vuepress/.temp/pages/timeline/index.html.js"), meta: {"title":"Timeline"} }],
  ["/category/personal/", { loader: () => import(/* webpackChunkName: "category_personal_index.html" */"/home/guillemb/Projects/GuillemBaldiWebsite/docs/.vuepress/.temp/pages/category/personal/index.html.js"), meta: {"title":"Category Personal"} }],
  ["/tag/personal/", { loader: () => import(/* webpackChunkName: "tag_personal_index.html" */"/home/guillemb/Projects/GuillemBaldiWebsite/docs/.vuepress/.temp/pages/tag/personal/index.html.js"), meta: {"title":"Tag Personal"} }],
]);

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateRoutes) {
    __VUE_HMR_RUNTIME__.updateRoutes(routes)
  }
  if (__VUE_HMR_RUNTIME__.updateRedirects) {
    __VUE_HMR_RUNTIME__.updateRedirects(redirects)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ routes, redirects }) => {
    __VUE_HMR_RUNTIME__.updateRoutes(routes)
    __VUE_HMR_RUNTIME__.updateRedirects(redirects)
  })
}
