<script lang="ts">
	import { goto } from '$app/navigation';
	import { authToken } from '$lib/stores/auth';

	let email: string = $state('');
	let password: string = $state('');
	let error: string = $state('');
	let loading: boolean = $state(false);

	async function handleLogin(event: SubmitEvent) {
		event.preventDefault();

		loading = true;
		error = '';

		try {
			const response = await fetch('/api/auth', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ action: 'login', email, password })
			});

			const data = await response.json();

			if (response.ok) {
				$authToken = data.token;
				goto('/notes');
			} else {
				error = data.error || 'Login failed';
			}
		} catch (err) {
			error = 'Login failed. Please try again.';
		} finally {
			loading = false;
		}
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-black">
	<div class="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-8">
		<h2 class="mb-6 text-2xl font-bold text-white">Login to NotesFlow</h2>

		{#if error}
			<div class="mb-4 rounded border border-red-500 bg-red-500/10 p-3 text-red-500">
				{error}
			</div>
		{/if}

		<form onsubmit={handleLogin} class="space-y-4">
			<div>
				<label class="mb-2 block text-gray-400" for="email">Email</label>
				<input
					type="email"
					id="email"
					bind:value={email}
					class="w-full rounded-lg border border-zinc-800 bg-black p-3 text-white transition-colors focus:border-white"
					required
				/>
			</div>

			<div>
				<label class="mb-2 block text-gray-400" for="password">Password</label>
				<input
					type="password"
					id="password"
					bind:value={password}
					class="w-full rounded-lg border border-zinc-800 bg-black p-3 text-white transition-colors focus:border-white"
					required
				/>
			</div>

			<button
				type="submit"
				class="w-full rounded-lg bg-white py-3 font-semibold text-black transition-colors hover:bg-gray-100"
			>
				Login
			</button>
		</form>

		<p class="mt-4 text-center text-gray-400">
			Don't have an account?
			<a href="/signup" class="text-white hover:underline">Sign up</a>
		</p>
	</div>
</div>
