import { Strategy, ExtractJwt } from 'passport-jwt';
import User from '../models/user';

const jwtStrategy = new Strategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || 'defaultSecret',
  },
  async (payload, done) => {
    try {
      const user = await User.findById(payload.userId);

      if (!user) {
        return done(null, false);
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
);

export default jwtStrategy;
