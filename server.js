const express = require("express")
const expressGraphQL = require("express-graphql").graphqlHTTP
const glue = require('schemaglue') 
const { makeExecutableSchema } = require('@graphql-tools/schema')
const app = express();

const { schema, resolver } = glue('./src/graphql')

const executableSchema = makeExecutableSchema ({
    typeDefs: schema,
    resolvers: resolver
})

app.use('/graphql', expressGraphQL({
    schema: executableSchema,
    graphiql: true
}))

app.listen(5000, () => console.log("Server is running.")) 