const pool = require("../../db/pool")

exports.resolver = {
    Query: {
        authors: async () =>{
            const authors = await pool.QueryRows('SELECT * FROM authors')
            const books = await pool.QueryRows('SELECT * FROM books')
            return authors.map(author => {
                return {
                    id: author.id,
                    name: author.name,
                    books: books.filter(book => book.author_id == author.id)
                }
            })
        },
        author: async (_, args) => {
            const author = await pool.QueryRow('SELECT * FROM authors where id = $1', [args.id])
            if (!author) {
                throw new Error("AUTHOR_DOES_NOT_EXIST")
            }
            const books = await pool.QueryRows('SELECT * FROM books')
            author.books = books.filter(book => book.author_id == args.id)
            return author
        }},
    Mutation: {
        createAuthor: async (_, args) => {
            const author = await pool.QueryRow("SELECT * FROM authors WHERE name = $1", [args.name])
            if (author){
                throw new Error('This author already exists')
            }
            await pool.query("INSERT INTO authors(name) VALUES ($1)", [args.name])
            return "OK"
        },
        updateAuthor: async (_, {input}) => {
            const author = await pool.QueryRow('SELECT * FROM authors WHERE id = $1', [input.id])
            if (!author) {
                throw new Error("AUTHOR_DOES_NOT_EXIST")
            }
            const result = await pool.QueryRow('UPDATE authors SET name = $1 WHERE id = $2 RETURNING *', [input.name, input.id])
            return result
        },
        deleteAuthor: async (_, args) => {
            await pool.QueryRow('DELETE FROM authors WHERE id = $1', [args.id])
            return "OK"
        }}
}