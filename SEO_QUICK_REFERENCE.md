# ⚡ SEO Quick Reference Guide

Quick lookup for SEO implementation and best practices.

---

## 🚀 Creating New Pages with SEO

### Step 1: Use the Page Template
Copy template from `lib/EXAMPLE_PAGE_TEMPLATE.tsx`

### Step 2: Add Metadata
```typescript
import { createPageMetadata } from "@/lib/seo-utils";

export const metadata = createPageMetadata(
  "Page Title",
  "Page description",
  ["keyword1", "keyword2"],
  "/page-path"
);
```

### Step 3: Add Structured Data
```typescript
import { WebAppStructuredData } from "@/components/structured-data";

export default function Page() {
  return (
    <>
      <WebAppStructuredData />
      {/* Your content */}
    </>
  );
}
```

---

## 📝 Meta Tag Cheatsheet

### Title Tag
- **Length:** 50-60 characters
- **Format:** "Primary Keyword | Milestone Studio"
- **Goal:** Rank for main keyword + brand recall

### Meta Description
- **Length:** 150-160 characters
- **Format:** Include primary keyword + call-to-action
- **Goal:** Improve click-through rate (CTR)

### Keywords Meta Tag
- **Count:** 5-10 most important keywords
- **Format:** Comma-separated, no spaces
- **Goal:** Search engine understanding

### Canonical URL
- **Format:** Absolute URL starting with https://
- **Goal:** Prevent duplicate content issues
- **Usage:** One per page, points to self

---

## 🎯 Keyword Placement Guide

### Priority Tiers
```
🔴 HIGH    - Title tag, H1, Meta description
🟡 MEDIUM  - Body content, Alt text, Internal links
🟢 LOW     - Secondary headings, Footer
```

### Density Target
- **Optimal:** 1-2% keyword density
- **Avoid:** Keyword stuffing (>3%)
- **Natural:** Use synonyms and variations

### Placement Examples

#### In Title
"Milestone Card Generator | Free Tool | Milestone Studio"

#### In Description
"Create beautiful milestone cards with our free generator. Customize gradients, fonts, and themes. Export PNG instantly for social media."

#### In H1
"Create Milestone Cards in Seconds"

#### In Body
"Our milestone card generator makes it easy to..."

---

## 🔗 URL Best Practices

### URL Structure
```
✅ Good:     /milestone-card-generator
✅ Good:     /editor
❌ Bad:      /page1
❌ Bad:      /p/123
```

### Canonical URL Setup
```typescript
alternates: { canonical: "/page-path" }
```

### Redirect Best Practices
- Use 301 for permanent redirects
- Avoid redirect chains
- Update internal links

---

## 📊 Schema.org Quick Reference

### When to Use Which Schema

| Purpose | Schema Type | Usage |
|---------|-------------|-------|
| Main page | WebApplication | Tool/software |
| Organization info | Organization | Company details |
| FAQ content | FAQPage | Q&A sections |
| Navigation | BreadcrumbList | Site hierarchy |
| Product reviews | Product | AggregateRating |

### Adding Schema
```typescript
import { WebAppStructuredData } from "@/components/structured-data";

// In your component
<WebAppStructuredData />
```

---

## 📱 Social Media Meta Tags

### Open Graph Essential Tags
```html
og:title       - Page title
og:description - Page description
og:image       - 1200x630px image
og:url         - Absolute URL
og:type        - website
```

### Twitter Card Essential Tags
```html
twitter:card        - summary_large_image
twitter:title       - Tweet title
twitter:description - Tweet description
twitter:image       - Card image
```

### Image Sizing
```
Open Graph: 1200x630px
Twitter:    1200x630px minimum
Minimum:    200x200px
```

---

## ✅ Pre-Launch Verification

### SEO Checklist
```
□ Meta titles (50-60 chars)
□ Meta descriptions (150-160 chars)
□ Keywords optimized
□ Canonical URLs set
□ JSON-LD valid
□ OG images ready
□ Mobile responsive
□ Robots.txt created
□ Sitemap.xml created
□ No broken links
□ Load speed tested
```

### External Tools to Check
- Google Search Console
- Bing Webmaster Tools
- Google PageSpeed Insights
- Schema.org Validator
- Facebook OG Debugger
- Twitter Card Validator

---

## 🔍 Monitoring Checklist

### Weekly
- Check Google Search Console for errors
- Monitor Core Web Vitals
- Review recent traffic spike/dip

### Monthly
- Keyword ranking check
- Traffic analysis
- Bounce rate review
- Pages indexed count
- Crawl statistics

### Quarterly
- Competitor analysis
- Backlink audit
- Content gap analysis
- Keyword strategy review

---

## 🛠️ SEO Tools Stack

### Free Tools
| Tool | Purpose |
|------|---------|
| Google Search Console | Ranking, CTR, indexation |
| Google Analytics | Traffic, user behavior |
| Bing Webmaster Tools | Crawling, indexation |
| Lighthouse | Performance, SEO audit |
| Schema.org Validator | Structured data check |

### Paid Tools (Optional)
| Tool | Price | Purpose |
|------|-------|---------|
| Ahrefs | $99/mo | Keywords, backlinks |
| SEMrush | $120/mo | Competitor analysis |
| Moz | $99/mo | Rankings, authority |
| Ubersuggest | $12/mo | Budget option |

---

## 📚 Quick Links to Documentation

| Document | Purpose |
|----------|---------|
| [SEO_GUIDE.md](./SEO_GUIDE.md) | Full setup guide |
| [SEO_KEYWORDS_STRATEGY.md](./SEO_KEYWORDS_STRATEGY.md) | Keywords details |
| [SEO_VERIFICATION_CHECKLIST.md](./SEO_VERIFICATION_CHECKLIST.md) | Launch checklist |
| [EXAMPLE_PAGE_TEMPLATE.tsx](./lib/EXAMPLE_PAGE_TEMPLATE.tsx) | Page template |

---

## 🎓 Common SEO Mistakes to Avoid

### ❌ Don't
- Duplicate content across pages
- Keyword stuffing
- Broken internal links
- Missing alt text on images
- Ignored mobile optimization
- Slow page load times
- No HTTPS/SSL
- Redirects chain
- Ignored robots.txt
- Outdated content

### ✅ Do
- Unique, valuable content
- Natural keyword usage
- Working links everywhere
- Descriptive alt text
- Mobile-first design
- Fast page speed
- HTTPS enabled
- Direct redirects
- Proper robots.txt
- Regular updates

---

## 🚨 SEO Red Flags

Watch out for these issues:

1. **Crawl Errors** in Search Console
2. **Duplicate Content** warnings
3. **Mobile Issues** reported
4. **Core Web Vitals** failing
5. **Manual Actions** against site
6. **Malware Warnings**
7. **Too Many 404s**
8. **Poor Schema Validation**

---

## 💡 SEO Tips & Tricks

### For Better Rankings
1. Update old content regularly
2. Build high-quality backlinks
3. Create comprehensive guides
4. Focus on user intent
5. Use long-tail keywords
6. Optimize for featured snippets
7. Build internal link structure
8. Add FAQ schema

### For Better CTR
1. Write compelling titles (emotion + benefit)
2. Add power words ("free", "best", "ultimate")
3. Include numbers ("5 ways to...", "2023")
4. Create curiosity ("avoid this...", "secret")
5. Keep descriptions under 160 chars
6. Test different variations

### For Better UX
1. Improve page speed
2. Mobile optimization
3. Clear navigation
4. Remove intrusive ads
5. Readable fonts
6. Proper spacing
7. Fast loading images
8. Clear CTAs

---

## 📞 Support Resources

### Metric Definitions
- **CTR:** Click-through rate (clicks ÷ impressions)
- **SERP:** Search engine results page
- **Impression:** Page appearance in search results
- **Ranking:** Position in search results (1-10)
- **Backlink:** Link from other site to yours
- **Domain Authority:** Site credibility (0-100)

### Common Questions

**Q: How long to rank?**
A: 3-6 months for most keywords, 6-12 for competitive ones

**Q: How many keywords to target?**
A: Start with 5-10 primary, expand as you grow

**Q: Does social media help SEO?**
A: Not directly, but indirectly through traffic and awareness

**Q: How often to update content?**
A: Monthly is ideal, at least quarterly

**Q: What about paid ads for SEO?**
A: PPC doesn't affect organic ranking directly

---

## 🎯 Goals & Targets

### 90-Day Goals
- [ ] 100 organic visits/month
- [ ] 5 keywords in top 20
- [ ] Proper indexation
- [ ] Google Search Console setup
- [ ] No crawl errors

### 6-Month Goals
- [ ] 1,000 organic visits/month
- [ ] 20 keywords in top 20
- [ ] Authority building
- [ ] Backlinks acquired
- [ ] Content expanded

### 1-Year Goals
- [ ] 5,000 organic visits/month
- [ ] 50 keywords ranking
- [ ] Authority established
- [ ] Sustainable growth
- [ ] Competitive advantage

---

**Last Updated:** May 2026
**Version:** 1.0
**Status:** Ready to Use

For detailed information, refer to the full SEO_GUIDE.md documentation.
