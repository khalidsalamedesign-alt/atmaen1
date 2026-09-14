// يولّد صور PNG: أيقونات التطبيق + صور المشاركة لكل صفحة.
// يحتاج خادم المعاينة شغّال:  npm run build && npm run preview
// ثم:  npm run images   ← وبعدها  npm run build  مرة ثانية لنسخ الصور
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';

// ملف تعريف مؤقت حتى ما يلتصق بنافذة المتصفح المفتوحة عند المستخدم
const profile = mkdtempSync(join(tmpdir(), 'itmaen-shot-'));
process.on('exit', () => { try { rmSync(profile, { recursive: true, force: true }); } catch {} });

const BASE = process.env.BASE_URL || 'http://localhost:4321';
const browsers = [
  process.env.CHROME_PATH,
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean);
const browser = browsers.find((b) => existsSync(b));
if (!browser) throw new Error('ما لقيت Chrome أو Edge — حدد المسار بـ CHROME_PATH');

const shot = (url, out, w, h) => {
  const abs = resolve(out);
  if (existsSync(abs)) rmSync(abs);
  execFileSync(browser, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check',
    `--user-data-dir=${profile}`, '--force-device-scale-factor=1',
    '--default-background-color=00000000', '--virtual-time-budget=4000',
    `--window-size=${w},${h}`, `--screenshot=${abs}`, url,
  ], { stdio: 'ignore', timeout: 60000 });
  if (!existsSync(abs)) throw new Error(`فشل التصوير: ${url}`);
  console.log('✓', out);
};

mkdirSync('public/og', { recursive: true });

// أيقونات التطبيق (من النسخة المربعة القابلة للقص)
shot(`${BASE}/icon-maskable.svg`, join('public', 'icon-512.png'), 512, 512);
shot(`${BASE}/icon-maskable.svg`, join('public', 'icon-192.png'), 192, 192);
shot(`${BASE}/icon-maskable.svg`, join('public', 'apple-touch-icon.png'), 180, 180);

// صور المشاركة
const ids = ['site', ...readdirSync('src/data/cases').map((f) => JSON.parse(readFileSync(join('src/data/cases', f), 'utf8')).id)];
for (const id of ids) shot(`${BASE}/og/${id}`, join('public', 'og', `${id}.png`), 1200, 630);
