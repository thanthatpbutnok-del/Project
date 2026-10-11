const translations = {
    th: {
        nav_eval: "ประเมินทักษะ",
        nav_roadmap: "แผนโรดแมป",
        nav_resources: "คลังสื่อการเรียนรู้",
        nav_admin: "จัดการระบบ (Admin)",
        logout: "ออกจากระบบ",
        eval_title: "ระบบประเมินดรรชนีความพร้อมสายอาชีพไอที",
        eval_subtitle: "ประเมินทักษะของคุณ แล้วระบบจะเชื่อมโยงไปสู่คอร์สเรียนและโรดแมปที่เหมาะสมที่สุดให้อัตโนมัติ",
        select_career_label: "เลือกสายอาชีพและประเมินตนเอง",
        dashboard_title: "แดชบอร์ดสรุปผล",
        score_label: "READINESS SCORE",
        skill_breakdown: "สรุปคะแนนทักษะย่อย",
        btn_resources: "ดูสื่อการเรียนรู้ที่แนะนำสำหรับสายงานนี้",
        btn_roadmap: "ไปที่แผนโรดแมปพัฒนาตนเอง",
        roadmap_header: "เส้นทางเติบโตตามสายอาชีพ (IT Roadmap)",
        roadmap_sub: "วางแผนก้าวทีละขั้น จากระดับปูพื้นฐานไปจนถึงระดับมืออาชีพ",
        resources_header: "คลังสื่อการเรียนรู้สายอาชีพไอที",
        resources_sub: "คัดสรรคอร์สเรียน วิดีโอแนวทาง และเอกสารประกอบการเรียนรู้เพื่อยกระดับทักษะของคุณ",
        btn_goto_resource: "เข้าสู่สื่อเรียนรู้",
        filter_all: "ทั้งหมด",
        status_evaluated: "ประเมินเรียบร้อย"
    },
    en: {
        nav_eval: "Skill Evaluator",
        nav_roadmap: "Career Roadmap",
        nav_resources: "Learning Resources",
        nav_admin: "Admin Control",
        logout: "Logout",
        eval_title: "IT Career Readiness Index Evaluator",
        eval_subtitle: "Evaluate your skills and the system will automatically link you to tailored courses and roadmaps.",
        select_career_label: "Select Career & Self-Assessment",
        dashboard_title: "Analytics Dashboard",
        score_label: "READINESS SCORE",
        skill_breakdown: "Skill Breakdown",
        btn_resources: "View Recommended Learning Resources",
        btn_roadmap: "Go to Career Development Roadmap",
        roadmap_header: "IT Career Growth Roadmap",
        roadmap_sub: "Plan your step-by-step progression from foundational to professional levels.",
        resources_header: "IT Career Learning Resources Hub",
        resources_sub: "Curated courses, video guides, and reference documents to level up your skills.",
        btn_goto_resource: "Access Resource",
        filter_all: "All",
        status_evaluated: "Evaluated"
    }
};

function initDatabase() {
    if (!localStorage.getItem('sv_users_db')) {
        const initialUsers = [
            {
                studentId: '6840144204',
                name: 'นายฐานฑัต บุตรนอก',
                group: 'ว.6501',
                subject: 'การออกแบบและพัฒนาเว็บไซต์เบื้องต้น',
                password: '1234',
                status: 'ประเมินเรียบร้อย',
                role: 'admin'
            }
        ];
        localStorage.setItem('sv_users_db', JSON.stringify(initialUsers));
    }
}

function getCurrentUserSession() {
    const userJson = localStorage.getItem('skillverse_user');
    return userJson ? JSON.parse(userJson) : null;
}

const careerDataMulti = {
    frontend: {
        title: { th: "🚀 Frontend Developer", en: "🚀 Frontend Developer" },
        desc: { th: "เชี่ยวชาญการสร้างสถาปัตยกรรมฝั่งผู้ใช้งาน (UI/UX) และ Responsive Layout", en: "Specialized in user-facing architecture (UI/UX) and Responsive layouts." },
        skills: [
            { id: 'html_css', name: { th: 'HTML5 & CSS3 Layouts', en: 'HTML5 & CSS3 Layouts' }, weight: 0.3 },
            { id: 'js_es6', name: { th: 'JavaScript ES6+ Logic', en: 'JavaScript ES6+ Logic' }, weight: 0.4 },
            { id: 'bootstrap', name: 'Bootstrap 5 Framework', weight: 0.3 }
        ]
    },
    backend: {
        title: { th: "⚙️ Backend Developer", en: "⚙️ Backend Developer" },
        desc: { th: "ออกแบบระบบเซิร์ฟเวอร์ ฐานข้อมูล และการเชื่อมต่อ RESTful API", en: "Design secure server systems, databases, and RESTful API integrations." },
        skills: [
            { id: 'node_py', name: { th: 'Server Processing Logic', en: 'Server Processing Logic' }, weight: 0.5 },
            { id: 'db_sql', name: { th: 'Database & SQL Queries', en: 'Database & SQL Queries' }, weight: 0.5 }
        ]
    },
    uiux: {
        title: { th: "🎨 UI/UX Designer", en: "🎨 UI/UX Designer" },
        desc: { th: "วิเคราะห์พฤติกรรมผู้ใช้ ออกแบบ Wireframe และ Design System", en: "Analyze user behavior, design wireframes, and design systems." },
        skills: [
            { id: 'user_research', name: { th: 'User Research & Journey', en: 'User Research & Journey' }, weight: 0.5 },
            { id: 'wireframing', name: { th: 'Prototyping & Figma', en: 'Prototyping & Figma' }, weight: 0.5 }
        ]
    }
};

const learningResources = [
    { id: 1, title: "คอร์สปูพื้นฐาน HTML5 & CSS3 แบบละเอียดยิบ", category: "frontend", type: "Course", level: "Beginner", icon: "bi-filetype-html", link: "https://developer.mozilla.org/en-US/docs/Learn", desc: "เรียนรู้โครงสร้างเว็บเพจและการจัดเลย์เอาต์ Modern Responsive" },
    { id: 2, title: "เจาะลึก JavaScript ES6+ & Async/Await", category: "frontend", type: "Video", level: "Intermediate", icon: "bi-filetype-js", link: "https://javascript.info/", desc: "เข้าใจกลไก Event Loop, DOM, Promises และการจัดการ API" },
    { id: 3, title: "การออกแบบและจัดการฐานข้อมูล MySQL / MariaDB", category: "backend", type: "Book", level: "Intermediate", icon: "bi-database-fill", link: "https://dev.mysql.com/doc/", desc: "ออกแบบโครงสร้างตารางและการเขียน SQL Joins" },
    { id: 4, title: "หลักการ UI/UX Design และการสร้าง Design System", category: "uiux", type: "Course", level: "All Levels", icon: "bi-palette-fill", link: "https://www.figma.com/resource-library/", desc: "วิเคราะห์ User Journey และ Wireframing" }
];

function getCurrentLang() { return localStorage.getItem('skillverse_lang') || 'th'; }

function toggleLanguage() {
    const nextLang = getCurrentLang() === 'th' ? 'en' : 'th';
    localStorage.setItem('skillverse_lang', nextLang);
    location.reload();
}

function logout() {
    localStorage.removeItem('skillverse_user');
    localStorage.removeItem('skillverse_role');
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', () => {
    initDatabase();

    if (!localStorage.getItem('skillverse_user') && window.location.pathname.indexOf('login.html') === -1) {
        window.location.href = 'login.html';
        return;
    }

    const lang = getCurrentLang();
    const langBtn = document.getElementById('langToggleBtn');
    if (langBtn) langBtn.innerText = lang === 'th' ? '🌐 EN' : '🌐 TH';

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) el.innerText = translations[lang][key];
    });

    const role = localStorage.getItem('skillverse_role');
    const adminNavItem = document.getElementById('adminNavItem');
    if (adminNavItem) {
        adminNavItem.style.display = role === 'admin' ? 'block' : 'none';
    }
});
