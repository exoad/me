import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import SEO from '../components/SEO';
import BlogToc from '../components/BlogToc';
import Header from '../components/Header';
import Footer from '../components/Footer';
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
                <main id="main" className="page" role="status" aria-live="polite" aria-busy="true">
                    <p>Loading...</p>
                </main>
            </>
        );
    }

    if (!post) {
        return (
            <>
                <SEO title="Post Not Found" />
                <main id="main" className="page">
                    <h2>Post Not Found</h2>
                    <p>
                        <Link to="/blog">Back to Blog</Link>
                        {" · "}
                        <Link to="/">Home</Link>
                    </p>
                </main>
            </>
        );
    }

    return (
        <>
            <SEO title={post.title} description={post.excerpt} url={`https://exoad.net/blog/${post.slug}`} image={`/og-${post.slug}.jpg`} />
            <main id="main" className="page" style={{ maxWidth: "900px" }}>
                <Header />
                <div style={{ display: "flex", gap: "2rem" }}>
                    <BlogToc entries={post.toc} />
                    <article style={{ minWidth: 0, maxWidth: "700px" }}>
                        <header>
                            <p className="muted">
                                {post.date} &middot; {post.tags.map(t => `#${t}`).join(' ')}
                            </p>
                            <h1>{post.title}</h1>
                            <p className="muted">{post.excerpt}</p>
                        </header>

                        <div
                            className="blog-content"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                    </article>
                </div>
                <Footer />
            </main>
        </>
    );
}
