document.addEventListener('DOMContentLoaded', () => {
    // 1. Navigation Scrolled State
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                const icon = hamburger.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });

    // 3. Scroll Reveal Animation
    const reveals = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;
        
        reveals.forEach(reveal => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    };
    
    // Trigger once on load
    revealOnScroll();
    window.addEventListener('scroll', revealOnScroll);

    // 4. Chatbot Widget Logic
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotContainer = document.getElementById('chatbot-container');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const chatbotInput = document.getElementById('chatbot-input-field');
    const chatbotSend = document.getElementById('chatbot-send');

    // Toggle Chatbot
    chatbotToggle.addEventListener('click', () => {
        chatbotContainer.classList.add('active');
        chatbotInput.focus();
    });

    chatbotClose.addEventListener('click', () => {
        chatbotContainer.classList.remove('active');
    });

    // Handle Send Message
    const handleSendMessage = () => {
        const message = chatbotInput.value.trim();
        if (message !== '') {
            addMessage(message, 'user-message');
            chatbotInput.value = '';
            
            // Show typing indicator or delay response slightly
            setTimeout(() => {
                const response = getChatbotResponse(message);
                addMessage(response, 'bot-message');
            }, 600);
        }
    };

    chatbotSend.addEventListener('click', handleSendMessage);
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    });

    const addMessage = (text, className) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', className);
        messageElement.textContent = text;
        chatbotMessages.appendChild(messageElement);
        // Scroll to bottom
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    };

    // Main Chatbot Logic
    const getChatbotResponse = (input) => {
        const text = input.toLowerCase();

        // Keywords checking
        if (text.match(/\b(hi|hello|hey|greetings)\b/)) {
            return "Hello there! I can help answer questions about Manigandan's portfolio. What would you like to know?";
        }
        
        if (text.match(/\b(who|about|name|background)\b/)) {
            return "Manigandan R. is a self-motivated B.Tech IT student at Anna University (Class of 2027) based in Pallikonda, India. He builds skills in programming, databases, and leadership.";
        }
        
        if (text.match(/\b(skill|skills|know|technologies|stack|language|languages)\b/)) {
            return "His technical skills include HTML (75%), SQL (70%), Python (60%), Java (55%), and C (55%). He is also strong in Leadership, Communication, Problem Solving, and Team Collaboration.";
        }
        
        if (text.match(/\b(experience|work|job|internship)\b/)) {
            return "He has 3 months of experience working as a Billing Assistant at a Supermarket in Pallikonda, where he handled billing, customer service, and learned POS systems.";
        }
        
        if (text.match(/\b(education|study|degree|college|university)\b/)) {
            return "He is currently pursuing his B.Tech in Information Technology at Anna University (2023 - 2027). He is in his 2nd year.";
        }
        
        if (text.match(/\b(project|projects|hackathon|activities)\b/)) {
            return "Manigandan has participated in the global NASA Space Apps Challenge and NM Hackathon. He also actively serves as Class Leader coordinating his peers.";
        }
        
        if (text.match(/\b(contact|email|phone|hire|reach)\b/)) {
            return "You can reach him via email at manigandanm237@gmail.com, or phone at +91 8870359724. Also check his LinkedIn out via the links below!";
        }
        
        if (text.match(/\b(location|where)\b/)) {
            return "He is currently located in Pallikonda, India.";
        }
        
        if (text.match(/\b(resume|cv)\b/)) {
            return "You can learn almost everything about him on this page! If you need his official resume, please contact him directly at manigandanm237@gmail.com.";
        }

        return "I'm sorry, I only answer questions related to Manigandan's portfolio. Try asking about his skills, education, projects, or contact info!";
    };

    // 5. AJAX Contact Form Submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = this.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            btn.disabled = true;

            const formData = new FormData(this);
            const actionUrl = this.getAttribute('action').replace('formsubmit.co', 'formsubmit.co/ajax');

            fetch(actionUrl, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json'
                },
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Formsubmit email not activated yet");
                }
                return response.json();
            })
            .then(data => {
                showNotification('Message sent successfully! I will get back to you soon.', 'success');
                this.reset();
                btn.innerHTML = originalText;
                btn.disabled = false;
            })
            .catch(error => {
                // Fallback to normal submission to show FormSubmit's activation UI
                HTMLFormElement.prototype.submit.call(this);
            });
        });
    }

    // Notification Popup function
    const showNotification = (message, type) => {
        const popup = document.createElement('div');
        popup.className = `notification-popup ${type}`;
        popup.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <p>${message}</p>
            </div>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;

        document.body.appendChild(popup);

        // Close button logic
        popup.querySelector('.notification-close').addEventListener('click', () => {
            popup.classList.add('fade-out');
            setTimeout(() => popup.remove(), 300);
        });

        // Auto close after 5 seconds
        setTimeout(() => {
            if (document.body.contains(popup)) {
                popup.classList.add('fade-out');
                setTimeout(() => popup.remove(), 300);
            }
        }, 5000);
    };

    // 6. Particles.js Configuration for Professional Background
    if (typeof particlesJS !== 'undefined') {
        particlesJS("particles-js", {
            "particles": {
                "number": { "value": 60, "density": { "enable": true, "value_area": 800 } },
                "color": { "value": ["#0ea5e9", "#6366f1", "#8b5cf6", "#ffffff"] },
                "shape": { "type": "circle" },
                "opacity": { "value": 0.6, "random": true },
                "size": { "value": 3, "random": true },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#8b5cf6",
                    "opacity": 0.2,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 1.5,
                    "direction": "none",
                    "random": true,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                }
            },
            "interactivity": {
                "detect_on": "window",
                "events": {
                    "onhover": { "enable": true, "mode": "grab" },
                    "onclick": { "enable": true, "mode": "push" },
                    "resize": true
                },
                "modes": {
                    "grab": { "distance": 180, "line_linked": { "opacity": 0.6 } },
                    "push": { "particles_nb": 3 }
                }
            },
            "retina_detect": true
        });
    }
});
