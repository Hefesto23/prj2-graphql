import getUserId from '../utils/get-user-id'

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
        const userFiltArgs = {};

        if (args.query) {
            userFiltArgs.where = {
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

        return prisma.query.users(userFiltArgs, info)
    },
    posts(parent, args, { prisma, request }, info) {
        const postFiltArgs = {};

        if(args.query){
            postFiltArgs.where = {
                OR: [
                    {
                        title_contains: args.query
                    },
                    {
                        body_contains: args.query
                    }
                ]
            }
        }

        return prisma.query.posts(postFiltArgs, info)
    },
    comments(parent, args, { prisma }, info) {
        return prisma.query.comments(null,info)
    },
    postsFromUser(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        //Arguments
        let postFiltArgs = {
            where: {
                author: {
                    id: userId
                }
            }
        }

        if(args.id) {
            postFiltArgs = {
                where: {
                    id: args.id,
                    author: {
                        id: userId
                    }
                }
            }
        }

        return prisma.query.posts(postFiltArgs, info)
    },
    me(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        const meFiltArgs = {
            where: {
                id: userId
            }
        };
        
        return prisma.query.user(meFiltArgs,info)
    }
}

export { Query as default }