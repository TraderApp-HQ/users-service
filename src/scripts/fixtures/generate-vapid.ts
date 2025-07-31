// scripts/generate-vapid.ts
import webpush from "web-push";

async function generateVapidKeys() {
	const vapidKeys = webpush.generateVAPIDKeys();

	console.log("Public Key:", vapidKeys.publicKey);
	console.log("Private Key:", vapidKeys.privateKey);
}

generateVapidKeys();
