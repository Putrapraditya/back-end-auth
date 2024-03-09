import Role from '../models/role';

export async function initRoles() {
  try {

    const existingRoles = await Role.find();
    if (existingRoles.length === 0) {

      await Role.create({ rolename: 'admin' });
      await Role.create({ rolename: 'agent' });
      await Role.create({ rolename: 'user' });
      console.log('Default roles created successfully');
    } else {
      console.log('Roles already exist');
    }
  } catch (error) {
    console.error('Error initializing roles:', error);
  }
}
