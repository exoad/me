import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import BlogToc from '../components/BlogToc';
import { strings } from "../data/shared";
import { BlogPostData, loadBlogPost } from '../utils/markdown';
import { MdArrowBack } from 'react-icons/md';

export default function BlogPostPage() {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [post, setPost] = useState<BlogPostData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (slug) {
            loadBlogPost(slug).then(p => {
                setPost(p);
                setLoading(false);
            }).catch(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [slug]);

    if (loading) {
        return (
            <>
                <SEO title="Loading..." />
                <div className="min-h-screen bg-bg0 flex items-center justify-center">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-yellow rounded-full animate-pulse" />
                        <div className="w-2 h-2 bg-green rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                        <div className="w-2 h-2 bg-blue rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                    </div>
                </div>
            </>
        );
    }

    if (!post) {
        return (
            <>
                <SEO title="Post Not Found" />
                <div className="min-h-screen bg-bg0 flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-fg0 mb-4">Post Not Found</h2>
                        <button onClick={() => navigate('/blog')} className="text-fg3 hover:text-fg2 transition-colors duration-300 text-sm font-sans">Back to Blog</button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <SEO title={post.title} description={post.excerpt} url={`https://exoad.net/blog/${post.slug}`} image="/og-jackbox.jpg" />
            <div className="min-h-screen bg-bg0">
                {/* Flex container: content + sidebar TOC */}
                <div className="max-w-5xl mx-auto px-6 py-12 lg:flex lg:gap-8">
                    {/* Sidebar TOC - left side on large screens */}
                    <BlogToc entries={post.toc} />
                    {/* Main content column */}
                    <article className="max-w-2xl min-w-0 blog-post">
                        {/* Back buttons */}
                        <div className="flex items-center gap-6 mb-12">
                            <button onClick={() => navigate('/blog')} className="flex items-center gap-2 text-fg4 hover:text-yellow transition-colors duration-300 text-sm font-sans group">
                                <MdArrowBack size={16} />
                                {strings.pages.blog.back_to_blog}
                            </button>
                            <span className="text-fg4/30 text-xs select-none">|</span>
                            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-fg4 hover:text-yellow transition-colors duration-300 text-sm font-sans group">
                                Home
                            </button>
                        </div>

                        {/* Header */}
                        <header className="mb-12">
                            <div className="flex items-baseline gap-4 mb-4">
                                <span className="text-fg4 text-xs font-sans tracking-wide">{post.date}</span>
                                {' '}
                                <span className="text-blue text-xs font-sans">{post.tags.map(t => `#${t}`).join(' ')}</span>
                            </div>
                            {' '}
                            <h1 className="text-3xl md:text-4xl font-bold font-playfair text-yellow mb-6">{post.title}</h1>
                            <p className="text-fg3 text-base font-sans leading-relaxed max-w-xl">{post.excerpt}</p>
                        </header>

                        {/* Content */}
                        <div
                            className="blog-content prose prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                    </article>
                </div>
            </div>
        </>
    );
}
