// Example Express.js routes for HTMX endpoints
const express = require('express');
const router = express.Router();

// Mock data
const courses = [
    {
        id: 1,
        title: 'Web Application Security',
        description: 'Learn about common web vulnerabilities, SQL injection, XSS, and secure coding practices.',
        thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=200&fit=crop',
        progress: 75,
        category: 'offensive'
    },
    {
        id: 2,
        title: 'Network Defense & Monitoring',
        description: 'Master network security fundamentals, firewalls, IDS/IPS, and threat detection techniques.',
        thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=200&fit=crop',
        progress: 60,
        category: 'defensive'
    },
    {
        id: 3,
        title: 'Network Fundamentals',
        description: 'Understand networking protocols, OSI model, TCP/IP, routing, and network troubleshooting.',
        thumbnail: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=200&fit=crop',
        progress: 85,
        category: 'general'
    }
];

const flashcards = {
    1: [
        {
            id: 1,
            question: "What is SQL Injection?",
            answer: "SQL injection is a code injection technique that exploits vulnerabilities in an application's software by inserting malicious SQL statements into entry fields for execution."
        },
        {
            id: 2,
            question: "What is Cross-Site Scripting (XSS)?",
            answer: "XSS is a security vulnerability that allows attackers to inject malicious scripts into web pages viewed by other users, potentially stealing data or performing actions on their behalf."
        }
    ],
    2: [
        {
            id: 1,
            question: "What is a Firewall?",
            answer: "A firewall is a network security device that monitors and filters incoming and outgoing network traffic based on predetermined security rules."
        },
        {
            id: 2,
            question: "What is an Intrusion Detection System (IDS)?",
            answer: "An IDS is a security tool that monitors network traffic and system activities for malicious activity or policy violations and generates alerts."
        }
    ],
    3: [
        {
            id: 1,
            question: "What is the OSI Model?",
            answer: "The OSI (Open Systems Interconnection) model is a conceptual framework that describes network communication in seven layers, from physical to application."
        },
        {
            id: 2,
            question: "What is TCP/IP?",
            answer: "TCP/IP is a suite of communication protocols used to interconnect network devices on the internet and private networks."
        }
    ]
};

// Get courses
router.get('/courses', (req, res) => {
    const courseCards = courses.map(course => `
        <div class="course-card" onclick="openCourseModal(${course.id}, '${course.title}')">
            <img src="${course.thumbnail}" alt="${course.title}" class="course-thumbnail">
            <div class="course-info">
                <h3 class="course-title">${course.title}</h3>
                <p class="course-description">${course.description}</p>
                <div class="course-progress">
                    <div class="progress-label-small">
                        <span>Progress</span>
                        <span>${course.progress}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${course.progress}%;"></div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    res.send(courseCards);
});

// Get flashcards for a course
router.get('/flashcards/:courseId', (req, res) => {
    const courseId = parseInt(req.params.courseId);
    const courseFlashcards = flashcards[courseId] || [];
    res.json(courseFlashcards);
});

// Get user progress
router.get('/progress', (req, res) => {
    res.json({
        offensive: 75,
        defensive: 60,
        general: 85
    });
});

module.exports = router;