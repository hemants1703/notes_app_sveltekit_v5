import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('authToken');
	event.locals.token = token;

	const response = await resolve(event);
	return response;
};
