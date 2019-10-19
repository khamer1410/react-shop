const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Mutations = {
  async createItem(parent, args, ctx, info) {
    // TODO check is user logged

    const item = await ctx.db.mutation.createItem(
      {
        data: {
          ...args
        }
      },
      info
    );

    return item;
  },

  updateItem(parent, args, ctx, info) {
    const updates = { ...args };
    delete updates.id;

    return ctx.db.mutation.updateItem(
      {
        data: updates,
        where: {
          id: args.id
        }
      },
      info
    );
  },

 async deleteItem(parent, args, ctx, info) {
    const where = {id: args.id}
    const item = await ctx.db.query.item({where}, `{id title}`)
    // TODO - permisions!
    return ctx.db.mutation.deleteItem({where}, info)
  },

  async signup(parent, args, ctx, info) {
    args.email = args.email.toLowerCase();
    // hash password
    const password = await bcrypt.hash(args.password, 10);
    // create the user in the db
    const user = await ctx.db.mutation.createUser({
      data: {
        ...args, // name, email, password
        password,
        permissions: {set: ['USER']}, // set gives access to a predefined enum
      },
    }, info)

    // create JWT to auto log in
    const token = jwt.sign({userId: user.id}, process.env.APP_SECRET)

    // set the jwt into cookie res
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAges: 1000 * 60 * 60 *24 * 365, // 1 year
    });

    return user
  }
};

module.exports = Mutations;
