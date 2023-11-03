import {
    SecretsManagerClient,
    GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";
import 'dotenv/config';
import secretsJson from '../env.json'
import { ENVIRONMENTS } from "./constants";

const client = new SecretsManagerClient({ region: "eu-west-1" });
const env = process.env.NODE_ENV || 'development';
let suffix = ENVIRONMENTS[process.env.NODE_ENV?.toUpperCase() || ''].toLowerCase();
const secretNames = [
  'common-secrets',
  'users-service-secrets'
];


async function initSecrets() {
    console.debug(`Getting secrets for ${env} and ${suffix} environment`);
    console.log(`aws secret ==== ${process.env.AWS_ACCESS_KEY_ID}`)
    try {
        const secretsJsonList: Record<string, boolean> = secretsJson;
        const secrets = await Promise.all(secretNames.map(async (secretName) => {
            const command = new GetSecretValueCommand({ SecretId: `${secretName}/${suffix}`, VersionStage: 'AWSCURRENT' });
            const response = await client.send(command);
            return JSON.parse(response.SecretString || '');
        }));

        secrets.forEach((secret) => {
            Object.entries(secret).forEach((item) => {
                const isNeeded = secretsJsonList[item[0]];
                if(isNeeded) {
                    process.env[item[0]] = item[1] as string;
                    console.log(`${item[0]} ==== ${process.env[item[0]]}`)
                }
            })
        });
    } 
    catch (error) {
        throw error;
    }
}

export default initSecrets;