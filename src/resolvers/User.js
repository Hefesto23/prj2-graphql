import getUserId from "../utils/get-user-id";

const User = {
  // locking one specific field
  email(parent, args, { request }) {
    const userId = getUserId(request, false);

    if (userId && userId === parent.id) {
      return parent.email;
    }
    return null;
  }
};

export { User as default };
