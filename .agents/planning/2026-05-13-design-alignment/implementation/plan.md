# Implementation Plan: Page Design Alignment

## Overview

This plan outlines the step-by-step process to align all pages with the homepage design pattern. Each step results in a working, demoable increment.

## Prerequisites

- Homepage (HomePage.tsx) is the gold standard - do NOT modify it
- All other pages must match its visual design
- Build passes after each step

## Step 1: BlogListPage Alignment

**Objective:** Remove Scaffold wrapper, replace colors, match section pattern

**Files to modify:**
- `src/pages/BlogListPage.tsx`

**Changes:**
1. Remove `Scaffold` and `ScaffoldContent` imports and usage
2. Remove `PageDescriptor` import and usage
3. Remove `Divider` import and usage
4. Replace all `text-gb-fg*` with `text-fg*`
5. Replace all `border-gb-bg2` with `border-bg2`
6. Change `max-w-3xl` to `max-w-2xl` for content sections
7. Add section header with `text-[10px] uppercase tracking-[0.2em]`
8. Use `border-b border-bg2 mt-6` instead of Divider component
9. Add minimal layout structure matching homepage

**Verification:**
- Run `npm run build`
- Visit `/blog` and compare with homepage design
- Check colors match (use browser dev tools to inspect)

## Step 2: BlogPostPage Alignment

**Objective:** Remove Scaffold wrapper, replace colors, match section pattern

**Files to modify:**
- `src/pages/BlogPostPage.tsx`

**Changes:**
1. Remove `Scaffold` and `ScaffoldContent` imports and usage
2. Remove `PageDescriptor` import and usage
3. Remove `Divider` import and usage
4. Replace all `text-gb-fg*` with `text-fg*`
5. Replace all `border-gb-bg2` with `border-bg2`
6. Match homepage's padding and spacing
7. Add "Back to Blog" link matching homepage's link style
8. Use `border-b border-bg2 mt-6` for dividers
9. Add section header with `text-[10px] uppercase tracking-[0.2em]`

**Verification:**
- Run `npm run build`
- Visit `/blog/jackbox-server-setup` and compare with homepage
- Check colors match
- Verify back link works

## Step 3: ProjectsPage Alignment

**Objective:** Remove Scaffold wrapper, replace colors, match section pattern

**Files to modify:**
- `src/pages/ProjectsPage.tsx`

**Changes:**
1. Remove `Scaffold` and `ScaffoldContent` imports and usage
2. Remove `PageDescriptor` import and usage
3. Remove `Divider` import and usage
4. Replace all `text-gb-fg*` with `text-fg*`
5. Replace all `border-gb-bg2` with `border-bg2`
6. Match homepage's section pattern
7. Use `border-b border-bg2 mt-6` for dividers
8. Add section header with `text-[10px] uppercase tracking-[0.2em]`

**Verification:**
- Run `npm run build`
- Visit `/projects` and compare with homepage
- Check colors match
- Verify project cards still work

## Step 4: ContactPage Alignment

**Objective:** Remove Scaffold wrapper, replace colors, match section pattern

**Files to modify:**
- `src/pages/ContactPage.tsx`

**Changes:**
1. Remove `Scaffold` and `ScaffoldContent` imports and usage
2. Replace all `text-gb-fg*` with `text-fg*`
3. Replace all `border-gb-bg2` with `border-bg2`
4. Match homepage's section pattern
5. Use `border-b border-bg2 mt-6` for dividers
6. Add section header with `text-[10px] uppercase tracking-[0.2em]`

**Verification:**
- Run `npm run build`
- Visit `/contacts` and compare with homepage
- Check colors match
- Verify contact links work

## Step 5: AboutPage Alignment

**Objective:** Remove Scaffold wrapper, replace colors, match section pattern

**Files to modify:**
- `src/pages/AboutPage.tsx`

**Changes:**
1. Remove `Scaffold` and `ScaffoldContent` imports and usage
2. Remove `PageDescriptor` import and usage
3. Replace all `text-gb-fg*` with `text-fg*`
4. Replace all `border-gb-bg2` with `border-bg2`
5. Match homepage's section pattern
6. Use `border-b border-bg2 mt-6` for dividers
7. Add section header with `text-[10px] uppercase tracking-[0.2em]`

**Verification:**
- Run `npm run build`
- Visit `/about` and compare with homepage
- Check colors match
- Verify timeline still works

## Step 6: PhotosPage Alignment

**Objective:** Match homepage section pattern and colors

**Files to modify:**
- `src/pages/PhotosPage.tsx`

**Changes:**
1. Replace header with homepage-style section header
2. Replace footer with homepage-style inline footer
3. Use `text-fg*` colors consistently
4. Add section headers with `text-[10px] uppercase tracking-[0.2em]`
5. Use `border-b border-bg2` for dividers
6. Match homepage's padding and spacing

**Verification:**
- Run `npm run build`
- Visit `/photos` and compare with homepage
- Check colors match
- Verify photo grid still works

## Step 7: Final Verification

**Objective:** Ensure all pages match homepage design

**Verification:**
1. Run `npm run build` - must pass with no errors
2. Visit each page and visually compare with homepage:
   - `/` - Homepage (gold standard)
   - `/blog` - Blog list
   - `/blog/jackbox-server-setup` - Blog post
   - `/projects` - Projects
   - `/contacts` - Contact
   - `/about` - About
   - `/photos` - Photos
3. Check that all pages use `text-fg*` colors (not `text-gb-fg*`)
4. Check that all pages use `border-bg2` (not `border-gb-bg2`)
5. Check that all pages have consistent section headers
6. Check that all pages have consistent dividers
7. Check that all pages have consistent spacing

## Risk Mitigation

- **Build breaks:** Keep a backup of each file before modification
- **Visual regression:** Take screenshots of each page before and after changes
- **Functionality loss:** Test all interactive elements after each step
- **Color inconsistency:** Use browser dev tools to verify exact color values

## Success Criteria

1. All pages use `text-fg*` color classes (not `text-gb-fg*`)
2. All pages use `border-bg2` for borders (not `border-gb-bg2`)
3. All pages have consistent section headers with `text-[10px] uppercase tracking-[0.2em]`
4. All pages use `border-b border-bg2 mt-6` for dividers (not `Divider` component)
5. All pages have consistent spacing and padding
6. Build passes with no errors
7. All interactive elements still work
8. Visual consistency with homepage across all pages

## Connections

- [[../rough-idea]] - Project overview
- [[../research/design-analysis]] - Design analysis
- [[../design/page-alignment]] - Design specification
