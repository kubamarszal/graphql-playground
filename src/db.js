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
}]

const db = {
    users,
    posts,
    comments
}

export { db as default }