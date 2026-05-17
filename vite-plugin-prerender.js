import { readFileSync, readdirSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import matter from "gray-matter";

const BLOG_DIR = resolve("src/content/blog");
const INDEX_HTML = resolve("index.html");

function getBlogPosts() {
  try {
    const files = readdirSync(BLOG_DIR).filter(f => f.endsWith(".md"));
    return files.map(f => {
      const raw = readFileSync(resolve(BLOG_DIR, f), "utf8");
      const { data } = matter(raw);
      return {
        slug: f.replace(".md", ""),
        title: data.title || "",
        excerpt: data.excerpt || "",
        date: data.date || "",
        tags: data.tags || [],
      };
    });
  } catch (e) {
    console.error("Error reading blog posts:", e);
    return [];
  }
}

function generateBlogHtml(post, baseHtml) {

function removeDefaultOgTags(html) {
  // Remove default OG and Twitter tags that will be replaced
  html = html.replace(/  <meta property="og:type" content="website" \/>\\n/g, '');
  html = html.replace(/  <meta property="og:title" content="exoad - Jiaming Meng" \/>\\n/g, '');
  const ogImage = "/og-jackbox.jpg";
  const url = `https://exoad.net/blog/${post.slug}`;

  const ogTags = `
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${post.title}" />
  <meta property="og:description" content="${post.excerpt}" />
  <meta property="og:image" content="${ogImage}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:site_name" content="exoad" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${post.title}" />
  <meta name="twitter:description" content="${post.excerpt}" />
  <meta name="twitter:image" content="${ogImage}" />`

  let html = baseHtml;
  html = html.replace("<title>exoad - Jiaming Meng</title>", `<title>${post.title} | exoad</title>`);
  html = html.replace("</head>", `${ogTags}\\n</head>`);
  return html;
}

export default function prerenderPlugin() {
  return {
    name: "prerender",
    enforce: "post",

    closeBundle() {
      const posts = getBlogPosts();
      if (posts.length === 0) return;

      const baseHtml = readFileSync(INDEX_HTML, "utf8");

      for (const post of posts) {
        const html = generateBlogHtml(post, baseHtml);
        const outDir = resolve("dist/blog", post.slug);
        mkdirSync(outDir, { recursive: true });
        writeFileSync(resolve(outDir, "index.html"), html);
        console.log(`Generated: /blog/${post.slug}/index.html`);
      }

      console.log(`Prerendered ${posts.length} blog post(s)`);
    }
  };
}
