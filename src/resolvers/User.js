import getUserId from "../utils/get-user-id";

const User = {
  // locking one specific field
  posts: {
    fragment: "fragment userId on User { id }",
    resolve(parent, args, { prisma, request }) {
      const userId = getUserId(request, false);
      if (userId && userId === parent.id) {
        return prisma.query.posts({
          where: {
            author: {
              id: parent.id
            }
          }
        });
      }
      return [];
    }
  },
  email: {
    fragment: "fragment userId on User { id }",
    resolve(parent, args, { request }) {
      const userId = getUserId(request, false);

      if (userId && userId === parent.id) {
        return parent.email;
      }
      return null;
    }
  }
};

export { User as default };
