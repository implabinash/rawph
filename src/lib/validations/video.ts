import z from "zod/v4";

const youtubeRegex =
	/^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)[\w-]+/;

export const youtubeURLSchema = z.object({
	videoURL: z.url("Please enter a valid URL").refine(
		(url) => {
			return youtubeRegex.test(url);
		},
		{ message: "We couldn't find a YouTube video at that link. Check the URL and try again." }
	)
});
