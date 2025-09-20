<script lang="ts">
	import { resolve } from "$app/paths";
</script>

<main class="grid h-screen place-items-center">
	<section class="w-112 space-y-8 rounded-lg bg-neutral-50 p-8">
		<div class="space-y-2 text-center">
			<h1 class="text-heading-2">Welcome to Rawph</h1>

			<p class="text-body text-subtext-color">Register to continue learning together</p>
		</div>

		<form class="space-y-4">
			<div class="flex flex-col gap-1">
				<label for="name" class="text-body-bold">Name</label>

				<input
					id="name"
					type="text"
					name="name"
					placeholder="Enter your name"
					class="rounded-md border border-neutral-border px-2 py-1 placeholder:text-caption"
					required
				/>
			</div>

			<div class="flex flex-col gap-1">
				<label for="email" class="text-body-bold">Email</label>

				<input
					id="email"
					type="email"
					name="email"
					placeholder="Enter your email"
					class="rounded-md border border-neutral-border px-2 py-1 placeholder:text-caption"
					required
				/>
			</div>

			<div class="flex flex-col gap-1">
				<label for="password" class="text-body-bold">Password</label>

				<input
					id="password"
					type="password"
					name="password"
					placeholder="Enter your password"
					class="rounded-md border border-neutral-border px-2 py-1 placeholder:text-caption"
					required
				/>
			</div>

			<button
				class="mt-2 w-full cursor-pointer rounded-md bg-brand-600 px-4 py-2 text-body-bold text-black hover:bg-brand-500 active:bg-brand-600"
				>Join Rawph</button
			>
		</form>

		<div class="flex items-center gap-2 text-caption text-subtext-color">
			<hr class="flex-1" />
			<span>or</span>
			<hr class="flex-1" />
		</div>

		<form action="">
			<button
				class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-neutral-border bg-black px-4 py-2 text-body-bold text-brand-700 hover:bg-neutral-50 active:bg-black"
				type="submit"
			>
				<img src="/images/google.svg" alt="Sign in with Google" class="" />Continue with Google</button
			>
		</form>

		<p class="text-center text-body text-subtext-color">
			Already have an account? <a href={resolve("/signin")} class="text-brand-700">Sign In</a>
		</p>
	</section>
</main>
