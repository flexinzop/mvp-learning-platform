// Alpine.js data
function appData() {
    return {
        sidebarOpen: false,
        showModal: false,
        currentCourse: null,
        flashcards: [],
        currentQuestionIndex: 0,
        cardFlipped: false,

        // novo estado para o welcome modal
        showWelcome: true,
        flashcardsCount: 15,      // pode vir de uma fetch / API
        consecutiveDays: 7,       // você que popula dinamicamente
        cardsReviewed: 342,
        currentPage: 'dashboard', // Track current page
        
        // Add mobile detection
        isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
        isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent),
        
        // Initialize mobile-specific behaviors
        init() {
            this.$nextTick(() => {
                this.handleMobileBehaviors();
            });
        },
        
        handleMobileBehaviors() {
            // Fix for iOS Safari viewport height
            if (this.isIOS) {
                const setVH = () => {
                    const vh = window.innerHeight * 0.01;
                    document.documentElement.style.setProperty('--vh', `${vh}px`);
                };
                
                setVH();
                window.addEventListener('resize', setVH);
                window.addEventListener('orientationchange', setVH);
            }
            
            // Close sidebar when clicking outside on mobile
            if (this.isMobile) {
                document.addEventListener('click', (e) => {
                    if (this.sidebarOpen && 
                        !e.target.closest('.sidebar') && 
                        !e.target.closest('.mobile-menu-toggle')) {
                        this.sidebarOpen = false;
                    }
                });
            }

            // Handle responsive progress bars
            this.handleResponsiveProgressBars();
        },
        
        handleResponsiveProgressBars() {
            const progressBars = document.querySelectorAll('.progress-bar-vertical .progress-fill');
            
            const updateProgressBars = () => {
                const isMobile = window.innerWidth <= 768;
                
                progressBars.forEach(bar => {
                    const currentHeight = bar.style.height;
                    const currentWidth = bar.style.width;
                    
                    if (isMobile) {
                        // Convert to horizontal (width-based)
                        if (currentHeight && !currentWidth) {
                            bar.style.width = currentHeight;
                            bar.style.height = '100%';
                            bar.style.bottom = 'auto';
                            bar.style.left = '0';
                        }
                    } else {
                        // Convert to vertical (height-based)
                        if (currentWidth && !currentHeight) {
                            bar.style.height = currentWidth;
                            bar.style.width = '100%';
                            bar.style.left = 'auto';
                            bar.style.bottom = '0';
                        }
                    }
                });
            };

            // Initial update
            updateProgressBars();
            
            // Update on resize
            window.addEventListener('resize', updateProgressBars);
        },
        
        get currentFlashcard() {
            return this.flashcards[this.currentQuestionIndex];
        },
        
        openModal(courseId, courseTitle) {
            this.currentCourse = { id: courseId, title: courseTitle };
            this.loadFlashcards(courseId);
            this.showModal = true;
            this.currentQuestionIndex = 0;
            this.cardFlipped = false;
            document.body.style.overflow = 'hidden';
        },
        
        closeModal() {
            this.showModal = false;
            this.currentCourse = null;
            this.flashcards = [];
            this.cardFlipped = false;
            document.body.style.overflow = 'auto';
        },
        
        loadFlashcards(courseId) {
            // Simulate API call
            const flashcardData = {
                1: [
                    { question: "O que se exige na compreensão textual?", answer: "Na compreensão textual, exige-se a capacidade de identificar informações explícitas no texto." },
                    { question: "O que se exige na interpretação textual?", answer: "Na interpretação textual, exige-se a depreensão de conhecimentos extraídos a partir dos elementos presentes no texto, utilizando uma série de procedimentos analíticos." },
                    { question: "Quais são os tipos de texto?", answer: "Um texto pode ser verbal ou não verbal. O texto verbal tem duas manifestações: oralidade e escrita. Na escrita, predomina a prosa e o poema. No texto não verbal, abrangem-se conhecimentos sobre linguagem corporal, cores, formas gráficas, etc. Se unir texto verbal e não verbal, temos um texto misto." }
                ],
                2: [
                    { question: "É possível a execução da pena restritiva de direitos antes do trânsito em julgado da condenação.", answer: "❌ Errado: Não é possível a execução da pena restritiva de direitos antes do trânsito em julgado da condenação. STJ. 3ª Seção. EREsp 1.619.087-SC, Rel. para acórdão Min. Jorge Mussi, julgado em 14/6/2017 (Info 609)." },
                    { question: "O que é a interpretação jurídica ou hermenêutica clássica?", answer: "Errado: ❌ A interpretação jurídica ou hermenêutica clássica encara a Constituição como as demais leis, utilizando elementos tradicionais como gramática, lógica, sistemática e histórica para descobrir o verdadeiro significado e sentido da norma." },
                    { question: "Todas as entidades civis ou comerciais sob controle acionário do Estado são consideradas empresas estatais.", answer: "✅ Certo. O conceito de empresas estatais abrange empresas públicas, sociedades de economia mista, suas subsidiárias e demais sociedades controladas pelo Estado." }
                ],
                3: [
                    { question: "What is the OSI Model?", answer: "The OSI (Open Systems Interconnection) model is a conceptual framework that describes network communication in seven layers." },
                    { question: "What is TCP/IP?", answer: "TCP/IP is a suite of communication protocols used to interconnect network devices on the internet and private networks." },
                    { question: "What is DNS?", answer: "DNS (Domain Name System) is a hierarchical naming system that translates human-readable domain names into IP addresses." }
                ]
            };
            
            this.flashcards = flashcardData[courseId] || [];
        },
        
        flipCard() {
            this.cardFlipped = !this.cardFlipped;
        },
        
        nextCard() {
            if (this.currentQuestionIndex < this.flashcards.length - 1) {
                this.currentQuestionIndex++;
                this.cardFlipped = false;
            }
        },
        
        previousCard() {
            if (this.currentQuestionIndex > 0) {
                this.currentQuestionIndex--;
                this.cardFlipped = false;
            }
        },

        startReview() {
            // Start review with the first available course (or a default course)
            // You can modify this to use a specific course or get from user preferences
            const defaultCourseId = 1;
            const defaultCourseTitle = "Agente Administrativo da Polícia Civil do Distrito Federal - PCDF";
            
            this.openModal(defaultCourseId, defaultCourseTitle);
        },

        goToFlashcards() {
            // Navigate to flashcards page
            this.currentPage = 'flashcards';
            this.sidebarOpen = false; // Close sidebar on mobile
            
            // Don't auto-trigger review - let user choose from course grid
            // The course grid will load via HTMX and users can click on courses
        },

        goToDashboard() {
            this.currentPage = 'dashboard';
            this.sidebarOpen = false;
        },

        goToStatistics() {
            this.currentPage = 'statistics';
            this.sidebarOpen = false;
            
            // Initialize charts after page transition
            this.$nextTick(() => {
                this.initCharts();
            });
        },

        initCharts() {
            // Course Completion Pie Chart
            this.initPieChart();
            
            // Monthly Access Bar Chart
            this.initBarChart();
        },

        initPieChart() {
            const canvas = document.getElementById('courseCompletionChart');
            if (!canvas) return;
            
            const ctx = canvas.getContext('2d');
            const data = [
                { label: 'PCDF', value: 75, color: '#FF6B6B' },
                { label: 'Delegado PF', value: 60, color: '#4ECDC4' },
                { label: 'SEFAZ/GO', value: 85, color: '#45B7D1' }
            ];
            
            const total = data.reduce((sum, item) => sum + item.value, 0);
            let currentAngle = 0;
            
            data.forEach(item => {
                const sliceAngle = (item.value / total) * 2 * Math.PI;
                
                ctx.beginPath();
                ctx.moveTo(150, 150);
                ctx.arc(150, 150, 100, currentAngle, currentAngle + sliceAngle);
                ctx.closePath();
                ctx.fillStyle = item.color;
                ctx.fill();
                
                currentAngle += sliceAngle;
            });
        },

        initBarChart() {
            const canvas = document.getElementById('monthlyAccessChart');
            if (!canvas) return;
            
            const ctx = canvas.getContext('2d');
            const data = [
                { month: 'Jan', access: 45 },
                { month: 'Fev', access: 52 },
                { month: 'Mar', access: 38 },
                { month: 'Abr', access: 67 },
                { month: 'Mai', access: 73 },
                { month: 'Jun', access: 89 },
                { month: 'Jul', access: 95 },
                { month: 'Ago', access: 82 },
                { month: 'Set', access: 78 },
                { month: 'Out', access: 91 },
                { month: 'Nov', access: 104 },
                { month: 'Dez', access: 87 }
            ];
            
            const maxValue = Math.max(...data.map(d => d.access));
            const barWidth = 25;
            const barSpacing = 10;
            const chartHeight = 200;
            const chartWidth = data.length * (barWidth + barSpacing);
            const startX = 50;
            const startY = 250;
            
            // Draw bars
            data.forEach((item, index) => {
                const x = startX + index * (barWidth + barSpacing);
                const height = (item.access / maxValue) * chartHeight;
                const y = startY - height;
                
                // Bar
                ctx.fillStyle = '#3457F3';
                ctx.fillRect(x, y, barWidth, height);
                
                // Value label
                ctx.fillStyle = '#2d3748';
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(item.access, x + barWidth/2, y - 5);
                
                // Month label
                ctx.fillText(item.month, x + barWidth/2, startY + 15);
            });
        }
    };
}

// HTMX event handlers and custom functions
document.addEventListener('DOMContentLoaded', function() {
    // Simulate course data loading
    setTimeout(() => {
        const coursesGrid = document.querySelector('.courses-grid');
        if (coursesGrid && coursesGrid.innerHTML.includes('Loading courses...')) {
            coursesGrid.innerHTML = `
                <div class="course-card" onclick="openCourseModal(1, 'AGENTE ADMINISTRATIVO DA POLÍCIA CIVIL DO DISTRITO FEDERAL')">
                    <img src="/1.png" alt="PCDF" class="course-thumbnail">
                    <div class="course-info">
                        <h3 class="course-title">AGENTE ADMINISTRATIVO DA POLÍCIA CIVIL DO DISTRITO FEDERAL</h3>
                        <p class="course-description">Pacote atualizado com a publicação do edital.</p>
                        <div class="course-progress">
                            <div class="progress-label-small">
                                <span>Progress</span>
                                <span>75%</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="animation: fillProgress 2s ease-in-out 0.5s forwards; width: 75%;"></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="course-card" onclick="openCourseModal(2, 'SEFAZ/GO – Auditor')">
                    <img src="/2.png" alt="SEFAZ" class="course-thumbnail">
                    <div class="course-info">
                        <h3 class="course-title">SEFAZ/GO – Auditor</h3>
                        <p class="course-description">Pacote atualizado com a publicação do edital.</p>
                        <div class="course-progress">
                            <div class="progress-label-small">
                                <span>Progress</span>
                                <span>60%</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="animation: fillProgress 2s ease-in-out 0.8s forwards; width: 60%;"></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="course-card" onclick="openCourseModal(3, 'SEFAZ/GO – Auditor')">
                    <img src="/3.png" alt="SEFAZ" class="course-thumbnail">
                    <div class="course-info">
                        <h3 class="course-title">SEFAZ/GO – Auditor</h3>
                        <p class="course-description">Pacote atualizado com a publicação do edital.</p>
                        <div class="course-progress">
                            <div class="progress-label-small">
                                <span>Progress</span>
                                <span>85%</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="animation: fillProgress 2s ease-in-out 1.1s forwards; width: 85%;"></div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    }, 1000);
    
    // Add CSS animation for progress bars
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fillProgress {
            from { width: 0; }
            to { width: var(--target-width, 0); }
        }
    `;
    document.head.appendChild(style);
});

// Global function to open modal (called from course cards)
function openCourseModal(courseId, courseTitle) {
    // Get Alpine.js component instance
    const appElement = document.querySelector('[x-data*="appData"]');
    if (appElement && appElement._x_dataStack) {
        const alpineData = appElement._x_dataStack[0];
        alpineData.openModal(courseId, courseTitle);
    }
}

// HTMX configuration
document.addEventListener('htmx:configRequest', function(evt) {
    evt.detail.headers['X-Requested-With'] = 'XMLHttpRequest';
});

// Handle HTMX after content load to update progress bars
document.addEventListener('htmx:afterRequest', function(evt) {
    // Update progress bars for newly loaded content
    setTimeout(() => {
        const appElement = document.querySelector('[x-data*="appData"]');
        if (appElement && appElement._x_dataStack) {
            const alpineData = appElement._x_dataStack[0];
            if (alpineData.handleResponsiveProgressBars) {
                alpineData.handleResponsiveProgressBars();
            }
        }
    }, 100);
});

// Handle HTMX errors
document.addEventListener('htmx:responseError', function(evt) {
    console.error('HTMX Error:', evt.detail);
    // Show user-friendly error message
    const target = evt.detail.target;
    if (target) {
        target.innerHTML = '<div class="error-message">Failed to load content. Please try again.</div>';
    }
});

// Keyboard navigation for flashcards
document.addEventListener('keydown', function(e) {
    const appElement = document.querySelector('[x-data*="appData"]');
    if (!appElement || !appElement._x_dataStack) return;
    
    const alpineData = appElement._x_dataStack[0];
    if (!alpineData.showModal) return;
    
    switch(e.key) {
        case 'ArrowLeft':
            e.preventDefault();
            alpineData.previousCard();
            break;
        case 'ArrowRight':
            e.preventDefault();
            alpineData.nextCard();
            break;
        case ' ':
        case 'Enter':
            e.preventDefault();
            alpineData.flipCard();
            break;
    }
});