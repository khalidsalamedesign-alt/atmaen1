export const categories = [
  { id: 'breathing', name: 'اختناق وتنفس', icon: 'lungs' },
  { id: 'bleeding', name: 'نزيف وجروح', icon: 'drop' },
  { id: 'burns', name: 'حروق', icon: 'flame' },
  { id: 'accidents', name: 'حوادث منزلية', icon: 'home' },
  { id: 'poison-bites', name: 'سموم ولدغات', icon: 'bottle' },
  { id: 'sudden', name: 'حالات مفاجئة', icon: 'bolt-heart' },
] as const;

export const ages = [
  { id: 'infant', name: 'رضّع', hint: 'أقل من سنة', icon: 'baby' },
  { id: 'child', name: 'أطفال', hint: 'من سنة إلى البلوغ', icon: 'child' },
  { id: 'adult', name: 'بالغين', hint: '', icon: 'adult' },
  { id: 'elderly', name: 'كبار السن', hint: '', icon: 'elderly' },
] as const;

export const urgencyLabel: Record<string, string> = {
  critical: 'حرجة',
  high: 'عالية',
  medium: 'متوسطة',
  low: 'منخفضة',
};

// حالات مخطط لها ولم تُكتب مسوّدتها بعد — تظهر بالبحث والتصنيفات كـ«قيد الإعداد»
// الشكل: { title, category, ageGroup: ['all' | id], keywords }
export const planned: { title: string; category: string; ageGroup: string[]; keywords: string }[] = [];
