// ==========================================================================
// SCRIPT PRINCIPALE
// Tutte le funzioni si attivano solo quando la pagina è completamente caricata
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

    /* -----------------------------------------------------------
       1. ANIMAZIONE INTRO SCROLL (Apparizione degli elementi)
       ----------------------------------------------------------- */
    const revealElements = document.querySelectorAll(".scroll-reveal, .title-reveal");
    if (revealElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if(entry.isIntersecting){
                    entry.target.classList.add("visible");
                }
            });
        }, { threshold: 0.2 });

        revealElements.forEach(el => observer.observe(el));
    }


    /* -----------------------------------------------------------
       2. GSAP: HORIZONTAL SCROLL (Scorrimento Orizzontale)
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
       3. MENU HAMBURGER (Versione Mobile)
       ----------------------------------------------------------- */
       /* -----------------------------------------------------------
   3. MENU HAMBURGER DEFINITIVO
----------------------------------------------------------- */
const hamburger = document.querySelector('.hamburger-menu');
const navLinks = document.querySelector('.nav-links');

if(hamburger && navLinks){

hamburger.addEventListener('click', function(e){
e.preventDefault();
e.stopPropagation();

hamburger.classList.toggle('active');
navLinks.classList.toggle('active');

document.body.style.overflow =
navLinks.classList.contains('active') ? 'hidden' : 'auto';
});

document.querySelectorAll('.nav-links a').forEach(link=>{
link.addEventListener('click', ()=>{
hamburger.classList.remove('active');
navLinks.classList.remove('active');
document.body.style.overflow='auto';
});
});

}

    /* -----------------------------------------------------------
       4. IMMAGINE FLUTTUANTE (Hover Reveal sui Progetti)
       ----------------------------------------------------------- */
    const revealContainer = document.querySelector('.hover-reveal-container');
const revealImg = document.querySelector('.hover-reveal-img');
const workItems = document.querySelectorAll('.work-item, .interactive-project');

if (window.innerWidth > 900 && revealContainer && revealImg && workItems.length > 0) {

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let revealX = mouseX;
    let revealY = mouseY;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX + 20;
        mouseY = e.clientY - (revealContainer.offsetHeight / 2);
    });

    function renderReveal() {
        revealX += (mouseX - revealX) * 0.1;
        revealY += (mouseY - revealY) * 0.1;
        revealContainer.style.left = `${revealX}px`;
        revealContainer.style.top = `${revealY}px`;
        requestAnimationFrame(renderReveal);
    }

    renderReveal();

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
       5. LIGHTBOX AVANZATO (Galleria Immagini a tutto schermo)
       ----------------------------------------------------------- */
    const lightbox = document.getElementById('project-lightbox');
    
    if (lightbox) {
        const lbImg = document.getElementById('lb-current-img');
        const lbTitle = document.getElementById('lb-title');
        const lbDesc = document.getElementById('lb-desc');
        const btnPrev = document.querySelector('.lb-prev');
        const btnNext = document.querySelector('.lb-next');
        const btnClose = document.querySelector('.close-lightbox');

        let currentImagesArray = [];
        let currentIndex = 0;

        // Funzione per chiudere il Lightbox in modo pulito
        const closeLightbox = () => {
            lightbox.style.display = 'none';
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto'; // Riattiva scroll
        };

        // Aggiorna l'immagine a schermo
        const updateImage = () => {
            if (lbImg && currentImagesArray.length > 0) {
                lbImg.src = currentImagesArray[currentIndex];
            }
        };

        // Apre il Lightbox quando clicchi su un progetto
        workItems.forEach(item => {
            item.addEventListener('click', () => {
                const titleEl = item.querySelector('.work-title');
                const descEl = item.querySelector('.project-description');
                const imagesNodes = item.querySelectorAll('.project-images img');

                if (lbTitle && titleEl) lbTitle.innerText = titleEl.innerText;
                if (lbDesc && descEl) lbDesc.innerText = descEl.innerText;

                currentImagesArray = Array.from(imagesNodes).map(img => img.src);
                currentIndex = 0;
                updateImage();

                // Gestione bottoni freccia
                if (btnPrev && btnNext) {
                    if (currentImagesArray.length <= 1) {
                        btnPrev.style.display = 'none';
                        btnNext.style.display = 'none';
                    } else {
                        btnPrev.style.display = 'block';
                        btnNext.style.display = 'block';
                    }
                }

                // Nasconde la preview volante e mostra il lightbox
                if (revealContainer) revealContainer.classList.remove('visible');
                lightbox.style.display = 'flex';
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        // Controlli Frecce (Mouse)
        if (btnNext) {
            btnNext.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % currentImagesArray.length;
                updateImage();
            });
        }
        if (btnPrev) {
            btnPrev.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + currentImagesArray.length) % currentImagesArray.length;
                updateImage();
            });
        }

        // Chiusura (Click su X o sfondo nero)
        if (btnClose) btnClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
                closeLightbox();
            }
        });

        // Controlli Tastiera (Esc, Frecce)
        document.addEventListener("keydown", (e) => {
            if (!lightbox.classList.contains("active")) return;
            if (e.key === "ArrowRight" && btnNext) btnNext.click();
            if (e.key === "ArrowLeft" && btnPrev) btnPrev.click();
            if (e.key === "Escape") closeLightbox();
        });
    }

    // LIGHTBOX BASE (Per immagini singole con classe .open-lightbox)
    document.querySelectorAll('.open-lightbox').forEach(img => {
        img.addEventListener('click', () => {
            const basicLightbox = document.getElementById('lightbox-overlay') || lightbox;
            const basicLightboxImg = document.getElementById('lightbox-img') || document.getElementById('lb-current-img');
            
            if (basicLightbox && basicLightboxImg) {
                basicLightboxImg.src = img.src;
                basicLightbox.style.display = 'flex';
                basicLightbox.classList.add('active');
            }
        });
    });


    /* -----------------------------------------------------------
       6. GESTIONE VIDEO (Pausa automatica e Fullscreen)
       ----------------------------------------------------------- */
    const allVideos = document.querySelectorAll('video');
    
    // Mette in pausa gli altri video quando ne avvii uno
    allVideos.forEach(video => {
        video.addEventListener('play', () => {
            allVideos.forEach(v => {
                if (v !== video) v.pause();
            });
        });
    });

    // Ingrandisce i video con classe .custom-video a tutto schermo
    document.querySelectorAll(".custom-video").forEach(video => {
        video.addEventListener("click", () => {
            const overlay = document.createElement("div");
            overlay.classList.add("video-fullscreen");

            const newVideo = video.cloneNode(true);
            newVideo.controls = true;
            newVideo.autoplay = true;
            
            // Pausa il video in miniatura per non sovrapporre l'audio
            video.pause(); 

            overlay.appendChild(newVideo);
            document.body.appendChild(overlay);

            // Chiudi cliccando fuori dal video
            overlay.addEventListener("click", (e) => {
                if(e.target !== newVideo) overlay.remove();
            });
        });
    });

});
