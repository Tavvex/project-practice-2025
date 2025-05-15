/**
 * NLP Text Analyzer - Полный скрипт с меню вывода
 * 
 * Основные функции:
 * 1. Управление вкладками
 * 2. Демо-анализ текста с NLP-функциями
 * 3. Меню вывода с экспортом, фильтрацией и визуализацией
 * 4. Обратная связь
 * 5. Адаптивное меню
 * 6. Плавная прокрутка
 */

document.addEventListener('DOMContentLoaded', function() {
    // ==================== 1. Управление вкладками ====================
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (tabBtns.length > 0 && tabContents.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                // Удаляем активный класс у всех элементов
                tabBtns.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Активируем текущую вкладку
                this.classList.add('active');
                document.getElementById(tabId).classList.add('active');
                
                // Сохраняем состояние
                localStorage.setItem('activeTab', tabId);
            });
        });
        
        // Восстанавливаем активную вкладку
        const savedTab = localStorage.getItem('activeTab');
        if (savedTab) {
            const tabToActivate = document.querySelector(`.tab-btn[data-tab="${savedTab}"]`);
            if (tabToActivate) tabToActivate.click();
        }
    }

    // ==================== 2. Демо-анализ текста ====================
    const analyzeBtn = document.querySelector('.demo-text .btn');
    const demoTextarea = document.querySelector('.demo-text textarea');
    const demoResult = document.querySelector('.demo-result .result-placeholder');
    
    if (analyzeBtn && demoTextarea && demoResult) {
        analyzeBtn.addEventListener('click', function() {
            const text = demoTextarea.value.trim();
            
            if (text.length === 0) {
                showNotification('Пожалуйста, введите текст для анализа', 'error');
                return;
            }
            
            // Анализируем текст
            const analysisResults = {
                text: text,
                wordCount: text.split(/\s+/).length,
                frequentWords: getFrequentWords(text),
                sentiment: analyzeSentiment(text),
                entities: detectEntities(text),
                topics: detectTopics(text),
                readability: analyzeReadability(text)
            };
            
            // Отображаем результаты
            renderResults(analysisResults);
        });
    }

    // ==================== 3. Функции анализа текста ====================
    function getFrequentWords(text, count = 5) {
        const words = text.toLowerCase()
            .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
            .split(/\s+/)
            .filter(word => word.length > 3);
            
        const freq = {};
        words.forEach(word => freq[word] = (freq[word] || 0) + 1);
        
        return Object.entries(freq)
            .sort((a, b) => b[1] - a[1])
            .slice(0, count)
            .map(item => `${item[0]} (${item[1]})`);
    }

    function analyzeSentiment(text) {
        const positiveWords = ['хорош', 'отличн', 'прекрасн', 'довол', 'рад', 'удивительн'];
        const negativeWords = ['плох', 'ужасн', 'разочарован', 'недовол', 'грустн', 'зл'];
        
        let positive = 0, negative = 0;
        const words = text.toLowerCase().split(/\s+/);
        
        words.forEach(word => {
            if (positiveWords.some(p => word.includes(p))) positive++;
            if (negativeWords.some(n => word.includes(n))) negative++;
        });
        
        const total = positive + negative;
        if (total === 0) return { type: 'нейтральная', score: 0 };
        
        const score = Math.round(((positive - negative) / total) * 100);
        
        return {
            type: score > 20 ? 'позитивная' : score < -20 ? 'негативная' : 'нейтральная',
            score: score
        };
    }

    function detectEntities(text) {
        const entities = [];
        
        // Имена (заглавная буква в начале слова)
        const names = text.match(/([А-ЯЁ][а-яё]+)\s+([А-ЯЁ][а-яё]+)/g);
        if (names) entities.push(...names.map(n => `${n} (PER)`));
        
        // Организации (с заглавными буквами)
        const orgs = text.match(/[А-ЯЁ][а-яё]+\s+[А-ЯЁ][а-яё]+(?=\s+(университет|институт|компания|организация))/gi);
        if (orgs) entities.push(...orgs.map(o => `${o} (ORG)`));
        
        // Даты
        const dates = text.match(/(\d{1,2}\s?(январ|феврал|март|апрел|май|июн|июл|август|сентябр|октябр|ноябр|декабр)[а-я]*\s?\d{0,4})/i);
        if (dates) entities.push(...dates.map(d => `${d} (DATE)`));
        
        return entities.length > 0 ? entities : ['Не обнаружены'];
    }

    function detectTopics(text) {
        const topics = [];
        const keywords = {
            'технологии': ['технологи', 'гаджет', 'инновац', 'IT', 'программир'],
            'образование': ['университет', 'образован', 'студент', 'преподаватель'],
            'наука': ['наук', 'исследован', 'открыт', 'учен']
        };
        
        for (const [topic, words] of Object.entries(keywords)) {
            if (words.some(word => text.toLowerCase().includes(word))) {
                topics.push(topic);
            }
        }
        
        return topics.length > 0 ? topics : ['Общая тематика'];
    }

    function analyzeReadability(text) {
        const words = text.split(/\s+/);
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const syllables = text.match(/[аеёиоуыэюя]/gi)?.length || 1;
        
        const wordsPerSentence = words.length / sentences.length;
        const syllablesPerWord = syllables / words.length;
        
        // Формула удобочитаемости
        return Math.max(0, Math.min(100, 206.835 - 1.3 * wordsPerSentence - 60.1 * syllablesPerWord));
    }

    // ==================== 4. Меню вывода результатов ====================
    function renderResults(results) {
        demoResult.innerHTML = `
            <div class="results-container">
                <div class="results-menu">
                    <div class="export-group">
                        <button class="export-btn" data-format="text" title="Текстовый формат">
                            <i class="icon-download"></i> TXT
                        </button>
                        <button class="export-btn" data-format="json" title="JSON формат">
                            <i class="icon-download"></i> JSON
                        </button>
                        <button class="export-btn" data-format="csv" title="CSV формат">
                            <i class="icon-download"></i> CSV
                        </button>
                    </div>
                    
                    <div class="filter-group">
                        <select class="filter-select">
                            <option value="all">Все результаты</option>
                            <option value="stats">Статистика</option>
                            <option value="words">Частотные слова</option>
                            <option value="sentiment">Тональность</option>
                            <option value="entities">Сущности</option>
                        </select>
                    </div>
                    
                    <button class="visualize-btn">
                        <i class="icon-chart"></i> Визуализировать
                    </button>
                </div>
                
                <div class="results-content">
                    <div class="result-section" data-type="stats">
                        <h3><i class="icon-stats"></i> Основная статистика</h3>
                        <div class="stats-grid">
                            <div class="stat-item">
                                <div class="stat-value">${results.wordCount}</div>
                                <div class="stat-label">Слов</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-value">${Math.round(results.readability)}%</div>
                                <div class="stat-label">Удобочитаемость</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="result-section" data-type="words">
                        <h3><i class="icon-words"></i> Частотные слова</h3>
                        <div class="word-cloud">
                            ${results.frequentWords.map(word => {
                                const size = 14 + Math.min(26, parseInt(word.match(/\d+/)[0]));
                                return `<span style="font-size: ${size}px">${word.replace(/\(\d+\)/, '')}</span>`;
                            }).join('')}
                        </div>
                    </div>
                    
                    <div class="result-section" data-type="sentiment">
                        <h3><i class="icon-sentiment"></i> Тональность текста</h3>
                        <div class="sentiment-display">
                            <div class="sentiment-type ${results.sentiment.type}">
                                ${results.sentiment.type.toUpperCase()}
                                <div class="sentiment-score">${results.sentiment.score > 0 ? '+' : ''}${results.sentiment.score}</div>
                            </div>
                            <div class="sentiment-meter">
                                <div class="meter-bar" style="width: ${50 + results.sentiment.score/2}%"></div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="result-section" data-type="entities">
                        <h3><i class="icon-entities"></i> Распознанные сущности</h3>
                        <ul class="entities-list">
                            ${results.entities.map(e => `<li>${e}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `;
        
        initResultsMenu();
    }

    function initResultsMenu() {
        // Экспорт результатов
        document.querySelectorAll('.export-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const format = this.getAttribute('data-format');
                exportResults(format);
            });
        });
        
        // Фильтрация результатов
        const filterSelect = document.querySelector('.filter-select');
        if (filterSelect) {
            filterSelect.addEventListener('change', function() {
                filterResults(this.value);
            });
        }
        
        // Визуализация
        const visualizeBtn = document.querySelector('.visualize-btn');
        if (visualizeBtn) {
            visualizeBtn.addEventListener('click', function() {
                visualizeResults();
            });
        }
    }

    function exportResults(format) {
        const text = demoTextarea.value.trim();
        const results = {
            text: text,
            wordCount: text.split(/\s+/).length,
            frequentWords: getFrequentWords(text),
            sentiment: analyzeSentiment(text),
            entities: detectEntities(text),
            topics: detectTopics(text),
            readability: analyzeReadability(text)
        };
        
        let exportData, mimeType, fileExt;
        
        switch(format) {
            case 'text':
                fileExt = 'txt';
                mimeType = 'text/plain';
                exportData = `NLP АНАЛИЗ ТЕКСТА\n\n` +
                             `Текст (${text.length} символов):\n${text.substring(0, 200)}${text.length > 200 ? '...' : ''}\n\n` +
                             `ОСНОВНЫЕ МЕТРИКИ:\n` +
                             `• Слов: ${results.wordCount}\n` +
                             `• Удобочитаемость: ${Math.round(results.readability)}%\n` +
                             `• Тональность: ${results.sentiment.type} (${results.sentiment.score > 0 ? '+' : ''}${results.sentiment.score})\n\n` +
                             `ЧАСТОТНЫЕ СЛОВА:\n${results.frequentWords.join('\n')}\n\n` +
                             `СУЩНОСТИ:\n${results.entities.join('\n')}\n\n` +
                             `ТЕМЫ:\n${results.topics.join(', ')}`;
                break;
                
            case 'json':
                fileExt = 'json';
                mimeType = 'application/json';
                exportData = JSON.stringify(results, null, 2);
                break;
                
            case 'csv':
                fileExt = 'csv';
                mimeType = 'text/csv';
                exportData = `Параметр;Значение\n` +
                             `Текст;"${text.substring(0, 100).replace(/"/g, '""')}${text.length > 100 ? '...' : ''}"\n` +
                             `Количество слов;${results.wordCount}\n` +
                             `Удобочитаемость;${Math.round(results.readability)}%\n` +
                             `Тональность;${results.sentiment.type}\n` +
                             `Оценка тональности;${results.sentiment.score}\n` +
                             `Частотные слова;"${results.frequentWords.join(', ')}"\n` +
                             `Сущности;"${results.entities.join(', ')}"\n` +
                             `Темы;"${results.topics.join(', ')}"`;
                break;
        }
        
        // Создаем и скачиваем файл
        const blob = new Blob([exportData], { type: `${mimeType};charset=utf-8;` });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `nlp-analysis-${new Date().toISOString().slice(0, 10)}.${fileExt}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showNotification(`Результаты экспортированы в ${format.toUpperCase()}`, 'success');
    }

    function filterResults(filter) {
        document.querySelectorAll('.result-section').forEach(section => {
            section.style.display = filter === 'all' || section.getAttribute('data-type').includes(filter) ? 'block' : 'none';
        });
    }

    function visualizeResults() {
        // Анимация облака слов
        const words = document.querySelectorAll('.word-cloud span');
        words.forEach((word, i) => {
            word.style.transition = 'all 0.5s';
            word.style.transform = `rotate(${Math.random() * 10 - 5}deg)`;
            word.style.opacity = '1';
        });
        
        // Анимация шкалы тональности
        const meterBar = document.querySelector('.meter-bar');
        if (meterBar) {
            const targetWidth = meterBar.style.width;
            meterBar.style.width = '0';
            setTimeout(() => {
                meterBar.style.width = targetWidth;
            }, 100);
        }
        
        showNotification('Данные визуализированы!', 'success');
    }

    // ==================== 5. Обратная связь ====================
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            
            if (!data.name || !data.email || !data.message) {
                showNotification('Пожалуйста, заполните все поля', 'error');
                return;
            }
            
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
                showNotification('Введите корректный email', 'error');
                return;
            }
            
            // В реальном проекте здесь был бы AJAX-запрос
            console.log('Форма отправлена:', data);
            showNotification('Сообщение отправлено! Мы скоро ответим', 'success');
            this.reset();
        });
    }

    // ==================== 6. Вспомогательные функции ====================
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="icon-${type === 'success' ? 'check' : 'warning'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }

    // ==================== 7. Адаптивное меню ====================
    const menuToggle = document.createElement('button');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '<span></span><span></span><span></span>';
    
    const header = document.querySelector('header .container');
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

    // ==================== 8. Плавная прокрутка ====================
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
                
                // Обновляем URL
                history.pushState(null, null, targetId);
            }
        });
    });
});

// ==================== 9. Анимация загрузки ====================
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Анимация элементов с задержкой
    document.querySelectorAll('.animate-on-load').forEach((el, i) => {
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 100 * i);
    });
});