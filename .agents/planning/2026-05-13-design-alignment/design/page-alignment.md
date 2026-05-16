# Page Alignment Design Specification

## Overview

This document specifies the exact changes needed to align all pages with the homepage design pattern. The homepage is the gold standard - all other pages must visually match its look and feel.

## Design Rules (Universal)

### 1. Color Classes

**CORRECT** (homepage style):
- `text-fg0` - Primary text (`#fbf1c7`)
- `text-fg` - Secondary text (`#ebdbb2`)
- `text-fg2` - Tertiary text (`#d5c4a1`)
- `text-fg3` - Muted text (`#bdae93`)
- `text-fg4` - Dim text (`#a89984`)
- `bg-bg0` - Background (`#1d2021`)
- `border-bg2` - Border (`#504945`)
- `border-fg3` - Hover border (`#bdae93`)

**INCORRECT** (must be replaced):
- `text-gb-fg*` - Gruvbox theme colors (different values)
- `bg-gb-bg0-hard` - Hard background variant
- `border-gb-bg2` - Gruvbox border variant

### 2. Section Pattern

Every page section must follow this pattern:

```tsx
<section className="max-w-2xl">
    <h2 className="text-fg4 font-sans uppercase tracking-[0.2em] text-[10px] mb-6">
        SECTION LABEL
    </h2>
    {/* Content */}
    <div className="border-b border-bg2 mt-6" />
</section>
```

### 3. Typography

- **Headings**: `font-sans` (Inter), `font-bold` or `font-extrabold`
- **Body**: `font-sans` (Inter), `text-sm` to `text-base`
- **Labels**: `text-[10px] uppercase tracking-[0.2em]`
- **Links**: `text-xs` with `hover:text-fg2`
- **Playfair Display**: Only for name/title headings (like homepage NameCard)

### 4. Spacing

- Sections: `gap-24` in flex column
- Content width: `max-w-2xl`
- Padding: `px-4 sm:px-8 md:px-12`
- Divider margin: `mt-6`
- Section label margin: `mb-6`

### 5. What to Remove

- `Scaffold` wrapper (use direct layout)
- `ScaffoldContent` wrapper
- `PageDescriptor` component (use direct h2/h3)
- `Divider` component (use `border-b border-bg2`)
- `text-gb-fg*` classes (use `text-fg*`)
- `border-gb-bg2` classes (use `border-bg2`)

## Page-Specific Changes

### BlogListPage.tsx

**Current issues:**
- Uses `Scaffold` + `ScaffoldContent`
- Uses `PageDescriptor`
- Uses `Divider` component
- Uses `text-gb-fg*` colors
- Uses `border-gb-bg2` borders
- Has `max-w-3xl` instead of `max-w-2xl`

**Required changes:**
1. Remove `Scaffold` wrapper - use direct layout
2. Remove `ScaffoldContent` wrapper
3. Remove `PageDescriptor` import and usage
4. Remove `Divider` import and usage
5. Replace all `text-gb-fg*` with `text-fg*`
6. Replace all `border-gb-bg2` with `border-bg2`
7. Change `max-w-3xl` to `max-w-2xl` for content sections
8. Use `border-b border-bg2 mt-6` instead of `Divider` component
9. Add section headers with `text-[10px] uppercase tracking-[0.2em]`
10. Match homepage's mobile/desktop layout pattern

**Target structure:**
```tsx
// No Scaffold wrapper
<div className="min-h-screen bg-bg0">
    <div className="px-4 sm:px-8 md:px-12 py-12 max-w-2xl mx-auto">
        <section>
            <h2 className="text-fg4 font-sans uppercase tracking-[0.2em] text-[10px] mb-6">
                BLOG
            </h2>
            {/* Blog posts */}
            <div className="border-b border-bg2 mt-6" />
        </section>
    </div>
</div>
```

### BlogPostPage.tsx

**Current issues:**
- Uses `Scaffold` wrapper
- Uses `ScaffoldContent` with `py-32` padding
- Uses `PageDescriptor`
- Uses `Divider` component
- Uses `text-gb-fg*` colors
- Has custom layout

**Required changes:**
1. Remove `Scaffold` wrapper
2. Remove `ScaffoldContent` wrapper
3. Remove `PageDescriptor` import and usage
4. Remove `Divider` import and usage
5. Replace all `text-gb-fg*` with `text-fg*`
6. Replace all `border-gb-bg2` with `border-bg2`
7. Match homepage's padding and spacing
8. Use `border-b border-bg2` for dividers
9. Add "Back to Blog" link matching homepage's link style

**Target structure:**
```tsx
<div className="min-h-screen bg-bg0">
    <div className="px-4 sm:px-8 md:px-12 py-12 max-w-2xl mx-auto">
        <a href="/blog" className="text-fg4 hover:text-fg2 text-xs font-sans transition duration-300">
            ← Back to Blog
        </a>
        <section>
            <h1 className="text-3xl sm:text-4xl font-bold font-sans text-fg0 mb-4">
                {post.title}
            </h1>
            <div className="border-b border-bg2 mt-6" />
            <div className="blog-content mt-8">
                {/* Post content */}
            </div>
        </section>
    </div>
</div>
```

### PhotosPage.tsx

**Current issues:**
- Uses its own header/footer structure
- Has different layout structure
- Missing section pattern

**Required changes:**
1. Replace header with homepage-style section header
2. Replace footer with homepage-style inline footer
3. Use `text-fg*` colors consistently
4. Add section headers with `text-[10px] uppercase tracking-[0.2em]`
5. Use `border-b border-bg2` for dividers
6. Match homepage's padding and spacing

### ProjectsPage.tsx

**Current issues:**
- Uses `Scaffold` wrapper
- Uses `ScaffoldContent`
- Uses `PageDescriptor`
- Uses `Divider` component
- Uses `text-gb-fg*` colors
- Has grid layout (homepage uses section layout)

**Required changes:**
1. Remove `Scaffold` wrapper
2. Remove `ScaffoldContent` wrapper
3. Remove `PageDescriptor` import and usage
4. Remove `Divider` import and usage
5. Replace all `text-gb-fg*` with `text-fg*`
6. Replace all `border-gb-bg2` with `border-bg2`
7. Match homepage's section pattern
8. Use `border-b border-bg2 mt-6` for dividers

### ContactPage.tsx

**Current issues:**
- Uses `Scaffold` wrapper
- Uses `ScaffoldContent`
- Uses `text-gb-fg*` colors
- Has different layout structure

**Required changes:**
1. Remove `Scaffold` wrapper
2. Remove `ScaffoldContent` wrapper
3. Replace all `text-gb-fg*` with `text-fg*`
4. Match homepage's section pattern
5. Use `border-b border-bg2 mt-6` for dividers

### AboutPage.tsx

**Current issues:**
- Uses `Scaffold` wrapper
- Uses `ScaffoldContent`
- Uses `PageDescriptor`
- Uses `text-gb-fg*` colors
- Has timeline layout

**Required changes:**
1. Remove `Scaffold` wrapper
2. Remove `ScaffoldContent` wrapper
3. Remove `PageDescriptor` import and usage
4. Replace all `text-gb-fg*` with `text-fg*`
5. Match homepage's section pattern
6. Use `border-b border-bg2 mt-6` for dividers

## Color Mapping Reference

| Current (Wrong) | Correct (Homepage) | Value |
|----------------|-------------------|-------|
| `text-gb-fg0` | `text-fg0` | `#fbf1c7` |
| `text-gb-fg1` | `text-fg` | `#ebdbb2` |
| `text-gb-fg2` | `text-fg2` | `#d5c4a1` |
| `text-gb-fg3` | `text-fg3` | `#bdae93` |
| `text-gb-fg4` | `text-fg4` | `#a89984` |
| `border-gb-bg2` | `border-bg2` | `#504945` |
| `border-gb-bg3` | `border-bg3` | `#665c54` |
| `bg-gb-bg0-hard` | `bg-bg0` | `#1d2021` |

## Connections

- [[../rough-idea]] - Project overview
- [[../research/design-analysis]] - Design analysis
- [[../implementation/plan]] - Implementation steps
