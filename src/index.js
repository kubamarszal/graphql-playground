import { GraphQLServer } from 'graphql-yoga'
import uuidv4 from 'uuid/v4'

let users = [{
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

let posts = [{
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

let comments = [
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
        createUser(data: CreateUserInput!): User!
        createPost(data: CreatePostInput!): Post!
        createComment(data: CreateCommentInput!): Comment!
        deleteUser(id: ID!): User!
        deletePost(id: ID!): Post!
        deleteComment(id: ID!): Comment!
    }

    input CreateUserInput {
        name: String!
        email: String!
        age: Int
    }

    input CreatePostInput {
        title: String!
        body: String!
        published: Boolean!
        author: ID!
    }

    input CreateCommentInput {
        text: String!
        author: ID!
        post: ID!
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
            const emailTaken = users.some((user) => user.email === args.data.email )

            if(emailTaken) {
                throw new Error('Email is already taken!') 
            }

            const user = {
                id: uuidv4(),
                ...args.data
            }

            users.push(user)
            return user
        },
        createPost(parent, args, ctx, info) {
            const userExists = users.some((user) => user.id === args.data.author )

            if(!userExists) {
                throw new Error('User does not exist!')
            }

            const post = {
                id: uuidv4(),
                ...args.data
            }

            posts.push(post)
            return post
        },
        createComment(parent, args, ctx, info) {
            const userExists = users.some((user) => user.id === args.data.author)
            const postExists = posts.some((post) => post.id === args.data.post &&  post.published)

            if(!userExists || !postExists) {
                throw new Error('Something is very NOT ok!!!')
            }

            const comment = {
                id: uuidv4(),
                ...args.data
            }

            comments.push(comment)
            return comment
        },
        deleteUser(parent, args, ctx, info) {
            const userIndex = users.findIndex((user) => user.id === args.id)
            if (userIndex === -1) {
                throw new Error('User not found')
            }

            const deletedUsers = users.splice(userIndex, 1)

            posts = posts.filter((post) => {
                const match = post.author === args.id

                if(match) {
                    comments = comments.filter((comment) => comment.post !== post.id)
                }

                return !match
            })

            comments = comments.filter((comment) => comment.author !== args.id)

            return deletedUsers[0]
        },
        deletePost(parent, args, ctx, info) {
            const postIndex = posts.findIndex((post) => post.id === args.id)
            if(postIndex === -1) {
                throw new Error('Post not found!')
            }

            const deletedPosts = posts.splice(postIndex, 1)

            comments = comments.filter((comment) => comment.post !== args.id)

            return deletedPosts[0]
        },
        deleteComment(parent, args, ctx, info) {
            const commentIndex = comments.findIndex((comment) => comment.id === args.id)
            if(commentIndex === -1) {
                throw new Error('Comment not found!')
            }

            const deletedComments = comments.splice(commentIndex, 1)

            return deletedComments[0]
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