const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const { promisify } = require('util');


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
    })
    // create JWT to auto log in
    const token = jwt.sign({userId: user.id}, process.env.APP_SECRET)

    // set the jwt into cookie res
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAges: 1000 * 60 * 60 *24 * 365, // 1 year
    });

    return user
  },


  async signin(parent, args, ctx, info) {
    const { email, password } = args;

    const user = await ctx.db.query.user({where: {email}});

    if (!user) {
      throw new Error(`No user found for email: ${email}`)
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error('Wrong password!')
    }

    logUser(user.id, ctx)

    return user
  },

  singout(parent, args, ctx, info) {
    ctx.response.clearCookie('token')
    return {message: 'Goodbye!'}
  },

  async requestReset(parent, args, ctx, info) {
    // 1. Check if it is a real user
    const user = await ctx.db.query.user({where: { email: args.email}})

    if (!user) {
      throw new Error(`No user found for email: ${args.email}`)
    }
    // 2. Set a reset and expiry token on that user
    const randomBytesPromisified = promisify(randomBytes)
    const resetToken = (await randomBytesPromisified(20)).toString('hex')
    const resetTokenExpiry = Date.now() + 3600000 // 1 hour
    const res = await ctx.db.mutation.updateUser({
      where: {email: args.email},
      data: { resetToken, resetTokenExpiry}
    })
    console.log(res);
    return {message: 'reset token ready'}

    // 3. Email token to the user
  },

  async resetPassword(parent, args, ctx, info) {
    // 1. check if the passwords match
    if (args.password !== args.confirmPassword) {
      throw new Error('passwords do not match!')
    }
    // 2. check if its a legit reset token
    // 3. Check if its expired
    const [user] = await ctx.db.query.users({
      where: {
        resetToken: args.resetPassword,
        resetTokenExpiry_gte: Date.now() - 3600000,
      }
    })
    if (!user) {
      throw new Error('token is either invalid or expired!')
    }

    // 4. Hash their new password
    const password = await bcrypt.hash(args.password, 10);
    // 5. Save the new password to the user and remove old resetToken fields
    const updatedUser = await ctx.db.mutation.updateUser({
      where: { email: user.email },
      data: {
        password,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });
    // 6. Generate JWT
    const token = jwt.sign({userId: updatedUser.id}, process.env.APP_SECRET)

    // 7. Set the JWT cookie
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });
    // 8. return the new user
    return updatedUser
  }
};

function logUser(userId, ctx) {
    // create JWT to auto log in
    const token = jwt.sign({userId}, process.env.APP_SECRET)

    // set the jwt into cookie res
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAges: 1000 * 60 * 60 *24 * 365, // 1 year
    });
}

module.exports = Mutations;
