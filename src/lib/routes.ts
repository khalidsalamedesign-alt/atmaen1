import { allCases } from './util';
import { categories, ages } from '../data/taxonomy';

// كل صفحات الموقع — تُستخدم للـ sitemap وللتخزين الأوفلاين
export const allRoutes = [
  '/',
  ...allCases.map((c) => `/case/${c.id}`),
  ...categories.map((c) => `/category/${c.id}`),
  ...ages.map((a) => `/age/${a.id}`),
  '/tools',
  '/tools/cpr-timer',
  '/tools/burn-timer',
  '/tools/body-map',
  '/tools/family-card',
  '/printables',
  '/printables/choking-poster',
  '/printables/classroom-poster',
  '/first-aid-kit',
  '/emergency-numbers',
  '/about',
  '/medical-review',
  '/disclaimer',
  '/privacy',
  '/contact',
];
