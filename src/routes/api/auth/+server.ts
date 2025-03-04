import { json } from '@sveltejs/kit';
import { query } from '$lib/db.js';
import bcrypt from 'bcryptjs'; // Change this line
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your-secret-key'; // Move to .env in production

export async function POST({ request, cookies }) {  // Add cookies parameter
    const { action, username, email, password } = await request.json();

    if (action === 'signup') {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const result = await query(
                'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
                [username, email, hashedPassword]
            );

            const token = jwt.sign({ userId: result.insertId }, JWT_SECRET);
            cookies.set('authToken', token, { path: '/', httpOnly: true });  // Set cookie
            return json({ token });
        } catch (error) {
            return json({ error: 'Username or email already exists' }, { status: 400 });
        }
    }

    if (action === 'login') {
        try {
            const [user] = await query('SELECT * FROM users WHERE email = ?', [email]);

            if (!user || !(await bcrypt.compare(password, user.password_hash))) {
                return json({ error: 'Invalid credentials' }, { status: 401 });
            }

            const token = jwt.sign({ userId: user.id }, JWT_SECRET);
            cookies.set('authToken', token, { path: '/', httpOnly: true });  // Set cookie
            return json({ token });
        } catch (error) {
            return json({ error: 'Login failed' }, { status: 500 });
        }
    }
}
