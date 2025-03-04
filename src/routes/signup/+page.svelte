<script>
    import { goto } from '$app/navigation';
    import { authToken } from '$lib/stores/auth';

    let username = '';
    let email = '';
    let password = '';
    let error = '';

    async function handleSignup() {
        try {
            const response = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'signup', username, email, password })
            });

            const data = await response.json();
            
            if (response.ok) {
                $authToken = data.token;
                goto('/notes');
            } else {
                error = data.error;
            }
        } catch (err) {
            error = 'Signup failed';
        }
    }
</script>

<div class="min-h-screen flex items-center justify-center bg-black">
    <div class="bg-zinc-900 p-8 rounded-xl border border-zinc-800 w-full max-w-md">
        <h2 class="text-2xl font-bold text-white mb-6">Create an Account</h2>
        
        {#if error}
            <div class="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4">
                {error}
            </div>
        {/if}

        <form on:submit|preventDefault={handleSignup} class="space-y-4">
            <div>
                <label class="block text-gray-400 mb-2" for="username">Username</label>
                <input
                    type="text"
                    id="username"
                    bind:value={username}
                    class="w-full p-3 bg-black border border-zinc-800 rounded-lg text-white focus:border-white transition-colors"
                    required
                />
            </div>

            <div>
                <label class="block text-gray-400 mb-2" for="email">Email</label>
                <input
                    type="email"
                    id="email"
                    bind:value={email}
                    class="w-full p-3 bg-black border border-zinc-800 rounded-lg text-white focus:border-white transition-colors"
                    required
                />
            </div>
            
            <div>
                <label class="block text-gray-400 mb-2" for="password">Password</label>
                <input
                    type="password"
                    id="password"
                    bind:value={password}
                    class="w-full p-3 bg-black border border-zinc-800 rounded-lg text-white focus:border-white transition-colors"
                    required
                />
            </div>

            <button
                type="submit"
                class="w-full bg-white text-black font-semibold py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
                Sign Up
            </button>
        </form>

        <p class="mt-4 text-center text-gray-400">
            Already have an account? 
            <a href="/login" class="text-white hover:underline">Login</a>
        </p>
    </div>
</div>