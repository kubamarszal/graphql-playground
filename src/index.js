import { GraphQLServer } from 'graphql-yoga'
import uuidv4 from 'uuid/v4'

const users = [{
        id: '1',
        name: 'Jakub',
        email: 'jakub@example.com',
        age: 31
    },
    {
        id: '2',
        name: 'Sarah',
        email: 'sarah@example.com',
    },
    {
        id: '3',
        name: 'Mike',
        email: 'mike@example.com',
        age: 66
}]

const posts = [{
        id: '1',
        title: 'What Good Sleepers Don’t Do',
        body: 'When it comes to restful slumber, there is no try',
        published: true,
        author: '1'
    }, {
        id: '2',
        title: 'Why I Got Breast Implants',
        body: 'After a lifetime of looking good for other people, I needed to reclaim my body',
        published: false,
        author: '1'
    }, {
        id: '3',
        title: 'How to Delete Your Slack Messages',
        body: 'If you’re concerned about message retention, solutions are just a few clicks away',
        published: true,
        author: '3'
}]

const comments = [
    {
        id: '1',
        text: 'Great article mate!',
        author: '2',
        post: '3'
    }, {
        id: '2',
        text: 'Good luck with your new blog!',
        author: '2',
        post: '1'
    }, {
        id: '3',
        text: 'I\'d like to see some more advanced features',
        author: '3',
        post: '1'
    }, {
        id: '4',
        text: 'Wow what a greate place to learn GraphQL!',
        author: '2',
        post: '2'
    }
]

//Types
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        comments: [Comment!]!
    }

    type Mutation {
        createUser(name: String!, email: String!, age: Int): User!
        createPost(title: String!, body: String!, published: Boolean!, author: ID!): Post!
        createComment(text: String!, author: ID!, post: ID!): Comment!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]!
    }

    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
    }
`

//Resolvers
const resolvers = {
    Query: {
        users(parent, args, ctx, info) {
            if(!args.query){
                return users
            } else {
                return users.filter((user) => {
                    return user.name.toLowerCase().includes(args.query.toLowerCase())
                })
            }
        },
        posts(parent, args, ctx, info) {
            if(!args.query) {
                return posts
            } else {
                return posts.filter((post) => {
                    const lct = args.query.toLowerCase()
                    const titleMatch = post.title.toLowerCase().includes(lct)
                    const bodyMatch = post.body.toLowerCase().includes(lct)
                    return titleMatch || bodyMatch
                })
            }
        },
        comments(parent, args, ctx, info) {
            return comments
        }
    },
    Mutation: {
        createUser(parent, args, ctx, info) {
            const emailTaken = users.some((user) => user.email === args.email )

            if(emailTaken) {
                throw new Error('Email is already taken!') 
            }

            const user = {
                id: uuidv4(),
                ...args
            }

            users.push(user)
            return user
        },
        createPost(parent, args, ctx, info) {
            const userExists = users.some((user) => user.id === args.author )

            if(!userExists) {
                throw new Error('User does not exist!')
            }

            const post = {
                id: uuidv4(),
                ...args
            }

            posts.push(post)
            return post
        },
        createComment(parent, args, ctx, info) {
            const userExists = users.some((user) => user.id === args.author)
            const postExists = posts.some((post) => post.id === args.post &&  post.published)

            if(!userExists || !postExists) {
                throw new Error('Something is very NOT ok!!!')
            }

            const comment = {
                id: uuidv4(),
                ...args
            }

            comments.push(comment)
            return comment
        }
    },
    Post: {     //1:1 // 1:N
        author(parent, args, ctx, info) {
            return users.find((user) => {
                return user.id === parent.author
            })
        },
        comments(parent, args, ctx, info) {
            return comments.filter((comment) => {
                return comment.post === parent.id
            })
        }
    },
    User: {     // 1:N // 1:N
        posts(parent, args, ctx, info) {
            return posts.filter((post) => {
                return post.author === parent.id
            })
        },
        comments(parent, args, ctx, info) {
            return comments.filter((comment) => {
                return comment.author === parent.id
            })
        }
    },
    Comment: {  //1:1 // 1:1
        author(parent, args, ctx, info) {
            return users.find((user) => {
                return user.id === parent.author
            })
        }, 
        post(parent, args, ctx, info) {
            return posts.find((post) => {
                return post.id === parent.post
            })
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(() => {
    console.log('Server is running')
})