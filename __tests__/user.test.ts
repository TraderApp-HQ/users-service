const request = require("supertest");
const app = require("../src/app");
import { Response } from "express";

// import userService from "../src/controllers/UserController";

describe("UserService", () => {
	// ...
	const token =
		"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1Njk5Y2E2NWQ3NmI1M2IwZWI3ZTRhYyIsImZpcnN0X25hbWUiOiJEYXZpZDIyIiwibGFzdF9uYW1lIjoiT3Nhcm8iLCJwaG9uZSI6IjA5MDU3MjI4OTA0IiwiZW1haWwiOiJvc2Fyb2RhdmlkNUBnbWFpbC5jb20iLCJkb2IiOiIxMnRoIERlYyIsImlzUGhvbmVWZXJpZmllZCI6ZmFsc2UsImlzRW1haWxWZXJpZmllZCI6ZmFsc2UsImlzSWRWZXJpZmllZCI6ZmFsc2UsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzAyMzM0MTgzLCJleHAiOjE3MDIzMzUwODMsImlzcyI6InRyYWRlcmFwcC5maW5hbmNlIn0.eVnGc5NcBF-1p2TlIBzKND_wqByUURCaXlo0Pf_VnWM";

	describe("GET /users", () => {
		it("should return all users", async () => {
			return (
				request(app)
					.get(`/users`)
					.set("Authorization", `Bearer ${token}`)
					// .expect("Content-Type", /application\/json/)
					.expect(200)
					.then((res: Response) => {
						expect(res.statusCode).toBe(200);
					})
			);
		});
	});
});
