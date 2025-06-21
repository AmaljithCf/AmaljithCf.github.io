document.addEventListener('DOMContentLoaded', () => {
    // --- Initialize AOS (Animate On Scroll) ---
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false,
    });

    // --- Letter Fly Away Effect Function ---
    function setupLetterFlyAwayEffect(selector, interactionElementSelector) {
        const textElement = document.querySelector(selector);
        const interactionElement = document.querySelector(interactionElementSelector);

        if (!textElement || !interactionElement) {
            console.warn("Letter fly away effect: Target or interaction element not found.");
            return;
        }

        const originalText = textElement.textContent;
        textElement.innerHTML = ''; // Clear original text

        const letters = originalText.split('');
        const letterSpans = [];

        letters.forEach(char => {
            const span = document.createElement('span');
            span.textContent = char;
            span.className = 'letter-span';
            if (char.trim() === '') { // Handle spaces to maintain layout
                span.style.minWidth = '0.3em'; // Adjust as needed for font
                // Alternatively, use   but spans are better for styling:
                // span.innerHTML = ' ';
            }
            textElement.appendChild(span);
            letterSpans.push(span);
        });

        const INTERACTION_RADIUS = 120; // How close the mouse needs to be (px)
        const REPEL_STRENGTH = 60;   // How far the letters fly (px)
        const ROTATION_STRENGTH = 30; // Max rotation (degrees)

        interactionElement.addEventListener('mousemove', (e) => {
            // Get mouse position relative to the viewport
            const mouseX = e.clientX;
            const mouseY = e.clientY;

            letterSpans.forEach(span => {
                const rect = span.getBoundingClientRect();
                const spanCenterX = rect.left + rect.width / 2;
                const spanCenterY = rect.top + rect.height / 2;

                const deltaX = spanCenterX - mouseX;
                const deltaY = spanCenterY - mouseY;
                const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

                if (distance < INTERACTION_RADIUS) {
                    const angle = Math.atan2(deltaY, deltaX);
                    const repelFactor = (INTERACTION_RADIUS - distance) / INTERACTION_RADIUS;
                    const moveX = Math.cos(angle) * REPEL_STRENGTH * repelFactor;
                    const moveY = Math.sin(angle) * REPEL_STRENGTH * repelFactor;
                    const rotation = (Math.random() - 0.5) * 2 * ROTATION_STRENGTH * repelFactor;

                    span.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${rotation}deg)`;
                } else {
                    span.style.transform = 'translate(0, 0) rotate(0deg)';
                }
            });
        });

        interactionElement.addEventListener('mouseleave', () => {
            letterSpans.forEach(span => {
                span.style.transform = 'translate(0, 0) rotate(0deg)';
            });
        });
    }

    // --- Call the Letter Fly Away Effect ---
    setupLetterFlyAwayEffect('#interactiveName', '#hero');


    // --- Typewriter Effect for Tagline ---
    const taglineEl = document.getElementById('tagline');
    if (taglineEl) {
        const text = taglineEl.innerText;
        taglineEl.innerText = '';
        let i = 0;
        function typeWriter() {
            if (i < text.length) {
                taglineEl.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, 70); // Adjust speed
            }
        }
        setTimeout(typeWriter, 1200); // Delay to sync with hero animations
    }


    // --- Fun Facts Toggle ---
    const funFactsBtn = document.getElementById('funFactsBtn');
    const funFactsContent = document.getElementById('funFactsContent');
    if (funFactsBtn && funFactsContent) {
        funFactsBtn.addEventListener('click', () => {
            funFactsContent.classList.toggle('hidden');
            funFactsBtn.textContent = funFactsContent.classList.contains('hidden') ? "Fun Facts!" : "Hide Facts";
        });
    }

    // --- Timeline "More Details" Toggle ---
    const detailsBtns = document.querySelectorAll('.details-btn');
    detailsBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const content = btn.nextElementSibling;
            content.classList.toggle('hidden');
            btn.textContent = content.classList.contains('hidden') ? "More Details" : "Less Details";
        });
    });

    // --- Skill Bar Animation on Scroll ---
    const skillLevels = document.querySelectorAll('.skill-level');
    const animateSkillBar = (skillBarElement) => {
        const level = skillBarElement.dataset.level;
        if (level) {
            skillBarElement.style.width = level;
        }
    };

    const skillObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkillBar(entry.target);
                observer.unobserve(entry.target); // Animate only once
            }
        });
    }, { threshold: 0.5 }); // Trigger when 50% visible

    skillLevels.forEach(skill => {
        skillObserver.observe(skill);
    });


    // --- Project Modal Functionality ---
    const projectCards = document.querySelectorAll('.project-card');
    const modal = document.getElementById('projectModal');
    const closeBtn = document.querySelector('.modal .close-btn'); // More specific selector for close button

    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalTech = document.getElementById('modalTech');
    const modalLiveLink = document.getElementById('modalLiveLink');
    const modalRepoLink = document.getElementById('modalRepoLink');

    // Dummy project data (replace with your actual project details)
    const projectData = {
        project1: {
            image: "placeholder-project-large.jpg",
            title: "Awesome Project Title - In Depth",
            description: "This is a more detailed explanation of the Awesome Project. It involved complex problem-solving and resulted in a highly scalable and efficient application. Users love its intuitive interface and robust feature set.",
            technologies: "React, Node.js, Express, MongoDB, AWS S3",
            liveLink: "#",
            repoLink: "#"
        },
        project2: {
            image: "placeholder-project-large.jpg",
            title: "Another Great App - Full Story",
            description: "This application was developed to address a specific market need. It leverages Python and Django for a powerful backend, with a sleek, responsive frontend. Key features include X, Y, and Z.",
            technologies: "Python, Django, PostgreSQL, Docker, Heroku",
            liveLink: "#",
            repoLink: "#"
        }
    };

    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const projectId = card.dataset.projectId;
            const data = projectData[projectId];

            if (data) {
                modalImage.src = data.image || 'placeholder-project-large.jpg';
                modalTitle.textContent = data.title;
                modalDescription.textContent = data.description;
                modalTech.textContent = data.technologies;
                
                modalLiveLink.href = data.liveLink || '#';
                modalLiveLink.style.display = (data.liveLink && data.liveLink !== "#") ? 'inline-block' : 'none';
                
                modalRepoLink.href = data.repoLink || '#';
                modalRepoLink.style.display = (data.repoLink && data.repoLink !== "#") ? 'inline-block' : 'none';

                modal.style.display = "flex";
                document.body.style.overflow = 'hidden';
            }
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = "none";
            document.body.style.overflow = 'auto';
        });
    }

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
            document.body.style.overflow = 'auto';
        }
    });

    // --- Active Nav Link Highlighting on Scroll ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav ul li a');
    const navHeight = document.querySelector('nav') ? document.querySelector('nav').offsetHeight : 60;


    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            // const sectionHeight = section.clientHeight; // Not always needed for this logic
            if (pageYOffset >= (sectionTop - navHeight - 50)) { // 50 is an additional offset buffer
                current = section.getAttribute('id');
            }
        });
        
        // If scrolled to the very top, make "Home" active
        if (pageYOffset < (document.getElementById('hero').offsetHeight / 2) ) {
            current = 'hero';
        }


        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });

        // Back to top button visibility
        const backToTopButton = document.querySelector('.back-to-top');
        if (backToTopButton) { // Check if element exists
            if (window.scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        }
    });


    // --- Footer Current Year ---
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Back to Top Button ---
    const backToTopButton = document.querySelector('.back-to-top');
    if (backToTopButton) {
        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});
