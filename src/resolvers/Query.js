const Query = {
    users(parent, args, { db }, info) {
        if(!args.query){
            return db.users
        } else {
            return db.users.filter((user) => {
                return user.name.toLowerCase().includes(args.query.toLowerCase())
            })
        }
    },
    posts(parent, args, { db }, info) {
        if(!args.query) {
            return db.posts
        } else {
            return db.posts.filter((post) => {
                const lct = args.query.toLowerCase()
                const titleMatch = post.title.toLowerCase().includes(lct)
                const bodyMatch = post.body.toLowerCase().includes(lct)
                return titleMatch || bodyMatch
            })
        }
    },
    comments(parent, args, { db }, info) {
        return db.comments
    }
}

export { Query as default }