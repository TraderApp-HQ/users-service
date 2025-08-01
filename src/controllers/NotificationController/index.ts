import { Request, Response, NextFunction } from "express";
import { apiResponseHandler, logger } from "@traderapp/shared-resources";
import PushSubscription from "../../models/PushSubscription";
import { RESPONSE_FLAGS } from "../../config/constants";

export async function subscribeToPushNotifications(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	const { endpoint, keys, userId } = req.body;
	logger.log(`Subscribe to push notifications ${JSON.stringify(req.body)}`);

	if (!endpoint || !keys?.p256dh || !keys?.auth) {
		const error = new Error("Invalid subscription data");
		error.name = RESPONSE_FLAGS.validationError;
		throw error;
	}

	try {
		await PushSubscription.findOneAndUpdate(
			{ userId, endpoint },
			{ userId, endpoint, keys },
			{ upsert: true, new: true },
		);
		res.status(200).json(
			apiResponseHandler({
				message: "Subscription subscribed successfully",
			}),
		);
	} catch (err: any) {
		err.message = "Something went wrong subscribing to push notifications";
		next(err);
	}
}

export async function unsubscribeFromPushNotifications(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	const { userId, endpoint } = req.body;
	logger.log(`Unsubscribe from push notifications ${JSON.stringify(req.body)}`);

	try {
		const data = await PushSubscription.findOne({ userId, endpoint });
		if (data) {
			await PushSubscription.deleteOne({ userId, endpoint });
		}
		res.status(200).json(
			apiResponseHandler({
				message: "Subscription unsubscribed successfully",
			}),
		);
	} catch (err: any) {
		err.message = "Something went wrong unsubscribing from push notifications";
		next(err);
	}
}
