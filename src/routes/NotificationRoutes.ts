import { Router } from "express";
import { ROUTES } from "../config/constants";
import {
	subscribeToPushNotifications,
	unsubscribeFromPushNotifications,
} from "../controllers/NotificationController";
import {
	validateSubscribeToPushNotifications,
	validateUnsubscribeFromPushNotifications,
} from "../middlewares/NotificationMiddleware";

const router = Router();

// Push Notifications
router.post(
	ROUTES.subscribeToPushNotifications,
	validateSubscribeToPushNotifications,
	subscribeToPushNotifications,
);
router.post(
	ROUTES.unsubscribeFromPushNotifications,
	validateUnsubscribeFromPushNotifications,
	unsubscribeFromPushNotifications,
);
// router.post(ROUTES.sendPushNotification, validateAdmin, sendPushNotification);

export default router;
