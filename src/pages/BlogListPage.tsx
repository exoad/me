import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { strings } from "../data/shared";
import { BlogPostData, loadAllBlogPosts } from '../utils/markdown';
import { MdOutlineArrowOutward, MdArrowBack } from 'react-icons/md';

// Loading indicator colors (excluding red) - green, yellow, blue
const LOADING_COLORS = [
    'text-green',
    'text-yellow',
    'text-blue'
];

function BlogPostCard({ post, index }: { post: BlogPostData; index: number }) {
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);
    const colorClass = LOADING_COLORS[index % LOADING_COLORS.length];

    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), index * 100);
        return () => clearTimeout(timer);
    }, [index]);

    return (
        <button
            onClick={() => navigate(`/blog/${post.slug}`)}
            className={`block w-full text-left group transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
        >
            <div className="py-6 pr-4 transition-all duration-300">
                <div className="flex items-baseline gap-4 mb-2">
                    <span className="text-fg4 text-xs font-sans tracking-wide">{post.date}</span>
                    <span className={`text-xs font-sans ${colorClass}`}>
                        {post.tags.slice(0, 2).map(t => `#${t}`).join(' ')}
                    </span>
                </div>
                <h3 className={`text-xl sm:text-2xl font-bold font-playfair ${colorClass} group-hover:text-fg0 transition-colors duration-300 mb-2 whitespace-nowrap overflow-hidden text-ellipsis`}>
                    {post.title}
                </h3>
                <p className="text-fg3 text-sm font-sans leading-relaxed max-w-2xl mb-3">
                    {post.excerpt}
                </p>
                <div className="flex items-center gap-2 text-fg4 group-hover:text-fg2 transition-colors duration-300 text-xs font-sans">
                    <span className="group-hover:underline underline-offset-4">Read more</span>
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
            <div className="min-h-screen bg-bg0">
                <div className="max-w-2xl mx-auto px-6 py-12">
                    {/* Back to home */}
                    <button onClick={() => navigate('/')} className="flex items-center gap-2 text-fg4 hover:text-yellow transition-colors duration-300 text-sm font-sans mb-12 group">
                        <MdArrowBack size={16} />
                        Home
                    </button>

                    {/* Minimal header like landing page */}
                    <div className="mb-16">
                        <h2 className="text-[10px] uppercase tracking-[0.2em] text-fg4 mb-4 font-sans">Writing</h2>
                        <h1 className="text-4xl md:text-5xl font-bold font-playfair text-fg0 mb-4">
                            {strings.pages.blog.title}
                        </h1>
                        <p className="text-fg3 text-base font-sans leading-relaxed max-w-xl">
                            {strings.pages.blog.description}
                        </p>
                    </div>

                    {/* Posts list - no dividers, minimal spacing */}
                    <div className="space-y-2">
                        {loading ? (
                            <div className="flex items-center gap-2 text-fg4 text-sm font-sans py-8">
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
            </div>
        </>
    );
}
