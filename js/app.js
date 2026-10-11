document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('careerSelect')) {
        loadProfileCard();
        switchCareer();
    }

    if (document.getElementById('resourceCardsGrid')) {
        const urlParams = new URLSearchParams(window.location.search);
        const selectedCategory = urlParams.get('category') || 'all';
        renderFilterButtons(selectedCategory);
        renderResourceCards(selectedCategory);
    }
});

function loadProfileCard() {
    const currentUser = getCurrentUserSession();
    if (!currentUser) return;

    const nameEl = document.getElementById('displayProfileName');
    const idEl = document.getElementById('displayProfileId');
    const groupEl = document.getElementById('displayProfileGroup');
    const subjectEl = document.getElementById('displayProfileSubject');
    const statusEl = document.getElementById('displayProfileStatus');

    if (nameEl) nameEl.innerText = currentUser.name;
    if (idEl) idEl.innerText = currentUser.studentId;
    if (groupEl) groupEl.innerText = currentUser.group;
    if (subjectEl) subjectEl.innerText = currentUser.subject || "การออกแบบและพัฒนาเว็บไซต์เบื้องต้น";
    if (statusEl) statusEl.innerText = currentUser.status || 'ประเมินเรียบร้อย';
}

function openEditProfileModal() {
    const currentUser = getCurrentUserSession();
    if (!currentUser) return;

    document.getElementById('modalInputName').value = currentUser.name;
    document.getElementById('modalInputId').value = currentUser.studentId;
    document.getElementById('modalInputGroup').value = currentUser.group;
    document.getElementById('modalInputSubject').value = "การออกแบบและพัฒนาเว็บไซต์เบื้องต้น";

    const modal = new bootstrap.Modal(document.getElementById('editProfileModal'));
    modal.show();
}

function saveQuickProfile(event) {
    event.preventDefault();
    const currentUser = getCurrentUserSession();
    if (!currentUser) return;

    currentUser.name = document.getElementById('modalInputName').value.trim();
    currentUser.studentId = document.getElementById('modalInputId').value.trim();
    currentUser.group = document.getElementById('modalInputGroup').value.trim();
    currentUser.subject = "การออกแบบและพัฒนาเว็บไซต์เบื้องต้น";

    localStorage.setItem('skillverse_user', JSON.stringify(currentUser));

    let users = JSON.parse(localStorage.getItem('sv_users_db')) || [];
    const index = users.findIndex(u => u.studentId === currentUser.studentId || u.name === currentUser.name);
    if (index !== -1) {
        users[index] = currentUser;
        localStorage.setItem('sv_users_db', JSON.stringify(users));
    }

    loadProfileCard();

    const modalEl = document.getElementById('editProfileModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();

    alert('อัปเดตข้อมูลส่วนตัวเรียบร้อยแล้ว!');
}

function switchCareer() {
    const lang = getCurrentLang();
    const key = document.getElementById('careerSelect').value;
    const currentCareer = careerDataMulti[key];
    
    const descBox = document.getElementById('careerDescBox');
    if (descBox) {
        descBox.innerHTML = `<strong><i class="bi bi-info-circle-fill me-1 text-primary"></i>${currentCareer.title[lang]}:</strong> ${currentCareer.desc[lang]}`;
    }

    const container = document.getElementById('skillsContainer');
    if (!container) return;
    container.innerHTML = '';

    currentCareer.skills.forEach((skill, index) => {
        const skillName = typeof skill.name === 'object' ? skill.name[lang] : skill.name;
        const div = document.createElement('div');
        div.className = 'mb-3 p-3 rounded-3 border border-secondary border-opacity-25 bg-dark bg-opacity-25';
        div.innerHTML = `
            <div class="d-flex justify-content-between text-white mb-1">
                <span class="small fw-medium">${index + 1}. ${skillName}</span>
                <span class="badge bg-primary" id="val_${skill.id}">50%</span>
            </div>
            <input type="range" class="form-range skill-range" id="${skill.id}" min="0" max="100" value="50" oninput="calculateScore()">
        `;
        container.appendChild(div);
    });
    calculateScore();
}

function calculateScore() {
    const lang = getCurrentLang();
    const key = document.getElementById('careerSelect').value;
    const currentCareer = careerDataMulti[key];
    let score = 0;
    let highSkillsCount = 0;
    const summary = document.getElementById('summaryList');
    if (!summary) return;
    summary.innerHTML = '';

    currentCareer.skills.forEach(skill => {
        const input = document.getElementById(skill.id);
        const val = input ? parseInt(input.value) : 0;
        const badgeEl = document.getElementById(`val_${skill.id}`);
        if (badgeEl) badgeEl.innerText = `${val}%`;
        
        score += val * skill.weight;
        if (val >= 75) highSkillsCount++;

        const skillName = typeof skill.name === 'object' ? skill.name[lang] : skill.name;
        const li = document.createElement('li');
        li.className = 'list-group-item bg-dark text-white border-secondary border-opacity-25 d-flex justify-content-between py-2';
        li.innerHTML = `<span class="small">${skillName}</span><span class="badge ${val >= 70 ? 'bg-success' : 'bg-warning'}">${val}%</span>`;
        summary.appendChild(li);
    });

    const rounded = Math.round(score);
    const totalScoreEl = document.getElementById('totalScore');
    const scoreBarEl = document.getElementById('scoreBar');
    const statusEl = document.getElementById('evaluationStatus');

    if (totalScoreEl) totalScoreEl.innerText = `${rounded}%`;
    if (scoreBarEl) scoreBarEl.style.width = `${rounded}%`;

    if (statusEl) {
        if (rounded >= 80) {
            statusEl.innerHTML = '<span class="text-success fw-bold"><i class="bi bi-check-circle-fill me-1"></i>พร้อมปฏิบัติงานจริง</span>';
        } else if (rounded >= 50) {
            statusEl.innerHTML = '<span class="text-warning fw-bold"><i class="bi bi-exclamation-triangle-fill me-1"></i>ระดับปานกลาง ควรพัฒนาเพิ่ม</span>';
        } else {
            statusEl.innerHTML = '<span class="text-danger fw-bold"><i class="bi bi-info-circle-fill me-1"></i>จำเป็นต้องเน้นปูพื้นฐาน</span>';
        }
    }

    renderBadges(rounded, highSkillsCount);
}

function renderBadges(score, highSkills) {
    const badgeContainer = document.getElementById('badgeContainer');
    if (!badgeContainer) return;
    badgeContainer.innerHTML = '';

    const badges = [
        { name: '🔥 Fast Learner', active: score >= 60 },
        { name: '⭐ Master Skill', active: highSkills >= 2 },
        { name: '💎 Top Readiness', active: score >= 85 }
    ];

    badges.forEach(b => {
        const span = document.createElement('span');
        span.className = `badge rounded-pill px-3 py-2 ${b.active ? 'bg-success bg-opacity-25 text-success border border-success' : 'bg-secondary bg-opacity-10 text-muted border border-secondary'}`;
        span.innerHTML = `${b.active ? '✓ ' : '🔒 '}${b.name}`;
        badgeContainer.appendChild(span);
    });
}

function randomScores(type) {
    const key = document.getElementById('careerSelect').value;
    const currentCareer = careerDataMulti[key];

    currentCareer.skills.forEach(skill => {
        const input = document.getElementById(skill.id);
        if (input) {
            if (type === 'positive') {
                input.value = Math.floor(Math.random() * 21) + 80;
            } else {
                input.value = Math.floor(Math.random() * 100);
            }
        }
    });
    calculateScore();
}

function generateReportModal() {
    const lang = getCurrentLang();
    const key = document.getElementById('careerSelect').value;
    const currentCareer = careerDataMulti[key];
    const score = document.getElementById('totalScore').innerText;
    const currentUser = getCurrentUserSession();

    const modalContent = document.getElementById('modalReportContent');
    if (!modalContent) return;

    modalContent.innerHTML = `
        <div class="p-3 rounded-3 bg-dark bg-opacity-50 border border-secondary border-opacity-25 mb-3">
            <h6 class="text-primary fw-bold mb-2">👤 ผู้ประเมิน: ${currentUser ? currentUser.name : 'นักศึกษา'} (รหัส ${currentUser ? currentUser.studentId : '-'})</h6>
            <p class="mb-1 text-sub">เป้าหมายสายอาชีพ: <strong class="text-white">${currentCareer.title[lang]}</strong></p>
            <p class="mb-0 text-sub">ดัชนีความพร้อมรวม (Readiness Score): <strong class="text-success fs-5">${score}</strong></p>
        </div>
        <p class="text-sub small">คำแนะนำ: ควรฝึกฝนเพิ่มเติมในทักษะที่มีคะแนนต่ำกว่า 70% และศึกษาคอร์สเรียนแนะนำในหน้าคลังสื่อการเรียนรู้เพื่อสร้างพอร์ตโฟลิโอต่อไป</p>
    `;

    const reportModal = new bootstrap.Modal(document.getElementById('reportModal'));
    reportModal.show();
}

function navigateToResources() {
    const key = document.getElementById('careerSelect').value;
    window.location.href = `resources.html?category=${key}`;
}

function renderFilterButtons(activeCategory) {
    const categories = [
        { key: 'all', name: 'ทั้งหมด' },
        { key: 'frontend', name: 'Frontend' },
        { key: 'backend', name: 'Backend' },
        { key: 'uiux', name: 'UI/UX Design' }
    ];

    const container = document.getElementById('filterBtnContainer');
    if (!container) return;

    container.innerHTML = '';
    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = `btn rounded-pill px-4 ${cat.key === activeCategory ? 'btn-custom' : 'btn-outline-light'}`;
        btn.innerText = cat.name;
        btn.onclick = () => {
            renderFilterButtons(cat.key);
            renderResourceCards(cat.key);
        };
        container.appendChild(btn);
    });
}

function renderResourceCards(category) {
    const grid = document.getElementById('resourceCardsGrid');
    if (!grid) return;

    grid.innerHTML = '';
    const filtered = category === 'all' 
        ? learningResources 
        : learningResources.filter(r => r.category === category);

    filtered.forEach(item => {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4';
        col.innerHTML = `
            <div class="glass-card p-4 h-100 d-flex flex-column justify-content-between">
                <div>
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <span class="skill-badge">${item.type}</span>
                        <span class="text-sub small">${item.level}</span>
                    </div>
                    <h5 class="fw-bold text-white mb-2"><i class="bi ${item.icon} text-primary me-2"></i>${item.title}</h5>
                    <p class="text-sub small mb-4">${item.desc}</p>
                </div>
                <a href="${item.link}" target="_blank" class="btn btn-outline-info btn-sm rounded-pill w-100">
                    <i class="bi bi-box-arrow-up-right me-1"></i> เข้าสู่สื่อเรียนรู้
                </a>
            </div>
        `;
        grid.appendChild(col);
    });
}
