import User from "../models/User.js";  
import { AuthenticationError } from 'apollo-server-express';
import { signToken } from '../services/auth.js';

const resolvers = {
    Query: {
      
      me: async (_parent: any, _args: any, context: any) => {
        if (context.user) {
          return User.findOne({ _id: context.user._id });
        }
        throw new AuthenticationError('You need to be logged in!');
      },
    },


    