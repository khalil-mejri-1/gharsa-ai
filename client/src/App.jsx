import React from 'react';
import { motion } from 'framer-motion';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';

import { AnimatePresence } from 'framer-motion';
import config from './config.js';

const decodeJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

const translations = {
  ar: {
    dir: 'rtl',
    font: 'Cairo, sans-serif',
    nav: {
      sensors: 'المستشعرات',
      community: 'المجتمع',
      ai: 'التشخيص الذكي',
      contact: 'اتصل بنا',
      login: 'تسجيل الدخول',
      signup: 'إنشاء حساب',
      download: 'تحميل التطبيق',
      logout: 'تسجيل الخروج'
    },
    hero: {
      title: 'مستقبل الزراعة',
      subtitle: 'بين يديك',
      desc: 'منصة شاملة مدعومة بالذكاء الاصطناعي لمراقبة محاصيلك، والتربة، والتواصل مع مجتمع من الخبراء لتحقيق أقصى إنتاجية.',
      btn_signup: 'إنشاء حساب',
      btn_ai_test: 'تجربة الذكاء الاصطناعي'
    },
    sensors: {
      title: 'متابعة دقيقة لكل تفصيلة',
      subtitle: 'دقة عالية لنمو مثالي',
      moisture: 'رطوبة',
      moisture_desc: 'مستويات مثالية.',
      temp: 'حرارة',
      temp_desc: 'ارتفاع طفيف متوقع.',
      ph: 'حموضة',
      ph_desc: 'تربة متوازنة تماماً.',
      light: 'إضاءة',
      light_desc: 'مستوى إضاءة عالي.',
      stable: 'تحليل مستقر',
      npk_ratio: 'نسبة النيتروجين والفوسفور والبوتاسيوم (NPK)',
      nitrogen: 'نيتروجين',
      phosphorus: 'فوسفور',
      potassium: 'بوتاسيوم'
    },
    how_it_works: {
      title: 'كيف يعمل التطبيق',
      subtitle: 'رحلتك نحو الزراعة الذكية',
      step1_title: 'تحميل التطبيق',
      step1_desc: 'قم بالتحميل والتثبيت',
      step2_title: 'ربط المستشعرات',
      step2_desc: 'قم بتوصيل أجهزتك',
      step3_title: 'مراقبة البيانات',
      step3_desc: 'راقب وحلل بذكاء',
      step4_title: 'تواصل مع الخبراء',
      step4_desc: 'شارك مع المجتمع'
    },
    community: {
      title: 'مجتمع المزارعين الأذكياء',
      subtitle: 'تواصل، تعلم، وتطور',
      desc: 'انضم إلى أكبر شبكة اجتماعية زراعية في المنطقة. شارك تجاربك، واطلب المشورة من الخبراء، وابقَ على اتصال مع زملائك المزارعين عبر رسائل مشفرة وآمنة تماماً.',
      feat1_title: 'ساحة النقاش العامة',
      feat1_desc: 'شارك منشورات، صور، وفيديوهات لمحاصيلك واحصل على تعليقات وإعجابات من المجتمع.',
      feat2_title: 'رسائل مشفرة آمنة',
      feat2_desc: 'تواصل بخصوصية تامة مع الخبراء والزملاء عبر نظام مراسلة محمي بأحدث تقنيات التشفير.',
      feat3_title: 'نصائح من خبراء موثقين',
      feat3_desc: 'احصل على إجابات لأسئلتك من قبل مهندسين زراعيين متخصصين في مختلف المحاصيل.'
    },
    ai: {
      title: 'كيف يعمل ذكاؤنا الاصطناعي',
      subtitle: 'حلول ذكية واستباقية',
      feat1_title: 'التعرف على الصور',
      feat1_desc: 'تحليل صور النباتات بدقة عالية لاكتشاف الأمراض والآفات في مراحلها المبكرة.',
      feat2_title: 'التشخيص والعلاج',
      feat2_desc: 'تشخيص فوري مع خطط علاج مخصصة وخطوات عملية لإنقاذ المحصول.',
      feat3_title: 'التعلم المستمر',
      feat3_desc: 'تزداد خوارزمياتنا ذكاءً مع كل عملية فحص لضمان أفضل التوصيات.'
    },
    testimonials: {
      title: 'ماذا يقول شركاؤنا؟',
      subtitle: 'قصص نجاح حقيقية بفضل Gharsa AI',
      t1_text: 'التطبيق غير طريقتي في متابعة التربة تماماً، ميزة الذكاء الاصطناعي مذهلة حقاً!',
      t1_name: 'أحمد المنصوري',
      t1_role: 'مزارع - تونس',
      t2_text: 'سهولة التواصل مع الخبراء وفرت علي الكثير من الجهد والمال في إدارة المحاصيل.',
      t2_name: 'خالد جاسم',
      t2_role: 'مزرعة نخيل - السعودية',
      t3_text: 'دقة البيانات وتحليلها ساعدتني في تحسين الإنتاج بنسبة 40% هذا الموسم.',
      t3_name: 'سارة علي',
      t3_role: 'مهندسة زراعية - مصر'
    },
    contact: {
      title: 'اتصل بنا',
      subtitle: 'نحن هنا للإجابة على استفساراتكم ودعمكم',
      name: 'الاسم الكامل',
      name_ph: 'أدخل اسمك هنا',
      email: 'البريد الإلكتروني',
      email_ph: 'example@mail.com',
      msg: 'الرسالة',
      msg_ph: 'كيف يمكننا مساعدتك؟',
      send: 'إرسال الرسالة',
      info1_title: 'البريد الإلكتروني',
      info1_desc: 'راسلنا في أي وقت وسنقوم بالرد خلال 24 ساعة.',
      info2_title: 'الهاتف',
      info2_desc: 'متوفرون من الإثنين إلى الجمعة، 9 صباحاً - 5 مساءً.',
      info3_title: 'المقر الرئيسي',
      info3_desc: 'زورونا في مكتبنا لمناقشة شراكاتكم الزراعية.'
    },
    footer: {
      privacy: 'سياسة الخصوصية',
      terms: 'شروط الخدمة',
      support: 'الدعم الفني',
      rights: '© 2026 Gharsa AI. جميع الحقوق محفوظة.'
    },
    auth: {
      return: 'العودة للملف الرئيسي',
      register_title: 'ابدأ رحلتك في',
      register_span: 'الزراعة الذكية',
      register_desc: 'انضم إلى آلاف المزارعين الذين يستخدمون الذكاء الاصطناعي لتحسين محاصيلهم وحماية كوكبنا.',
      trusted: 'مجتمع موثوق',
      experts: 'أكثر من 500 خبير زراعي',
      create_acc: 'إنشاء حساب جديد',
      create_desc: 'أدخل بياناتك للبدء في استخدام Gharsa AI',
      farmer: 'مزارع',
      expert: 'خبير زراعي',
      soon: 'قريباً',
      pic: 'صورة الملف الشخصي (اختياري)',
      first_name: 'الاسم',
      last_name: 'اللقب',
      password: 'كلمة المرور',
      agree: 'أوافق على شروط الخدمة وسياسة الخصوصية',
      btn_register: 'إنشاء الحساب',
      loading: 'جاري التحميل...',
      or: 'أو عبر',
      have_acc: 'لديك حساب بالفعل؟',
      welcome: 'مرحباً بعودتك إلى',
      welcome_span: 'Gharsa AI',
      welcome_desc: 'سجل دخولك لمتابعة محاصيلك والتواصل مع مجتمع المزارعين المبدعين.',
      alerts: '35 تنبيه جديد في منطقتك',
      update: 'آخر تحديث: منذ دقيقتين',
      login_title: 'تسجيل الدخول',
      login_desc: 'أدخل بياناتك للوصول إلى حسابك',
      forgot: 'نسيت كلمة المرور؟',
      btn_login: 'دخول',
      no_acc: 'ليس لديك حساب؟',
      success_reg: 'تم إنشاء الحساب بنجاح!',
      error_reg: 'حدث خطأ أثناء التسجيل',
      success_log: 'تم تسجيل الدخول بنجاح عبر Google!',
      err_num: 'لا يسمح بالأرقام في هذا الحقل',
      err_email: 'بريد إلكتروني غير صالح',
      default_user: 'مستخدم',
      default_google_user: 'مستخدم Google'
    },
    mockups: {
      general: 'عام',
      farmer_likes: 'إعجابات',
      comments: 'تعليقات',
      like: 'إعجاب',
      comment: 'تعليق',
      messages: 'الرسائل',
      search: 'بحث...',
      requests: 'طلبات',
      ai_diag: 'تشخيص النبات بالذكاء الاصطناعي',
      ai_diag_desc: 'وجه الكاميرا نحو النبتة للتعرف على الآفات، الأمراض، أو نقص التغذية فوراً.',
      start_scan: 'بدء الفحص',
      post1_role: 'مزارع',
      post1_text: 'الحمد لله، بدأت جودة التربة في التحسن بعد اتباع توصيات التطبيق...',
      post2_role: 'خبير',
      post2_text: 'نصيحة اليوم: تأكد من ضبط مستويات الـ pH قبل التسميد القادم.',
      post3_role: 'مهندسة زراعية',
      post3_text: 'رصدنا انتشار طفيف لآفة في منطقة الدلتا، يرجى الحذر.'
    }
  },
  en: {
    dir: 'ltr',
    font: 'Inter, sans-serif',
    nav: {
      sensors: 'Sensors',
      community: 'Community',
      ai: 'AI Scan',
      contact: 'Contact',
      login: 'Login',
      signup: 'Sign Up',
      download: 'Download App',
      logout: 'Logout'
    },
    hero: {
      title: 'Future of Farming',
      subtitle: 'In Your Hands',
      desc: 'A comprehensive AI-powered platform to monitor your crops, soil, and connect with a community of experts for maximum productivity.',
      btn_signup: 'Create Account',
      btn_ai_test: 'AI Diagnosis'
    },
    sensors: {
      title: 'Precise Monitoring',
      subtitle: 'High precision for optimal growth',
      moisture: 'Moisture',
      moisture_desc: 'Optimal levels.',
      temp: 'Temperature',
      temp_desc: 'Slight increase expected.',
      ph: 'pH Level',
      ph_desc: 'Perfectly balanced.',
      light: 'Illuminance',
      light_desc: 'High exposure.',
      stable: 'Stable Analysis',
      npk_ratio: 'NPK Ratio (Nitrogen, Phosphorus, Potassium)',
      nitrogen: 'Nitrogen',
      phosphorus: 'Phosphorus',
      potassium: 'Potassium'
    },
    how_it_works: {
      title: 'How It Works',
      subtitle: 'Your Journey to Smart Farming',
      step1_title: 'Download App',
      step1_desc: 'Download & Install',
      step2_title: 'Connect Sensors',
      step2_desc: 'Link your devices',
      step3_title: 'Monitor Data',
      step3_desc: 'Analyze smartly',
      step4_title: 'Engage Experts',
      step4_desc: 'Join the community'
    },
    community: {
      title: 'Smart Farmers Community',
      subtitle: 'Connect, Learn, Evolve',
      desc: 'Join the largest agricultural network. Share experiences, seek expert advice, and stay connected via fully encrypted secure messages.',
      feat1_title: 'Public Forum',
      feat1_desc: 'Share posts, photos, and videos of your crops to get feedback and likes from the community.',
      feat2_title: 'Secure Messaging',
      feat2_desc: 'Communicate privately with experts and peers via encrypted messaging.',
      feat3_title: 'Verified Experts Advice',
      feat3_desc: 'Get answers to your questions directly from specialized agronomists.'
    },
    ai: {
      title: 'How Our AI Works',
      subtitle: 'Proactive & Smart Solutions',
      feat1_title: 'Image Recognition',
      feat1_desc: 'High-accuracy plant image analysis to detect pests and diseases early.',
      feat2_title: 'Diagnosis & Treatment',
      feat2_desc: 'Instant diagnosis with customized treatment plans and actionable steps.',
      feat3_title: 'Continuous Learning',
      feat3_desc: 'Our algorithms get smarter with every scan to ensure the best recommendations.'
    },
    testimonials: {
      title: 'What Our Partners Say',
      subtitle: 'Real success stories powered by Gharsa AI',
      t1_text: 'The app completely changed how I monitor my soil. The AI is truly amazing!',
      t1_name: 'Ahmed Mansouri',
      t1_role: 'Farmer - Tunisia',
      t2_text: 'Easy expert access saved me a lot of effort and money in crop management.',
      t2_name: 'Khaled Jassim',
      t2_role: 'Palm Farm - Saudi Arabia',
      t3_text: 'Precise data analysis helped me boost production by 40% this season.',
      t3_name: 'Sarah Ali',
      t3_role: 'Agronomist - Egypt'
    },
    contact: {
      title: 'Contact Us',
      subtitle: 'We are here to answer and support you',
      name: 'Full Name',
      name_ph: 'Enter your name',
      email: 'Email Address',
      email_ph: 'example@mail.com',
      msg: 'Message',
      msg_ph: 'How can we help?',
      send: 'Send Message',
      info1_title: 'Email',
      info1_desc: 'Reach us anytime, we reply within 24h.',
      info2_title: 'Phone',
      info2_desc: 'Available Mon-Fri, 9am - 5pm.',
      info3_title: 'Headquarters',
      info3_desc: 'Visit our office for agricultural partnerships.'
    },
    footer: {
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      support: 'Tech Support',
      rights: '© 2026 Gharsa AI. All Rights Reserved.'
    },
    auth: {
      return: 'Back to Home',
      register_title: 'Start your journey in',
      register_span: 'Smart Farming',
      register_desc: 'Join thousands of farmers using AI to improve crops and protect our planet.',
      trusted: 'Trusted Community',
      experts: 'Over 500 Agronomists',
      create_acc: 'Create New Account',
      create_desc: 'Enter your details to start using Gharsa AI',
      farmer: 'Farmer',
      expert: 'Expert',
      soon: 'Soon',
      pic: 'Profile Picture (Optional)',
      first_name: 'First Name',
      last_name: 'Last Name',
      password: 'Password',
      agree: 'I agree to Terms of Service & Privacy Policy',
      btn_register: 'Create Account',
      loading: 'Loading...',
      or: 'OR VIA',
      have_acc: 'Already have an account?',
      welcome: 'Welcome back to',
      welcome_span: 'Gharsa AI',
      welcome_desc: 'Login to track your crops and connect with the farming community.',
      alerts: '35 New Alerts in your area',
      update: 'Last update: 2 minutes ago',
      login_title: 'Login',
      login_desc: 'Enter details to access your account',
      forgot: 'Forgot password?',
      btn_login: 'Login',
      no_acc: 'Don\'t have an account?',
      success_reg: 'Account created successfully!',
      error_reg: 'Error during registration',
      success_log: 'Logged in via Google successfully!',
      err_num: 'Numbers are not allowed here',
      err_email: 'Invalid Email address',
      default_user: 'User',
      default_google_user: 'Google User'
    },
    mockups: {
      general: 'GENERAL',
      farmer_likes: 'Farmer Likes',
      comments: 'Comments',
      like: 'Like',
      comment: 'Comment',
      messages: 'Messages',
      search: 'Search...',
      requests: 'Requests',
      ai_diag: 'AI Plant Diagnosis',
      ai_diag_desc: 'Point your camera at the plant to identify pests, diseases, or nutrient deficiencies instantly.',
      start_scan: 'Start Scanning',
      post1_role: 'Farmer',
      post1_text: 'Thank God, soil quality started to improve after following the app recommendations...',
      post2_role: 'Expert',
      post2_text: 'Tip of the day: Make sure to adjust pH levels before the next fertilization.',
      post3_role: 'Agronomist',
      post3_text: 'We detected a slight spread of pests in the Delta region, please be careful.'
    }
  }
};

const LanguageContext = React.createContext();

const useTranslation = () => {
  const context = React.useContext(LanguageContext);
  return context;
};

const Toast = ({ message, type, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border ${type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-100' : 'bg-primary/10 border-primary/20 text-white'
        }`}
    >
      <span className={`material-symbols-outlined text-2xl ${type === 'error' ? 'text-red-400' : 'text-primary'}`}>
        {type === 'error' ? 'error' : 'check_circle'}
      </span>
      <span className="font-bold text-sm whitespace-nowrap">{message}</span>
      <button onClick={onClose} className="ml-4 opacity-50 hover:opacity-100 transition-opacity flex items-center">
        <span className="material-symbols-outlined text-sm">close</span>
      </button>
    </motion.div>
  );
};

const App = () => {
  const [user, setUser] = React.useState(() => {
    const savedUser = localStorage.getItem('gharsa_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [toast, setToast] = React.useState({ message: '', type: '', visible: false });
  const [lang, setLang] = React.useState(() => localStorage.getItem('gharsa_lang') || 'ar');

  React.useEffect(() => {
    localStorage.setItem('gharsa_lang', lang);
    document.documentElement.dir = translations[lang].dir;
    document.documentElement.lang = lang;
  }, [lang]);

  React.useEffect(() => {
    if (user) {
      localStorage.setItem('gharsa_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('gharsa_user');
    }
  }, [user]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 4000);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      <BrowserRouter>
        <AnimatePresence>
          {toast.visible && <Toast message={toast.message} type={toast.type} onClose={() => setToast(prev => ({ ...prev, visible: false }))} />}
        </AnimatePresence>
        <Routes>
          <Route path="/" element={<LandingPage user={user} setUser={setUser} />} />
          <Route path="/register" element={<SignUpPage setUser={setUser} showToast={showToast} />} />
          <Route path="/login" element={<LoginPage setUser={setUser} showToast={showToast} />} />
          <Route path="/ai-diagnosis" element={<AIDiagnosisPage />} />
        </Routes>
      </BrowserRouter>
    </LanguageContext.Provider>
  );
};

const Navbar = ({ isSimple = false, user = null, setUser = null }) => {
  const location = useLocation();
  const { lang, setLang, t } = useTranslation();
  const [theme, setTheme] = React.useState(() => localStorage.getItem('gharsa_theme') || 'dark');
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  React.useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
    localStorage.setItem('gharsa_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const navLinks = [
    { name: t.nav.sensors, href: '/#sensors' },
    { name: t.nav.community, href: '/#community' },
    { name: t.nav.ai, href: '/#ai-scan' },
    { name: t.nav.contact, href: '/#contact' }
  ];

  const isRegisterPage = location.pathname === '/register';
  const isLoginPage = location.pathname === '/login';

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center gap-2">
        <Link to="/" className="text-xl sm:text-2xl font-space font-bold tracking-tighter text-white hover:opacity-80 transition-opacity cursor-pointer flex items-center gap-2 sm:gap-3 shrink-0">
          <img src="https://i.ibb.co/vCVSnc8k/Untitled-design-7-removebg-preview.png" alt="Gharsa AI Logo" className="h-8 w-auto object-contain" />
          <span>Gharsa <span className="text-primary">AI</span></span>
        </Link>

        {!isSimple && (
          <div className="hidden min-[1167px]:flex gap-8 items-center">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-white/70 hover:text-primary transition-all duration-300 font-medium"
              >
                {link.name}
              </a>
            ))}
          </div>
        )}

        {/* Right side actions */}
        <div className="flex gap-2 sm:gap-4 items-center shrink-0">
          {user ? (
            <div className="hidden min-[426px]:flex items-center gap-3">
              <span className="text-white font-bold text-sm hidden sm:block">{user.firstName || user.name || t.auth.default_user}</span>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/20 overflow-hidden flex items-center justify-center bg-primary/10">
                {user.profilePicture ? (
                  <img src={user.profilePicture.startsWith('http') ? user.profilePicture : `${config.API_URL}${user.profilePicture}`} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-primary">person</span>
                )}
              </div>
            </div>
          ) : (
            <>
              {!isRegisterPage && !isLoginPage && (
                <Link
                  to="/register"
                  className="text-white border border-white/20 px-4 sm:px-6 py-2 rounded-full font-bold hover:bg-white/10 transition-all text-xs sm:text-sm whitespace-nowrap"
                >
                  {t.nav.signup}
                </Link>
              )}
              {isRegisterPage && (
                <Link
                  to="/login"
                  className="text-primary font-bold text-sm hover:underline"
                >
                  {t.nav.login}
                </Link>
              )}
              {!isRegisterPage && !isLoginPage && (
                <Link
                  to="/login"
                  className="text-white/70 hover:text-primary font-medium text-sm transition-colors"
                >
                  {t.nav.login}
                </Link>
              )}
            </>
          )}

          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-1 sm:gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/30 backdrop-blur-md px-3 sm:px-4 h-9 sm:h-10 rounded-full text-[10px] sm:text-xs font-bold text-white transition-all duration-300 group"
            title={lang === 'ar' ? 'Switch to English' : 'التبديل للعربية'}
          >
            <span className="material-symbols-outlined text-base sm:text-lg text-primary group-hover:rotate-180 transition-transform duration-500">
              language
            </span>
            <span className="tracking-wider hidden sm:block">
              {lang === 'ar' ? 'English' : 'العربية'}
            </span>
            <span className="tracking-wider sm:hidden">
              {lang === 'ar' ? 'EN' : 'AR'}
            </span>
          </button>

          <button className="hidden lg:flex bg-primary text-black px-6 py-2 rounded-full font-bold active:scale-95 transition-all neon-glow text-sm items-center gap-2">
            <span>{t.nav.download}</span>
            <span className="material-symbols-outlined text-sm">download</span>
          </button>

          {user && (
            <button
              onClick={() => setUser(null)}
              className="hidden min-[426px]:flex text-white/40 hover:text-red-400 transition-colors bg-white/5 border border-white/10 w-9 h-9 sm:w-10 sm:h-10 rounded-full items-center justify-center group"
              title={t.nav.logout}
            >
              <span className="material-symbols-outlined text-lg sm:text-xl group-hover:scale-110 transition-transform">logout</span>
            </button>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="text-white/60 hover:text-primary transition-colors bg-white/5 border border-white/10 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center group"
            title={theme === 'dark' ? 'الوضع المضيء' : 'الوضع المظلم'}
          >
            <span className="material-symbols-outlined text-lg sm:text-xl group-hover:rotate-12 transition-transform">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          {/* Mobile Menu Toggle */}
          {!isSimple && (
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="min-[1167px]:hidden text-white/60 hover:text-primary transition-colors bg-white/5 border border-white/10 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center group"
            >
              <span className="material-symbols-outlined text-lg sm:text-xl group-active:scale-95 transition-transform">
                {isMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile/Tablet Menu */}
      <AnimatePresence>
        {!isSimple && isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 w-full bg-surface border-b border-white/10 shadow-2xl overflow-hidden min-[1167px]:hidden"
          >
            <div className="flex flex-col py-4 px-6 space-y-2 max-w-7xl mx-auto">

              {/* User Profile for Mobile (<= 425px) */}
              {user && (
                <div className="flex min-[426px]:hidden items-center justify-between border-b border-white/10 pb-4 mb-2">
                  <div className={`flex items-center gap-3 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/20 overflow-hidden flex items-center justify-center bg-primary/10">
                      {user.profilePicture ? (
                        <img src={user.profilePicture.startsWith('http') ? user.profilePicture : `${config.API_URL}${user.profilePicture}`} alt="User" className="w-full h-full object-cover" />
                      ) : (
                        <span className="material-symbols-outlined text-primary">person</span>
                      )}
                    </div>
                    <span className="text-white font-bold text-sm">{user.firstName || user.name || t.auth.default_user}</span>
                  </div>
                  <button
                    onClick={() => {
                      setUser(null);
                      setIsMenuOpen(false);
                    }}
                    className="text-red-400/80 hover:text-red-400 transition-colors bg-white/5 border border-white/10 p-2 rounded-full flex items-center justify-center"
                    title={t.nav.logout}
                  >
                    <span className="material-symbols-outlined text-xl">logout</span>
                  </button>
                </div>
              )}

              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-white/80 hover:text-primary font-bold text-lg py-3 border-b border-white/5 last:border-0 ${lang === 'ar' ? 'text-right' : 'text-left'}`}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const LandingPage = ({ user, setUser }) => {
  const navigate = useNavigate();
  const { lang, t } = useTranslation();

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const stagger = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true },
    transition: { staggerChildren: 0.2 }
  };


  return (
    <div className="min-h-screen bg-background text-on-background selection:bg-primary/30 selection:text-primary" style={{ fontFamily: t.font }}>
      <Navbar user={user} setUser={setUser} />

      <main>
        {/* Hero Section */}
        <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAipgZh7fQCo3131CBkQ8DvxJdURA0bWBGpYQ3k7vAb3WNyN9JYEbKJQS5SqfDjiIf-IGIOKsSM3MvYGcXv50lrzjuqR_TmVaEaXgZKMUuXfRbsJcoOoDDGw1apZDpC-Hzyocv_73P-pXQZaYhHamPJ-Kw1-G2uH6mx0qZIkhKU3-YIsSuIlz5U09sVYgOevH8xyFowG29jF4eWuKvkLRmAjU1m1SuU-U0Gul2XcuuVHIMe0R0cSUAMOWzU8EBjr4trTTt9yvz5wQ"
              alt="Futuristic Farm"
              className="w-full h-full object-cover opacity-40 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          </div>

          <div className="max-w-7xl mx-auto w-full px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 pb-24 pt-10 lg:pb-0 lg:pt-0">
            <motion.div
              initial={{ opacity: 0, x: lang === 'ar' ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className={`space-y-6 md:space-y-8 ${lang === 'ar' ? 'text-right' : 'text-left'}`}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-space font-bold leading-tight text-white">
                {t.hero.title} <br />
                <span className="text-primary drop-shadow-[0_0_15px_rgba(0,230,64,0.3)]">{t.hero.subtitle}</span>
              </h1>
              <p className={`text-lg md:text-xl text-on-surface-variant max-w-xl leading-relaxed ${lang === 'ar' ? 'ml-auto' : 'mr-auto'}`}>
                {t.hero.desc}
              </p>
              <div className="flex flex-wrap gap-4 pt-4" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                <button className="bg-primary text-black px-8 py-3 rounded-full font-bold active:scale-95 transition-all neon-glow flex items-center gap-2">
                  <span>{t.nav.download}</span>
                  <span className="material-symbols-outlined">download</span>
                </button>
                <Link
                  to="/ai-diagnosis"
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-8 py-3 rounded-full font-bold active:scale-95 transition-all flex items-center gap-2"
                >
                  <span>{t.hero.btn_ai_test}</span>
                  <span className="material-symbols-outlined text-primary">psychology</span>
                </Link>
                {!user && (
                  <Link
                    to="/register"
                    className="border border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-md px-8 py-3 rounded-full font-bold text-white transition-all flex items-center justify-center"
                  >
                    {t.hero.btn_signup}
                  </Link>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative h-[400px] md:h-[500px] lg:h-[650px] flex items-center justify-center mt-12 lg:mt-0"
            >
              {/* Decorative Tech Rings */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[500px] h-[500px] border border-primary/20 rounded-full animate-pulse" />
                <div className="absolute w-[600px] h-[600px] border border-primary/10 rounded-full animate-spin-slow" />
              </div>

              {/* Floating Container */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative flex items-center justify-center max-[400px]:scale-[0.55] scale-[0.65] md:scale-90 lg:scale-100"
              >
                {/* Phone 1 (Left) */}
                <motion.div
                  animate={{ y: [0, -15, 0], rotate: [-8, -6, -8] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="w-72 h-[580px] rounded-[3rem] border-8 border-white/90 bg-surface overflow-hidden relative shadow-[0_0_50px_rgba(0,230,64,0.1)] z-20 transition-all hover:scale-105 duration-700 translate-x-[-40px]"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none z-10" />
                  <img
                    src="https://i.ibb.co/hJDWXTrd/Screenshot-2026-04-24-232020.png"
                    alt="App Mockup 1"
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                {/* Phone 2 (Right) */}
                <motion.div
                  animate={{ y: [0, 15, 0], rotate: [8, 10, 8] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="w-72 h-[580px] rounded-[3rem] border-8 border-white/90 bg-surface overflow-hidden relative shadow-[0_0_50px_rgba(0,230,64,0.1)] z-10 transition-all hover:scale-105 duration-700 translate-x-[40px]"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none z-10" />
                  <img
                    src="https://i.ibb.co/67bYRDZk/Screenshot-2026-04-24-232139.png"
                    alt="App Mockup 2"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </motion.div>

              {/* Enhanced Glow */}
              <div className="absolute inset-0 bg-primary/5 blur-[150px] rounded-full z-0" />
            </motion.div>
          </div>
        </section>

        {/* Sensors Section */}
        <section id="sensors" className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div {...fadeIn} className="text-center mb-16 space-y-4">
              <h2 className="text-4xl font-space font-bold text-white">{t.sensors.title}</h2>
              <p className="text-on-surface-variant text-lg">{t.sensors.subtitle}</p>
            </motion.div>

            <motion.div
              variants={stagger}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <StatCard icon="water_drop" label={t.sensors.moisture} value="68%" color="text-primary" desc={t.sensors.moisture_desc} />
              <StatCard icon="thermostat" label={t.sensors.temp} value="24°C" color="text-red-400" desc={t.sensors.temp_desc} />
              <StatCard icon="science" label={t.sensors.ph} value="6.5" color="text-white" desc={t.sensors.ph_desc} />
              <StatCard icon="light_mode" label={t.sensors.light} value="42k lx" color="text-yellow-custom" desc={t.sensors.light_desc} />
              <div className="glass-card rounded-3xl p-8 lg:col-span-2 flex flex-col justify-between border-primary/20 bg-primary/5">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    <span className="material-symbols-outlined text-primary text-2xl sm:text-3xl">eco</span>
                  </div>
                  <span className="px-3 sm:px-4 py-1 rounded-full bg-primary/20 text-primary text-[10px] sm:text-xs font-bold border border-primary/30">{t.sensors.stable}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-6">{t.sensors.npk_ratio}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
                  <NPKItem label={t.sensors.nitrogen} value="120" unit="mg/kg" />
                  <NPKItem label={t.sensors.phosphorus} value="45" unit="mg/kg" />
                  <NPKItem label={t.sensors.potassium} value="180" unit="mg/kg" />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* How it Works */}
        <section className="py-32 px-6 bg-surface/50 border-y border-white/5">
          <div className="max-w-7xl mx-auto">
            <motion.div {...fadeIn} className="text-center mb-20 space-y-4">
              <h2 className="text-4xl font-bold text-white">{t.how_it_works.title}</h2>
              <p className="text-on-surface-variant text-lg">{t.how_it_works.subtitle}</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative">
              <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
              <Step icon="download" number="1" title={t.how_it_works.step1_title} desc={t.how_it_works.step1_desc} />
              <Step icon="sensors" number="2" title={t.how_it_works.step2_title} desc={t.how_it_works.step2_desc} />
              <Step icon="analytics" number="3" title={t.how_it_works.step3_title} desc={t.how_it_works.step3_desc} />
              <Step icon="groups" number="4" title={t.how_it_works.step4_title} desc={t.how_it_works.step4_desc} />
            </div>
          </div>
        </section>

        {/* Community Section */}
        <section id="community" className="py-32 px-6 overflow-hidden">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8 text-right order-2 lg:order-1"
            >
              <h2 className="text-4xl md:text-5xl font-space font-bold text-white">
                {t.community.title} <br />
                <span className="text-primary">{t.community.subtitle}</span>
              </h2>
              <p className="text-xl text-on-surface-variant leading-relaxed">
                {t.community.desc}
              </p>

              <div className="space-y-6">
                <CommunityFeature
                  icon="forum"
                  title={t.community.feat1_title}
                  desc={t.community.feat1_desc}
                />
                <CommunityFeature
                  icon="lock"
                  title={t.community.feat2_title}
                  desc={t.community.feat2_desc}
                />
                <CommunityFeature
                  icon="verified"
                  title={t.community.feat3_title}
                  desc={t.community.feat3_desc}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative order-1 lg:order-2 flex flex-col sm:flex-row justify-center items-center gap-6 lg:gap-8 min-h-[700px]"
            >
              {/* Mock Community Feed */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-full max-w-[320px] h-[500px] sm:h-[550px] glass-card rounded-[2.5rem] sm:rounded-[3rem] p-4 sm:p-6 border-white/20 shadow-[0_30px_60px_rgba(0,0,0,0.4)] overflow-hidden group hover:scale-105 transition-transform duration-500 sm:mt-24 z-20"
              >
                <div className="flex justify-between items-center mb-6">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                  </div>
                  <span className="text-[10px] text-white/40 font-mono tracking-widest uppercase">Community_Hub</span>
                </div>

                <div className="space-y-6 opacity-90 group-hover:opacity-100 transition-opacity overflow-y-auto h-[400px] scrollbar-hide pr-2">
                  <MockPost name="Khalil" role={t.mockups.post1_role} text={t.mockups.post1_text} />
                  <MockPost name="Aziz" role={t.mockups.post2_role} text={t.mockups.post2_text} />
                  <MockPost name="Sarah" role={t.mockups.post3_role} text={t.mockups.post3_text} />
                </div>

                {/* Glowing Navigation Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-surface/95 backdrop-blur-xl border-t border-white/10 flex justify-around items-center px-2 pb-1 z-30 shadow-[0_-10px_30px_rgba(0,0,0,0.2)]">
                  <NavItem icon="home" label="HOME" />
                  <NavItem icon="chat" label="COMMUNITY" active />
                  <NavItem icon="forum" label="MESSAGES" />
                  <NavItem icon="psychology" label="AI SCAN" />
                  <NavItem icon="light_mode" label="THEME" />
                </div>
              </motion.div>

              {/* Full Messages Mock */}
              <motion.div
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="flex sm:block hover:scale-105 transition-transform duration-500 sm:mb-24 z-10 scale-[0.85] sm:scale-100"
              >
                <MessagesMock />
              </motion.div>
            </motion.div>

          </div>
        </section>

        {/* AI Features */}
        <section id="ai-scan" className="py-32 px-6 bg-surface/30">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20 space-y-4"
            >
              <h2 className="text-4xl md:text-5xl font-space font-bold text-white">{t.ai.title}</h2>
              <p className="text-on-surface-variant text-lg">{t.ai.subtitle}</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left: Visual Scanner Mock */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="flex justify-center lg:justify-start"
              >
                <ScannerMock />
              </motion.div>

              {/* Right: Feature Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <FeatureCard
                    icon="image_search"
                    title={t.ai.feat1_title}
                    desc={t.ai.feat1_desc}
                  />
                </div>
                <FeatureCard
                  icon="healing"
                  title={t.ai.feat2_title}
                  desc={t.ai.feat2_desc}
                />
                <FeatureCard
                  icon="model_training"
                  title={t.ai.feat3_title}
                  desc={t.ai.feat3_desc}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-32 px-6 bg-gradient-to-b from-transparent to-primary/5">
          <div className="max-w-7xl mx-auto">
            <motion.div {...fadeIn} className="text-center mb-16 space-y-4">
              <h2 className="text-4xl font-bold text-white">{t.testimonials.title}</h2>
              <p className="text-on-surface-variant text-lg">{t.testimonials.subtitle}</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Testimonial
                text={t.testimonials.t1_text}
                name={t.testimonials.t1_name}
                role={t.testimonials.t1_role}
                avatar="/avatar-1.png"
              />
              <Testimonial
                text={t.testimonials.t2_text}
                name={t.testimonials.t2_name}
                role={t.testimonials.t2_role}
                avatar="https://i.pravatar.cc/150?u=khaled"
              />
              <Testimonial
                text={t.testimonials.t3_text}
                name={t.testimonials.t3_name}
                role={t.testimonials.t3_role}
                avatar="https://i.pravatar.cc/150?u=sara"
              />
            </div>
          </div>
        </section>
        {/* Contact Us Section */}
        <section id="contact" className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16 space-y-4"
            >
              <h2 className="text-4xl md:text-5xl font-space font-bold text-white">{t.contact.title}</h2>
              <p className="text-on-surface-variant text-lg">{t.contact.subtitle}</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: lang === 'ar' ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="glass-card rounded-[2.5rem] p-10 border-white/10"
              >
                <form className={`space-y-6 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                  <div className="space-y-2">
                    <label className={`text-sm font-bold text-white/60 ${lang === 'ar' ? 'mr-4' : 'ml-4'}`}>{t.contact.name}</label>
                    <input
                      type="text"
                      placeholder={t.contact.name_ph}
                      className={`w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-primary/50 transition-colors ${lang === 'ar' ? 'text-right' : 'text-left'}`}
                      dir={lang === 'ar' ? 'rtl' : 'ltr'}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={`text-sm font-bold text-white/60 ${lang === 'ar' ? 'mr-4' : 'ml-4'}`}>{t.contact.email}</label>
                    <input
                      type="email"
                      placeholder={t.contact.email_ph}
                      className={`w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-primary/50 transition-colors ${lang === 'ar' ? 'text-right' : 'text-left'}`}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={`text-sm font-bold text-white/60 ${lang === 'ar' ? 'mr-4' : 'ml-4'}`}>{t.contact.msg}</label>
                    <textarea
                      rows="4"
                      placeholder={t.contact.msg_ph}
                      className={`w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-primary/50 transition-colors ${lang === 'ar' ? 'text-right' : 'text-left'}`}
                      dir={lang === 'ar' ? 'rtl' : 'ltr'}
                    ></textarea>
                  </div>
                  <button className="btn-primary w-full justify-center py-5">
                    <span>{t.contact.send}</span>
                    <span className="material-symbols-outlined">send</span>
                  </button>
                </form>
              </motion.div>

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: lang === 'ar' ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <ContactInfoCard
                  icon="mail"
                  title={t.contact.info1_title}
                  value="support@gharsa.ai"
                  desc={t.contact.info1_desc}
                />
                <ContactInfoCard
                  icon="call"
                  title={t.contact.info2_title}
                  value="+216 71 000 000"
                  desc={t.contact.info2_desc}
                />
                <ContactInfoCard
                  icon="location_on"
                  title={t.contact.info3_title}
                  value="Tunis, Tunisia"
                  desc={t.contact.info3_desc}
                />

              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-background py-16 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-2xl font-space font-bold text-white">
            Gharsa <span className="text-primary">AI</span>
          </div>
          <div className="flex gap-8 text-white/50 text-sm">
            <a href="#" className="hover:text-primary transition-colors">{t.footer.privacy}</a>
            <a href="#" className="hover:text-primary transition-colors">{t.footer.terms}</a>
            <a href="#" className="hover:text-primary transition-colors">{t.footer.support}</a>
          </div>
          <div className="text-white/30 text-sm">
            {t.footer.rights}
          </div>
        </div>
      </footer>

    </div>
  );
};

const StatCard = ({ icon, label, value, color, desc }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="glass-card rounded-3xl p-8 space-y-6 group transition-all duration-300 hover:bg-white/5"
  >
    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary/50 transition-colors">
      <span className={`material-symbols-outlined text-3xl ${color}`}>{icon}</span>
    </div>
    <div>
      <h3 className="text-xl font-bold text-white/60 mb-2">{label}</h3>
      <div className={`text-5xl font-space font-bold ${color}`}>{value}</div>
    </div>
    <p className="text-on-surface-variant text-sm">{desc}</p>
  </motion.div>
);

const NPKItem = ({ label, value, unit }) => (
  <div className="space-y-1">
    <div className="text-sm text-on-surface-variant">{label}</div>
    <div className="text-3xl font-space font-bold text-white">
      {value} <span className="text-sm font-normal text-on-surface-variant">{unit}</span>
    </div>
  </div>
);

const Step = ({ icon, number, title, desc }) => (
  <motion.div
    whileHover={{ y: -10 }}
    className="flex flex-col items-center text-center gap-6 relative z-10"
  >
    <div className="w-24 h-24 rounded-full glass-card flex items-center justify-center border-primary/30 neon-shadow relative bg-surface group-hover:scale-110 transition-transform">
      <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-on-primary font-bold flex items-center justify-center text-sm shadow-lg">{number}</span>
      <span className="material-symbols-outlined text-5xl text-primary">{icon}</span>
    </div>
    <div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-on-surface-variant text-sm">{desc}</p>
    </div>
  </motion.div>
);

const FeatureCard = ({ icon, title, desc }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="glass-card rounded-3xl p-10 flex flex-col items-center text-center gap-6 hover:bg-white/5 transition-all duration-300"
  >
    <div className="w-20 h-20 rounded-[2rem] bg-primary/10 flex items-center justify-center border border-primary/20">
      <span className="material-symbols-outlined text-5xl text-primary">{icon}</span>
    </div>
    <h3 className="text-2xl font-space font-bold text-white">{title}</h3>
    <p className="text-on-surface-variant leading-relaxed">{desc}</p>
  </motion.div>
);

const Testimonial = ({ text, name, role, avatar }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="glass-card rounded-3xl p-8 flex flex-col gap-6 hover:neon-shadow transition-all duration-300"
  >
    <div className="flex gap-1 text-primary">
      {[1, 2, 3, 4, 5].map(s => <span key={s} className="material-symbols-outlined">star</span>)}
    </div>
    <p className="text-lg text-white leading-relaxed">"{text}"</p>
    <div className="flex items-center gap-4 mt-auto pt-6 border-t border-white/5">
      <div className="w-14 h-14 rounded-full border-2 border-primary/30 overflow-hidden bg-surface">
        <img src={avatar} alt={name} className="w-full h-full object-cover" />
      </div>
      <div>
        <h4 className="font-bold text-white">{name}</h4>
        <p className="text-sm text-on-surface-variant">{role}</p>
      </div>
    </div>
  </motion.div>
);

const CommunityFeature = ({ icon, title, desc }) => (
  <div className="flex gap-6 items-start">
    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
      <span className="material-symbols-outlined text-primary">{icon}</span>
    </div>
    <div className="space-y-1">
      <h4 className="text-xl font-bold text-white">{title}</h4>
      <p className="text-on-surface-variant text-sm leading-relaxed">{desc}</p>
    </div>
  </div>
);

const MockPost = ({ name, role, text }) => {
  const { t, lang } = useTranslation();
  return (
    <div className="bg-surface rounded-2xl p-4 border border-white/5 space-y-3 shadow-xl">
      {/* Header */}
      <div className={`flex justify-between items-start ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
        <div className={`flex gap-2 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
          <div className="w-10 h-10 rounded-full border border-primary/20 overflow-hidden bg-surface">
            <img src={`https://i.pravatar.cc/150?u=${name}`} alt={name} className="w-full h-full object-cover" />
          </div>
          <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
            <div className={`flex items-center gap-1 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
              <span className="font-bold text-white text-sm">{name.toLowerCase()}</span>
              <span className="material-symbols-outlined text-red-500 text-sm">delete</span>
            </div>
            <div className="text-[10px] text-white/40">{role} •</div>
          </div>
        </div>
        <div className="px-2 py-1 rounded-full bg-white/10 border border-white/5 text-[8px] font-bold text-primary tracking-widest">
          {t.mockups.general}
        </div>
      </div>

      {/* Content */}
      <p className={`text-sm text-white leading-relaxed ${lang === 'ar' ? 'text-right' : 'text-left'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>{text}</p>

      {/* Stats */}
      <div className={`flex justify-between items-center py-1 border-b border-white/5 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-center gap-1 text-white/60 text-xs ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
          <span className="material-symbols-outlined text-red-500 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
          <span>0 {t.mockups.farmer_likes}</span>
        </div>
        <div className="text-white/60 text-xs">
          1 {t.mockups.comments}
        </div>
      </div>

      {/* Actions */}
      <div className={`flex justify-around pt-1 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
        <button className={`flex items-center gap-1 text-white/60 hover:text-primary transition-colors text-xs ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
          <span className="material-symbols-outlined text-base">favorite</span>
          <span className="font-bold">{t.mockups.like}</span>
        </button>
        <button className={`flex items-center gap-1 text-white/60 hover:text-primary transition-colors text-xs ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
          <span className="material-symbols-outlined text-base">chat_bubble</span>
          <span className="font-bold">{t.mockups.comment}</span>
        </button>
      </div>
    </div>
  )
};

const MessagesMock = () => {
  const { t, lang } = useTranslation();
  return (
    <div className="bg-surface rounded-[2.5rem] w-[280px] p-5 border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.4)] space-y-4 relative overflow-hidden">
      <div className={`flex justify-between items-center ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
        <h3 className="text-xl font-bold text-white">{t.mockups.messages}</h3>
      </div>

      <div className="relative">
        <span className={`material-symbols-outlined absolute ${lang === 'ar' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-white/20 text-lg`}>search</span>
        <input
          type="text"
          placeholder={t.mockups.search}
          className={`w-full bg-white/5 border border-white/5 rounded-2xl py-2 ${lang === 'ar' ? 'pr-10 pl-3 text-right' : 'pl-10 pr-3 text-left'} text-xs text-white focus:outline-none focus:border-primary/50 transition-colors`}
          dir={lang === 'ar' ? 'rtl' : 'ltr'}
        />
      </div>

      <div className={`flex gap-3 overflow-hidden py-1 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
        <div className="flex flex-col items-center gap-1 cursor-pointer group">
          <div className="w-12 h-12 rounded-full border-2 border-primary p-1 group-hover:scale-110 transition-transform">
            <div className="w-full h-full rounded-full bg-surface-variant overflow-hidden relative">
              <img src="https://i.pravatar.cc/150?u=khalil" alt="Khalil" className="w-full h-full object-cover" />
              <div className={`absolute bottom-0 ${lang === 'ar' ? 'left-0' : 'right-0'} w-3 h-3 bg-primary border-2 border-surface rounded-full`} />
            </div>
          </div>
          <span className="text-[9px] text-white/60 font-bold">Khalil</span>
        </div>
        <div className="flex flex-col items-center gap-1 cursor-pointer group">
          <div className="w-12 h-12 rounded-full border-2 border-white/10 p-1 group-hover:scale-110 transition-transform">
            <div className="w-full h-full rounded-full bg-surface-variant overflow-hidden relative opacity-60">
              <img src="https://i.pravatar.cc/150?u=sarah" alt="Sarah" className="w-full h-full object-cover" />
            </div>
          </div>
          <span className="text-[9px] text-white/40">Sarah</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className={`flex justify-between items-center ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
          <span className="text-xs font-bold text-white">{t.mockups.messages}</span>
          <span className="text-[10px] text-primary font-bold px-2 py-1 bg-primary/10 rounded-full">{t.mockups.requests} (2)</span>
        </div>

        <div className="space-y-4">
          <MessageItem name="Maram Khlifi" text="يسعدني الانضمام..." time="1h" active />
          <MessageItem name="SKANDER" text="هل يمكنني معرفة..." time="2h" />
          <MessageItem name="Khalil Mejri" text="ممتاز جداً!" time="3 sem." />
        </div>
      </div>
    </div>
  )
};

const MessageItem = ({ name, text, time, active }) => {
  const { lang } = useTranslation();
  return (
    <div className={`flex items-center gap-3 group cursor-pointer ${lang === 'ar' ? 'flex-row-reverse text-right' : 'text-left'}`}>
      <div className="relative">
        <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
          <img src={`https://i.pravatar.cc/150?u=${name}`} alt={name} className="w-full h-full object-cover" />
        </div>
        {active && <div className={`absolute bottom-0 ${lang === 'ar' ? 'left-0' : 'right-0'} w-2.5 h-2.5 bg-primary border-2 border-surface rounded-full`} />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-bold text-white group-hover:text-primary transition-colors">{name}</div>
        <div className={`text-[9px] text-white/40 truncate ${lang === 'ar' ? 'flex flex-row-reverse gap-1 justify-end' : ''}`}>
          <span>{text}</span> <span>•</span> <span>{time}</span>
        </div>
      </div>
    </div>
  )
};

const NavItem = ({ icon, label, active }) => (
  <div className={`flex flex-col items-center gap-1 cursor-pointer hover:text-white transition-colors ${active ? 'text-primary' : 'text-white/20'}`}>
    <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: active ? "'FILL' 1" : "''" }}>
      {icon}
    </span>
    <span className="text-[7px] font-bold tracking-tighter uppercase">{label}</span>
  </div>
);

const ScannerMock = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-surface rounded-[2.5rem] sm:rounded-[3rem] w-full max-w-[350px] p-6 sm:p-8 border border-white/10 shadow-2xl space-y-8 relative overflow-hidden group mx-auto">
      <div className="relative flex justify-center items-center py-12">
        {/* Scanning Rings (Circle) */}
        <div className="w-56 h-56 border-2 border-dashed border-primary/40 rounded-full animate-spin-slow flex items-center justify-center" />

        {/* Viewfinder (Square) */}
        <div className="absolute w-32 h-32 border-4 border-primary rounded-[2rem] flex items-center justify-center">
          <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-xl" />
          <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-xl" />
          <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-xl" />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-xl" />
          <span className="material-symbols-outlined text-primary text-4xl animate-pulse">center_focus_weak</span>
        </div>
      </div>

      <div className="text-center space-y-4">
        <h3 className="text-2xl font-bold text-white">{t.mockups.ai_diag}</h3>
        <p className="text-on-surface-variant text-sm leading-relaxed">
          {t.mockups.ai_diag_desc}
        </p>
      </div>

      <button className="w-full bg-primary text-black font-bold py-4 rounded-full flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(0,230,64,0.3)] hover:scale-105 transition-transform">
        <span className="material-symbols-outlined">photo_camera</span>
        {t.mockups.start_scan}
      </button>

    </div>
  )
};

const ContactInfoCard = ({ icon, title, value, desc }) => (
  <div className="flex gap-6 items-start group">
    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary/50 transition-colors shrink-0">
      <span className="material-symbols-outlined text-primary text-3xl">{icon}</span>
    </div>
    <div className="space-y-1">
      <h4 className="text-xl font-bold text-white">{title}</h4>
      <div className="text-primary font-space font-bold">{value}</div>
      <p className="text-on-surface-variant text-sm leading-relaxed">{desc}</p>
    </div>
  </div>
);

const SignUpPage = ({ setUser, showToast }) => {
  const { t, lang } = useTranslation();
  const navigate = useNavigate();
  const [role, setRole] = React.useState('farmer');
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    agreed: false,
    profilePicture: null
  });
  const [previewImage, setPreviewImage] = React.useState(null);
  const [errors, setErrors] = React.useState({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const validate = (name, value) => {
    let error = '';
    if (name === 'firstName' || name === 'lastName') {
      if (/[0-9]/.test(value)) {
        error = t.auth.err_num;
      }
    }
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value && !emailRegex.test(value)) {
        error = t.auth.err_email;
      }
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      if (files && files[0]) {
        setFormData(prev => ({ ...prev, profilePicture: files[0] }));
        setPreviewImage(URL.createObjectURL(files[0]));
      }
      return;
    }
    const val = type === 'checkbox' ? checked : value;

    const error = validate(name, val);
    setErrors(prev => ({ ...prev, [name]: error }));
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const isFormValid =
    formData.firstName &&
    formData.lastName &&
    formData.email &&
    formData.password &&
    formData.agreed &&
    !Object.values(errors).some(err => err);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    setIsSubmitting(true);

    const submitData = new FormData();
    submitData.append('firstName', formData.firstName);
    submitData.append('lastName', formData.lastName);
    submitData.append('email', formData.email);
    submitData.append('password', formData.password);
    submitData.append('role', role);
    if (formData.profilePicture) {
      submitData.append('profilePicture', formData.profilePicture);
    }

    try {
      const response = await fetch(`${config.API_URL}/api/auth/register`, {
        method: 'POST',
        body: submitData,
      });

      const data = await response.json();

      if (response.ok) {
        if (setUser && data.user) setUser(data.user);
        showToast(t.auth.success_reg);
        navigate('/');
      } else {
        showToast(data.message || t.auth.error_reg, 'error');
      }
    } catch (error) {
      console.error('Registration Error:', error);
      showToast('تعذر الاتصال بالخادم. تأكد من تشغيل الخادم.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  React.useEffect(() => {
    /* global google */
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: "1009149258614-ekacj2v6em2of5h332ipllkcvsafmfoq.apps.googleusercontent.com",
        callback: handleGoogleCallback
      });

      window.google.accounts.id.renderButton(
        document.getElementById("googleBtn"),
        { theme: "outline", size: "large", width: "100%", text: "continue_with", shape: "pill" }
      );
    }
  }, []);

  const handleGoogleCallback = (response) => {
    console.log("Encoded JWT ID token: " + response.credential);
    const decodedToken = decodeJwt(response.credential);
    if (setUser && decodedToken) {
      setUser({
        firstName: decodedToken.given_name || decodedToken.name || t.auth.default_google_user,
        email: decodedToken.email,
        profilePicture: decodedToken.picture || ''
      });
    }
    showToast(t.auth.success_log);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden pt-20">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-6 relative">
        {/* Background Decorative Elements */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-emerald-900/20 blur-[120px] rounded-full" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl w-full bg-surface/50 backdrop-blur-2xl rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl flex flex-col lg:flex-row min-h-[700px]"
        >
          {/* Left Side: Branding/Visual */}
          <div className="lg:w-1/2 relative p-12 flex flex-col justify-between overflow-hidden bg-primary/5">
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
            </div>

            <div className="relative z-10">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-white/60 hover:text-primary transition-colors group mb-12"
              >
                <span className={`material-symbols-outlined group-hover:${lang === 'ar' ? '-translate-x-1' : 'translate-x-1'} transition-transform`}>
                  {lang === 'ar' ? 'arrow_forward' : 'arrow_back'}
                </span>
                <span>{t.auth.return}</span>
              </button>

              <div className="space-y-6">
                <div className="text-4xl font-space font-bold text-white">
                  {t.auth.register_title} <br />
                  <span className="text-primary">{t.auth.register_span}</span>
                </div>
                <p className="text-on-surface-variant text-lg max-w-md leading-relaxed">
                  {t.auth.register_desc}
                </p>
              </div>
            </div>

            {/* Mini Mockup in Left Side */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10 mt-12 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md hidden lg:block"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">verified</span>
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{t.auth.trusted}</div>
                  <div className="text-xs text-on-surface-variant">{t.auth.experts}</div>
                </div>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '75%' }}
                  className="h-full bg-primary"
                />
              </div>
            </motion.div>
          </div>

          {/* Right Side: Form */}
          <div className="lg:w-1/2 p-12 lg:p-16 flex flex-col justify-center bg-surface">
            <div className={`max-w-md mx-auto w-full space-y-8 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-white">{t.auth.create_acc}</h2>
                <p className="text-on-surface-variant">{t.auth.create_desc}</p>
              </div>

              {/* Role Selection */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setRole('farmer')}
                  className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${role === 'farmer' ? 'border-primary bg-primary/5 text-primary' : 'border-white/5 bg-white/5 text-white/40 hover:border-white/20'}`}
                >
                  <span className="material-symbols-outlined text-3xl">agriculture</span>
                  <span className="text-sm font-bold">{t.auth.farmer}</span>
                </button>
                <button
                  disabled
                  className="p-4 rounded-2xl border border-white/5 bg-white/5 text-white/20 flex flex-col items-center gap-2 relative cursor-not-allowed overflow-hidden"
                >
                  <div className="absolute top-2 right-2 px-2 py-0.5 bg-white/10 text-[10px] font-bold rounded text-white/40 uppercase tracking-widest">
                    {t.auth.soon}
                  </div>
                  <span className="material-symbols-outlined text-3xl">psychology</span>
                  <span className="text-sm font-bold">{t.auth.expert}</span>
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                {/* Profile Picture Upload */}
                <div className="flex justify-center mb-6">
                  <label className="relative cursor-pointer group flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-dashed border-white/20 group-hover:border-primary transition-colors flex items-center justify-center bg-white/5 relative">
                      {previewImage ? (
                        <img src={previewImage} alt="Profile Preview" className="w-full h-full object-cover" />
                      ) : (
                        <span className="material-symbols-outlined text-white/40 text-4xl group-hover:text-primary transition-colors">add_a_photo</span>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-2xl">upload</span>
                      </div>
                    </div>
                    <span className="text-xs text-white/50 mt-2 group-hover:text-white transition-colors">{t.auth.pic}</span>
                    <input
                      type="file"
                      name="profilePicture"
                      accept="image/*"
                      onChange={handleChange}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className={`text-sm font-bold text-white/60 block ${lang === 'ar' ? 'mr-2' : 'ml-2'}`}>{t.auth.first_name}</label>
                    <input
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder={lang === 'ar' ? "محمد" : "John"}
                      className={`w-full bg-white/5 border ${errors.firstName ? 'border-red-500' : 'border-white/5'} rounded-2xl py-3 px-4 text-white focus:outline-none focus:border-primary transition-colors ${lang === 'ar' ? 'text-right' : 'text-left'}`}
                      dir={lang === 'ar' ? 'rtl' : 'ltr'}
                    />
                    {errors.firstName && <p className={`text-[10px] text-red-500 ${lang === 'ar' ? 'mr-2' : 'ml-2'}`}>{errors.firstName}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className={`text-sm font-bold text-white/60 block ${lang === 'ar' ? 'mr-2' : 'ml-2'}`}>{t.auth.last_name}</label>
                    <input
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder={lang === 'ar' ? "العلوي" : "Doe"}
                      className={`w-full bg-white/5 border ${errors.lastName ? 'border-red-500' : 'border-white/5'} rounded-2xl py-3 px-4 text-white focus:outline-none focus:border-primary transition-colors ${lang === 'ar' ? 'text-right' : 'text-left'}`}
                      dir={lang === 'ar' ? 'rtl' : 'ltr'}
                    />
                    {errors.lastName && <p className={`text-[10px] text-red-500 ${lang === 'ar' ? 'mr-2' : 'ml-2'}`}>{errors.lastName}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={`text-sm font-bold text-white/60 block ${lang === 'ar' ? 'mr-2' : 'ml-2'}`}>{t.contact.email}</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className={`w-full bg-white/5 border ${errors.email ? 'border-red-500' : 'border-white/5'} rounded-2xl py-3 px-4 text-white focus:outline-none focus:border-primary transition-colors ${lang === 'ar' ? 'text-right' : 'text-left'}`}
                    dir={lang === 'ar' ? 'rtl' : 'ltr'}
                  />
                  {errors.email && <p className={`text-[10px] text-red-500 ${lang === 'ar' ? 'mr-2' : 'ml-2'}`}>{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <label className={`text-sm font-bold text-white/60 block ${lang === 'ar' ? 'mr-2' : 'ml-2'}`}>{t.auth.password}</label>
                  <input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full bg-white/5 border border-white/5 rounded-2xl py-3 px-4 text-white focus:outline-none focus:border-primary transition-colors ${lang === 'ar' ? 'text-right' : 'text-left'}`}
                    dir="ltr"
                  />
                </div>

                <div className={`flex items-center gap-3 justify-end pt-2 ${lang === 'en' ? 'flex-row-reverse' : ''}`}>
                  <label className="text-xs text-white/40 cursor-pointer">{t.auth.agree}</label>
                  <input
                    name="agreed"
                    type="checkbox"
                    checked={formData.agreed}
                    onChange={handleChange}
                    className="w-4 h-4 accent-primary rounded border-white/10"
                  />
                </div>

                <button
                  disabled={!isFormValid || isSubmitting}
                  className={`w-full justify-center py-4 mt-4 rounded-2xl font-bold transition-all shadow-[0_20px_40px_rgba(0,230,64,0.2)] ${(isFormValid && !isSubmitting) ? 'bg-primary text-black' : 'bg-white/10 text-white/20 cursor-not-allowed shadow-none'}`}
                >
                  {isSubmitting ? t.auth.loading : t.auth.btn_register}
                </button>
              </form>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/5"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-surface px-4 text-white/30">{t.auth.or}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div id="googleBtn" className="w-full"></div>
              </div>

              <p className={`text-center text-sm text-white/40 pt-4 ${lang === 'en' ? 'flex flex-row-reverse justify-center gap-1' : ''}`}>
                {t.auth.have_acc} <button onClick={() => navigate('/login')} className="text-primary font-bold hover:underline cursor-pointer">{t.auth.login_title}</button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const LoginPage = ({ setUser, showToast }) => {
  const { t, lang } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({ email: '', password: '' });
  const [errors, setErrors] = React.useState({});

  React.useEffect(() => {
    /* global google */
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: "1009149258614-ekacj2v6em2of5h332ipllkcvsafmfoq.apps.googleusercontent.com",
        callback: (res) => {
          const decodedToken = decodeJwt(res.credential);
          if (setUser && decodedToken) {
            setUser({
              firstName: decodedToken.given_name || decodedToken.name || t.auth.default_google_user,
              email: decodedToken.email,
              profilePicture: decodedToken.picture || ''
            });
          }
          showToast(t.auth.success_log);
          navigate('/');
        }
      });

      window.google.accounts.id.renderButton(
        document.getElementById("googleBtnLogin"),
        { theme: "outline", size: "large", width: "100%", text: "signin_with", shape: "pill" }
      );
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isFormValid = formData.email && formData.password;

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden pt-20">
      <Navbar />

      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full" />

      <div className="flex-1 flex items-center justify-center p-6 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-5xl w-full bg-surface/50 backdrop-blur-2xl rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl flex flex-col lg:flex-row min-h-[600px]"
        >
          {/* Left Side: Inspiration */}
          <div className="lg:w-1/2 relative p-12 flex flex-col justify-between bg-primary/5">
            <div className="space-y-6">
              <div className="text-4xl font-space font-bold text-white">
                {t.auth.welcome} <br />
                <span className="text-primary">{t.auth.welcome_span}</span>
              </div>
              <p className="text-on-surface-variant text-lg leading-relaxed">
                {t.auth.welcome_desc}
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md hidden lg:block">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                <div className="text-sm text-white/80">{t.auth.alerts}</div>
              </div>
              <div className="text-xs text-on-surface-variant">{t.auth.update}</div>
            </div>
          </div>

          {/* Right Side: Login Form */}
          <div className="lg:w-1/2 p-12 lg:p-16 flex flex-col justify-center bg-surface">
            <div className={`max-w-sm mx-auto w-full space-y-8 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
              <div className={`space-y-2 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                <h2 className="text-3xl font-bold text-white">{t.auth.login_title}</h2>
                <p className="text-on-surface-variant">{t.auth.login_desc}</p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (setUser) setUser({ firstName: t.auth.default_user, email: formData.email });
                  showToast(t.auth.success_log);
                  navigate('/');
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label className={`text-sm font-bold text-white/60 block ${lang === 'ar' ? 'mr-2 text-right' : 'ml-2 text-left'}`}>{t.contact.email}</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className={`w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-primary transition-colors ${lang === 'ar' ? 'text-right' : 'text-left'}`}
                    dir={lang === 'ar' ? 'rtl' : 'ltr'}
                  />
                </div>

                <div className="space-y-2">
                  <div className={`flex justify-between items-center px-2 ${lang === 'en' ? 'flex-row-reverse' : ''}`}>
                    <button type="button" className="text-xs text-primary hover:underline">{t.auth.forgot}</button>
                    <label className="text-sm font-bold text-white/60">{t.auth.password}</label>
                  </div>
                  <input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-primary transition-colors ${lang === 'ar' ? 'text-right' : 'text-left'}`}
                    dir="ltr"
                  />
                </div>

                <button
                  disabled={!isFormValid}
                  className={`w-full justify-center py-4 mt-4 rounded-2xl font-bold transition-all ${isFormValid ? 'bg-primary text-black shadow-[0_20px_40px_rgba(0,230,64,0.2)]' : 'bg-white/10 text-white/20 cursor-not-allowed'}`}
                >
                  {t.auth.btn_login}
                </button>
              </form>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/5"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-surface px-4 text-white/30">{t.auth.or}</span>
                </div>
              </div>

              <div id="googleBtnLogin" className="w-full"></div>

              <p className={`text-center text-sm text-white/40 pt-4 ${lang === 'en' ? 'flex flex-row-reverse justify-center gap-1' : ''}`}>
                {t.auth.no_acc} <Link to="/register" className="text-primary font-bold hover:underline">{t.auth.create_acc}</Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const AIDiagnosisPage = () => {
  const { t, lang } = useTranslation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [result, setResult] = React.useState(null);
  const [previewImage, setPreviewImage] = React.useState(null);
  const fileInputRef = React.useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreviewImage(URL.createObjectURL(file));
    setResult(null);
    await uploadImage(file);
  };

  const uploadImage = async (file) => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(config.PREDICT_API_URL, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.disease) {
        setResult(data);
        console.log("المرض المكتشف:", data.disease);
        console.log("نسبة التأكد:", data.confidence);
      } else {
        console.log("خطأ:", data.error);
        alert(lang === 'ar' ? `خطأ: ${data.error}` : `Error: ${data.error}`);
      }
    } catch (error) {
      console.error("حدث خطأ أثناء الاتصال بالسيرفر:", error);
      alert(lang === 'ar' ? "تأكد من أن السيرفر يعمل وأنك متصل بنفس الشبكة!" : "Make sure the server is running and you are on the same network!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-emerald-900/10 blur-[150px] rounded-full" />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 p-6 flex justify-between items-center">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-white/60 hover:text-primary transition-colors group"
        >
          <span className={`material-symbols-outlined group-hover:${lang === 'ar' ? 'translate-x-1' : '-translate-x-1'} transition-transform`}>
            {lang === 'ar' ? 'arrow_forward' : 'arrow_back'}
          </span>
          <span className="font-bold">{t.auth.return}</span>
        </button>
      </nav>

      {/* Main Scanner Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[450px] space-y-12 relative z-10"
      >
        {!result ? (
          <>
            <div className="relative flex justify-center items-center">
              {/* Scanning Rings (Circle) */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="w-72 h-72 sm:w-80 sm:h-80 border-2 border-dashed border-primary/40 rounded-full flex items-center justify-center"
              />

              {/* Viewfinder (Square) or Preview */}
              <div className="absolute w-44 h-44 sm:w-48 sm:h-48 border-2 border-primary/20 rounded-[2.5rem] flex items-center justify-center overflow-hidden">
                {previewImage ? (
                  <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    {/* Corners */}
                    <div className="absolute -top-1 -left-1 w-10 h-10 border-t-4 border-l-4 border-primary rounded-tl-2xl" />
                    <div className="absolute -top-1 -right-1 w-10 h-10 border-t-4 border-r-4 border-primary rounded-tr-2xl" />
                    <div className="absolute -bottom-1 -left-1 w-10 h-10 border-b-4 border-l-4 border-primary rounded-bl-2xl" />
                    <div className="absolute -bottom-1 -right-1 w-10 h-10 border-b-4 border-r-4 border-primary rounded-br-2xl" />

                    <motion.span
                      animate={{ opacity: [0.3, 1, 0.3], scale: [0.95, 1.05, 0.95] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="material-symbols-outlined text-primary text-6xl"
                    >
                      center_focus_weak
                    </motion.span>
                  </>
                )}
              </div>

              {/* Loading Overlay */}
              {isSubmitting && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm rounded-[3rem] z-20">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                  <div className="text-white font-bold animate-pulse">{lang === 'ar' ? 'جاري التحليل...' : 'Analyzing...'}</div>
                </div>
              )}
            </div>

            <div className="text-center space-y-6">
              <h1 className="text-4xl font-space font-bold text-white tracking-tight">
                {t.mockups.ai_diag}
              </h1>
              <p className="text-on-surface-variant text-lg leading-relaxed max-w-sm mx-auto">
                {t.mockups.ai_diag_desc}
              </p>
            </div>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />

            <button
              onClick={() => fileInputRef.current.click()}
              disabled={isSubmitting}
              className={`w-full bg-primary text-black font-black py-5 rounded-[2rem] flex items-center justify-center gap-4 shadow-[0_20px_50px_rgba(0,230,64,0.3)] hover:scale-[1.02] active:scale-95 transition-all text-xl ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span className="material-symbols-outlined text-2xl">photo_camera</span>
              <span>{isSubmitting ? (lang === 'ar' ? 'جاري التحميل...' : 'Uploading...') : t.mockups.start_scan}</span>
            </button>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center space-y-12"
          >
            {/* Circular Image with Dashed Border */}
            <div className="relative">
              <div className="w-64 h-64 rounded-full border-4 border-dashed border-primary/60 p-2">
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-primary/20">
                  <img src={previewImage} alt="Scanned Plant" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full -z-10" />
            </div>

            {/* Result Card */}
            <div className="w-full bg-[#0a1a10] border border-white/5 rounded-[2rem] p-8 text-center space-y-4 shadow-2xl">
              <div className="text-white/40 text-xs font-bold tracking-[0.2em] uppercase">
                {lang === 'ar' ? 'المرض المكتشف:' : 'Detected Disease:'}
              </div>
              <div className="text-white text-4xl font-bold tracking-tight">
                {result.disease}
              </div>
              <div className="text-white/60 font-medium">
                {lang === 'ar' ? 'نسبة التأكد:' : 'Confidence:'} {(result.confidence * 100).toFixed(2)}%
              </div>
            </div>

            {/* Reset Button */}
            <button
              onClick={() => {
                setResult(null);
                setPreviewImage(null);
              }}
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-3 rounded-full font-bold transition-all flex items-center gap-2 group"
            >
              <span className="material-symbols-outlined group-hover:rotate-180 transition-transform">refresh</span>
              {lang === 'ar' ? 'فحص صورة أخرى' : 'Scan Another Image'}
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default App;
