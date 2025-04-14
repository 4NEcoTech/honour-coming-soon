import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import { dbConnect } from './dbConnect';
import Permission from '../models/permission';



export async function defineAbilitiesFor(role) {
  await dbConnect();

  const { can, build } = new AbilityBuilder(createMongoAbility);
  const permissions = await Permission.find();

  permissions.forEach((perm) => {
    if (perm.roles.includes(role)) {
      can(perm.action, perm.resource);
    }
  });

  return build();
}
