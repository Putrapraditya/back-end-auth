import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import passport from 'passport';
import authRoutes from './routes/authRoutes';
import localStrategy from './strategies/localStrategy';
import jwtStrategy from './strategies/jwtStrategy';
import { initRoles } from './utils/roleUtils';
import { initUsers } from './utils/userUtils';

dotenv.config();
const app = express();


mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/auth-service')
  .then(async () => {
    console.log('Connected to MongoDB');

    await initRoles();
    await initUsers();

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  }).catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });
  
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());


app.use(passport.initialize());
passport.use('local', localStrategy);
passport.use('jwt', jwtStrategy);


app.use('/api/auth/v1', authRoutes);
