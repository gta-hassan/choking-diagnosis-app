// بيانات المخطط الطبي الشاملة
const flowchartData = {
    start: {
        type: 'question',
        text: 'هل المصاب يختنق؟',
        yes: 'q1',
        no: 'end_safe',
        keywords: ['اختناق', 'عدم تنفس']
    },
    q1: {
        type: 'question',
        text: 'هل المصاب يتكلم أو يسعل أو يتنفس بشكل طبيعي؟',
        yes: 'action1',
        no: 'action2',
        keywords: ['تكلم', 'سعال', 'تنفس']
    },
    action1: {
        type: 'action',
        title: 'الإجراء الأول',
        text: 'خمس ضربات على الظهر بقوة\nثم خمس ضغطات على البطن (للبالغين)\nأو خمس ضغطات على الصدر (للرضع)',
        keywords: ['ضربات', 'ظهر', 'ضغطات']
    },
    action2: {
        type: 'action',
        title: 'الإجراء الثاني',
        text: 'تطبيق مناورة هيملك (Heimlich Maneuver):\nقف خلف المصاب\nضع يديك حول البطن\nاضغط بقوة للأعلى والداخل\nكرر حتى يتم إزالة الانسداد',
        keywords: ['هيملك', 'ضغط', 'بطن']
    },
    q2: {
        type: 'question',
        text: 'هل تمكنت من إزالة الانسداد؟',
        yes: 'end_success',
        no: 'action3',
        keywords: ['إزالة', 'انسداد']
    },
    action3: {
        type: 'action',
        title: 'استدعاء الطوارئ',
        text: 'اتصل بخدمات الطوارئ فوراً على 911\nاستمر في تطبيق الإجراءات الإسعافية\nأحضر مزيل رجفان تلقائي إن أمكن',
        keywords: ['طوارئ', '911', 'إسعاف']
    },
    end_safe: {
        type: 'result',
        icon: '✅',
        title: 'المصاب بأمان',
        text: 'لا يوجد اختناق - المصاب بحالة آمنة'
    },
    end_success: {
        type: 'result',
        icon: '🎉',
        title: 'تم إنقاذ المصاب!',
        text: 'تمكنت من إزالة الانسداد - ابقَ مع المصاب ومراقبته'
    },
    end_emergency: {
        type: 'result',
        icon: '🚨',
        title: 'حالة طارئة',
        text: 'تم استدعاء الخدمات الطارئة - استمر في الإسعاف الأولية'
    }
};

// متغيرات الحالة
let currentStep = 'start';
let stepCount = 0;
let correctCount = 0;
let wrongCount = 0;
let history = [];

// عناصر الصفحة
const flowchartContainer = document.getElementById('flowchartContainer');
const resetBtn = document.getElementById('resetBtn');
const progressCount = document.getElementById('progressCount');
const correctCountEl = document.getElementById('correctCount');
const wrongCountEl = document.getElementById('wrongCount');
const keywordsList = document.getElementById('keywordsList');

// تهيئة التطبيق
function init() {
    currentStep = 'start';
    stepCount = 0;
    correctCount = 0;
    wrongCount = 0;
    history = [];
    updateStats();
    displayStep();
    updateKeywords();
}

// تحديث الإحصائيات
function updateStats() {
    progressCount.textContent = stepCount;
    correctCountEl.textContent = `✅ ${correctCount}`;
    wrongCountEl.textContent = `❌ ${wrongCount}`;
}

// تحديث الكلمات المفتاحية
function updateKeywords() {
    keywordsList.innerHTML = '';
    const allKeywords = [];
    
    Object.values(flowchartData).forEach(step => {
        if (step.keywords) {
            allKeywords.push(...step.keywords);
        }
    });

    const uniqueKeywords = [...new Set(allKeywords)];
    
    uniqueKeywords.forEach(keyword => {
        const keywordEl = document.createElement('div');
        keywordEl.className = 'keyword-item';
        keywordEl.textContent = keyword;
        keywordEl.addEventListener('click', () => {
            keywordEl.classList.toggle('active');
        });
        keywordsList.appendChild(keywordEl);
    });
}

// عرض الخطوة الحالية
function displayStep() {
    const step = flowchartData[currentStep];
    
    flowchartContainer.innerHTML = '';

    const stepWrapper = document.createElement('div');
    stepWrapper.className = 'step-wrapper';

    // رقم الخطوة
    const stepNumber = document.createElement('div');
    stepNumber.className = 'step-number';
    stepNumber.textContent = stepCount + 1;

    const stepContent = document.createElement('div');
    stepContent.className = 'step-content';

    if (step.type === 'question') {
        displayQuestion(step, stepContent);
    } else if (step.type === 'action') {
        displayAction(step, stepContent);
    } else if (step.type === 'result') {
        displayResult(step, stepContent);
        stepNumber.style.opacity = '0.5';
    }

    stepWrapper.appendChild(stepNumber);
    stepWrapper.appendChild(stepContent);
    flowchartContainer.appendChild(stepWrapper);
}

// عرض سؤال
function displayQuestion(step, container) {
    const card = document.createElement('div');
    card.className = 'question-card';
    
    const text = document.createElement('div');
    text.className = 'question-text';
    text.textContent = step.text;
    
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'button-group';

    const yesBtn = document.createElement('button');
    yesBtn.className = 'btn btn-yes';
    yesBtn.textContent = '✅ نعم';
    yesBtn.addEventListener('click', () => answer('yes', step));

    const noBtn = document.createElement('button');
    noBtn.className = 'btn btn-no';
    noBtn.textContent = '❌ لا';
    noBtn.addEventListener('click', () => answer('no', step));

    buttonGroup.appendChild(yesBtn);
    buttonGroup.appendChild(noBtn);

    card.appendChild(text);
    card.appendChild(buttonGroup);
    container.appendChild(card);
}

// عرض إجراء
function displayAction(step, container) {
    const card = document.createElement('div');
    card.className = 'action-card';

    if (step.title) {
        const title = document.createElement('div');
        title.className = 'action-title';
        title.textContent = step.title;
        card.appendChild(title);
    }

    const text = document.createElement('div');
    text.className = 'action-text';
    text.innerHTML = step.text.split('\n').join('<br>');
    card.appendChild(text);

    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'button-group';

    const continueBtn = document.createElement('button');
    continueBtn.className = 'btn btn-yes';
    continueBtn.textContent = '➡️ متابعة';
    continueBtn.addEventListener('click', () => continueFlow(step));

    buttonGroup.appendChild(continueBtn);
    card.appendChild(buttonGroup);
    container.appendChild(card);
}

// عرض النتيجة النهائية
function displayResult(step, container) {
    const card = document.createElement('div');
    card.className = 'result-card';

    const title = document.createElement('h2');
    title.innerHTML = `${step.icon} ${step.title}`;
    card.appendChild(title);

    const text = document.createElement('p');
    text.textContent = step.text;
    card.appendChild(text);

    const actions = document.createElement('div');
    actions.className = 'result-actions';

    const continueBtn = document.createElement('button');
    continueBtn.className = 'btn btn-continue';
    continueBtn.textContent = '🔄 بدء من جديد';
    continueBtn.addEventListener('click', init);

    actions.appendChild(continueBtn);
    card.appendChild(actions);
    container.appendChild(card);
}

// الإجابة على سؤال
function answer(response, step) {
    stepCount++;
    
    if (response === 'yes') {
        correctCount++;
        currentStep = step.yes;
    } else {
        wrongCount++;
        currentStep = step.no;
    }

    history.push({
        step: currentStep,
        answer: response,
        text: step.text
    });

    updateStats();
    displayStep();
}

// متابعة من إجراء
function continueFlow(step) {
    // البحث عن الخطوة التالية
    if (currentStep === 'action1') {
        stepCount++;
        currentStep = 'q2';
    } else if (currentStep === 'action2') {
        stepCount++;
        currentStep = 'q2';
    } else if (currentStep === 'action3') {
        stepCount++;
        currentStep = 'end_emergency';
    }

    updateStats();
    displayStep();
}

// مستمع لزر إعادة التعيين
resetBtn.addEventListener('click', init);

// بدء التطبيق
init();
