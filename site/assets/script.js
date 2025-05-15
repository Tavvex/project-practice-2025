/**
 * NLP Text Analyzer - Основной скрипт сайта
 * 
 * Этот скрипт обеспечивает:
 * 1. Работу вкладок на странице "О проекте"
 * 2. Демо-версию анализа текста
 * 3. Обработку формы обратной связи
 * 4. Плавную прокрутку по странице
 * 5. Адаптивное меню для мобильных устройств
 */

document.addEventListener('DOMContentLoaded', function() {
    // =============================================
    // 1. Управление вкладками на странице "О проекте"
    // Позволяет переключаться между разными функциями анализатора
    // без перезагрузки страницы
    // =============================================
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (tabBtns.length > 0 && tabContents.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Получаем ID вкладки из атрибута data-tab
                const tabId = this.getAttribute('data-tab');
                
                // Удаляем активный класс у всех кнопок и контента
                tabBtns.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Активируем текущую вкладку
                this.classList.add('active');
                document.getElementById(tabId).classList.add('active');
                
                // Сохраняем состояние вкладки в localStorage
                localStorage.setItem('activeTab', tabId);
            });
        });
        
        // Восстанавливаем активную вкладку при загрузке страницы
        const savedTab = localStorage.getItem('activeTab');
        if (savedTab) {
            const tabToActivate = document.querySelector(`.tab-btn[data-tab="${savedTab}"]`);
            if (tabToActivate) tabToActivate.click();
        }
    }

    // =============================================
    // 2. Демо-версия анализа текста
    // Имитирует работу NLP анализатора на главной странице
    // =============================================
    const analyzeBtn = document.querySelector('.demo-text .btn');
    const demoTextarea = document.querySelector('.demo-text textarea');
    const demoResult = document.querySelector('.demo-result .result-placeholder');
    
    if (analyzeBtn && demoTextarea && demoResult) {
        analyzeBtn.addEventListener('click', function() {
            const text = demoTextarea.value.trim();
            
            if (text.length === 0) {
                demoResult.innerHTML = '<p class="error">Пожалуйста, введите текст для анализа</p>';
                return;
            }
            
            // Имитация анализа текста
            demoResult.innerHTML = `
                <h3>Результаты анализа</h3>
                <div class="analysis-result">
                    <p><strong>Количество слов:</strong> ${text.split(/\s+/).length}</p>
                    <p><strong>Самые частые слова:</strong> ${getFrequentWords(text)}</p>
                    <p><strong>Тональность:</strong> ${analyzeSentiment(text)}</p>
                    <p><strong>Распознанные сущности:</strong> ${detectEntities(text)}</p>
                </div>
                <div class="analysis-progress">
                    <div class="progress-bar" style="width: 100%"></div>
                </div>
            `;
        });
        
        // Вспомогательные функции для демо-анализа
        function getFrequentWords(text) {
            const words = text.toLowerCase().split(/\s+/);
            const freq = {};
            words.forEach(word => {
                if (word.length > 3) freq[word] = (freq[word] || 0) + 1;
            });
            const sorted = Object.keys(freq).sort((a, b) => freq[b] - freq[a]);
            return sorted.slice(0, 3).join(', ');
        }
        
        function analyzeSentiment(text) {
            const positiveWords = ['хорош', 'отличн', 'прекрасн', 'довол'];
            const negativeWords = ['плох', 'ужасн', 'разочарован', 'недовол'];
            
            let sentiment = 0;
            const words = text.toLowerCase().split(/\s+/);
            
            words.forEach(word => {
                if (positiveWords.some(p => word.includes(p))) sentiment++;
                if (negativeWords.some(n => word.includes(n))) sentiment--;
            });
            
            return sentiment > 0 ? 'позитивная' : sentiment < 0 ? 'негативная' : 'нейтральная';
        }
        
        function detectEntities(text) {
            const entities = [];
            if (text.match(/\bМосковск\w*\b/)) entities.push('Москва (LOC)');
            if (text.match(/\bПолитех\b/)) entities.push('Московский Политех (ORG)');
            if (text.match(/\d{1,2}\s?(январ|феврал|март|апрел|май|июн|июл|август|сентябр|октябр|ноябр|декабр)/i)) {
                entities.push('Дата (DATE)');
            }
            return entities.length ? entities.join(', ') : 'не обнаружены';
        }
    }

    // =============================================
    // 3. Обработка формы обратной связи
    // Валидация и "отправка" данных формы
    // =============================================
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = this.querySelector('input[type="text"]').value.trim();
            const email = this.querySelector('input[type="email"]').value.trim();
            const message = this.querySelector('textarea').value.trim();
            
            // Простая валидация
            if (!name || !email || !message) {
                alert('Пожалуйста, заполните все поля формы');
                return;
            }
            
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                alert('Пожалуйста, введите корректный email');
                return;
            }
            
            // В реальном проекте здесь был бы AJAX-запрос
            console.log('Форма отправлена:', { name, email, message });
            
            // Показываем уведомление
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.innerHTML = `
                <p>Спасибо за ваше сообщение, ${name}!</p>
                <p>Мы ответим вам на email: ${email}</p>
            `;
            contactForm.parentNode.insertBefore(notification, contactForm.nextSibling);
            
            // Скрываем уведомление через 5 секунд
            setTimeout(() => {
                notification.style.opacity = '0';
                setTimeout(() => notification.remove(), 500);
            }, 5000);
            
            // Очищаем форму
            this.reset();
        });
    }

    // =============================================
    // 4. Плавная прокрутка для якорных ссылок
    // =============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Обновляем URL без перезагрузки страницы
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                } else {
                    location.hash = targetId;
                }
            }
        });
    });

    // =============================================
    // 5. Адаптивное меню для мобильных устройств
    // =============================================
    const menuToggle = document.createElement('button');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '<span></span><span></span><span></span>';
    
    const header = document.querySelector('header');
    if (header) {
        header.prepend(menuToggle);
        
        menuToggle.addEventListener('click', function() {
            document.body.classList.toggle('menu-open');
        });
    }
    
    // Закрываем меню при клике на ссылку
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', () => {
            document.body.classList.remove('menu-open');
        });
    });
});

// =============================================
// 6. Анимация загрузки страницы
// =============================================
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Анимация элементов с задержкой
    const animatedElements = document.querySelectorAll('.animate-on-load');
    animatedElements.forEach((el, index) => {
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 150 * index);
    });
});