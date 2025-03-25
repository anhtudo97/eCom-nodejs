const mysql = require('mysql2');

// create a new connection
const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'tipjs',
    database: 'test',
    port: '8811',
    connectionLimit: 10,
});

const batchSize = 100000; // adjust batch size
const totalSize = 10_000_000; // adjust total size

// 1_000_000 6.077s
// 10_000_000 1m

let currentId = 1;
console.time(':::::::::::::::::::TIMER::::::::::::::::')
const insertBatch = async () => {
    const values = [];
    for (let i = 0; i < batchSize && currentId <= totalSize; i++) {
        const name = `name-${currentId}`;
        const age = currentId;
        const address = `address-${currentId}`;
        values.push([currentId, name, age, address]);
        currentId++;
    }

    if (!values.length) {
        console.timeEnd(':::::::::::::::::::TIMER::::::::::::::::')
        connection.end(
            err => {
                if (err) {
                    console.log(`Error occurred while creating`)
                } else {
                    console.log(`Connection closed successful`)
                }
            }
        )

        return;
    }

    const query = `INSERT INTO test_table (id, name, age, address) VALUES ?`;
    connection.query(query, [values], async (err, result) => {
        if (err) throw err;
        console.log(`Inserted ${result.affectedRows} records`);

        await insertBatch();
    });
}

insertBatch().catch(err => console.error(err));