import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IHttpRequestMethods,
	IRequestOptions,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

// Apify actor that does the real work (runs server-side, billed pay-per-event).
const ACTOR_ID = 'apivault_labs~apify-actor-job-leads';

export class JobLeads implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Job Posting Lead Finder',
		name: 'jobLeads',
		icon: 'file:jobleads.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["keywords"]}}',
		description:
			'Find companies hiring now across Indeed + LinkedIn, enriched into B2B sales leads: leadScore, salary parser, tech skills, cross-source dedup, outreach pitches.',
		defaults: {
			name: 'Job Posting Lead Finder',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'apifyApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Keywords',
				name: 'keywords',
				type: 'string',
				default: '',
				required: true,
				placeholder: 'marketing manager',
				description: 'Job title or keywords to search for',
			},
			{
				displayName: 'Location',
				name: 'location',
				type: 'string',
				default: '',
				placeholder: 'New York, NY',
				description: 'City, state, country, or "Remote". Leave empty for anywhere.',
			},
			{
				displayName: 'Sources',
				name: 'sources',
				type: 'multiOptions',
				options: [
					{ name: 'Indeed', value: 'indeed' },
					{ name: 'LinkedIn', value: 'linkedin' },
					{ name: 'Glassdoor (often Cloudflare-blocked)', value: 'glassdoor' },
				],
				default: ['indeed', 'linkedin'],
				description: 'Which job boards to search',
			},
			{
				displayName: 'Deduplicate Companies',
				name: 'deduplicateCompanies',
				type: 'boolean',
				default: true,
				description:
					'Whether to keep one job per company (highest leadScore). Disable to keep every role for hiring-volume data.',
			},
			{
				displayName: 'Export Format',
				name: 'exportFormat',
				type: 'options',
				options: [
					{ name: 'Default JSON (40+ fields)', value: 'default' },
					{ name: 'CSV (CRM-ready flat row)', value: 'csv' },
				],
				default: 'default',
				description: 'Shape of each lead record',
			},
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'collection',
				placeholder: 'Add Filter',
				default: {},
				options: [
					{
						displayName: 'Min Lead Score',
						name: 'minLeadScore',
						type: 'number',
						typeOptions: { minValue: 0, maxValue: 100 },
						default: 0,
						description: 'Drop jobs below this leadScore (0-100)',
					},
					{
						displayName: 'Only With Salary',
						name: 'onlyWithSalary',
						type: 'boolean',
						default: false,
						description: 'Whether to keep only jobs with a disclosed salary',
					},
					{
						displayName: 'Only Remote',
						name: 'onlyRemote',
						type: 'boolean',
						default: false,
						description: 'Whether to keep only fully-remote jobs',
					},
					{
						displayName: 'Only Fresh This Week',
						name: 'onlyFreshThisWeek',
						type: 'boolean',
						default: false,
						description: 'Whether to keep only jobs posted in the last 7 days',
					},
					{
						displayName: 'Only Pay-Transparency Compliant',
						name: 'onlyPayTransparencyCompliant',
						type: 'boolean',
						default: false,
						description:
							'Whether to keep only jobs in pay-transparency law states with disclosed salary',
					},
				],
			},
			{
				displayName: 'Additional Options',
				name: 'additionalOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Write SUMMARY + Top Companies',
						name: 'writeSummary',
						type: 'boolean',
						default: true,
						description:
							'Whether to write aggregate KV records (SUMMARY + TOP_HIRING_COMPANIES + TOP_JOBS)',
					},
					{
						displayName: 'Top N',
						name: 'topN',
						type: 'number',
						typeOptions: { minValue: 5, maxValue: 100 },
						default: 20,
						description: 'Size of the top-companies / top-jobs records',
					},
					{
						displayName: 'Max Concurrency',
						name: 'maxConcurrency',
						type: 'number',
						typeOptions: { minValue: 1, maxValue: 5 },
						default: 3,
						description: 'Parallel source fetches',
					},
					{
						displayName: 'Timeout per Source (Seconds)',
						name: 'timeout',
						type: 'number',
						typeOptions: { minValue: 30, maxValue: 300 },
						default: 120,
						description: 'Max wait per job board',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const keywords = this.getNodeParameter('keywords', i) as string;
				const location = this.getNodeParameter('location', i, '') as string;
				const sources = this.getNodeParameter('sources', i, [
					'indeed',
					'linkedin',
				]) as string[];
				const deduplicateCompanies = this.getNodeParameter(
					'deduplicateCompanies',
					i,
				) as boolean;
				const exportFormat = this.getNodeParameter('exportFormat', i) as string;
				const filters = this.getNodeParameter('filters', i, {}) as {
					minLeadScore?: number;
					onlyWithSalary?: boolean;
					onlyRemote?: boolean;
					onlyFreshThisWeek?: boolean;
					onlyPayTransparencyCompliant?: boolean;
				};
				const extra = this.getNodeParameter('additionalOptions', i, {}) as {
					writeSummary?: boolean;
					topN?: number;
					maxConcurrency?: number;
					timeout?: number;
				};

				if (!keywords || !keywords.trim()) {
					throw new NodeOperationError(this.getNode(), 'Keywords are required', {
						itemIndex: i,
					});
				}

				const cleanSources = (sources && sources.length ? sources : ['indeed', 'linkedin']).filter(
					(s) => ['indeed', 'linkedin', 'glassdoor'].includes(s),
				);

				const body: Record<string, unknown> = {
					keywords: keywords.trim(),
					location: location || '',
					sources: cleanSources,
					deduplicateCompanies,
					exportFormat,
					minLeadScore: filters.minLeadScore ?? 0,
					onlyWithSalary: filters.onlyWithSalary ?? false,
					onlyRemote: filters.onlyRemote ?? false,
					onlyFreshThisWeek: filters.onlyFreshThisWeek ?? false,
					onlyPayTransparencyCompliant: filters.onlyPayTransparencyCompliant ?? false,
					writeSummary: extra.writeSummary ?? true,
					topN: extra.topN ?? 20,
					maxConcurrency: extra.maxConcurrency ?? 3,
					timeout: extra.timeout ?? 120,
				};

				const options: IRequestOptions = {
					method: 'POST' as IHttpRequestMethods,
					url: `https://api.apify.com/v2/acts/${ACTOR_ID}/run-sync-get-dataset-items`,
					body,
					json: true,
				};

				const response = await this.helpers.requestWithAuthentication.call(
					this,
					'apifyApi',
					options,
				);

				const results = Array.isArray(response) ? response : [response];
				for (const result of results) {
					returnData.push({ json: result, pairedItem: { item: i } });
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
						pairedItem: { item: i },
					});
					continue;
				}
				throw new NodeOperationError(this.getNode(), error as Error, { itemIndex: i });
			}
		}

		return [returnData];
	}
}
