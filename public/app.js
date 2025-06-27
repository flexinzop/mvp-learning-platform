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
        summaryStats: {
            cards_reviewed: 342,
            consecutive_days: 7,
            accuracy_rate: 73,
            pending_cards: 15
        },
        
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
                    { question: "As concessões de serviços públicos podem ser classificadas apenas como concessão comum e concessão especial (PPP).", answer: "❌ Errado: Além das concessões comuns e especiais (PPPs), há regimes jurídicos específicos para setores como transporte aéreo, radiodifusão, portos e telecomunicações, conforme normas setoriais aplicáveis." },
                    { question: "A desconsideração da personalidade jurídica pode ser aplicada caso ela seja um obstáculo ao ressarcimento de prejuízos ambientais.", answer: "✅ Correto. Nos termos do artigo 4º da Lei nº 9.605/1998, a desconsideração da personalidade jurídica é possível quando esta representar um obstáculo ao ressarcimento de prejuízos causados à qualidade do meio ambiente." },
                    { question: "Como funcionam as ordens e classes no sistema de numeração decimal?", answer: "No sistema de numeração decimal, cada algarismo representa uma ordem, começando da direita para a esquerda, e a cada três ordens temos uma classe. Por exemplo:Unidade de milhar, dezena de milhar, centena de milhar formam a classe dos Milhares.Unidade de milhão, dezena de milhão, centena de milhão formam a classe dos Milhões." }
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

        async initCharts() {
            // Load summary stats
            await this.loadSummaryStats();
            
            // Initialize Chart.js charts
            await this.initPieChart();
            await this.initBarChart();
        },

        async loadSummaryStats() {
            try {
                const response = await fetch('/api/charts/summary-stats');
                const data = await response.json();
                this.summaryStats = data;
            } catch (error) {
                console.error('Error loading summary stats:', error);
            }
        },

        async initPieChart() {
            try {
                const response = await fetch('/api/charts/pie-chart');
                const chartConfig = await response.json();
                
                const chartContainer = document.getElementById('courseCompletionChart');
                if (!chartContainer) return;
                
                // Clear container and create canvas with appropriate height
                chartContainer.innerHTML = '<canvas id="pieChartCanvas" style="height: 330px !important; max-width: 100%;"></canvas>';
                const canvas = document.getElementById('pieChartCanvas');
                
                if (canvas) {
                    new Chart(canvas, {
                        type: chartConfig.type,
                        data: chartConfig.data,
                        options: {
                            ...chartConfig.options,
                            plugins: {
                                ...chartConfig.options.plugins,
                                tooltip: {
                                    ...chartConfig.options.plugins.tooltip,
                                    callbacks: {
                                        label: function(context) {
                                            return `${context.label}: ${context.parsed}%`;
                                        }
                                    }
                                }
                            }
                        }
                    });
                }
            } catch (error) {
                console.error('Error loading pie chart:', error);
                const chartContainer = document.getElementById('courseCompletionChart');
                if (chartContainer) {
                    chartContainer.innerHTML = '<div class="chart-error">Failed to load chart</div>';
                }
            }
        },

        async initBarChart() {
            try {
                const response = await fetch('/api/charts/bar-chart');
                const chartConfig = await response.json();
                
                const chartContainer = document.getElementById('monthlyAccessChart');
                if (!chartContainer) return;
                
                // Clear container and create canvas with appropriate height
                chartContainer.innerHTML = '<canvas id="barChartCanvas" style="height: 380px !important; max-width: 100%;"></canvas>';
                const canvas = document.getElementById('barChartCanvas');
                
                if (canvas) {
                    new Chart(canvas, {
                        type: chartConfig.type,
                        data: chartConfig.data,
                        options: {
                            ...chartConfig.options,
                            plugins: {
                                ...chartConfig.options.plugins,
                                tooltip: {
                                    ...chartConfig.options.plugins.tooltip,
                                    callbacks: {
                                        label: function(context) {
                                            return `Acessos: ${context.parsed.y}`;
                                        }
                                    }
                                }
                            }
                        }
                    });
                }
            } catch (error) {
                console.error('Error loading bar chart:', error);
                const chartContainer = document.getElementById('monthlyAccessChart');
                if (chartContainer) {
                    chartContainer.innerHTML = '<div class="chart-error">Failed to load chart</div>';
                }
            }
        },

        // Chart.js is now handling all chart rendering
        // Removed HTML fallback functions since Chart.js provides better interactivity
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