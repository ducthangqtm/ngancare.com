import { renameSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';

const apiDir = path.join(process.cwd(), 'src', 'app', 'api');
const tempDir = path.join(process.cwd(), 'src', 'app', '_api_temp');

let moved = false;

function restoreDir() {
  if (moved && existsSync(tempDir)) {
    for (let i = 0; i < 5; i++) {
      try {
        renameSync(tempDir, apiDir);
        return;
      } catch (e) {
        // Sleep 500ms and retry if locked by Windows filesystem
        execSync('node -e "setTimeout(()=>{}, 500)"');
      }
    }
  }
}

try {
  if (existsSync(apiDir)) {
    renameSync(apiDir, tempDir);
    moved = true;
  }

  console.log('Building Next.js Static Export for Cloudflare Pages...');
  execSync('npx next build', {
    stdio: 'inherit',
    env: { ...process.env, STATIC_EXPORT: 'true' },
  });
  console.log('Build completed successfully! Static output is in "out/". Cloudflare Pages Functions in "functions/".');
} catch (error) {
  console.error('Build error:', error);
  process.exit(1);
} finally {
  restoreDir();
}
