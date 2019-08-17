import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import getUserId from '../utils/get-user-id'
import { config } from "dotenv";

config();

const Mutation = {
   async createUser(parent, args, { prisma }, info) {
        const emailTaken = await prisma.exists.User({ email: args.data.email } )

        if (emailTaken) {
            throw new Error('Email taken')
        }

        if(args.data.password.length < 8 ) {
            throw new Error('Password must be at least 8 characters long!')
        }

        const password = await bcrypt.hash( args.data.password, 10 )

        const user = await prisma.mutation.createUser({ 
            data: {
                ...args.data,
                password 
            }
        }) 

        return {
            user,
            token: jwt.sign({ userId: user.id }, `${process.env.JWT_SECRET}`)
        }
    },
   async login(parent, args, { prisma }, info) {
       const user = await prisma.query.user({
           where: {
               email: args.data.email
           }
       })

       if (!user) {
        throw new Error('Unable to login')
        }

       const isMatch = await bcrypt.compare(args.data.password,user.password)

       if (!isMatch) {
        throw new Error('Unable to login')
        }

        return {
            user,
            token: jwt.sign({ userId: user.id }, `${process.env.JWT_SECRET}`)
        }

   },
   async deleteUser(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        return await prisma.mutation.deleteUser({ 
            where: {
                id: userId 
            }
        }, info)
    },
    updateUser(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        return prisma.mutation.updateUser({
            where: {
                id: userId
            },
            data: args.data
        }, info)
    },
    createPost(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        return prisma.mutation.createPost({
            data: {
                title: args.data.title,
                body: args.data.body,
                published: args.data.published,
                author: {
                    connect: {
                        id: userId
                    }
                }
            }
        }, info)
    },
    async deletePost(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        const checkUserPost = await prisma.exists.Post({
            id: args.id,
            author: {
                id: userId
            }
        })

        if(!checkUserPost){
            throw new Error('Unable to delete Post!')
        }


        return prisma.mutation.deletePost(
            {
                where: {
                    id: args.id
                }
            },
            info
        )
    },
    async updatePost(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        const checkUserPost = await prisma.exists.Post({
            id: args.id,
            author: {
                id: userId
            }
        })

        if(!checkUserPost){
            throw new Error('Unable to update Post!')
        }


        return prisma.mutation.updatePost({
            where: {
                id: args.id
            },
            data: args.data
        }, info)
    },
    createComment(parent, args, { prisma, request }, info) {
       const userId = getUserId(request)

       return prisma.mutation.createComment(
           {
            data: {
                text: args.data.text,
                author: {
                    connect: {
                        id: userId
                    }
                },
                post: {
                    connect: {
                        id: args.data.post
                    }
                }
            }
           },
           info
       )
    },
    async deleteComment(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        const checkUserComment = await prisma.exists.Comment({
            id: args.id,
            author: {
                id: userId
            }
        })

        if(!checkUserComment){
            throw new Error('Unable to delete comment!')
        }


        return prisma.mutation.deleteComment(
            {
                where: {
                    id: args.id
                }
            },
            info
        )
    },
    async updateComment(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        const checkUserComment = await prisma.exists.Comment({
            id: args.id,
            author: {
                id: userId
            }
        })

        if(!checkUserComment){
            throw new Error('Unable to update comment!')
        }

        return prisma.mutation.updateComment(
            {
                where: {
                    id: args.id
                },
                data: args.data
            },
            info
        )
    }
}

export { Mutation as default }