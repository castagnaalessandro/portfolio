// ==========================================================================
// SCRIPT PRINCIPALE PORTFOLIO - VERSIONE PREMIUM DEFINITIVA
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

    /* -----------------------------------------------------------
       1. ANIMAZIONE TITOLI / ELEMENTI
    ----------------------------------------------------------- */
    const revealElements = document.querySelectorAll('.scroll-reveal, .title-reveal');

    if (revealElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.15 });

        revealElements.forEach(el => observer.observe(el));
    }


    /* -----------------------------------------------------------
       2. GSAP HORIZONTAL SCROLL SKILLS (solo desktop)
    ----------------------------------------------------------- */
    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {

        gsap.registerPlugin(ScrollTrigger);

        if (window.innerWidth > 900) {

            const horizontalScroll = document.getElementById('horizontal-scroll');

            if (horizontalScroll) {
                gsap.to(horizontalScroll, {
                    x: () => -(horizontalScroll.scrollWidth - window.innerWidth),
                    ease: "none",

                    scrollTrigger: {
                        trigger: ".horizontal-wrapper",
                        pin: true,
                        scrub: 1,
                        start: "top top",
                        end: () => "+=" + (horizontalScroll.scrollWidth - window.innerWidth)
                    }
                });
            }
        }
    }


    /* -----------------------------------------------------------
       3. MENU HAMBURGER DEFINITIVO
    ----------------------------------------------------------- */
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {

        hamburger.onclick = function (e) {
            e.preventDefault();
            e.stopPropagation();

            const isOpen = navLinks.classList.toggle('active');
            hamburger.classList.toggle('active', isOpen);

            document.body.style.overflow = isOpen ? 'hidden' : 'auto';
        };

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.onclick = () => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.style.overflow = 'auto';
            };
        });
    }


    /* -----------------------------------------------------------
       4. HOVER REVEAL PROGETTI (solo desktop)
    ----------------------------------------------------------- */
    const revealContainer = document.querySelector('.hover-reveal-container');
    const revealImg = document.querySelector('.hover-reveal-img');
    const workItems = document.querySelectorAll('.work-item, .interactive-project');

    if (
        window.innerWidth > 900 &&
        revealContainer &&
        revealImg &&
        workItems.length > 0
    ) {

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let revealX = mouseX;
        let revealY = mouseY;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX + 20;
            mouseY = e.clientY - (revealContainer.offsetHeight / 2);
        });

        function animateReveal() {
            revealX += (mouseX - revealX) * 0.1;
            revealY += (mouseY - revealY) * 0.1;

            revealContainer.style.left = revealX + 'px';
            revealContainer.style.top = revealY + 'px';

            requestAnimationFrame(animateReveal);
        }

        animateReveal();

        workItems.forEach(item => {

            item.addEventListener('mouseenter', () => {
                const imgSrc = item.getAttribute('data-img');

                if (imgSrc) revealImg.src = imgSrc;

                revealContainer.classList.add('visible');
            });

            item.addEventListener('mouseleave', () => {
                revealContainer.classList.remove('visible');
            });

        });
    }


    /* -----------------------------------------------------------
       5. LIGHTBOX PROGETTI PREMIUM FIX TOTALE MOBILE
    ----------------------------------------------------------- */
    const lightbox = document.getElementById('project-lightbox');
    const navbar = document.getElementById('navbar');

    function hideNavbar() {
        if (navbar) {
            navbar.style.opacity = '0';
            navbar.style.visibility = 'hidden';
            navbar.style.pointerEvents = 'none';
        }
    }

    function showNavbar() {
        if (navbar) {
            navbar.style.opacity = '1';
            navbar.style.visibility = 'visible';
            navbar.style.pointerEvents = 'auto';
        }
    }

    if (lightbox) {

        const lbImg = document.getElementById('lb-current-img');
        const lbTitle = document.getElementById('lb-title');
        const lbDesc = document.getElementById('lb-desc');

        const btnPrev = document.querySelector('.lb-prev');
        const btnNext = document.querySelector('.lb-next');
        const btnClose = document.querySelector('.close-lightbox');

        let currentImages = [];
        let currentIndex = 0;
        let savedScroll = 0;

        function updateImage() {
            if (lbImg && currentImages.length > 0) {
                lbImg.src = currentImages[currentIndex];
            }
        }

        function openLightbox() {

            savedScroll = window.scrollY;

            document.body.style.position = 'fixed';
            document.body.style.top = `-${savedScroll}px`;
            document.body.style.left = '0';
            document.body.style.right = '0';
            document.body.style.width = '100%';

            hideNavbar();

            lightbox.style.display = 'flex';
            lightbox.classList.add('active');
            lightbox.style.overflowY = 'auto';
            lightbox.style.webkitOverflowScrolling = 'touch';
            lightbox.scrollTop = 0;
        }

        function closeLightbox() {

            lightbox.style.display = 'none';
            lightbox.classList.remove('active');

            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.left = '';
            document.body.style.right = '';
            document.body.style.width = '';

            window.scrollTo(0, savedScroll);

            showNavbar();
        }

        workItems.forEach(item => {

            item.addEventListener('click', () => {

                const title = item.querySelector('.work-title');
                const desc = item.querySelector('.project-description');
                const images = item.querySelectorAll('.project-images img');

                if (title) lbTitle.innerText = title.innerText;
                if (desc) lbDesc.innerText = desc.innerText;

                currentImages = Array.from(images).map(img => img.src);
                currentIndex = 0;

                updateImage();

                if (btnPrev && btnNext) {
                    if (currentImages.length <= 1) {
                        btnPrev.style.display = 'none';
                        btnNext.style.display = 'none';
                    } else {
                        btnPrev.style.display = 'block';
                        btnNext.style.display = 'block';
                    }
                }

                openLightbox();
            });

        });

        if (btnNext) {
            btnNext.onclick = () => {
                currentIndex = (currentIndex + 1) % currentImages.length;
                updateImage();
            };
        }

        if (btnPrev) {
            btnPrev.onclick = () => {
                currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
                updateImage();
            };
        }

        if (btnClose) btnClose.onclick = closeLightbox;

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {

            if (!lightbox.classList.contains('active')) return;

            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight' && btnNext) btnNext.click();
            if (e.key === 'ArrowLeft' && btnPrev) btnPrev.click();
        });

    }


    /* -----------------------------------------------------------
       6. VIDEO - pausa automatica + navbar hide fullscreen
    ----------------------------------------------------------- */
    const allVideos = document.querySelectorAll('video');

    allVideos.forEach(video => {

        video.addEventListener('play', () => {
            allVideos.forEach(v => {
                if (v !== video) v.pause();
            });
        });

        video.addEventListener('fullscreenchange', () => {
            if (document.fullscreenElement) {
                hideNavbar();
            } else {
                showNavbar();
            }
        });

    });

    /* FIX POSIZIONE HOMEPAGE AL CARICAMENTO MOBILE */
window.addEventListener('load', () => {

    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 50);

});

});