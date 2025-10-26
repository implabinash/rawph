import z from "zod/v4";

export const youtubeUrlSchema = z.object({
	videoURL: z.url("Please enter a valid URL").refine(
		(url) => {
			const youtubeRegex =
				/^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)[\w-]+/;
			return youtubeRegex.test(url);
		},
		{ message: "Please enter a valid YouTube URL" }
	)
});
