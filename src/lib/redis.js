import Redis from "ioredis";
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
  username: process.env.REDIS_USERNAME,
});

const PERM_KEY_PREFIX = "cache:permissions:";

redis.on("connect", () => {
  console.log("Connected to Redis");
});

redis.on("error", (err) => {
  console.error("Redis connection error:", err);
});

export async function getPermissionsForRole(role, db) {
  const cacheKey = PERM_KEY_PREFIX + role;
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const roleDoc = await db.collection("role_permissions").findOne({ role });
  if (!roleDoc) throw new Error(`Permissions for role ${role} not found`);

  const rules = roleDoc.permissions;
  await redis.set(cacheKey, JSON.stringify(rules), "EX", 60 * 60);
  return rules;
}

export async function invalidateRolePermissions(role) {
  const cacheKey = PERM_KEY_PREFIX + role;
  await redis.del(cacheKey);
}

export default redis;
