const { ApolloServer } = require('apollo-server');
const typeDefs = require('./src/schemas');
const resolvers = require('./src/resolvers');
const connectDB = require('./src/config/db');
require('dotenv').config();

const PORT = process.env.PORT || 8080;

connectDB();
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ headers: req.headers }) 
});

server.listen({ port: PORT }).then(({ url }) => {
    console.log(`Server ready at ${url}`);
});
