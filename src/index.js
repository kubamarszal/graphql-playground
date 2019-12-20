import { GraphQLServer } from 'graphql-yoga'
import db from './db'
import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
import Comment from './resolvers/Comment'
import User from './resolvers/User'
import Post from './resolvers/Post'

const resolvers = {
    Query,
    Mutation,
    Post,
    User,
    Comment
}

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: {
        db
    }
})

server.start(() => {
    console.log('Server is running')
})