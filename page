
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('auto-type')) {
        var typed = new Typed('#auto-type', {
            strings: ["We've got Your Back!", "Best Tools Available!", "Always Here for You!"],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 2000,
            startDelay: 500,
            loop: true,
            showCursor: true,
            cursorChar: '|'
        });
    }

    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = question ? question.querySelector('svg') : null;

        if (question && answer) {
            question.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const isCurrentlyOpen = answer.style.maxHeight && answer.style.maxHeight !== '0px';
                
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        const otherIcon = otherItem.querySelector('.faq-question svg');
                        const otherQuestion = otherItem.querySelector('.faq-question');
                        if (otherAnswer && otherQuestion) {
                            otherAnswer.style.maxHeight = '0px';
                            otherAnswer.style.opacity = '0';
                            otherAnswer.style.transform = 'translateY(-10px)';
                            if (otherIcon) {
                                otherIcon.style.transform = 'rotate(0deg)';
                            }
                            otherQuestion.setAttribute('aria-expanded', 'false');
                            otherItem.classList.remove('open');
                        }
                    }
                });

                if (isCurrentlyOpen) {
                    answer.style.maxHeight = '0px';
                    answer.style.opacity = '0';
                    answer.style.transform = 'translateY(-10px)';
                    if (icon) {
                        icon.style.transform = 'rotate(0deg)';
                    }
                    question.setAttribute('aria-expanded', 'false');
                    item.classList.remove('open');
                } else {
                    answer.style.maxHeight = answer.scrollHeight + 20 + 'px';
                    answer.style.opacity = '1';
                    answer.style.transform = 'translateY(0)';
                    if (icon) {
                        icon.style.transform = 'rotate(180deg)';
                    }
                    question.setAttribute('aria-expanded', 'true');
                    item.classList.add('open');
                }
            });

            question.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    question.click();
                }
            });

            question.setAttribute('aria-expanded', 'false');
            question.setAttribute('tabindex', '0');
            answer.style.maxHeight = '0px';
            answer.style.opacity = '0';
            answer.style.transform = 'translateY(-10px)';
            answer.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        }
    });

    const video = document.getElementById('customVideo');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const muteBtn = document.getElementById('muteBtn');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const progressBar = document.getElementById('progressBar');
    const progressFilled = document.getElementById('progressFilled');
    const timeDisplay = document.getElementById('timeDisplay');

    if (video && playPauseBtn) {
        playPauseBtn.addEventListener('click', () => {
            if (video.paused) {
                video.play();
                playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
            } else {
                video.pause();
                playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
            }
        });

        muteBtn.addEventListener('click', () => {
            video.muted = !video.muted;
            muteBtn.innerHTML = video.muted ? 
                '<i class="fa-solid fa-volume-mute"></i>' : 
                '<i class="fa-solid fa-volume-high"></i>';
        });

        fullscreenBtn.addEventListener('click', () => {
            if (video.requestFullscreen) {
                video.requestFullscreen();
            } else if (video.webkitRequestFullscreen) {
                video.webkitRequestFullscreen();
            } else if (video.msRequestFullscreen) {
                video.msRequestFullscreen();
            }
        });

        video.addEventListener('timeupdate', () => {
            const progress = (video.currentTime / video.duration) * 100;
            progressFilled.style.width = progress + '%';
            
            const currentMinutes = Math.floor(video.currentTime / 60);
            const currentSeconds = Math.floor(video.currentTime % 60);
            const totalMinutes = Math.floor(video.duration / 60);
            const totalSeconds = Math.floor(video.duration % 60);
            
            timeDisplay.textContent = 
                `${currentMinutes}:${currentSeconds.toString().padStart(2, '0')} / ${totalMinutes}:${totalSeconds.toString().padStart(2, '0')}`;
        });

        progressBar.addEventListener('click', (e) => {
            const rect = progressBar.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const width = rect.width;
            const newTime = (clickX / width) * video.duration;
            video.currentTime = newTime;
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    video.play();
                    playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
                }
            });
        }, { threshold: 0.5 });

        observer.observe(video);
    }

    const liveFeed = document.getElementById('red');
    if (liveFeed) {
        const games = [
            'Brookhaven RP', 'Adopt Me!', 'Tower of Hell', 'Piggy', 'Arsenal',
            'Jailbreak', 'MeepCity', 'Welcome to Bloxburg', 'Royale High',
            'Murder Mystery 2', 'Phantom Forces', 'Natural Disaster Survival',
            'Work at a Pizza Place', 'Theme Park Tycoon 2', 'Vehicle Simulator'
        ];

        function updateLiveFeed() {
            const randomGame = games[Math.floor(Math.random() * games.length)];
            liveFeed.textContent = randomGame;
            
            liveFeed.style.animation = 'none';
            liveFeed.offsetHeight; 
            liveFeed.style.animation = 'pulse 0.5s ease-in-out';
        }

        setInterval(updateLiveFeed, 3000);
        updateLiveFeed(); 
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });

        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.animate__animated');
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('animate__fadeInUp');
            }
        });
    };

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); 

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.circles li, .animated-stars');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    const header = document.querySelector('header') || document.getElementById('header-main');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.style.background = 'rgba(15, 15, 35, 0.85)';
                header.style.backdropFilter = 'saturate(180%) blur(20px)';
                header.style.borderBottom = '1px solid rgba(79, 70, 229, 0.3)';
            } else {
                header.style.background = 'rgba(15, 15, 35, 0.95)';
                header.style.backdropFilter = 'saturate(180%) blur(20px)';
                header.style.borderBottom = '1px solid rgba(79, 70, 229, 0.2)';
            }
        });
    }

    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });

    const inputs = document.querySelectorAll('input[type="text"], input[type="password"]');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });

        input.addEventListener('input', function() {
            if (this.value) {
                this.parentElement.classList.add('has-value');
            } else {
                this.parentElement.classList.remove('has-value');
            }
        });
    });

    const buttons = document.querySelectorAll('.starter, .btn-icon');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });

        button.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
});

const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.7; transform: scale(1.05); }
        100% { opacity: 1; transform: scale(1); }
    }
    
    .loaded .main-content {
        animation: fadeInUp 0.8s ease-out;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);
