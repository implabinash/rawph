import { z } from "zod/v4";

export const signUpSchema = z.object({
	name: z
		.string()
		.min(3, { message: "Your name should be at least 3 characters" })
		.max(32, { message: "Your name can't be longer than 32 characters" })
		.trim(),
	email: z
		.email({ message: "Please enter a valid email address" })
		.min(1, { message: "Email is required" })
		.toLowerCase()
		.trim(),
	password: z
		.string()
		.min(6, { message: "Your password should be at least 6 characters" })
		.max(16, { message: "Your password can't be longer than 16 characters" })
		.regex(/[0-9]/, {
			message: "Include at least one number in your password"
		})
		.regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, {
			message: "Include at least one special character in your password"
		})
});

export const signInSchema = z.object({
	email: z
		.email({ message: "Please enter a valid email address" })
		.min(1, { message: "Email is required" })
		.toLowerCase()
		.trim(),
	password: z.string().min(6, { message: "Your password should be at least 6 characters" })
});

export const changePasswordSchema = z
	.object({
		currentPassword: z
			.string()
			.min(6, { message: "Your password should be at least 6 characters" }),
		newPassword: z
			.string()
			.min(6, { message: "Your password should be at least 6 characters" })
			.max(16, { message: "Your password can't be longer than 16 characters" })
			.regex(/[0-9]/, {
				message: "Include at least one number in your password"
			})
			.regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, {
				message: "Include at least one special character in your password"
			}),
		confirmPassword: z.string().min(6, { message: "Your password should be at least 6 characters" })
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"]
	})
	.refine((data) => data.currentPassword !== data.newPassword, {
		message: "Your new password should be different from your current one",
		path: ["newPassword"]
	});

export const setPasswordSchema = changePasswordSchema
	.pick({
		newPassword: true,
		confirmPassword: true
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"]
	});

export const inviteCodeSchema = z.object({
	code: z.string().min(10, { message: "Check your invite code and try again" })
});
