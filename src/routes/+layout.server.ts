import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ cookies }) => {
	return {
		token: cookies.get('authToken')
	};
};
