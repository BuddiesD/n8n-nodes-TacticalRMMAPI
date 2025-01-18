import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class TacticalRMMAPICredentials implements ICredentialType {
    name = 'tacticalRMMAPICredentials';
    displayName = 'Tactical RMM API Credentials';
    documentationUrl = '';
    properties: INodeProperties[] = [
        {
            displayName: 'Base URL',
            name: 'baseUrl',
            type: 'string',
            default: '',
            placeholder: 'https://api.example.com',
            description: 'The base URL of the Tactical RMM API',
        },
        {
            displayName: 'API Key',
            name: 'apiKey',
            type: 'string',
            typeOptions: {
                password: true,
            },
            default: '',
            description: 'The API key for authentication',
        },
    ];
}
