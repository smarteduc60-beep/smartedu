import React from 'react';

interface FutureEngineerGameProps {
  config: any;
}

const FutureEngineerGame: React.FC<FutureEngineerGameProps> = ({ config }) => {
  const gameHtml = `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>🏗️ مهندسو المستقبل - مغامرة الهندسة</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
            body {
                background: linear-gradient(135deg, #2c3e50, #3498db, #1abc9c);
                min-height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 20px;
            }
            .game-container {
                width: 100%;
                max-width: 1400px;
                background: rgba(255, 255, 255, 0.95);
                border-radius: 50px;
                box-shadow: 0 30px 80px rgba(0, 0, 0, 0.4);
                overflow: hidden;
                backdrop-filter: blur(10px);
                border: 5px solid #f1c40f;
            }
            .start-screen {
                text-align: center;
                padding: 60px 40px;
                background: linear-gradient(135deg, #667eea, #764ba2, #1abc9c);
                color: white;
            }
            .start-screen h1 {
                font-size: 4em;
                margin-bottom: 20px;
                text-shadow: 3px 3px 6px rgba(0,0,0,0.3);
                animation: titleFloat 3s ease-in-out infinite;
            }
            @keyframes titleFloat {
                0%,100%{transform:translateY(0);}
                50%{transform:translateY(-10px);}
            }
            .engineer-badge {
                display: flex;
                justify-content: center;
                gap: 30px;
                margin: 40px 0;
                flex-wrap: wrap;
            }
            .badge-item {
                background: rgba(255,255,255,0.2);
                padding: 20px;
                border-radius: 30px;
                backdrop-filter: blur(10px);
                border: 2px solid rgba(255,255,255,0.3);
                width: 200px;
            }
            .badge-icon {
                font-size: 3em;
                margin-bottom: 10px;
            }
            .badge-title {
                font-size: 1.3em;
                font-weight: bold;
            }
            .start-btn {
                background: #f1c40f;
                color: #2c3e50;
                border: none;
                padding: 25px 80px;
                font-size: 2em;
                border-radius: 80px;
                cursor: pointer;
                font-weight: bold;
                margin-top: 40px;
                box-shadow: 0 20px 40px rgba(241,196,15,0.4);
                transition: all 0.3s;
                animation: pulse 2s infinite;
            }
            @keyframes pulse {
                0%,100%{transform:scale(1);}
                50%{transform:scale(1.05);}
            }
            .start-btn:hover {
                transform: scale(1.1);
                box-shadow: 0 30px 60px rgba(241,196,15,0.6);
            }
            .progress-header {
                background: linear-gradient(45deg, #2c3e50, #3498db);
                padding: 20px;
                color: white;
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-wrap: wrap;
                gap: 20px;
            }
            .engineer-level {
                display: flex;
                align-items: center;
                gap: 15px;
                background: rgba(255,255,255,0.1);
                padding: 10px 25px;
                border-radius: 50px;
            }
            .level-badge {
                font-size: 2em;
            }
            .level-info {
                font-size: 1.2em;
            }
            .stats-container {
                display: flex;
                gap: 25px;
            }
            .stat-box {
                background: rgba(255,255,255,0.15);
                padding: 10px 25px;
                border-radius: 50px;
                text-align: center;
            }
            .stat-value {
                font-size: 1.8em;
                font-weight: bold;
                color: #f1c40f;
            }
            .mastery-bar {
                flex-grow: 1;
                height: 20px;
                background: rgba(255,255,255,0.2);
                border-radius: 10px;
                overflow: hidden;
            }
            .mastery-fill {
                height: 100%;
                background: linear-gradient(90deg, #f1c40f, #e74c3c);
                width: 0%;
                transition: width 0.5s;
            }
            .game-area {
                padding: 30px;
                background: #f8f9fa;
            }
            .chapters-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 25px;
                margin-bottom: 30px;
            }
            .chapter-card {
                background: white;
                border-radius: 30px;
                padding: 25px;
                cursor: pointer;
                transition: all 0.3s;
                border: 3px solid transparent;
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                text-align: center;
            }
            .chapter-card:hover {
                transform: translateY(-10px);
                box-shadow: 0 20px 40px rgba(0,0,0,0.2);
            }
            .chapter-card.active {
                border-color: #f1c40f;
                background: #fff9e6;
            }
            .chapter-card.completed {
                border-color: #27ae60;
                background: #d4edda;
            }
            .chapter-icon {
                font-size: 4em;
                margin-bottom: 15px;
            }
            .chapter-title {
                font-size: 1.5em;
                font-weight: bold;
                color: #2c3e50;
                margin-bottom: 10px;
            }
            .chapter-desc {
                color: #7f8c8d;
                margin-bottom: 15px;
            }
            .progress-dots {
                display: flex;
                justify-content: center;
                gap: 8px;
            }
            .dot {
                width: 12px;
                height: 12px;
                background: #ecf0f1;
                border-radius: 50%;
            }
            .dot.completed {
                background: #27ae60;
            }
            .dot.active {
                background: #f1c40f;
                transform: scale(1.2);
            }
            .canvas-area {
                background: white;
                border-radius: 30px;
                padding: 30px;
                margin: 20px 0;
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            }
            .question-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
            }
            .question-title {
                font-size: 1.8em;
                color: #2c3e50;
                font-weight: bold;
            }
            .difficulty {
                background: #3498db;
                color: white;
                padding: 8px 20px;
                border-radius: 30px;
            }
            .geometry-canvas {
                width: 100%;
                height: 400px;
                background: #ecf0f1;
                border-radius: 20px;
                position: relative;
                margin: 30px 0;
                overflow: hidden;
                border: 3px solid #bdc3c7;
            }
            .tools-panel {
                display: flex;
                gap: 15px;
                flex-wrap: wrap;
                margin: 20px 0;
                padding: 20px;
                background: #ecf0f1;
                border-radius: 20px;
            }
            .tool-btn {
                background: white;
                border: none;
                padding: 15px 25px;
                border-radius: 50px;
                cursor: pointer;
                font-size: 1.1em;
                display: flex;
                align-items: center;
                gap: 10px;
                transition: all 0.3s;
                border: 2px solid #bdc3c7;
            }
            .tool-btn:hover {
                transform: translateY(-3px);
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            }
            .tool-btn.active {
                background: #3498db;
                color: white;
                border-color: #2980b9;
            }
            .tool-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
            .line {
                position: absolute;
                height: 4px;
                background: #2c3e50;
                transform-origin: left center;
                pointer-events: all;
                cursor: pointer;
            }
            .line:hover {
                background: #e74c3c;
                height: 6px;
                box-shadow: 0 0 10px rgba(231,76,60,0.5);
            }
            .point {
                position: absolute;
                width: 16px;
                height: 16px;
                background: #e74c3c;
                border-radius: 50%;
                transform: translate(-50%, -50%);
                cursor: pointer;
                border: 3px solid white;
                box-shadow: 0 0 10px rgba(0,0,0,0.3);
            }
            .point:hover {
                transform: translate(-50%, -50%) scale(1.3);
                background: #f1c40f;
            }
            .midpoint {
                background: #27ae60;
            }
            .ruler {
                position: absolute;
                height: 2px;
                background: #f1c40f;
                transform-origin: left center;
                pointer-events: none;
                border: 1px dashed #e67e22;
            }
            .angle-indicator {
                position: absolute;
                width: 50px;
                height: 50px;
                border: 3px solid #e74c3c;
                border-radius: 50%;
                border-top-color: transparent;
                border-right-color: transparent;
                transform: rotate(45deg);
            }
            .options-area {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 15px;
                margin: 20px 0;
            }
            .option-card {
                background: white;
                border: 3px solid #3498db;
                padding: 20px;
                border-radius: 20px;
                cursor: pointer;
                transition: all 0.3s;
                text-align: center;
                font-size: 1.3em;
            }
            .option-card:hover {
                transform: translateY(-5px);
                background: #3498db;
                color: white;
            }
            .option-card.selected {
                background: #2ecc71;
                color: white;
                border-color: #27ae60;
            }
            .check-btn {
                background: linear-gradient(45deg, #2ecc71, #27ae60);
                color: white;
                border: none;
                padding: 20px 60px;
                font-size: 1.5em;
                border-radius: 50px;
                cursor: pointer;
                font-weight: bold;
                margin: 20px auto;
                display: block;
                transition: all 0.3s;
            }
            .check-btn:hover:not(:disabled) {
                transform: scale(1.05);
                box-shadow: 0 10px 30px rgba(46,204,113,0.4);
            }
            .check-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
            .feedback {
                margin-top: 30px;
                padding: 25px;
                border-radius: 20px;
                display: none;
                text-align: center;
                font-size: 1.5em;
                animation: slideUp 0.5s;
            }
            @keyframes slideUp {
                from { transform: translateY(20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            .feedback.correct {
                background: #d4edda;
                color: #155724;
                border: 3px solid #c3e6cb;
                display: block;
            }
            .feedback.incorrect {
                background: #f8d7da;
                color: #721c24;
                border: 3px solid #f5c6cb;
                display: block;
            }
            .hint-box {
                background: #fff3cd;
                border: 3px solid #ffeeba;
                padding: 20px;
                border-radius: 15px;
                margin: 20px 0;
                color: #856404;
                font-size: 1.2em;
            }
            .end-screen {
                text-align: center;
                padding: 60px 40px;
                background: linear-gradient(135deg, #2c3e50, #3498db);
                color: white;
                display: none;
            }
            .diploma {
                background: white;
                color: #2c3e50;
                padding: 40px;
                border-radius: 50px;
                max-width: 600px;
                margin: 40px auto;
                box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            }
            .diploma h2 {
                font-size: 3em;
                color: #f1c40f;
                margin-bottom: 20px;
            }
            .seal {
                font-size: 5em;
                margin: 20px 0;
                animation: spin 4s infinite;
            }
            @keyframes spin {
                0%,100%{transform:rotate(0deg);}
                50%{transform:rotate(10deg);}
            }
            .restart-btn {
                background: #f1c40f;
                color: #2c3e50;
                border: none;
                padding: 20px 60px;
                font-size: 1.5em;
                border-radius: 50px;
                cursor: pointer;
                font-weight: bold;
                margin-top: 30px;
            }
            @media (max-width: 768px) {
                .chapters-grid {
                    grid-template-columns: 1fr;
                }
                .options-area {
                    grid-template-columns: 1fr;
                }
            }
        </style>
    </head>
    <body>
        <div class="game-container">
            <div id="startScreen" class="start-screen">
                <h1>🏗️ مهندسو المستقبل</h1>
                <p style="font-size: 1.8em;">مغامرة الهندسة للتلاميذ الأولى متوسط</p>
                <div class="engineer-badge">
                    <div class="badge-item">
                        <div class="badge-icon">📏</div>
                        <div class="badge-title">توازي مستقيمين</div>
                    </div>
                    <div class="badge-item">
                        <div class="badge-icon">✝️</div>
                        <div class="badge-title">تقاطع وتعامد</div>
                    </div>
                    <div class="badge-item">
                        <div class="badge-icon">📐</div>
                        <div class="badge-title">نقل طول ومنتصف</div>
                    </div>
                </div>
                <div style="font-size: 4em; margin: 40px 0;">
                    📐 📏 ✂️
                </div>
                <button class="start-btn" onclick="startGame()">🚀 ابدأ المشوار الهندسي</button>
            </div>
            <div id="gameScreen" style="display: none;">
                <div class="progress-header">
                    <div class="engineer-level">
                        <span class="level-badge" id="engineerEmoji">👷</span>
                        <div class="level-info">
                            <div id="engineerLevel">مهندس مبتدئ</div>
                            <div style="font-size: 0.9em;" id="chapterName">المستوى 1/3</div>
                        </div>
                    </div>
                    <div class="stats-container">
                        <div class="stat-box">
                            <div class="stat-value" id="score">0</div>
                            <div>نقاط</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-value" id="correctCount">0</div>
                            <div>إجابات صحيحة</div>
                        </div>
                    </div>
                    <div class="mastery-bar">
                        <div class="mastery-fill" id="masteryFill"></div>
                    </div>
                </div>
                <div class="game-area">
                    <div class="chapters-grid" id="chaptersGrid"></div>
                    <div class="canvas-area" id="canvasArea">
                        <div class="question-header">
                            <div class="question-title" id="questionText"></div>
                            <div class="difficulty" id="difficulty">سهل</div>
                        </div>
                        <div class="geometry-canvas" id="geometryCanvas" onclick="handleCanvasClick(event)">
                            <svg width="100%" height="100%" style="position: absolute; top:0; left:0;"></svg>
                        </div>
                        <div class="tools-panel" id="toolsPanel"></div>
                        <div id="optionsContainer" class="options-area"></div>
                        <div class="hint-box" id="hintBox"></div>
                        <button class="check-btn" id="checkBtn" onclick="checkAnswer()">✅ تحقق من الإجابة</button>
                        <div class="feedback" id="feedback"></div>
                    </div>
                </div>
            </div>
            <div id="endScreen" class="end-screen">
                <h1>🎉 تهانينا!</h1>
                <p style="font-size: 1.8em;">لقد أصبحت مهندساً معتمداً</p>
                <div class="diploma">
                    <h2>شهادة تقدير</h2>
                    <div class="seal">🏅</div>
                    <p style="font-size: 1.5em; margin: 20px 0;" id="finalScore"></p>
                    <p>مهندس هندسة مستقيمية</p>
                    <p style="color: #7f8c8d;">بتاريخ: <span id="currentDate"></span></p>
                </div>
                <button class="restart-btn" onclick="restartGame()">🔄 تحدٍ جديد</button>
            </div>
        </div>
        <script>
            const chapters = ${JSON.stringify(config.chapters || [])};
            let currentChapter = 0;
            let currentQuestion = 0;
            let score = 0;
            let correctCount = 0;
            let totalQuestions = chapters.reduce((acc, ch) => acc + ch.questions.length, 0);
            let completedChapters = [];
            let selectedOption = null;
            let drawingMode = null;
            let tempPoints = [];
            let canvasElements = [];

            function startGame() {
                document.getElementById('startScreen').style.display = 'none';
                document.getElementById('gameScreen').style.display = 'block';
                resetGame();
                renderChapters();
                loadChapter(0);
                updateProgress();
            }

            function renderChapters() {
                const grid = document.getElementById('chaptersGrid');
                grid.innerHTML = '';
                chapters.forEach((ch, index) => {
                    const card = document.createElement('div');
                    card.className = \`chapter-card \${index === currentChapter ? 'active' : ''} \${completedChapters.includes(index) ? 'completed' : ''}\`;
                    card.onclick = () => selectChapter(index);
                    let dotsHtml = '';
                    for (let i = 0; i < ch.questions.length; i++) {
                        let dotClass = 'dot';
                        if (i < currentQuestion && index === currentChapter) dotClass += ' completed';
                        if (i === currentQuestion && index === currentChapter) dotClass += ' active';
                        if (completedChapters.includes(index)) dotClass += ' completed';
                        dotsHtml += \`<span class="\${dotClass}"></span>\`;
                    }
                    card.innerHTML = \`
                        <div class="chapter-icon">\${ch.icon}</div>
                        <div class="chapter-title">\${ch.title}</div>
                        <div class="chapter-desc">\${ch.desc}</div>
                        <div class="progress-dots">\${dotsHtml}</div>
                    \`;
                    grid.appendChild(card);
                });
            }

            function selectChapter(index) {
                if (index <= currentChapter || completedChapters.includes(index)) {
                    currentChapter = index;
                    currentQuestion = 0;
                    renderChapters();
                    loadChapter(index);
                }
            }

            function loadChapter(chapterIndex) {
                const chapter = chapters[chapterIndex];
                document.getElementById('chapterName').textContent = \`المستوى \${chapterIndex + 1}/3\`;
                document.getElementById('difficulty').textContent = chapter.difficulty === 'beginner' ? 'سهل' : chapter.difficulty === 'intermediate' ? 'متوسط' : 'متقدم';
                loadQuestion();
            }

            function loadQuestion() {
                const chapter = chapters[currentChapter];
                const question = chapter.questions[currentQuestion];
                document.getElementById('questionText').textContent = question.text;
                document.getElementById('hintBox').textContent = \`💡 \${question.hint}\`;
                canvasElements = [];
                if (question.elements) {
                    canvasElements = [...question.elements];
                }
                drawCanvas();
                if (question.options && question.type !== 'interactive') {
                    let optionsHtml = '';
                    question.options.forEach(opt => {
                        optionsHtml += \`<div class="option-card" onclick="selectOption(this, '\${opt}')">\${opt}</div>\`;
                    });
                    document.getElementById('optionsContainer').innerHTML = optionsHtml;
                } else {
                    document.getElementById('optionsContainer').innerHTML = '';
                }
                if (question.type === 'interactive') {
                    setupInteractiveTools(question);
                } else {
                    document.getElementById('toolsPanel').innerHTML = '';
                }
                document.getElementById('feedback').style.display = 'none';
                document.getElementById('checkBtn').disabled = false;
                selectedOption = null;
            }

            function drawCanvas() {
                const canvas = document.getElementById('geometryCanvas');
                let svg = canvas.querySelector('svg');
                if (!svg) {
                    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                    svg.setAttribute('width', '100%');
                    svg.setAttribute('height', '100%');
                    svg.style.position = 'absolute';
                    canvas.appendChild(svg);
                }
                svg.innerHTML = '';
                canvasElements.filter(el => el.type === 'line').forEach(line => {
                    const lineEl = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    lineEl.setAttribute('x1', line.x1);
                    lineEl.setAttribute('y1', line.y1);
                    lineEl.setAttribute('x2', line.x2);
                    lineEl.setAttribute('y2', line.y2);
                    lineEl.setAttribute('stroke', line.color || '#2c3e50');
                    lineEl.setAttribute('stroke-width', line.color === 'red' ? '4' : '3');
                    if (line.name) lineEl.setAttribute('data-name', line.name);
                    svg.appendChild(lineEl);
                    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    text.setAttribute('x', (line.x1 + line.x2) / 2 + 10);
                    text.setAttribute('y', (line.y1 + line.y2) / 2 - 10);
                    text.setAttribute('fill', '#2c3e50');
                    text.setAttribute('font-size', '16');
                    text.setAttribute('font-weight', 'bold');
                    text.textContent = line.name || '';
                    svg.appendChild(text);
                });
                canvasElements.filter(el => el.type === 'point').forEach(point => {
                    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    circle.setAttribute('cx', point.x);
                    circle.setAttribute('cy', point.y);
                    circle.setAttribute('r', '8');
                    circle.setAttribute('fill', point.id === 'M' ? '#27ae60' : '#e74c3c');
                    circle.setAttribute('stroke', 'white');
                    circle.setAttribute('stroke-width', '2');
                    if (point.name) circle.setAttribute('data-name', point.name);
                    svg.appendChild(circle);
                    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    text.setAttribute('x', point.x + 15);
                    text.setAttribute('y', point.y - 15);
                    text.setAttribute('fill', '#2c3e50');
                    text.setAttribute('font-size', '16');
                    text.setAttribute('font-weight', 'bold');
                    text.textContent = point.name || '';
                    svg.appendChild(text);
                });
            }
        </script>
    </body>
    </html>
  `;

  return (
    <iframe
      srcDoc={gameHtml}
      style={{ width: '100%', height: '90vh', border: 'none', borderRadius: '15px' }}
      title="لعبة مهندسو المستقبل"
      sandbox="allow-scripts allow-same-origin"
    />
  );
};

export default FutureEngineerGame;