<script>
    import { page } from '$app/stores';
    import { authToken } from '$lib/stores/auth';
    import { goto } from '$app/navigation';

    async function handleLogout() {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            $authToken = null;
            goto('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }
</script>

<nav class="bg-black border-b border-zinc-800">
    <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between h-16">
            <div class="flex">
                <div class="flex-shrink-0 flex items-center">
                    <a href="/" class="text-2xl font-bold text-white">NotesFlow</a>
                </div>
                {#if $authToken}
                    <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
                        <a 
                            href="/notes" 
                            class="inline-flex items-center px-1 pt-1 border-b-2 {$page.url.pathname.startsWith('/notes') ? 'border-white text-white' : 'border-transparent text-gray-400 hover:text-white'}"
                        >
                            My Notes
                        </a>
                    </div>
                {/if}
            </div>
            <div class="flex items-center space-x-4">
                {#if $authToken}
                    <a
                        href="/notes/new"
                        class="inline-flex items-center px-4 py-2 text-sm bg-white text-black rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        New Note
                    </a>
                    <button
                        on:click={handleLogout}
                        class="inline-flex items-center px-4 py-2 text-sm border border-zinc-700 text-gray-300 rounded-lg hover:text-white hover:border-white transition-colors"
                    >
                        Logout
                    </button>
                {:else}
                    <a
                        href="/login"
                        class="inline-flex items-center px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
                    >
                        Login
                    </a>
                    <a
                        href="/signup"
                        class="inline-flex items-center px-4 py-2 text-sm bg-white text-black rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        Sign Up
                    </a>
                {/if}
            </div>
        </div>
    </div>
</nav>