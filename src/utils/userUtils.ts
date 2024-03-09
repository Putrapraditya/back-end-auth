import User from '../models/user';
import Role from '../models/role';

export async function initUsers() {
  try {

    const existingUsers = await User.find();
    if (existingUsers.length === 0) {
      // Find role with rolename 'user'
      const userRole = await Role.findOne({ rolename: 'user' });
      if (!userRole) {
        console.error('Role "user" not found');
        return;
      }
      
      await User.create({ email: 'admin@smkn1jkt.sch.id', username: 'admin', password: 'adminup', roles: [userRole._id] });
      console.log('Default user created successfully');
    } else {
      console.log('Users already exist');
    }
  } catch (error) {
    console.error('Error initializing users:', error);
  }
}
