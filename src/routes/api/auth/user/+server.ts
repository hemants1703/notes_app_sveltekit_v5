import { json } from '@sveltejs/kit';
import { query } from '$lib/db.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your-secret-key'; // Move to .env in production

export async function GET({ request }) {
	const authHeader = request.headers.get('Authorization');
	const token = authHeader?.split(' ')[1];

	if (!token) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		const [user] = await query('SELECT id, username, email FROM users WHERE id = ?', [
			decoded.userId
		]);

		if (!user) {
			return json({ error: 'User not found' }, { status: 404 });
		}

		return json({
			id: user.id,
			username: user.username,
			email: user.email
		});
	} catch (error) {
		return json({ error: 'Invalid token' }, { status: 401 });
	}
}
