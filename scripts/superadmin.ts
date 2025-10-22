// scripts/createSuperAdmin.ts
import * as bcrypt from 'bcrypt';

async function main() {
  const email = 'example@gmail.com';
  const rawPassword = 'example'; // change later
  const passwordHash = await bcrypt.hash(rawPassword, 10);
  console.log(`Password hash: ${passwordHash}`);
  console.log('✅ Super admin created:', email);
  process.exit(0);
}

main();
