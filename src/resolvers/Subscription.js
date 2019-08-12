// Subscriptions allow clients to receive event-based realtime updates

const Subscription = {
    comment: {
        subscribe( parent, { postId }, { prisma }, info ) {
            return prisma.subscription.comment(
                {
                    where: {
                        node: {
                            post: {
                                id: postId
                            }
                        }
                    }
                }
                , info
            )
        }
    },
    post: {
        subscribe(parent, { userId }, { prisma }, info ) {
            return prisma.subscription.post(
                {
                    where: {
                        node: {
                            author: {
                                id: userId
                            }
                        }
                    }
                }
                , info
            )
        }
    }
}

export { Subscription as default }
