<script lang="ts">
	type SeoProps = {
		title: string;
		description?: string;
		ogTitle?: string;
		ogDescription?: string;
		twitterTitle?: string;
		twitterDescription?: string;
	};

	let {
		title,
		description = 'Rawph is a co-learning platform where you and your friends can learn from YouTube together. Sync videos, talk in real-time, and brainstorm on a shared whiteboard.',

		ogTitle = 'Rawph - Learn Together, Smarter',
		ogDescription = 'Paste a YouTube link, sync it with your friends, discuss over audio calls, and use a whiteboard to collaborate. Rawph makes learning social and fun.',

		twitterTitle = 'Rawph - Learn Together, Smarter',
		twitterDescription = 'Study with your friends in real time. Watch synced YouTube videos, discuss via audio, and brainstorm on a shared whiteboard with Rawph.'
	}: SeoProps = $props();
</script>

<svelte:head>
	<title>{title} | Rawph</title>
	<meta name="description" content={description} />
	<meta
		name="keywords"
		content="Rawph, co-learning platform, learn with friends, YouTube study, collaborative learning, online study tool, group learning, shared whiteboard, watch and learn"
	/>

	<meta property="og:title" content={ogTitle} />
	<meta property="og:description" content={ogDescription} />
	<!-- <meta property="og:image" content="https://rawph.com/og-image.png" /> -->
	<!-- <meta property="og:url" content="https://rawph.com" /> -->

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={twitterTitle} />
	<meta name="twitter:description" content={twitterDescription} />
	<!-- <meta name="twitter:image" content="https://rawph.com/twitter-card.png" /> -->
</svelte:head>
