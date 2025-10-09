<script lang="ts">
</script>

<main class="grid h-screen place-items-center">
	<section class="max-w-96 space-y-8">
		<div class="flex flex-col items-center justify-center gap-6 text-center">
			<h1 class="text-heading-1">You're invited!</h1>

			<p class="w-[80%] text-body text-subtext-color">
				Our platform is invite-only. Enter your referral code to get started.
			</p>
		</div>

		<form action="" class="space-y-2">
			<div class="flex flex-col gap-1">
				<label for="code" class="text-body-bold"
					>Invite Code <span class="text-error-500">*</span></label
				>

				<input
					id="code"
					type="text"
					name="code"
					placeholder="Enter your invite code"
					class="rounded-md border border-neutral-border px-2 py-2 text-body text-brand-700 placeholder:text-caption"
					required
				/>

				<!-- {#if form?.error.fieldErrors.email} -->
				<!-- <p class="text-caption text-error-600">{form.error.fieldErrors.email}</p> -->
				<!-- {/if} -->
			</div>

			<button
				class="mt-2 w-full cursor-pointer rounded-md bg-brand-600 px-4 py-2 text-body-bold text-default-background hover:bg-brand-500 active:bg-brand-600"
				type="submit">Verify Code</button
			>
		</form>

		<div class="flex items-center gap-2 text-caption text-subtext-color">
			<hr class="flex-1" />
			<span>or</span>
			<hr class="flex-1" />
		</div>

		<div class="space-y-2 rounded-md bg-neutral-50 p-6 text-center">
			<p class="text-heading-3">No invite code?</p>

			<p class="text-body text-subtext-color">
				Join our waitlist and we'll notify you when we release early access invitations.
			</p>
		</div>
	</section>
</main>
