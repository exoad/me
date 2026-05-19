import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import SEO from '../components/SEO';
import BlogToc from '../components/BlogToc';
import SubpageNav from '../components/SubpageNav';
import { strings } from "../data/shared";
import { BlogPostData, loadBlogPost } from '../utils/markdown';

export default function BlogPostPage() {
    const { slug } = useParams<{ slug: string }>();
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
                <main id="main" className="min-h-screen bg-bg0 flex items-center justify-center" role="status" aria-live="polite" aria-busy="true">
                    <div className="flex items-center gap-3" aria-label="Loading post">
                        <div className="w-2 h-2 bg-yellow rounded-full animate-pulse" />
                        <div className="w-2 h-2 bg-green rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                        <div className="w-2 h-2 bg-blue rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                    </div>
                </main>
            </>
        );
    }

    if (!post) {
        return (
            <>
                <SEO title="Post Not Found" />
                <main id="main" className="min-h-screen bg-bg0 flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-fg0 mb-4">Post Not Found</h2>
                        <div className="flex items-center justify-center gap-4 text-sm font-sans">
                            <Link to="/blog" className="text-fg3 hover:text-fg2 transition-colors duration-300">Back to Blog</Link>
                            <Link to="/" className="text-fg4 hover:text-yellow transition-colors duration-300">Home</Link>
                        </div>
                    </div>
                </main>
            </>
        );
    }

    return (
        <>
            <SEO title={post.title} description={post.excerpt} url={`https://exoad.net/blog/${post.slug}`} image={`/og-${post.slug}.jpg`} />
            <main id="main" className="min-h-screen bg-bg0">
                {/* Flex container: content + sidebar TOC */}
                <div className="max-w-5xl mx-auto px-6 py-12 lg:flex lg:gap-8">
                    {/* Sidebar TOC - left side on large screens */}
                    <BlogToc entries={post.toc} />
                    {/* Main content column */}
                    <article className="max-w-2xl min-w-0 blog-post">
                        <SubpageNav backTo="/blog" backLabel={strings.pages.blog.back_to_blog} />

                        {/* Header */}
                        <header className="mb-12">
                            <div className="flex items-baseline gap-4 mb-4">
                                <span className="text-fg4 text-xs font-sans tracking-wide">{post.date}</span>
                                {' '}
                                <span className="text-blue text-xs font-sans">{post.tags.map(t => `#${t}`).join(' ')}</span>
                            </div>
                            {' '}
                            <h1 className="text-3xl md:text-4xl font-bold text-yellow mb-6">{post.title}</h1>
                            <p className="text-fg3 text-base font-sans leading-relaxed max-w-xl">{post.excerpt}</p>
                        </header>

                        {/* Content */}
                        <div
                            className="blog-content prose prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                    </article>
                </div>
            </main>
        </>
    );
}
