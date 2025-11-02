<script>
	import { House } from "@lucide/svelte";

	import { resolve } from "$app/paths";
	import { page } from "$app/state";

	let status = $derived(page.status || 500);
	let message = $derived(page.error?.message || "Something went wrong");
</script>

<main class="grid h-screen w-full place-items-center">
	<section class="max-w-144 space-y-8 text-center">
		<div class="space-y-6">
			<div class="space-y-3">
				<h1 class="text-7xl font-bold">{status}</h1>

				<h2 class="text-heading-1">{message}</h2>
			</div>

			<p class="text-body">
				The page you're looking for doesn't exist or has been moved. Please check the URL or return
				to the dashboard.
			</p>
		</div>

		<a
			href={resolve("/dashboard", {})}
			class="mx-auto flex w-fit items-center gap-2 rounded-md bg-brand-600 px-4 py-2 text-body-bold text-default-background hover:bg-brand-500 active:bg-brand-600"
		>
			<House size="16px" /> Back to Dashboard</a
		>
	</section>
</main>
