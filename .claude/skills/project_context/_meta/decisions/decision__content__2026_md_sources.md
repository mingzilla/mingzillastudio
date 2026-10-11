## Sources

- [SOURCE] `2026/_meta/content/content.md` = minimum WHAT (challenge, what-it-does table, mermaid as structure source). `showcase.md` = only what content.md lacks (metrics, links, demo/image, extra topics). `profile.md` = everything that is not a topic. No duplication between them.
- [BUILD] `node 2026/_meta/scripts/build_content.js` -> `2026/content.js` (global `CONTENT`, works on file://), the crawlable HTML between the `seo` markers in `index.html`, and `sitemap.xml`. Run after editing any md.
- [MATCH] Table rows join topics by normalised title (parentheses and punctuation ignored). Showcase `### Title` joins by the same rule; `- Section:` makes a new topic.
- [WORDING] `content.md` wording wins over the old page.

## SEO

- [SEO] Static semantic HTML sits inside `#root > #static`; React replaces it on mount. Without JS the full text is still there.
- [SEO] `<title>`, description, canonical `https://mingzillastudio.co.uk/2026/`, Open Graph, Twitter, JSON-LD `Person`, `sitemap.xml`. A site-root `robots.txt` pointing at the sitemap is not created (repo root also serves other folders).
