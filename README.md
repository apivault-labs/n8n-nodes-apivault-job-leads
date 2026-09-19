# Job Posting Leads for n8n

Find companies hiring now across supported job sources and turn postings into structured B2B leads. Results can include company, role, location, salary, skills, freshness, lead score and outreach angles.

## Install

In n8n, open **Settings → Community Nodes → Install** and enter `n8n-nodes-apivault-job-leads`. Add an **Apify API** credential, then select it in the node.

## Quickstart

Import [`examples/quickstart-workflow.json`](examples/quickstart-workflow.json), replace the sample keyword and location, select your credential, and run it. The final node produces one CRM-ready hiring lead per item.

## Useful workflows

- recruitment-agency prospecting;
- sales targeting based on hiring intent;
- role and salary research;
- scheduled company-growth monitoring.

Runs use the hosted [Job Posting Lead Finder](https://apify.com/apivault_labs/apify-actor-job-leads). Actor usage is billed separately on Apify.

## License

[MIT](LICENSE)
