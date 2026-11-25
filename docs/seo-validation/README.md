# Schema validation

`report.md` is produced by `node scripts/seo-check.mjs` (offline structural checks). Before launch, also run these staging URLs through the Google Rich Results Test and schema.org validator and save the results here:

- / (Optometrist)
- /services/dry-eye-treatment/ (Service + FAQPage + BreadcrumbList)
- /services/aesthetics-med-spa/
- /visit/ (FAQPage)
- /blog/can-dry-eye-cause-blurry-vision/ (BlogPosting)

aggregateRating is intentionally not in the schema until the live Google rating is verified.
