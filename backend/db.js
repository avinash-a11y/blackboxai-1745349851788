const mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'blood_donor_receiver',
  connectionLimit: 5
});

module.exports = pool;
