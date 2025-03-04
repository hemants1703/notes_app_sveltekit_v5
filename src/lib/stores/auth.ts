import { writable } from 'svelte/store';

export const authToken = writable(typeof window !== 'undefined' ? localStorage.getItem('authToken') : null);

authToken.subscribe(value => {
    if (typeof window !== 'undefined') {
        if (value) localStorage.setItem('authToken', value);
        else localStorage.removeItem('authToken');
    }
});