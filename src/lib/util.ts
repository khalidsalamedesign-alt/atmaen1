const cases = import.meta.glob('../data/cases/*.json', { eager: true, import: 'default' });

export type Step = { text: string; detail?: string; illustration?: string };
export type Case = {
  id: string;
  title: string;
  shortTitle?: string;
  category: string;
  ageGroup: string[];
  urgency: 'critical' | 'high' | 'medium' | 'low';
  icon: string;
  summary: string;
  keywords: string;
  variants?: { label: string; id: string }[];
  callNow: string[];
  steps: Step[];
  dontDo: string[];
  afterCare: string;
  related: string[];
  tools: string[];
  source: { name: string; url: string | null };
  status: 'draft' | 'reviewed';
  reviewedAt: string | null;
  ageNotes?: { label: string; text: string }[];
};

const order = { critical: 0, high: 1, medium: 2, low: 3 };

export const allCases: Case[] = (Object.values(cases) as Case[]).sort(
  (a, b) => order[a.urgency] - order[b.urgency] || a.title.localeCompare(b.title, 'ar'),
);

export const getCase = (id: string) => allCases.find((c) => c.id === id);

export const arNum = (n: number | string) =>
  String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[+d]);

const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
export const arMonth = (ym: string) => {
  const [y, m] = ym.split('-');
  return `${months[+m - 1]} ${y}`;
};

export const toolNames: Record<string, { name: string; href: string }> = {
  'cpr-timer': { name: 'مؤقّت الإنعاش', href: '/tools/cpr-timer' },
  'burn-timer': { name: 'مؤقّت تبريد الحرق', href: '/tools/burn-timer' },
};
