import { redirect } from '@sveltejs/kit';

export function requireAuth(locals: App.Locals) {
    const token = locals.token;
    if (!token) {
        throw redirect(302, '/login');
    }
}