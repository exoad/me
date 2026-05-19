import { type CSSProperties, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import SubpageNav from '../components/SubpageNav';
import { strings } from "../data/shared";
import { BlogPostData, loadAllBlogPosts } from '../utils/markdown';
import { MdOutlineArrowOutward } from 'react-icons/md';

// Loading indicator colors (excluding red) - green, yellow, blue
const LOADING_COLORS = [
    'text-green',
    'text-yellow',
    'text-blue'
];

function BlogPostCard({ post, index }: { post: BlogPostData; index: number }) {
    const navigate = useNavigate();
    const colorClass = LOADING_COLORS[index % LOADING_COLORS.length];

    return (
        <button
            onClick={() => navigate(`/blog/${post.slug}`)}
            aria-label={`Read ${post.title}`}
            className="motion-lift block w-full text-left group"
            style={{ '--motion-index': Math.min(index, 5) } as CSSProperties}
        >
            <div className="py-6 pr-4 transition-all duration-300">
                <div className="flex items-baseline gap-4 mb-2">
                    <span className="text-fg4 text-xs font-sans tracking-wide">{post.date}</span>
                    <span className={`text-xs font-sans ${colorClass}`}>
                        {post.tags.slice(0, 2).map(t => `#${t}`).join(' ')}
                    </span>
                </div>
                <h3 className={`text-xl sm:text-2xl font-bold ${colorClass} group-hover:text-fg0 transition-colors duration-300 mb-2`}>
                    {post.title}
                </h3>
                <p className="text-fg3 text-sm font-sans leading-relaxed max-w-2xl mb-3">
                    {post.excerpt}
                </p>
                <div className="flex items-center gap-2 text-fg4 group-hover:text-fg2 transition-colors duration-300 text-xs font-sans">
                    <span className="motion-link-reveal">Read more</span>
                    <MdOutlineArrowOutward size={10} className="transition-transform duration-300 group-hover:translate-x-1" />
                </div>
            </div>
        </button>
    );
}

export default function BlogListPage() {
    const navigate = useNavigate();
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
            <main id="main" className="min-h-screen bg-bg0">
                <div className="max-w-2xl mx-auto px-6 py-12">
                    <SubpageNav />

                    {/* Minimal header like landing page */}
                    <div className="mb-8">
                        <h2 className="text-[10px] uppercase tracking-[0.2em] text-fg4 mb-4 font-sans">Writing</h2>
                        <h1 className="text-4xl md:text-5xl font-bold text-fg0 mb-4">
                            {strings.pages.blog.title}
                        </h1>
                        <p className="text-fg3 text-base font-sans leading-relaxed max-w-xl">
                            {strings.pages.blog.description}
                        </p>
                    </div>

                    {/* Posts list - no dividers, minimal spacing */}
                    <div className="motion-list-reveal space-y-2">
                        {loading ? (
                            <div className="flex items-center gap-2 text-fg4 text-sm font-sans py-8" role="status" aria-live="polite" aria-busy="true">
                                <div className="w-2 h-2 bg-yellow rounded-full animate-pulse" />
                                <span>Loading posts...</span>
                            </div>
                        ) : posts.length === 0 ? (
                            <p className="text-fg4 text-sm font-sans py-8">No posts yet. Check back soon!</p>
                        ) : (
                            posts.map((post, index) => (
                                <BlogPostCard key={post.slug} post={post} index={index} />
                            ))
                        )}
                    </div>
                </div>
            </main>
        </>
    );
}
