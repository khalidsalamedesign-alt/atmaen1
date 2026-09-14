// يولّد ملف مراجعة طبية قابل للطباعة من ملفات الحالات نفسها.
// npm run review  →  review/medical-review-packet.html  (افتحه واطبعه PDF)
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const esc = (s = '') => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const ar = (n) => String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);
const urg = { critical: 'حرجة', high: 'عالية', medium: 'متوسطة', low: 'منخفضة' };
const order = { critical: 0, high: 1, medium: 2, low: 3 };

const cases = readdirSync('src/data/cases')
  .map((f) => JSON.parse(readFileSync(join('src/data/cases', f), 'utf8')))
  .sort((a, b) => order[a.urgency] - order[b.urgency] || a.title.localeCompare(b.title, 'ar'));
const countries = JSON.parse(readFileSync('src/data/countries.json', 'utf8'));

const check = '<span class="ck">☐ صحيح</span><span class="ck">☐ يحتاج تعديل</span>';
const list = (items) => items.map((t) => `<tr><td>${esc(t)}</td><td class="c">${check}</td><td class="n"></td></tr>`).join('');

const caseHtml = (c, i) => `
<section class="case">
  <header>
    <span class="num">${ar(i + 1)}</span>
    <h2>${esc(c.title)}</h2>
    <span class="tag">${urg[c.urgency]}</span>
    <span class="file">src/data/cases/${esc(c.id)}.json</span>
  </header>
  <p class="sum">${esc(c.summary)}</p>

  <h3>اتصل بالإسعاف فوراً إذا</h3>
  <table><thead><tr><th>البند</th><th>التقييم</th><th>ملاحظات المراجع</th></tr></thead><tbody>${list(c.callNow)}</tbody></table>

  <h3>الخطوات (بالترتيب)</h3>
  <table><thead><tr><th>الخطوة</th><th>التقييم</th><th>ملاحظات المراجع</th></tr></thead><tbody>
  ${c.steps.map((s, j) => `<tr><td><b>${ar(j + 1)}.</b> ${esc(s.text)}${s.detail ? `<div class="d">${esc(s.detail)}</div>` : ''}${s.illustration ? `<div class="il">مرفق رسم توضيحي: ${esc(s.illustration)}</div>` : ''}</td><td class="c">${check}</td><td class="n"></td></tr>`).join('')}
  </tbody></table>
  ${c.ageNotes ? `<h3>ملاحظات حسب العمر</h3><table><tbody>${c.ageNotes.map((n) => `<tr><td><b>${esc(n.label)}:</b> ${esc(n.text)}</td><td class="c">${check}</td><td class="n"></td></tr>`).join('')}</tbody></table>` : ''}

  <h3>لا تفعل</h3>
  <table><thead><tr><th>البند</th><th>التقييم</th><th>ملاحظات المراجع</th></tr></thead><tbody>${list(c.dontDo)}</tbody></table>

  <h3>متى يراجع المستشفى</h3>
  <table><tbody>${list([c.afterCare])}</tbody></table>

  <div class="missing">
    <b>هل ينقص الحالة شيء مهم؟</b>
    <div class="lines"></div>
  </div>
  <div class="sign">
    <span>☐ معتمدة كما هي</span><span>☐ معتمدة بعد التعديلات أعلاه</span><span>☐ غير معتمدة</span>
    <span class="blank">التوقيع: ................</span><span class="blank">التاريخ: ..........</span>
  </div>
</section>`;

const html = `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8" />
<title>ملف المراجعة الطبية — اطمئن</title>
<style>
  @page { size: A4; margin: 14mm 12mm; }
  * { box-sizing: border-box; }
  body { font-family: 'Segoe UI', Tahoma, 'Noto Sans Arabic', sans-serif; color: #111; font-size: 10.5pt; line-height: 1.6; margin: 0; background: #eee; }
  .page { background: #fff; max-width: 210mm; margin: 0 auto; padding: 14mm 12mm; }
  h1 { font-size: 24pt; margin: 0 0 4mm; color: #0a5c63; }
  h2 { font-size: 15pt; margin: 0; }
  h3 { font-size: 11pt; margin: 5mm 0 1.5mm; color: #0a5c63; }
  .cover { page-break-after: always; }
  .cover .box { border: 1px solid #0a5c63; border-radius: 3mm; padding: 5mm; margin-block: 5mm; }
  .cover ol li { margin-bottom: 1.5mm; }
  .field { display: flex; gap: 3mm; margin-bottom: 4mm; }
  .field span:last-child { flex: 1; border-bottom: 1px solid #999; }
  .case { page-break-before: always; }
  .case header { display: flex; align-items: center; gap: 3mm; border-bottom: 2px solid #0a5c63; padding-bottom: 2mm; }
  .num { display: grid; place-items: center; width: 9mm; height: 9mm; border-radius: 50%; background: #0a5c63; color: #fff; font-weight: 700; }
  .tag { background: #fdedee; color: #ad1d25; padding: 0 3mm; border-radius: 99px; font-size: 9pt; font-weight: 700; }
  .file { margin-inline-start: auto; font-size: 8pt; color: #777; direction: ltr; }
  .sum { color: #444; margin: 2mm 0 0; }
  table { width: 100%; border-collapse: collapse; }
  th, td { border: 1px solid #bbb; padding: 1.5mm 2mm; vertical-align: top; text-align: start; }
  th { background: #f1f5f4; font-size: 9pt; }
  td.c { width: 30mm; font-size: 8.5pt; white-space: nowrap; }
  .ck { display: block; }
  td.n { width: 55mm; }
  tr { page-break-inside: avoid; }
  .d { color: #555; font-size: 9pt; }
  .il { color: #0a5c63; font-size: 8.5pt; }
  .missing { margin-top: 4mm; }
  .lines { height: 16mm; background: repeating-linear-gradient(#fff 0 7mm, #bbb 7mm 7.3mm); }
  .sign { display: flex; flex-wrap: wrap; gap: 2mm 6mm; margin-top: 4mm; padding: 3mm; background: #f1f5f4; border-radius: 2mm; font-weight: 700; }
  .nums td, .nums th { text-align: center; }
  .bar { text-align: center; padding: 10px; font-family: inherit; }
  .bar button { font: inherit; font-size: 14px; padding: 8px 20px; border: 0; border-radius: 8px; background: #0a5c63; color: #fff; cursor: pointer; }
  @media print { body { background: #fff; } .page { padding: 0; max-width: none; } .bar { display: none; } }
</style>
</head>
<body>
<div class="bar"><button onclick="window.print()">اطبع أو احفظ PDF</button></div>
<div class="page">
  <div class="cover">
    <h1>ملف المراجعة الطبية — موقع «اطمئن»</h1>
    <p>مرجع عربي مبسّط للإسعافات الأولية والطوارئ المنزلية، موجّه لغير المختصين (أمهات، آباء، معلمون). المحتوى أدناه <b>مسوّدة</b> ولن يُنشر قبل اعتمادك.</p>

    <div class="box">
      <b>بيانات المراجع</b>
      <div class="field"><span>الاسم:</span><span></span></div>
      <div class="field"><span>المسمى والتخصص:</span><span></span></div>
      <div class="field"><span>جهة العمل / رقم الترخيص المهني:</span><span></span></div>
      <div class="field"><span>هل توافق على ذكر اسمك بصفحة «من راجع المحتوى»؟</span><span>☐ نعم &nbsp; ☐ لا</span></div>
    </div>

    <div class="box">
      <b>المرجع الطبي المعتمد</b>
      <div class="field"><span>اسم المرجع وإصداره:</span><span></span></div>
      <div class="field"><span>الرابط:</span><span></span></div>
    </div>

    <b>طريقة المراجعة</b>
    <ol>
      <li>لكل بند: ضع علامة «صحيح» أو «يحتاج تعديل»، واكتب الصياغة المقترحة بخانة الملاحظات.</li>
      <li>راجع <b>ترتيب</b> الخطوات، وليس فقط صحتها.</li>
      <li>الجمهور غير مختص: المطلوب خطوات آمنة لشخص عادي، بجمل قصيرة وبدون مصطلحات.</li>
      <li>الموقع لا يصف أدوية ولا جرعات — نبّه على أي صياغة تُفهم كوصفة.</li>
      <li>الصياغة باللهجة الخليجية المبسّطة عمداً؛ التركيز على الدقة الطبية.</li>
      <li>بعض الخطوات لها رسومات توضيحية — تحتاج مراجعة أيضاً (تُرفق صورها منفصلة).</li>
    </ol>
    <p><b>عدد الحالات:</b> ${ar(cases.length)} — حرجة: ${ar(cases.filter((c) => c.urgency === 'critical').length)} · عالية: ${ar(cases.filter((c) => c.urgency === 'high').length)} · متوسطة ومنخفضة: ${ar(cases.filter((c) => ['medium', 'low'].includes(c.urgency)).length)}</p>
  </div>

  ${cases.map(caseHtml).join('')}

  <section class="case">
    <header><h2>ملحق: أرقام الطوارئ</h2></header>
    <p class="sum">يُتحقق من كل رقم من مصدر رسمي للدولة، ويُكتب المصدر.</p>
    <table class="nums">
      <thead><tr><th>الدولة</th><th>إسعاف</th><th>دفاع مدني</th><th>شرطة</th><th>مركز السموم</th><th>صحيح؟</th><th>المصدر الرسمي</th></tr></thead>
      <tbody>${countries.list.map((c) => `<tr><td>${esc(c.name)}</td><td>${c.ambulance}</td><td>${c.civil}</td><td>${c.police}</td><td>${c.poison ?? '—'}</td><td>☐</td><td></td></tr>`).join('')}</tbody>
    </table>
  </section>
</div>
</body>
</html>`;

mkdirSync('review', { recursive: true });
writeFileSync('review/medical-review-packet.html', html);
console.log(`✓ review/medical-review-packet.html — ${cases.length} حالة`);
