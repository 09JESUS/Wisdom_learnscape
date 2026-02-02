import mysql from 'mysql2/promise';

export const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Nhla@1234',
  database: 'wisdom_learnscape',
});
