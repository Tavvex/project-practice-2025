// Активация вкладок
document.addEventListener('DOMContentLoaded', function() {
    // Обработка вкладок
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                // Удаляем активный класс у всех кнопок и контента
                tabBtns.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Добавляем активный класс текущей кнопке и контенту
                this.classList.add('active');
                document.getElementById(tabId).classList.add('active');
            });
        });
    }
    
    // Демо-анализатор
    const analyzeBtn = document.querySelector('.demo-text .btn');
    const demoTextarea = document.querySelector('.demo-text textarea');
    const demoResult = document.querySelector('.demo-result .result-placeholder');
    
    if (analyzeBtn && demoTextarea && demoResult) {
        analyzeBtn.addEventListener('click', function() {
            const text = demoTextarea.value.trim();
            
            if (text.length === 0) {
                demoResult.innerHTML = '<p>Пожалуйста, введите текст для анализа</p>';
                return;
            }
            
            // Здесь должна быть реальная логика анализа
            // Для демонстрации просто покажем пример
            demoResult.innerHTML = `
                <h3>Результаты анализа</h3>
                <div class="analysis-result">
                    <p><strong>Количество слов:</strong> ${text.split(/\s+/).length}</p>
                    <p><strong>Самые частые слова:</strong> пример, анализатор, текст</p>
                    <p><strong>Тональность:</strong> нейтральная</p>
                </div>
                <img src="assets/images/analysis-example.png" alt="Пример анализа">
            `;
        });
    }
});