import { marked } from "marked";

export interface TocEntry {
  id: string;
  text: string;
  level: number;
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  featured?: boolean;
}

export interface BlogPostData extends BlogPostMeta {
  content: string;
  toc: TocEntry[];
}

interface MarkdownModule {
  attributes?: Record<string, unknown>;
  frontmatter?: Record<string, unknown>;
  markdown?: string;
}

type GlobResult = Record<string, MarkdownModule>;

let postsCache: { data: BlogPostData[]; timestamp: number } | null = null;
let metaCache: { data: BlogPostMeta[]; timestamp: number } | null = null;

const CACHE_TTL_MS = 5 * 60 * 1000;

const modulesGlob = import.meta.glob("../content/blog/*.md", {
eager : true,
}) as GlobResult;

function slugFromPath(path :string):string{
return path.split("/").pop()!.replace(/\.md$/,"");
}

function extractAttributes(mod :MarkdownModule):Record<string,unknown>{
if(mod.attributes)return mod.attributes as Record<string,unknown>;
if(mod.frontmatter)return mod.frontmatter as Record<string,unknown>;
return{};
}

function generateToc(htmlContent:string):TocEntry[]{
const entries:TocEntry[]=[];
const headingRegex=/<(h[1-6])[^>]*id=["']([^"']+)["'][^>]*>(.+?)<\/h[1-6]>/gi ;
let match ;
while((match=headingRegex.exec(htmlContent))!==null){
entries.push({
id : match[2],
text : match[3].replace(/<[^>]+>/g,""),
level : parseInt(match[1][1]),
});
}
return entries ;
}

async function loadAllBlogPosts():Promise<BlogPostData[]>{
if(postsCache&&Date.now()-postsCache.timestamp < CACHE_TTL_MS){
return postsCache.data ;
}
const posts :BlogPostData[]=[];
for(const [path ,mod] of Object.entries(modulesGlob)){
try{
const attrs=extractAttributes(mod);
const slug=slugFromPath(path);
const rawMd=(mod.markdown||"")as string ;
const html=marked.parse(rawMd)as string ;
const toc=generateToc(html);
posts.push({
slug ,
title:(attrs.title||slug)as string ,
date:(attrs.date||"")as string ,
excerpt:(attrs.excerpt||"")as string ,
tags:(attrs.tags||[])as any,
featured:(attrs.featured as boolean|undefined),
content : html ,
toc ,
});
}catch(e){
console.error("Failed to load blog post:"+path,e);
}
}
posts.sort((a,b)=>new Date(b.date).getTime()-new Date(a.date).getTime());
postsCache={data : posts,timestamp : Date.now()};
return posts ;
}

async function loadAllBlogMeta():Promise<BlogPostMeta[]>{
await loadAllBlogPosts();
if(!metaCache||Date.now()-metaCache.timestamp >= CACHE_TTL_MS){
metaCache={
data:(await loadAllBlogPosts()).map((p)=>({
slug:p.slug,
title:p.title,
date:p.date,
excerpt:p.excerpt,
tags:p.tags,
...(p.featured?{featured:p.featured}:{}),
})),
timestamp : Date.now(),
};
}
return metaCache!.data ;
}

async function loadBlogPost(slug:string):Promise<BlogPostData|null>{
await loadAllBlogPosts();
for(const p of (postsCache?.data??[])){
if(p.slug===slug)return p ;
}
return null ;
}

export {loadAllBlogPosts ,loadAllBlogMeta ,loadBlogPost};
