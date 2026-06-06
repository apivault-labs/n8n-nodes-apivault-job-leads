# Changelog

## 0.1.0

- Initial release.
- `Job Posting Lead Finder` node: search Indeed + LinkedIn (optional
  Glassdoor) for companies hiring now.
- 40+ enrichment fields per job: leadScore, USD salary parser, tech-skills
  extraction, seniority, categories, benefits, DEI signals, pay-transparency.
- Server-side filters (lead score, salary, remote, freshness) + company dedup.
- Export formats: default JSON / CSV (CRM-ready).
- `Apify API` credentials with token test against `/users/me`.
- Calls the `apivault_labs/apify-actor-job-leads` actor via
  `run-sync-get-dataset-items`.
