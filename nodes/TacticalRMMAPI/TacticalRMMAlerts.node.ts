import { INodeExecutionData, INodeType, INodeTypeDescription, IExecuteFunctions, IHttpRequestMethods } from 'n8n-workflow';

export class TacticalRMMAlerts implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Tactical RMM Alerts',
        name: 'tacticalRMMAlerts',
        icon: 'file:trmm.svg',
        group: ['transform'],
        version: 1,
        description: 'Interact with the Tactical RMM API for Alerts',
        defaults: {
            name: 'Tactical RMM Alerts',
        },
        inputs: ['main'],
        outputs: ['main'],
        credentials: [
            {
                name: 'tacticalRMMAPICredentials',
                required: true,
            },
        ],
        properties: [
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                options: [
                    { name: 'Create Alert', value: 'createAlert' },
                    { name: 'Get Alert by ID', value: 'getAlertById' },
                    { name: 'Update Alert', value: 'updateAlert' },
                    { name: 'Delete Alert', value: 'deleteAlert' },
                    { name: 'Patch Alerts', value: 'patchAlerts' },
                    { name: 'Bulk Alerts', value: 'bulkAlerts' },
                    { name: 'Get Templates', value: 'getTemplates' },
                    { name: 'Create Template', value: 'createTemplate' },
                    { name: 'Get Template by ID', value: 'getTemplateById' },
                    { name: 'Update Template', value: 'updateTemplate' },
                    { name: 'Delete Template', value: 'deleteTemplate' },
                    { name: 'Get Related Templates', value: 'getRelatedTemplates' },
                ],
                default: 'createAlert',
            },
            {
                displayName: 'Alert ID',
                name: 'alertId',
                type: 'number',
                displayOptions: {
                    show: {
                        operation: ['getAlertById', 'updateAlert', 'deleteAlert'],
                    },
                },
                default: 0,
                description: 'The ID of the alert',
            },
            {
                displayName: 'Template ID',
                name: 'templateId',
                type: 'number',
                displayOptions: {
                    show: {
                        operation: ['getTemplateById', 'updateTemplate', 'deleteTemplate', 'getRelatedTemplates'],
                    },
                },
                default: 0,
                description: 'The ID of the template',
            },
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const operation = this.getNodeParameter('operation', 0) as string;
        const credentials = await this.getCredentials('tacticalRMMAPICredentials');
        const baseUrl = credentials.baseUrl as string;
        let responseData;

        const options: {
            method: IHttpRequestMethods;
            uri: string;
            headers: {
                'X-API-KEY': string;
                'Content-Type': string;
            };
            json: true,
            body?: any;
        } = {
            method: 'GET',
            uri: '',
            headers: {
                'X-API-KEY': credentials.apiKey as string,
                'Content-Type': 'application/json',
            },
            json: true,
        };

        const alertId = this.getNodeParameter('alertId', 0, 0) as number;
        const templateId = this.getNodeParameter('templateId', 0, 0) as number;

        switch (operation) {
            case 'createAlert':
                options.method = 'POST';
                options.uri = `${baseUrl}/alerts/`;
                options.body = {}; // Include alert data
                break;
            case 'getAlertById':
                options.uri = `${baseUrl}/alerts/${alertId}/`;
                break;
            case 'updateAlert':
                options.method = 'PUT';
                options.uri = `${baseUrl}/alerts/${alertId}/`;
                options.body = {}; // Include updated alert data
                break;
            case 'deleteAlert':
                options.method = 'DELETE';
                options.uri = `${baseUrl}/alerts/${alertId}/`;
                break;
            case 'patchAlerts':
                options.method = 'PATCH';
                options.uri = `${baseUrl}/alerts/`;
                options.body = {}; // Include data for patching
                break;
            case 'bulkAlerts':
                options.method = 'POST';
                options.uri = `${baseUrl}/alerts/bulk/`;
                options.body = {}; // Include bulk alert data
                break;
            case 'getTemplates':
                options.uri = `${baseUrl}/alerts/templates/`;
                break;
            case 'createTemplate':
                options.method = 'POST';
                options.uri = `${baseUrl}/alerts/templates/`;
                options.body = {}; // Include template data
                break;
            case 'getTemplateById':
                options.uri = `${baseUrl}/alerts/templates/${templateId}/`;
                break;
            case 'updateTemplate':
                options.method = 'PUT';
                options.uri = `${baseUrl}/alerts/templates/${templateId}/`;
                options.body = {}; // Include updated template data
                break;
            case 'deleteTemplate':
                options.method = 'DELETE';
                options.uri = `${baseUrl}/alerts/templates/${templateId}/`;
                break;
            case 'getRelatedTemplates':
                options.uri = `${baseUrl}/alerts/templates/${templateId}/related/`;
                break;
        }

        try {
            responseData = await this.helpers.request(options);
        } catch (error) {
            throw new Error(`Error calling Tactical RMM Alerts API: ${error.message}`);
        }

        return [this.helpers.returnJsonArray(responseData)];
    }
}
