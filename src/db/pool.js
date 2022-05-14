const {Pool} = require("pg")

const pool = new Pool({
    host: "postgres",
    user:  "postgres",
    password: "postgres",
    database: "postgres",
    port: 5432
})

pool.QueryRow = async (query, args) => {
    const data = await pool.query(query, args)

    return data.rows[0]
}

pool.QueryRows = async (query, args) => {
    const data = await pool.query(query, args)

    return data.rows
}

module.exports = pool