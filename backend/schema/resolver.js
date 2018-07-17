const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const userresolver = {
  Query: {
    allUsers: async (parent, args, { User }) => {
      const user = await User.find();
      return user.map((x) => {
        x._id = x._id.toString();
        return x;
      });
    },
  },
  Mutation: {
    createUser: async (parent, args, { User }) => {
    const userargs = args;
    // check existing user to prevent duplicate email entry
      const existingUser = await User.findOne({ email:userargs.email });
       if (existingUser) {
         throw new Error('Email already used');
       }
    // use bacrypt hash function for password encryption
      userargs.password = await bcrypt.hash(userargs.password, 12);
      return User.create(userargs);
    },

    login: async(parent, { email, password }, { User, SECRET }) => {
      const userch = await User.findOne({ email });
        if (!userch){
          throw new Error('Not user with that email');
        }
    // use bacrypt compare function for password decryption
        const valid = await bcrypt.compare(password, userch.password);
        if(!valid){
          throw new Error('Incorrect password');
        }
        const token = jwt.sign(
        {
          userch: _.pick(userch, ['id', 'username']),
        },
        SECRET,
        {
            expiresIn: '1y',
        }
      );
        return token;
    },

  },
};
module.exports = userresolver;
