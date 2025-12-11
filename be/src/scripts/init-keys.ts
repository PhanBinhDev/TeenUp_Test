import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const secretsDir = path.resolve(process.cwd(), 'secrets');

if (!fs.existsSync(secretsDir)) {
  fs.mkdirSync(secretsDir, { recursive: true });
}

const privateKeyPath = path.join(secretsDir, 'private.key');
const publicKeyPath = path.join(secretsDir, 'public.key');

if (!fs.existsSync(privateKeyPath)) {
  execSync(
    `openssl genpkey -algorithm RSA -out ${privateKeyPath} -pkeyopt rsa_keygen_bits:4096`,
  );
}

if (!fs.existsSync(publicKeyPath)) {
  execSync(`openssl rsa -pubout -in ${privateKeyPath} -out ${publicKeyPath}`);
}
