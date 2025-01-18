import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class TacticalRMMAPICredentialsApi implements ICredentialType {

    name = 'tacticalRMMAPICredentialsApi';
    displayName = 'Tactical RMM API Credentials - API';
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
					displayName: 'Tactical RMM API Key',

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
