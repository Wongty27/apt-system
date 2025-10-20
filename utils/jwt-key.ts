import { randomBytes } from 'crypto';

try {
  console.log('Generatiing JWT Secret Key...');
  const secret = randomBytes(32).toString('hex');
  console.log(secret);
  console.log(`\nLength: ${secret.length} characters (256 bits)`);
} catch (error) {
  console.error(error);
}
