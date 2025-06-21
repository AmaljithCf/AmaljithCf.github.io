document.addEventListener('DOMContentLoaded', () => {
    // --- Initialize AOS (Animate On Scroll) ---
    AOS.init({
        duration: 800, // values from 0 to 3000, with step 50ms
        easing: 'ease-in-out', // default easing for AOS animations
        once: true, // whether animation should happen only once - while scrolling down
        mirror: false, // whether elements should animate out while scrolling past them
    });

    // --- Typewriter Effect for Tagline (Optional) ---
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
        // Start after hero text animation
        setTimeout(typeWriter, 1200); // Delay to match CSS animation
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

    // --- Skill Bar Animation on Scroll (Basic Implementation) ---
    // More robust with Intersection Observer, but AOS can handle visibility for trigger
    // This example animates them once AOS makes them visible
    const skillLevels = document.querySelectorAll('.skill-level');
    skillLevels.forEach(skill => {
        // This relies on AOS adding 'aos-animate' class when element is in view
        // We need a way to check if it's already animated if not using once:true in AOS
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    skill.style.width = skill.classList[1] ? getSkillWidth(skill.classList[1]) : '0%';
                    observer.unobserve(skill); // Animate only once
                }
            });
        }, { threshold: 0.5 }); // Trigger when 50% visible
        observer.observe(skill.parentElement); // Observe the container
    });

    function getSkillWidth(className) {
        // This is a bit manual; you'd map class names to percentages
        // Or better, store percentage in a data-attribute on the element
        const widths = {
            'js': '90%', 'python': '85%', 'html-css': '95%',
            'react': '80%', 'node': '75%', 'django': '70%',
            'git': '90%', 'docker': '60%', 'aws': '50%'
        };
        return widths[className] || '0%';
    }


    // --- Project Modal Functionality ---
    const projectCards = document.querySelectorAll('.project-card');
    const modal = document.getElementById('projectModal');
    const closeBtn = document.querySelector('.close-btn');

    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalTech = document.getElementById('modalTech');
    const modalLiveLink = document.getElementById('modalLiveLink');
    const modalRepoLink = document.getElementById('modalRepoLink');

    // Dummy project data (replace with your actual project details)
    const projectData = {
        project1: {
            image: "placeholder-project-large.jpg", // Larger image for modal
            title: "Awesome Project Title - In Depth",
            description: "This is a more detailed explanation of the Awesome Project. It involved complex problem-solving and resulted in a highly scalable and efficient application. Users love its intuitive interface and robust feature set.",
            technologies: "React, Node.js, Express, MongoDB, AWS S3",
            liveLink: "#", // Replace with actual link
            repoLink: "#"  // Replace with actual link
        },
        project2: {
            image: "placeholder-project-large.jpg",
            title: "Another Great App - Full Story",
            description: "This application was developed to address a specific market need. It leverages Python and Django for a powerful backend, with a sleek, responsive frontend. Key features include X, Y, and Z.",
            technologies: "Python, Django, PostgreSQL, Docker, Heroku",
            liveLink: "#",
            repoLink: "#"
        }
        // Add more projects here, matching data-project-id
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
                modalRepoLink.href = data.repoLink || '#';

                modalLiveLink.style.display = data.liveLink && data.liveLink !== "#" ? 'inline-block' : 'none';
                modalRepoLink.style.display = data.repoLink && data.repoLink !== "#" ? 'inline-block' : 'none';

                modal.style.display = "flex"; // Use flex to center
                document.body.style.overflow = 'hidden'; // Prevent background scroll
            }
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = "none";
            document.body.style.overflow = 'auto';
        });
    }

    // Close modal if user clicks outside of it
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
            document.body.style.overflow = 'auto';
        }
    });

    // --- Smooth Scrolling for Nav Links (already handled by CSS scroll-behavior: smooth) ---
    // --- Active Nav Link Highlighting on Scroll ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav ul li a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Adjust offset if you have a fixed nav bar
            if (pageYOffset >= (sectionTop - sectionHeight / 3 - 60)) { // 60 for nav height
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });

        // Back to top button visibility
        const backToTopButton = document.querySelector('.back-to-top');
        if (window.scrollY > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
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
