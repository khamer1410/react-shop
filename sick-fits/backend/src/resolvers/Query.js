const { forwardTo } = require("prisma-binding");
const { hasPermission } = require("../utils");

const Query = {
  //you can use shorthand if you only pass the data without auth or logic
  items: forwardTo("db"),

  // async items(parent, args, ctx, info) {
  //   return await ctx.db.query.items()
  // }

  item: forwardTo("db"),

  itemsConnection: forwardTo("db"),

  me(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      return null;
    }
    return ctx.db.query.user(
      {
        where: { id: ctx.request.userId },
      },
      info
    );
  },

  users(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error("You must be logged in");
    }

    hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE']);

    return ctx.db.query.users({}, info)
  },
};

module.exports = Query;
