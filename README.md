# n8n-nodes-apivault-job-leads

An [n8n](https://n8n.io) community node for the **Job Posting Lead Finder** — find companies hiring now across Indeed + LinkedIn and turn every posting into an enriched B2B sales lead.

No login. Pay-as-you-go, no monthly subscription. The multi-source aggregation and enrichment run server-side on [Apify](https://apify.com); this node is a thin connector you drive with your own Apify API token.

Built by **[apivault_labs](https://apify.com/apivault_labs)** — see [all our actors](https://apify.com/apivault_labs).

## Why hiring signals = sales leads

A company posting jobs is spending money and growing — a strong buying signal. This node finds those companies and hands you the data to reach them.

## What you get per job (40+ fields)

- **Core**: title, company, location, job type, posted date, job URL, source
- **leadScore 0-100** + leadTier (cold/warm/hot/scorching) + reasons
- **Salary parser** (USD-normalized, 7 currencies): min/max/median + tier
- **Skills extraction**: 225 tech terms, soft skills, certifications
- **Seniority**, **15 job categories**, **14 benefit flags**, **7 DEI signals**
- **US pay-transparency law** detection
- **Cross-source presence** (a job on multiple boards = serious budget)
- **3 outreach pitch variants** per company (in the top-companies record)

## Installation

In your n8n instance:

1. Go to **Settings → Community Nodes**
2. Select **Install**
3. Enter `n8n-nodes-apivault-job-leads`
4. Confirm and install

## Credentials

This node uses an **Apify API token**:

1. Create a free account at [apify.com](https://apify.com)
2. Go to **Apify Console → Settings → Integrations** and copy your **API token**
3. In n8n, create new **Apify API** credentials and paste the token

A free Apify account includes monthly usage credits.

## Usage

- **Keywords** — job title or keywords (e.g. `marketing manager`)
- **Location** — city/state/country or `Remote` (empty = anywhere)
- **Sources** — Indeed + LinkedIn by default (Glassdoor is opt-in; often Cloudflare-blocked)
- **Deduplicate Companies** — one job per company (highest leadScore)
- **Export Format** — default JSON / CSV (HubSpot/Pipedrive/Salesforce-ready)
- **Filters** — min lead score, only with salary, only remote, fresh this week, pay-transparency compliant

## Pricing

Billed per job through Apify (pay-per-event): **$3 / 1,000 jobs** ($0.003 each). All enrichment included.

## Use cases

- **B2B prospecting** — target companies actively growing
- **Recruitment-agency outreach** — pitch staffing to companies that are hiring
- **CRM enrichment** — export CSV straight into HubSpot/Salesforce/Pipedrive
- **Market & salary research** — track demand and compensation by role

## Resources

- [Job Posting Lead Finder actor on Apify](https://apify.com/apivault_labs/apify-actor-job-leads)
- [All actors by apivault_labs](https://apify.com/apivault_labs)
- Prefer Python? Use the [Python SDK](https://github.com/apivault-labs/job-posting-lead-finder-python)
- [n8n community nodes docs](https://docs.n8n.io/integrations/community-nodes/)

## License

[MIT](LICENSE)

## Keywords

`job-scraper` `indeed-scraper` `linkedin-jobs` `lead-generation` `b2b-prospecting` `hiring-signals` `sales-prospecting` `outreach-automation` `apollo-alternative` `zoominfo-alternative` `n8n` `apify`
