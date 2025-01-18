import { INodeExecutionData, INodeType, INodeTypeDescription, IExecuteFunctions, IHttpRequestMethods } from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';


export class TacticalRmmAgents implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Tactical RMM Agents',
        name: 'tacticalRmmAgents',
        icon: 'file:trmm.svg',
        group: ['transform'],
        version: 1,
        description: 'Interact with the Tactical RMM API for Agents',
        defaults: {
            name: 'Tactical RMM Agents',
        },
        inputs: ['main'],
        outputs: ['main'],
        credentials: [
            {
                name: 'tacticalRMMAPICredentialsApi',
                required: true,
            },
        ],
        properties: [
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
								noDataExpression: true,
								options: [
									{ name: 'Delete Agent', value: 'deleteAgent' },
									{ name: 'Delete Pending Actions', value: 'deletePendingActions' },
									{ name: 'Get Agent by ID', value: 'getAgentById' },
									{ name: 'Get Agent Checks', value: 'getAgentChecks' },
									{ name: 'Get Agent History', value: 'getAgentHistory' },
									{ name: 'Get All Agents', value: 'getAllAgents' },
									{ name: 'Get Event Logs', value: 'getEventLogs' },
									{ name: 'Get Pending Actions', value: 'getPendingActions' },
									{ name: 'Get Tasks', value: 'getTasks' },
									{ name: 'Patch Reboot Agent', value: 'patchRebootAgent' },
									{ name: 'Post Agent Check', value: 'postAgentCheck' },
									{ name: 'Post Command to Agent', value: 'postCommandToAgent' },
									{ name: 'Post Task', value: 'postTask' },
									{ name: 'Reboot Agent', value: 'rebootAgent' },
									{ name: 'Recover Agent', value: 'recoverAgent' },
									{ name: 'Run Script on Agent', value: 'runScriptOnAgent' },
									{ name: 'Update Agent', value: 'updateAgent' },
                ],
                default: 'getAllAgents',
            },
            {
                displayName: 'Agent ID',
                name: 'agentId',
                type: 'string',
                displayOptions: {
                    show: {
                        operation: [
                            'getAgentById',
                            'updateAgent',
                            'deleteAgent',
                            'getAgentChecks',
                            'postAgentCheck',
                            'postAgentCommand',
                            'getAgentEventLogs',
                            'rebootAgent',
                            'patchRebootAgent',
                            'recoverAgent',
                            'runScriptOnAgent',
                            'getAgentHistory',
                            'getAgentTasks',
                            'postAgentTask',
                            'getPendingActions',
                            'deletePendingActions',
                        ],
                    },
                },
                default: '',
                description: 'The ID of the agent',
            },
            {
                displayName: 'Log Type',
                name: 'logType',
                type: 'string',
                displayOptions: {
                    show: {
                        operation: ['getAgentEventLogs'],
                    },
                },
                default: 'system',
                description: 'The type of event log to retrieve (e.g., system, application, etc.)',
            },
            {
                displayName: 'Days',
                name: 'days',
                type: 'number',
                displayOptions: {
                    show: {
                        operation: ['getAgentEventLogs'],
                    },
                },
                default: 7,
                description: 'The number of days to retrieve logs for',
            },
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const operation = this.getNodeParameter('operation', 0) as string;
        const credentials = await this.getCredentials('tacticalRMMAPICredentialsApi');
        const baseUrl = credentials.baseUrl as string;
        let responseData;

        const options: {
            method: IHttpRequestMethods;
            uri: string;
            headers: {
                'X-API-KEY': string;
                'Content-Type': string;
            };
            json: boolean;
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

        const agentId = this.getNodeParameter('agentId', 0, '') as string;

        switch (operation) {
            case 'getAllAgents':
                options.uri = `${baseUrl}/agents/`;
                break;
            case 'getAgentById':
                options.uri = `${baseUrl}/agents/${agentId}/`;
                break;
            case 'updateAgent':
                options.method = 'PUT';
                options.uri = `${baseUrl}/agents/${agentId}/`;
                options.body = {}; // Update payload
                break;
            case 'deleteAgent':
                options.method = 'DELETE';
                options.uri = `${baseUrl}/agents/${agentId}/`;
                break;
            case 'getAgentChecks':
                options.uri = `${baseUrl}/agents/${agentId}/checks/`;
                break;
            case 'postAgentCheck':
                options.method = 'POST';
                options.uri = `${baseUrl}/agents/${agentId}/checks/`;
                options.body = {}; // Payload for check
                break;
            case 'postAgentCommand':
                options.method = 'POST';
                options.uri = `${baseUrl}/agents/${agentId}/cmd/`;
                options.body = {}; // Command payload
                break;
            case 'getAgentEventLogs':
                const logType = this.getNodeParameter('logType', 0) as string;
                const days = this.getNodeParameter('days', 0) as number;
                options.uri = `${baseUrl}/agents/${agentId}/eventlog/${logType}/${days}/`;
                break;
            case 'rebootAgent':
                options.method = 'POST';
                options.uri = `${baseUrl}/agents/${agentId}/reboot/`;
                break;
            case 'patchRebootAgent':
                options.method = 'PATCH';
                options.uri = `${baseUrl}/agents/${agentId}/reboot/`;
                options.body = {}; // Reboot payload
                break;
            case 'recoverAgent':
                options.method = 'POST';
                options.uri = `${baseUrl}/agents/${agentId}/recover/`;
                break;
            case 'runScriptOnAgent':
                options.method = 'POST';
                options.uri = `${baseUrl}/agents/${agentId}/runscript/`;
                options.body = {}; // Script payload
                break;
            case 'getAgentHistory':
                options.uri = `${baseUrl}/agents/${agentId}/history/`;
                break;
            case 'getAgentTasks':
                options.uri = `${baseUrl}/agents/${agentId}/tasks/`;
                break;
            case 'postAgentTask':
                options.method = 'POST';
                options.uri = `${baseUrl}/agents/${agentId}/tasks/`;
                options.body = {}; // Task payload
                break;
            case 'getPendingActions':
                options.uri = `${baseUrl}/agents/${agentId}/pendingactions/`;
                break;
            case 'deletePendingActions':
                options.method = 'DELETE';
                options.uri = `${baseUrl}/agents/${agentId}/pendingactions/`;
                break;
        }

        try {
					responseData = await this.helpers.request(options);
			} catch (error) {
					throw new NodeApiError(this.getNode(), error);
			}

        return [this.helpers.returnJsonArray(responseData)];
    }
}
