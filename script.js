// DOM Elements
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.nav-link');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navMenu = document.querySelector('.nav-links');
const sections = document.querySelectorAll('section');
const currentYear = document.getElementById('current-year');
const resumeBtn = document.getElementById('resume-btn');

// JSON Data URL
const DATA_URL = 'data.json';

// Initialize Portfolio
document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    currentYear.textContent = new Date().getFullYear();
    
    // Load data from JSON
    loadPortfolioData();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Setup event listeners
    setupEventListeners();
});

// Load portfolio data from JSON
async function loadPortfolioData() {
    try {
        const response = await fetch(DATA_URL);
        const data = await response.json();
        
        // Populate personal information
        document.getElementById('hero-name').textContent = data.personal.name;
        document.getElementById('hero-role').textContent = data.personal.role;
        document.getElementById('hero-tagline').textContent = data.personal.tagline;
        document.getElementById('contact-name').textContent = data.personal.name;
        document.getElementById('contact-location').textContent = data.personal.location;
        document.getElementById('contact-email').textContent = data.personal.email;
        
        // Update resume button
        if (data.socials.resume) {
            resumeBtn.href = data.socials.resume;
            resumeBtn.target = '_blank';
        }
        
        // Populate about section
        document.getElementById('about-content').innerHTML = `
            <p>${data.about.description}</p>
        `;
        
        // Populate skills section
        const skillsContainer = document.getElementById('skills-container');
        skillsContainer.innerHTML = '';
        
        for (const [category, skills] of Object.entries(data.skills)) {
            const skillCategory = document.createElement('div');
            skillCategory.className = 'skill-category fade-in';
            
            // Map category to icon
            const iconMap = {
                'Programming Languages': 'fas fa-code',
                'Frontend': 'fas fa-paint-brush',
                'Backend': 'fas fa-server',
                'Mobile': 'fas fa-mobile-alt',
                'Databases': 'fas fa-database',
                'Concepts': 'fas fa-brain',
                'Tools': 'fas fa-tools'
            };
            
            const icon = iconMap[category] || 'fas fa-star';
            
            skillCategory.innerHTML = `
                <h3 class="skill-category-title">
                    <i class="${icon}"></i>
                    ${category}
                </h3>
                <div class="skill-chips">
                    ${skills.map(skill => `<span class="skill-chip">${skill}</span>`).join('')}
                </div>
            `;
            
            skillsContainer.appendChild(skillCategory);
        }
        
        // Populate projects section
        const projectsContainer = document.getElementById('projects-container');
        projectsContainer.innerHTML = '';
        
        data.projects.forEach((project, index) => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card fade-in';
            projectCard.style.animationDelay = `${index * 0.1}s`;
            
            projectCard.innerHTML = `
                <div class="project-content">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    
                    <div class="project-tech">
                        ${project.tech.map(tech => `<span class="tech-badge">${tech}</span>`).join('')}
                    </div>
                    
                    ${project.features && project.features.length > 0 ? `
                    <div class="project-features">
                        ${project.features.map(feature => `
                            <div class="project-feature">
                                <i class="fas fa-check"></i>
                                <span>${feature}</span>
                            </div>
                        `).join('')}
                    </div>
                    ` : ''}
                    
                    <div class="project-links">
                        ${project.github ? `
                        <a href="${project.github}" class="btn btn-secondary" target="_blank" aria-label="View ${project.title} on GitHub">
                            <i class="fab fa-github"></i> GitHub
                        </a>
                        ` : ''}
                    </div>
                </div>
            `;
            
            projectsContainer.appendChild(projectCard);
        });
        
        // Populate experience & education timeline
        const timeline = document.getElementById('timeline');
        timeline.innerHTML = '';
        
        // Add experience items
        data.experience.forEach((exp, index) => {
            const timelineItem = document.createElement('div');
            timelineItem.className = 'timeline-item fade-in';
            timelineItem.style.animationDelay = `${index * 0.1}s`;
            
            timelineItem.innerHTML = `
                <div class="timeline-icon">
                    <i class="fas fa-briefcase"></i>
                </div>
                <div class="timeline-content">
                    <h3 class="timeline-title">${exp.title}</h3>
                    <p class="timeline-subtitle">${exp.organization}</p>
                    <p class="timeline-duration">
                        <i class="far fa-calendar"></i> ${exp.duration}
                    </p>
                    <ul class="timeline-points">
                        ${exp.points.map(point => `
                            <li class="timeline-point">
                                <i class="fas fa-circle"></i>
                                <span>${point}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `;
            
            timeline.appendChild(timelineItem);
        });
        
        // Add education items
        data.education.forEach((edu, index) => {
            const timelineItem = document.createElement('div');
            timelineItem.className = 'timeline-item fade-in';
            timelineItem.style.animationDelay = `${(data.experience.length + index) * 0.1}s`;
            
            timelineItem.innerHTML = `
                <div class="timeline-icon">
                    <i class="fas fa-graduation-cap"></i>
                </div>
                <div class="timeline-content">
                    <h3 class="timeline-title">${edu.degree} in ${edu.field}</h3>
                    <p class="timeline-subtitle">${edu.institution}</p>
                    <p class="timeline-duration">
                        <i class="far fa-calendar"></i> ${edu.duration}
                    </p>
                </div>
            `;
            
            timeline.appendChild(timelineItem);
        });
        
        // Populate social links
        const socialLinks = document.getElementById('social-links');
        socialLinks.innerHTML = '';
        
        if (data.socials.github) {
            const githubLink = document.createElement('a');
            githubLink.href = data.socials.github;
            githubLink.className = 'social-link';
            githubLink.target = '_blank';
            githubLink.ariaLabel = 'GitHub Profile';
            githubLink.innerHTML = '<i class="fab fa-github"></i>';
            socialLinks.appendChild(githubLink);
        }
        
        if (data.socials.linkedin) {
            const linkedinLink = document.createElement('a');
            linkedinLink.href = data.socials.linkedin;
            linkedinLink.className = 'social-link';
            linkedinLink.target = '_blank';
            linkedinLink.ariaLabel = 'LinkedIn Profile';
            linkedinLink.innerHTML = '<i class="fab fa-linkedin-in"></i>';
            socialLinks.appendChild(linkedinLink);
        }
        
        // Trigger animations after content is loaded
        setTimeout(() => {
            const fadeElements = document.querySelectorAll('.fade-in');
            fadeElements.forEach(el => {
                el.classList.add('visible');
            });
        }, 100);
        
    } catch (error) {
        console.error('Error loading portfolio data:', error);
        document.getElementById('about-content').innerHTML = 
            '<p>Error loading data. Please check your connection and try again.</p>';
    }
}

// Initialize scroll animations
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe all fade-in elements
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update active nav link based on scroll position
        updateActiveNavLink();
    });
    
    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        mobileMenuBtn.innerHTML = navMenu.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
    
    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
    
    // Smooth scroll for anchor links
document.querySelectorAll('a[href]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');

        // Only handle internal section links
        if (!href || !href.startsWith('#')) return;

        e.preventDefault();

        const targetElement = document.querySelector(href);
        if (!targetElement) return;

        window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
        });
    });
});

}

// Update active nav link based on scroll position
function updateActiveNavLink() {
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}