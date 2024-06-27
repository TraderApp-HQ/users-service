import { logger } from "@traderapp/shared-resources";
import nodemailer from "nodemailer";

const serverHost = "smtp.gmail.com";
const transporter = nodemailer.createTransport({
	host: serverHost,
	port: 465,
	auth: {
		user: process.env.EMAIL_ADMIN,
		pass: process.env.EMAIL_PASS,
	},
});
const namespace = "Trade App";

type MailType = "newuser";

interface HtmlTemplates {
	newuser: (payload: { email: string; role: string; link: string }) => string;
}

const html: HtmlTemplates = {
	newuser: (payload: { email: string; role: string; link: string }): string => `
        <h2>Welcome to ${namespace}</h2>,
        <p>A new account has been created for you.</p>
        <br />
        <p>Username: <b>${payload.email}</b></p>
        <p>Role: <b>${payload.role[0].toUpperCase()}</b></p>
        <br />
        <p>Thanks!</p>
        <p><a href=${payload.link}>Click to proceed</a></p>
        <p>The ${namespace} Team</p>
      `,
};

interface sendMailPayload {
	mailType: MailType;
	payload: any;
	subject: string;
	recipientEmails: string[];
}

export const sendEmail = async ({
	mailType,
	payload,
	subject,
	recipientEmails,
}: sendMailPayload): Promise<any> => {
	const mailOptions = {
		from: `${namespace} <${process.env.EMAIL_ADMIN}>`,
		to: recipientEmails.join(","),
		subject,
		html: html[mailType](payload),
	};
	try {
		const response: any = await new Promise((resolve, reject) => {
			transporter.sendMail(mailOptions, (error: any, info: any) => {
				if (error) {
					reject(error);
				}
				resolve(info);
			});
		});
		if (response?.messageId) {
			logger.info(`Nodemailer sent message: ${response.messageId}`);
		}
	} catch (err: any) {
		logger.error(`Email not sent: ${err.message}`);
	}
};
