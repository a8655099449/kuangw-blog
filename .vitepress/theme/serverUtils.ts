import globby from "globby";
import matter from "gray-matter";
import fs from "fs-extra";

import MarkdownIt from "markdown-it";
var regex = /\[(.*?)\]\(.*?\)/g;

export async function getPosts() {
  const md = new MarkdownIt();
  let paths = await getPostMDFilePaths();
  let posts = await Promise.all(
    paths.map(async (item) => {
      const content = await fs.readFile(item, "utf-8");
      let titles: any[] = [];
      try {
        const tokens = md.parse(content);
        tokens.forEach(({ type, markup }, index) => {
          // 将全部的标题提取出来
          if (type === "heading_open") {
            let content = tokens[index + 1]?.content;

            if (typeof content === 'string') {
              content = content.replace(regex, "$1")
            }
            titles.push({
              content,
              level: markup.length,
            });
          }
        });
      } catch (error) {}

      const { data } = matter(content);
      data.date = _convertDate(data.date);
      return {
        frontMatter: data,
        regularPath: `/${item.replace(".md", ".html")}`,
        titles,
      };
    })
  );
  posts.sort(_compareDate);
  return posts;
}

function _convertDate(date = new Date().toString()) {
  const json_date = new Date(date).toJSON();
  return json_date.split("T")[0];
}

function _compareDate(obj1, obj2) {
  return obj1.frontMatter.date < obj2.frontMatter.date ? 1 : -1;
}

async function getPostMDFilePaths() {
  let paths = await globby(["**.md"], {
    ignore: ["node_modules", "README.md"],
  });
  return paths.filter((item) => item.includes("posts/"));
}

export async function getPostLength() {
  // getPostMDFilePath return type is object not array
  return [...(await getPostMDFilePaths())].length;
}
