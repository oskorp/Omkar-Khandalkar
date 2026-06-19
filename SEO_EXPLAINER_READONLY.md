**SEO Explainer (Read‑Only)**

**Purpose**
- **Summary:** Explain what’s in this project, the SEO changes applied, and why they matter — written for both technical reviewers and laypeople.

**Files & structure**
- **index.html:** Main homepage; contains page content, navigation, and all head meta tags (title, description, Open Graph/Twitter tags, canonical, JSON‑LD Person schema).
- **index-backup.html:** Backup copy of the homepage with the same SEO changes.
- **sitemap.xml:** Sitemap for search engines listing site URLs and lastmod dates.
- **robots.txt:** Tells crawlers where the sitemap is and whether they can crawl the site.
- **scripts/**: Lightweight audit scripts (`scripts/seo-audit.js`, `scripts/seo-audit-no-deps.js`) for local SEO checks.
- **images/**: Media assets referenced by pages and social cards.

**SEO changes included (technical)**
- **Meta description:** `meta name="description"` updated with a concise summary of Omkar’s role and content (helps search snippets).
- **Keywords:** `meta name="keywords"` includes target phrases (e.g., "Omkar Khandalkar", "Omkar CodeOS", "Omkar podcast").
- **Canonical tag:** `link rel="canonical"` points to `https://omkarkhandalkar.space/` to prevent duplicate‑URL issues.
- **Open Graph / Twitter cards:** `og:title`, `og:description`, `og:image`, `twitter:*` tags set for rich previews on social platforms.
- **JSON‑LD (Person):** `application/ld+json` Person schema with `alternateName` array containing exact target name variants to help structured‑data matching for rich results.
- **Sitemap & Robots:** `sitemap.xml` lists canonical URLs; `robots.txt` points to the sitemap so crawlers discover pages faster.
- **Navigation / content order:** Reordered so About → Work → Resume appears in the navigation and the page flow (helps content priority and crawl order).

**Why this helps (plain / layman's terms)**
- **Search preview control:** The description and social tags give search engines and social sites a clear summary and image to show when people search or share the site.
- **Correct domain & canonical:** Pointing everything to the same domain (https://omkarkhandalkar.space/) prevents confusion — search engines index one official URL instead of several duplicates.
- **Helps Google understand "who" the site is about:** The structured data (JSON‑LD) tells Google this page is about a person named Omkar and includes common name variants so searches for the different name forms match the same profile.
- **Sitemap speeds indexing:** The sitemap lists pages so search engines can find and index them faster after deploy.
- **Better social previews:** Open Graph and Twitter cards ensure thumbnails and summaries look good when links are shared, increasing clicks.
- **Content order matters:** Putting Work earlier improves the chance search engines see portfolio content soon after visiting, which can help relevance for queries about projects and skills.

**How to verify (quick checks)**
- **Rich Results / Structured Data:** Use Google Rich Results Test on the homepage URL: https://search.google.com/test/rich-results
- **Sitemap submission:** After deploy, submit `https://omkarkhandalkar.space/sitemap.xml` in Google Search Console (ensure property exists for the .space domain).
- **Local quick audit (no external deps):** From project root, run:

```powershell
node scripts/seo-audit-no-deps.js
```

- **Lighthouse (deep audit):** (Requires Node + Chrome) run:

```powershell
npx lighthouse https://omkarkhandalkar.space/ --output html --output-path=lh-report.html
```

**Deployment steps (recommended)**
1. Merge `update-domain-space` into your production branch (e.g., `main`).
2. Deploy to your hosting provider (Netlify/Vercel/GitHub Pages etc.).
3. Verify the live homepage loads with the updated head tags and sitemap is accessible at `https://omkarkhandalkar.space/sitemap.xml`.
4. Submit sitemap to Google Search Console and request indexing for the homepage.
5. Run Lighthouse and fix high‑priority items (performance and accessibility often need tweaks).

**Notes & maintenance**
- Keep the `alternateName` list in JSON‑LD updated with any new public name variants or project brands.
- If you add pages, update `sitemap.xml` and bump `lastmod` dates.
- For major content changes, re‑submit the sitemap or request indexing in Search Console.

**Make this file read‑only (Windows)**
- To set the file attribute as read‑only locally, run in PowerShell:

```powershell
attrib +R "SEO_EXPLAINER_READONLY.md"
```

**Files referenced**
- [index.html](index.html)
- [index-backup.html](index-backup.html)
- [sitemap.xml](sitemap.xml)
- [robots.txt](robots.txt)
- [scripts/seo-audit-no-deps.js](scripts/seo-audit-no-deps.js)

---
*This file is intended as a concise, non‑technical explainer plus a short checklist for validating and deploying the SEO work.*
