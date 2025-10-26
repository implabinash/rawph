export const calculateTimeDiffInMin = (start: Date, end: Date) => {
	const diffInMs = end.getTime() - start.getTime();
	const diffInMin = Math.floor(diffInMs / (1000 * 60));
	return diffInMin;
};
