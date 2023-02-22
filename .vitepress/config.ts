import { getPosts, getPostLength } from "./theme/serverUtils";
import { buildBlogRSS } from "./theme/rss";

async function config() {
  return {
    lang: "en-US",
    title: "kuangw blog",
    description: "Home of kuangw",
    head: [
      [
        "link",
        {
          rel: "icon",
          type: "image/svg",
          href: "https://s2.loli.net/2022/12/13/vVFejXUpPTcCIsM.png",
        },
      ],
      [
        "meta",
        {
          name: "author",
          content: "kuangw",
          
        },
      ],
      [
        "meta",
        {
          property: "og:title",
          content: "Home",
        },
      ],
      [
        "meta",
        {
          property: "og:description",
          content: "Home of kuangw",
        },
      ],
    ],
    // cleanUrls: "with-subfolders",
    lastUpdated: false,
    themeConfig: {
      // repo: "clark-cui/homeSite",
      logo: "https://s2.loli.net/2022/12/13/vVFejXUpPTcCIsM.png",
      docsDir: "/",
      // docsBranch: "master",
      posts: await getPosts(),
      pageSize: 5,
      postLength: await getPostLength(),
      nav: [
        {
          text: "🏡Blogs",
          link: "/",
        },
        {
          text: "🔖Tags",
          link: "/tags",
        },
        {
          text: "📃Archives",
          link: "/archives",
        },
      
      ],
      socialLinks: [
        { icon: "github", link: "https://github.com/a8655099449" },
      ],
    },
    buildEnd: buildBlogRSS,

  };
}
export default config();
