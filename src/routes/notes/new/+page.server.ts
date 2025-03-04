import { requireAuth } from '$lib/auth';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = (event) => {
	requireAuth(event.locals);
	return {};
};
