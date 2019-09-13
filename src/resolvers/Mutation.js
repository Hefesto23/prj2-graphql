import bcrypt from "bcryptjs";
import utils from "../utils/utils";

const Mutation = {
  async createUser(parent, args, { prisma }) {
    const emailTaken = await prisma.exists.User({ email: args.data.email });

    if (emailTaken) {
      throw new Error("Email taken");
    }

    const password = await utils.hashPwd(args.data.password);

    const user = await prisma.mutation.createUser({
      data: {
        ...args.data,
        password
      }
    });

    return {
      user,
      token: utils.genToken(user.id)
    };
  },
  async login(parent, args, { prisma }) {
    const user = await prisma.query.user({
      where: {
        email: args.data.email
      }
    });

    if (!user) {
      throw new Error("Unable to login");
    }

    const isMatch = await bcrypt.compare(args.data.password, user.password);

    if (!isMatch) {
      throw new Error("Unable to login");
    }

    return {
      user,
      token: utils.genToken(user.id)
    };
  },
  async deleteUser(parent, args, { prisma, request }, info) {
    const userId = utils.getUserId(request);
    return prisma.mutation.deleteUser(
      {
        where: {
          id: userId
        }
      },
      info
    );
  },
  async updateUser(parent, args, { prisma, request }, info) {
    const userId = utils.getUserId(request);

    if (typeof args.data.password === "string") {
      // eslint-disable-next-line no-param-reassign
      args.data.password = await utils.hashPwd(args.data.password);
    }

    return prisma.mutation.updateUser(
      {
        where: {
          id: userId
        },
        data: args.data
      },
      info
    );
  },
  createPost(parent, args, { prisma, request }, info) {
    const userId = utils.getUserId(request);
    return prisma.mutation.createPost(
      {
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
      },
      info
    );
  },
  async deletePost(parent, args, { prisma, request }, info) {
    const userId = utils.getUserId(request);
    const checkUserPost = await prisma.exists.Post({
      id: args.id,
      author: {
        id: userId
      }
    });

    if (!checkUserPost) {
      throw new Error("Unable to delete Post!");
    }

    return prisma.mutation.deletePost(
      {
        where: {
          id: args.id
        }
      },
      info
    );
  },
  async updatePost(parent, args, { prisma, request }, info) {
    const userId = utils.getUserId(request);
    const checkUserPost = await prisma.exists.Post({
      id: args.id,
      author: {
        id: userId
      }
    });

    if (!checkUserPost) {
      throw new Error("Unable to update Post!");
    }

    return prisma.mutation.updatePost(
      {
        where: {
          id: args.id
        },
        data: args.data
      },
      info
    );
  },
  createComment(parent, args, { prisma, request }, info) {
    const userId = utils.getUserId(request);

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
    );
  },
  async deleteComment(parent, args, { prisma, request }, info) {
    const userId = utils.getUserId(request);
    const checkUserComment = await prisma.exists.Comment({
      id: args.id,
      author: {
        id: userId
      }
    });

    if (!checkUserComment) {
      throw new Error("Unable to delete comment!");
    }

    return prisma.mutation.deleteComment(
      {
        where: {
          id: args.id
        }
      },
      info
    );
  },
  async updateComment(parent, args, { prisma, request }, info) {
    const userId = utils.getUserId(request);
    const checkUserComment = await prisma.exists.Comment({
      id: args.id,
      author: {
        id: userId
      }
    });

    if (!checkUserComment) {
      throw new Error("Unable to update comment!");
    }

    return prisma.mutation.updateComment(
      {
        where: {
          id: args.id
        },
        data: args.data
      },
      info
    );
  }
};

export { Mutation as default };
