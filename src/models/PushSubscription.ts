// models/PushSubscription.ts
import { Schema, model, Document, Types } from "mongoose";

export interface IPushSubscription extends Document {
	id: string;
	userId: Types.ObjectId;
	endpoint: string;
	keys: {
		p256dh: string;
		auth: string;
	};
	createdAt: Date;
	updatedAt: Date;
}

const PushSubscriptionSchema = new Schema<IPushSubscription>(
	{
		userId: { type: Schema.Types.ObjectId, ref: "user", required: true },
		endpoint: { type: String, required: true, unique: true },
		keys: {
			p256dh: { type: String, required: true },
			auth: { type: String, required: true },
		},
	},
	{ timestamps: true, versionKey: false },
);

PushSubscriptionSchema.set("toJSON", {
	transform: (doc, ret) => {
		ret.id = ret._id;
		delete ret._id;
		delete ret.__v;
		return ret;
	},
});

PushSubscriptionSchema.index({ userId: 1, endpoint: 1 }, { unique: true });

export default model<IPushSubscription>("push-subscription", PushSubscriptionSchema);
