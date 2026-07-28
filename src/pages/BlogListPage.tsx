import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { strings } from "../data/shared";
import { BlogPostData, loadAllBlogPosts } from '../utils/markdown';

function BlogPostCard({ post }: { post: BlogPostData }) {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(`/blog/${post.slug}`)}
            aria-label={`Read ${post.title}`}
            className="blog-post-card"
        >
            <div>
                <span className="muted">{post.date}</span>{" "}
                <span className="muted">{post.tags.slice(0, 2).map(t => `#${t}`).join(' ')}</span>
            </div>
            <h3>{post.title}</h3>
            <p className="muted">{post.excerpt}</p>
        </button>
    );
}

export default function BlogListPage() {
    const [posts, setPosts] = useState<BlogPostData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAllBlogPosts().then(posts => {
            setPosts(posts);
            setLoading(false);
        }).catch(err => {
            console.error('Error loading blog posts:', err);
            setLoading(false);
        });
    }, []);

    return (
        <>
            <SEO
                title="Blog"
                description={strings.pages.blog.description}
                url="https://exoad.net/blog"
            />
            <main id="main" className="page">
                <Header />

                <h1>{strings.pages.blog.title}</h1>
                <p className="muted">{strings.pages.blog.description}</p>

                <div>
                    {loading ? (
                        <p role="status" aria-live="polite" aria-busy="true">Loading posts...</p>
                    ) : posts.length === 0 ? (
                        <p>No posts yet. Check back soon!</p>
                    ) : (
                        posts.map((post) => (
                            <BlogPostCard key={post.slug} post={post} />
                        ))
                    )}
                </div>

                <Footer />
            </main>
        </>
    );
}
