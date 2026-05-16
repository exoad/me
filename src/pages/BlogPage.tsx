import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Scaffold, { ScaffoldContent } from '../components/Scaffold';
import SEO from '../components/SEO';
import { blogPosts, strings } from "../data/shared";
import Divider from '../components/Divider';
import { Column, Row } from '../components/FlexLayouter';
import { MdOutlineArrowOutward } from 'react-icons/md';

function sortBlogPosts(posts: typeof blogPosts) {
    return [...posts].sort((a, b) => b.date.localeCompare(a.date));
}

function BlogPostCard({ post, index }: { post: typeof blogPosts[0]; index: number }) {
    const [visible, setVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) setVisible(true);
            },
            { threshold: 0.2 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`transition-all duration-700 ease-[cubic-bezier(0.17,0.67,0.38,1)] ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transitionDelay: visible ? `${index * 100}ms` : '0ms' }}
        >
            <a
                href={`/blog/${post.slug}`}
                className="block group transition-colors duration-300"
            >
                <div className="border-b border-bg2 pb-6 group-hover:border-fg3 transition-colors duration-300">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-fg4 text-xs font-sans">{post.displayDate}</span>
                        <span className="text-fg4/50 text-xs">·</span>
                        <span className="text-fg4 text-xs font-sans">
                            {post.tags.map(t => `#${t}`).join(' ')}
                        </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold font-sans text-fg0 group-hover:text-fg1 transition-colors duration-300 mb-2">
                        {post.title}
                    </h3>
                    <p className="text-fg3 text-sm font-sans leading-relaxed max-w-2xl mb-3">
                        {post.excerpt}
                    </p>
                    <Row gap={2} className="text-fg4 group-hover:text-fg2 transition-colors duration-300 text-xs font-sans">
                        <span>Read more</span>
                        <MdOutlineArrowOutward size={10} />
                    </Row>
                </div>
            </a>
        </div>
    );
}

export default function BlogPage() {
    const navigate = useNavigate();
    const sortedPosts = sortBlogPosts(blogPosts);

    return (
        <Scaffold>
            <SEO
                title="Blog"
                description={strings.pages.blog.description}
                url="https://exoad.net/blog"
            />
            <ScaffoldContent useDefaultLayout className="w-full overflow-x-hidden">
                <Column gap={12} crossAxisAlignment="start" className="max-w-3xl px-4 sm:px-8 md:px-12">
                    <Column gap={4} className="w-full mb-12">
                        <h2 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-gb-fg4/30 uppercase tracking-widest font-sans">
                            {strings.pages.blog.title}
                        </h2>
                        <p className="text-sm sm:text-base text-fg3 font-sans">
                            {strings.pages.blog.description}
                        </p>
                    </Column>
                    <Divider className="w-full" />
                    <Column gap={0} className="w-full">
                        {sortedPosts.map((post, index) => (
                            <BlogPostCard key={post.slug} post={post} index={index} />
                        ))}
                        {sortedPosts.length === 0 && (
                            <p className="text-fg4 text-sm font-sans py-8">No posts yet. Check back soon!</p>
                        )}
                    </Column>
                </Column>
            </ScaffoldContent>
        </Scaffold>
    );
}
