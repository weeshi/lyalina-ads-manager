# Lyalina Ads Manager

نظام إدارة الإعلانات والعملاء لشركة ليالينا - نسخة 6.4.0

## نظرة عامة

تطبيق React + Vite + Firebase لإدارة الإعلانات، العملاء، المسوقين، والباقات. يدعم المصادقة، قاعدة بيانات Firestore فورية، وتكامل مع Gemini AI.

## التقنيات المستخدمة

| التقنية | الإصدار | الاستخدام |
|----------|---------|-----------|
| React | 19.2.6 | واجهة المستخدم |
| Vite | 8.0.11 | أداة البناء والتطوير |
| Firebase | 12.13.0 | المصادقة + Firestore |
| Tailwind CSS | 4.3.0 | التصميم (Utility-first) |
| TypeScript | 6.0.3 | الكتابة القوية |
| Zustand | 5.0.13 | إدارة الحالة |
| Lucide React | 0.487.0 | الأيقونات |
| React Router | 7.15.0 | التوجيه |

## هيكل المشروع

```
src/
├── AdsManager.tsx          # الموزع الرئيسي
├── main.tsx                # نقطة الدخول
├── index.css               # Tailwind v4 الوحيد
├── firebase/
│   └── index.ts            # تهيئة Firebase
├── constants/
│   └── index.ts            # الثوابت (HEADERS, STATUS_OPTIONS, ...)
├── utils/
│   └── index.ts            # الدوال المساعدة
├── hooks/
│   ├── useAuth.ts          # إدارة المصادقة
│   ├── useData.ts          # اشتراكات Firestore
│   └── useFilters.ts       # بحث، فلترة، فرز
├── components/
│   ├── Auth/
│   │   └── AuthScreen.tsx
│   ├── Layout/
│   │   ├── Sidebar.tsx
│   │   ├── Topbar.tsx
│   │   └── AdvancedFiltersDrawer.tsx
│   ├── Modals/             # 10+ ملفات مودال مستقلة
│   └── Views/
│       ├── AnalyticsView.tsx
│       ├── CRMView.tsx
│       ├── CustomerDetailView.tsx
│       ├── MarketersView.tsx
│       ├── MarketerDetailView.tsx
│       ├── PackagesView.tsx
│       └── SettingsView.tsx
```

## الأوامر

```bash
# تثبيت الاعتماديات
pnpm install

# خادم التطوير (http://localhost:3000)
pnpm dev

# بناء الإنتاج
pnpm build

# معاينة البناء
pnpm preview
```

## متغيرات البيئة

يتم قراءة إعدادات Firebase من متغيرات `VITE_FIREBASE_*` عبر `import.meta.env`. انسخ `.env.example` إلى `.env` وعبّئ القيم.

| المتغير | الوصف |
|---------|--------|
| `VITE_FIREBASE_API_KEY` | مفتاح Firebase |
| `VITE_FIREBASE_AUTH_DOMAIN` | نطاق المصادقة |
| `VITE_FIREBASE_PROJECT_ID` | معرف المشروع |
| `VITE_FIREBASE_STORAGE_BUCKET` | حاوية التخزين |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | معرف المرسل |
| `VITE_FIREBASE_APP_ID` | معرف التطبيق |
| `VITE_FIREBASE_MEASUREMENT_ID` | معرف القياس |

## النشر على Firebase Hosting

```bash
# تسجيل الدخول (مرة واحدة)
npx firebase login

# بناء ونشر
pnpm deploy
```

أو يدوياً:

```bash
pnpm build
npx firebase deploy --only hosting
```

المشروع المربوط: `lyalina-ads`

## المسارات (Routes)

| المسار | العرض | الوصف |
|--------|-------|--------|
| `/` | CRMView | إدارة العملاء |
| `/marketers` | MarketersView | إدارة المسوقين |
| `/packages` | PackagesView | إدارة الباقات |
| `/analytics` | AnalyticsView | التحليلات والتقارير |
| `/settings` | SettingsView | الإعدادات |

## سير العمل للتطوير

1. شغل `pnpm dev` في `D:\ERP-Projects\lyalina-ads-manager`
2. تحقق من `pnpm build` قبل أي commit
3. Firebase Console: https://console.firebase.google.com/project/lyalina-ads
4. Gemini API: https://aistudio.google.com/app/apikey

## قواعد التطوير (من AGENTS.md)

1. **اللغة**: العربية فقط في التعليقات ورسائل المستخدمين
2. **TypeScript**: استخدام `// @ts-nocheck` في جميع الملفات
3. **التقسيم**: فصل UI عن منطق الأعمال
4. **المكونات**: مكون صغير واحد لكل ملف
5. **Firebase**: إعدادات مضمنة في الكود
6. **التصميم**: Tailwind utility classes فقط

## التحديثات والتطويرات

### v6.4.0 (الحالية)
- تحديث React إلى 19.2.6
- تحديث Vite إلى 8.0.11
- تحديث Firebase إلى 12.13.0
- إضافة Zustand لإدارة الحالة
- ترقية Tailwind إلى v4

### v8.0 (مخطط - حسب AGENTS.md)
- [ ] إعادة هيكلة كاملة للمكونات
- [ ] تحسين الأداء والـ Bundle size
- [ ] اختبارات شاملة
- [ ] توثيق API كامل

## المساهمة

1. اتبع قواعد AGENTS.md
2. شغل `pnpm build` وتأكد من نجاحه
3. لا ترفع مفاتيح API أو أسرار

## الترخيص

خاص - شركة ليالينا