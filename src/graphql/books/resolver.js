const pool = require("../../db/pool")

exports.resolver = {
    Query: {
        books: async () => {
            const books = await pool.QueryRows('SELECT * FROM books')
            const authors = await pool.QueryRows('SELECT * FROM authors')
            return await books.map(book => {
                return {
                    id: book.id,
                    name: book.name,
                    author_id: book.author_id,
                    author: authors.find(author => author.id == book.author_id)
                }
            })
        }, 
        book: async (_, args) => {
            const book = await pool.QueryRow('SELECT * FROM books where id = $1', [args.id])
            if (!book) {
                throw new Error ("BOOK_DOES_NOT_EXIST")
            }
            const authors = await pool.QueryRows('SELECT * FROM authors')
            book.author = authors.find(author => args.id == author.id)
            return book
        }},
    Mutation: {
        createBook: async (_, args) => {
            const book = await pool.QueryRow('SELECT * FROM books WHERE name = $1', [args.name])
            if(book){
                throw new Error("Book already exists")
            }
            await pool.QueryRows("INSERT INTO books(name, author_id) VALUES ($1, $2)", [args.name, args.author_id])
            return 'OK'
        },
        updateBook: async (_, { input }) => {
            const book = await pool.QueryRow('SELECT * FROM books WHERE id = $1', [input.id])
            if (!book) {
                throw new Error ("BOOK_DOES_NOT_EXIST")
            }
            const result = await pool.QueryRow('UPDATE books SET name = $1, \
                author_id = $2 WHERE id = $3 RETURNING *', [input.name, input.author_id, input.id])
            return result
        },
        deleteBook: async (_, args) => {
            await pool.QueryRow("DELETE FROM books WHERE id = $1", [args.id])
            return 'OK'
        }
    }
}