const {forwardTo} = require('prisma-binding')

const Query = {
  //you can use shorthand if you only pass the data without auth or logic
  items: forwardTo('db')

  // async items(parent, args, ctx, info) {
  //   return await ctx.db.query.items()
  // }
};

module.exports = Query;
