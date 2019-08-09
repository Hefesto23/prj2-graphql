const Query = {
    /*
    1 parent -> The previous object, which for a field on the root Query type is often not used.
    2 args -> The arguments provided to the field in the GraphQL query.
    3 context -> A value which is provided to every resolver and holds important contextual 
    information like the currently logged in user, or access to a database.
    4 info -> A value which holds field-specific information relevant to the current query as 
    well as the schema details, also refer to type GraphQLResolveInfo for more details.
    */
    users( parent, args, { prisma }, info ) {
        //arguments to filter
        const filtArgs = {};

        if (args.query) {
            filtArgs.where = {
                OR: [
                {
                    name_contains: args.query
                },
                {
                    email_contains: args.query
                }
            ]
            } 
        }

        return prisma.query.users(filtArgs, info)
    },
    posts(parent, args, { prisma }, info) {
        return prisma.query.posts(null,info)
    },
    comments(parent, args, { db }, info) {
        return db.comments
    },
    me() {
        return {
            id: '123098',
            name: 'Mike',
            email: 'mike@example.com'
        }
    },
    post() {
        return {
            id: '092',
            title: 'GraphQL 101',
            body: '',
            published: false
        }
    }
}

export { Query as default }