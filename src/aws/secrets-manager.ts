import {
    SecretsManagerClient,
    GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";
  
const secret_name = "mongodb-credentials";

const client = new SecretsManagerClient({ region: "us-east-2" });

async function getSecret(secret_name: string) {
    try {
        const response = await client.send(new GetSecretValueCommand({ SecretId: secret_name }));
        return JSON.parse(response.SecretString as string);
    } 
    catch (error) {
        throw error;
    }
}

export default getSecret;