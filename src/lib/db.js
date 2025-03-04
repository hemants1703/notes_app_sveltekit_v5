import mysql from 'mysql2/promise';
import { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } from '$env/static/private';

const pool = mysql.createPool({
	host: DB_HOST,
	user: DB_USER,
	password: DB_PASSWORD,
	database: DB_NAME,
	port: DB_PORT,
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0
});

export async function query(sql, params) {
	try {
		const [results] = await pool.execute(sql, params);
		return results;
	} catch (error) {
		console.error('Database Error:', error);
		throw error;
	}
}
