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
                    { question: "What is SQL Injection?", answer: "SQL injection is a code injection technique that exploits vulnerabilities in an application's software by inserting malicious SQL statements into entry fields." },
                    { question: "What is Cross-Site Scripting (XSS)?", answer: "XSS is a security vulnerability that allows attackers to inject malicious scripts into web pages viewed by other users." },
                    { question: "What is a Buffer Overflow?", answer: "A buffer overflow occurs when a program writes more data to a buffer than it can hold, potentially allowing attackers to execute arbitrary code." }
                ],
                2: [
                    { question: "What is a Firewall?", answer: "A firewall is a network security device that monitors and filters incoming and outgoing network traffic based on predetermined security rules." },
                    { question: "What is Intrusion Detection System (IDS)?", answer: "An IDS is a security tool that monitors network traffic and system activities for malicious activity or policy violations." },
                    { question: "What is Endpoint Detection and Response (EDR)?", answer: "EDR is a cybersecurity solution that monitors endpoint devices to detect and respond to cyber threats." }
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
                <div class="course-card" onclick="openCourseModal(1, 'Web Application Security')">
                    <img src="https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=200&fit=crop" alt="Web Security" class="course-thumbnail">
                    <div class="course-info">
                        <h3 class="course-title">Web Application Security</h3>
                        <p class="course-description">Learn about common web vulnerabilities, SQL injection, XSS, and secure coding practices.</p>
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
                
                <div class="course-card" onclick="openCourseModal(2, 'Network Defense & Monitoring')">
                    <img src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=200&fit=crop" alt="Network Security" class="course-thumbnail">
                    <div class="course-info">
                        <h3 class="course-title">Network Defense & Monitoring</h3>
                        <p class="course-description">Master network security fundamentals, firewalls, IDS/IPS, and threat detection techniques.</p>
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
                
                <div class="course-card" onclick="openCourseModal(3, 'Network Fundamentals')">
                    <img src="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=200&fit=crop" alt="Networking" class="course-thumbnail">
                    <div class="course-info">
                        <h3 class="course-title">Network Fundamentals</h3>
                        <p class="course-description">Understand networking protocols, OSI model, TCP/IP, routing, and network troubleshooting.</p>
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
                
                <div class="course-card" onclick="openCourseModal(1, 'Linux System Administration')">
                    <img src="https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=200&fit=crop" alt="Linux" class="course-thumbnail">
                    <div class="course-info">
                        <h3 class="course-title">Linux System Administration</h3>
                        <p class="course-description">Master Linux command line, system administration, security hardening, and automation.</p>
                        <div class="course-progress">
                            <div class="progress-label-small">
                                <span>Progress</span>
                                <span>45%</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="animation: fillProgress 2s ease-in-out 1.4s forwards; width: 45%;"></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="course-card" onclick="openCourseModal(2, 'Incident Response & Forensics')">
                    <img src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=200&fit=crop" alt="Forensics" class="course-thumbnail">
                    <div class="course-info">
                        <h3 class="course-title">Incident Response & Forensics</h3>
                        <p class="course-description">Learn incident response procedures, digital forensics, and threat hunting methodologies.</p>
                        <div class="course-progress">
                            <div class="progress-label-small">
                                <span>Progress</span>
                                <span>30%</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="animation: fillProgress 2s ease-in-out 1.7s forwards; width: 30%;"></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="course-card" onclick="openCourseModal(3, 'Cloud Security Fundamentals')">
                    <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=200&fit=crop" alt="Cloud Security" class="course-thumbnail">
                    <div class="course-info">
                        <h3 class="course-title">Cloud Security Fundamentals</h3>
                        <p class="course-description">Explore cloud security principles, AWS/Azure security services, and cloud compliance frameworks.</p>
                        <div class="course-progress">
                            <div class="progress-label-small">
                                <span>Progress</span>
                                <span>90%</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="animation: fillProgress 2s ease-in-out 2s forwards; width: 90%;"></div>
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