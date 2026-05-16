import { marked } from "marked";

export interface TocEntry { id: string; text: string; level: number; }

export interface BlogPostMeta { slug: string; title: string; date: string; excerpt: string; tags: string[]; featured?: boolean; }

export interface BlogPostData extends BlogPostMeta { content: string; toc: TocEntry[]; }

interface MarkdownModule { attributes?: Record<string, unknown>; frontmatter?: Record<string, unknown>; markdown?: string; }
type GlobResult = Record<string, MarkdownModule>;

let postsCache:{data :BlogPostData[];timestamp:number}|null=null;
let metaCache:{data :BlogPostMeta[];timestamp:number}|null=null;
const CACHE_TTL_MS=5*60*1000;

const modulesGlob=import.meta.glob("../content/blog/*.md",{eager:true}) as GlobResult ;

function slugFromPath(path:string):string{return path.split("/").pop()!.replace(/\.md$/,"")}

function extractAttributes(mod :MarkdownModule):Record<string,unknown>{if(mod.attributes)return mod.attributes;if(mod.frontmatter)return mod.frontmatter;return{}}

function textToSlug(text:string):string{return text.toLowerCase().replace(/[^\w\s-]/g,'').replace(/\s+/g,'-').substring(0,50)}

function generateToc(rawMd:string):TocEntry[]{
try{
const tokens=marked.lexer(rawMd);
const counts=new Map<string,number>();
const entries:TocEntry[]=[];
for(const token of tokens){
if(token.type==='heading'){
const baseSlug=textToSlug(token.text);
const count=(counts.get(baseSlug)||0)+1;
counts.set(baseSlug,count);
var id=count===1?baseSlug:`${baseSlug}-${count-1}`;
entries.push({id,text : token.text ,level : token.depth});
}}
return entries;
}catch(e){console.error('TOC generation failed:',e);return[]}
}

async function loadAllBlogPosts():Promise<BlogPostData[]>{
if(postsCache&&Date.now()-postsCache.timestamp < CACHE_TTL_MS){return postsCache.data ;}
var posts :BlogPostData[]=[];
for(const [path ,mod] of Object.entries(modulesGlob)){
try{
var attrs=extractAttributes(mod);
var slug=slugFromPath(path);
var rawMd=(mod.markdown||"")as string ;
var toc=generateToc(rawMd);
var html=marked.parse(rawMd)as string ;
posts.push({slug ,title:(attrs.title||slug)as string ,date:(attrs.date||"")as string ,excerpt:(attrs.excerpt||"")as string ,tags:(attrs.tags||[])as any,featured:(attrs.featured as boolean|undefined),content : html,toc});
}catch(e){console.error("Failed to load blog post:"+path,e);}}
posts.sort((a,b)=>new Date(b.date).getTime()-new Date(a.date).getTime());
postsCache={data : posts,timestamp : Date.now()} ;
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
...(p.featured?{featured:p.featured}:{})
})),
timestamp : Date.now(),
};}
return metaCache!.data ;
}

async function loadBlogPost(slug:string):Promise<BlogPostData|null>{
await loadAllBlogPosts();
for(const p of (postsCache?.data??[])){if(p.slug===slug)return p;}
return null ;
}

export {loadAllBlogPosts ,loadAllBlogMeta ,loadBlogPost};
