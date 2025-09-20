import * as dotenv from 'dotenv';
import * as path from 'path';
import chalk from 'chalk';

// Load environment from .env.test
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

console.log(__dirname)

const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET_KEY',
  'JWT_EXPIRATION_TIME',
  'SECRET_EXPIRATION_TIME',
  'NODE_ENV',
  'PORT',
  'NEXT_APP_PUBLIC_URL',
];

let hasError = false;

console.log(chalk.blue.bold('🔍 Checking required environment variables...\n'));

for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    console.error(chalk.red(`❌ Missing required environment variable: ${key}`));
    hasError = true;
  } else {
    console.log(chalk.green(`✅ ${key} = ${process.env[key]}`));
  }
}

if (hasError) {
  console.error(chalk.red.bold('\n❗ Missing environment variables found. Exiting...'));
  process.exit(1);
} else {
  console.log(chalk.green.bold('\n🎉 All required environment variables are set!'));
}
