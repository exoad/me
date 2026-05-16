# Design Alignment: Make All Pages Match Homepage

## Rough Idea

The main landing page (HomePage.tsx) has a super simple and minimalistic look and feel. All other pages (BlogListPage, BlogPostPage, PhotosPage, ProjectsPage, ContactPage, AboutPage) need to align closely with this design.

The homepage uses a custom layout without Scaffold wrapper, with specific color classes (`text-fg*` not `text-gb-fg*`), section patterns, and spacing. Other pages use Scaffold, PageDescriptor, Divider, and `text-gb-fg*` colors which create visual inconsistency.

## Connections

- [[idea-honing]] - Requirements clarification
- [[research/design-analysis]] - Detailed analysis of homepage design patterns
- [[design/page-alignment]] - Design specification for aligned pages
- [[implementation/plan]] - Step-by-step implementation plan
