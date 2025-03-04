import { json } from '@sveltejs/kit';
import { query } from '$lib/db.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your-secret-key'; // Move to .env in production

async function checkAuth({ request, cookies }) {
	const authHeader = request.headers.get('Authorization');
	const token = authHeader?.split(' ')[1] || cookies.get('authToken');

	if (!token) {
		return { error: 'Unauthorized' };
	}

	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		return { userId: decoded.userId };
	} catch (error) {
		return { error: 'Invalid token' };
	}
}

export async function GET({ request, cookies }) {
	const auth = await checkAuth({ request, cookies });

	if (auth.error) {
		return json({ error: auth.error }, { status: 401 });
	}

	try {
		// Modified query to include user_id in WHERE clause
		const notes = await query('SELECT * FROM notes WHERE user_id = ? ORDER BY created_at DESC', [
			auth.userId
		]);
		return json(notes);
	} catch (error) {
		console.error('Database Error:', error);
		return json({ error: 'Failed to fetch notes' }, { status: 500 });
	}
}

export async function POST({ request, cookies }) {
	const auth = await checkAuth({ request, cookies });

	if (auth.error) {
		return json({ error: auth.error }, { status: 401 });
	}

	try {
		const { title, content } = await request.json();
		// Add user_id to the INSERT query
		const result = await query(
			'INSERT INTO notes (title, content, user_id, created_at) VALUES (?, ?, ?, NOW())',
			[title, content, auth.userId]
		);
		return json({ id: result.insertId }, { status: 201 });
	} catch (error) {
		console.error('Database Error:', error);
		return json({ error: 'Failed to create note' }, { status: 500 });
	}
}

// Also update the PUT endpoint to ensure user ownership
export async function PUT({ request, cookies }) {
	const auth = await checkAuth({ request, cookies });

	if (auth.error) {
		return json({ error: auth.error }, { status: 401 });
	}

	try {
		const { id, title, content } = await request.json();
		// Only update if the note belongs to the user
		const result = await query(
			'UPDATE notes SET title = ?, content = ? WHERE id = ? AND user_id = ?',
			[title, content, id, auth.userId]
		);

		if (result.affectedRows === 0) {
			return json({ error: 'Note not found or unauthorized' }, { status: 404 });
		}

		return json({ success: true });
	} catch (error) {
		console.error('Database Error:', error);
		return json({ error: 'Failed to update note' }, { status: 500 });
	}
}

export async function DELETE({ request, cookies }) {
	const auth = await checkAuth({ request, cookies });

	if (auth.error) {
		return json({ error: auth.error }, { status: 401 });
	}

	try {
		const { id } = await request.json();
		// Only allow deletion if the note belongs to the user
		await query('DELETE FROM notes WHERE id = ? AND user_id = ?', [id, auth.userId]);
		return json({ success: true });
	} catch (error) {
		console.error('Database Error:', error);
		return json({ error: 'Failed to delete note' }, { status: 500 });
	}
}
