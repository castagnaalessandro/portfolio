// ------------------- ANIMAZIONE INTRO SCROLL -------------------
const revealElements = document.querySelectorAll(".scroll-reveal, .title-reveal");
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            entry.target.classList.add("visible");
        }
    });
}, { threshold: 0.2 });

revealElements.forEach(el => observer.observe(el));


// ------------------- GSAP: HORIZONTAL SCROLL & IMMAGINE FLUTTUANTE -------------------
document.addEventListener('DOMContentLoaded', () => {
    
    // Inizializzazione GSAP per Horizontal Scroll
    if (typeof gsap !== "undefined") {
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

    // Effetto Immagine Fluttuante (Lerp + Eventi Hover)
    const revealContainer = document.querySelector('.hover-reveal-container');
    const revealImg = document.querySelector('.hover-reveal-img');
    const workItems = document.querySelectorAll('.interactive-project');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let revealX = mouseX;
    let revealY = mouseY;

    // Traccia la posizione del mouse
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Anima il movimento usando Interpolazione Lineare (Lerp) per maggiore fluidità
    function render() {
        revealX += (mouseX - revealX) * 0.1;
        revealY += (mouseY - revealY) * 0.1;

        if (revealContainer) {
            revealContainer.style.left = `${revealX}px`;
            revealContainer.style.top = `${revealY}px`;
        }
        requestAnimationFrame(render);
    }
    render();

    // Mostra/Nascondi e cambia immagine in base al progetto in hover
    workItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const imgSrc = item.getAttribute('data-img');
            
            if (imgSrc && revealImg) {
                revealImg.src = imgSrc;
            }
            
            if (revealContainer) {
                revealContainer.classList.add('visible');
            }
        });

        item.addEventListener('mouseleave', () => {
            if (revealContainer) {
                revealContainer.classList.remove('visible');
            }
        });
    });
});


document.addEventListener('DOMContentLoaded', () => {
    
    // Seleziona gli elementi
    const revealContainer = document.querySelector('.hover-reveal-container');
    const revealImg = document.querySelector('.hover-reveal-img');
    const workItems = document.querySelectorAll('.interactive-project');

    // Se non trova il contenitore nel file HTML, ferma lo script
    if (!revealContainer) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let revealX = mouseX;
    let revealY = mouseY;

    // Aggiorna le coordinate quando muovi il mouse
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Funzione per il movimento "fluido" (Lerp)
    function render() {
        revealX += (mouseX - revealX) * 0.1;
        revealY += (mouseY - revealY) * 0.1;

        revealContainer.style.left = `${revealX}px`;
        revealContainer.style.top = `${revealY}px`;
        
        requestAnimationFrame(render);
    }
    render();

    // Quando entri col mouse in un progetto
    workItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const imgSrc = item.getAttribute('data-img');
            
            // Inserisce l'immagine corretta
            if (imgSrc && revealImg) {
                revealImg.src = imgSrc;
            }
            
            // Rende visibile il box
            revealContainer.classList.add('visible');
        });

        // Quando esci dal progetto
        item.addEventListener('mouseleave', () => {
            revealContainer.classList.remove('visible');
        });
    });

});










// Gestione Lightbox per i nuovi progetti
document.querySelectorAll('.open-lightbox').forEach(img => {
    img.addEventListener('click', () => {
        const lightbox = document.getElementById('lightbox-overlay');
        const lightboxImg = document.getElementById('lightbox-img');
        
        lightboxImg.src = img.src;
        lightbox.style.display = 'flex';
    });
});

// Assicurati che il codice GSAP che ti ho dato prima sia dentro il DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    // Il codice per lo scroll orizzontale che hai già nel file funzionerà 
    // ora che hai aggiunto le librerie nell'HTML e le classi corrette.
});









document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. IMMAGINE FLUTTUANTE (HOVER REVEAL) ---
    const revealContainer = document.querySelector('.hover-reveal-container');
    const revealImg = document.querySelector('.hover-reveal-img');
    const workItems = document.querySelectorAll('.work-item');

    document.addEventListener('mousemove', (e) => {
        if(revealContainer) {
            const x = e.clientX + 20; 
            const y = e.clientY - (revealContainer.offsetHeight / 2);
            revealContainer.style.left = `${x}px`;
            revealContainer.style.top = `${y}px`;
        }
    });

    // --- 2. LOGICA LIGHTBOX (CLICK + SLIDER + DESCRIZIONE) ---
    const lightbox = document.getElementById('project-lightbox');
    const lbImg = document.getElementById('lb-current-img');
    const lbTitle = document.getElementById('lb-title');
    const lbDesc = document.getElementById('lb-desc');
    const btnPrev = document.querySelector('.lb-prev');
    const btnNext = document.querySelector('.lb-next');
    const btnClose = document.querySelector('.close-lightbox');

    let currentImagesArray = [];
    let currentIndex = 0;

    workItems.forEach(item => {
        // Hover: mostra l'immagine flottante
        item.addEventListener('mouseenter', () => {
            const imgSrc = item.getAttribute('data-img');
            if (imgSrc) {
                revealImg.src = imgSrc;
                revealContainer.classList.add('visible');
            }
        });

        // Leave: nascondi l'immagine flottante
        item.addEventListener('mouseleave', () => {
            revealContainer.classList.remove('visible');
        });

        // Click: Apri il Lightbox a tutto schermo
        item.addEventListener('click', () => {
            // Prende il titolo
            const title = item.querySelector('.work-title').innerText;
            // Prende la descrizione
            const desc = item.querySelector('.project-description').innerText;
            // Prende tutte le immagini di questo specifico progetto
            const imagesNodes = item.querySelectorAll('.project-images img');
            
            // Crea un array con i link delle immagini
            currentImagesArray = Array.from(imagesNodes).map(img => img.src);
            currentIndex = 0;

            // Inserisci i dati nel Lightbox
            lbTitle.innerText = title;
            lbDesc.innerText = desc;
            lbImg.src = currentImagesArray[currentIndex];

            // Nascondi le frecce se c'è solo 1 immagine
            if (currentImagesArray.length <= 1) {
                btnPrev.style.display = 'none';
                btnNext.style.display = 'none';
            } else {
                btnPrev.style.display = 'block';
                btnNext.style.display = 'block';
            }

            // Mostra il Lightbox e blocca lo scorrimento della pagina
            lightbox.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            // Nasconde la foto fluttuante
            revealContainer.classList.remove('visible');
        });
    });

    // --- 3. CONTROLLI SLIDER LIGHTBOX ---
    btnNext.addEventListener('click', () => {
        currentIndex++;
        if (currentIndex >= currentImagesArray.length) { currentIndex = 0; }
        lbImg.src = currentImagesArray[currentIndex];
    });

    btnPrev.addEventListener('click', () => {
        currentIndex--;
        if (currentIndex < 0) { currentIndex = currentImagesArray.length - 1; }
        lbImg.src = currentImagesArray[currentIndex];
    });

    // --- 4. CHIUSURA LIGHTBOX ---
    btnClose.addEventListener('click', () => {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto'; // Riattiva scorrimento pagina
    });

    // Chiude anche se clicchi sullo sfondo nero
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

});













// --- CONTROLLO MULTI-VIDEO ---
    const allVideos = document.querySelectorAll('video');
    
    allVideos.forEach(video => {
        video.addEventListener('play', () => {
            // Metti in pausa tutti gli altri video quando ne parte uno
            allVideos.forEach(v => {
                if (v !== video) {
                    v.pause();
                }
            });
        });
    });







    document.addEventListener("DOMContentLoaded", () => {

    const lightbox = document.getElementById("project-lightbox");
    const closeBtn = document.querySelector(".close-lightbox");
    const nextBtn = document.querySelector(".lb-next");
    const prevBtn = document.querySelector(".lb-prev");

    // =========================
    // FIX APERTURA LIGHTBOX
    // =========================
    // Ogni volta che il lightbox viene mostrato via style,
    // aggiungiamo anche la classe "active"
    const observer = new MutationObserver(() => {
        if (lightbox.style.display === "flex") {
            lightbox.classList.add("active");
        }
    });

    observer.observe(lightbox, { attributes: true, attributeFilter: ["style"] });

    // =========================
    // FIX CHIUSURA (X)
    // =========================
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            lightbox.style.display = "none";   // mantiene il tuo sistema
            lightbox.classList.remove("active"); // sincronizza
        });
    }

    // =========================
    // KEYBOARD CONTROLS
    // =========================
    document.addEventListener("keydown", (e) => {

        // funziona solo se aperto
        if (!lightbox.classList.contains("active")) return;

        if (e.key === "ArrowRight") {
            if (nextBtn) nextBtn.click();
        }

        if (e.key === "ArrowLeft") {
            if (prevBtn) prevBtn.click();
        }

        if (e.key === "Escape") {
            if (closeBtn) closeBtn.click();
        }
    });

});








document.querySelectorAll(".custom-video").forEach(video => {

    video.addEventListener("click", () => {

        // crea overlay fullscreen
        const overlay = document.createElement("div");
        overlay.classList.add("video-fullscreen");

        // clona il video
        const newVideo = video.cloneNode(true);
        newVideo.controls = true;
        newVideo.autoplay = true;

        overlay.appendChild(newVideo);
        document.body.appendChild(overlay);

        // chiudi cliccando fuori
        overlay.addEventListener("click", () => {
            overlay.remove();
        });

    });

});






document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li a');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            // Apre/Chiude il menu
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            
            // Blocca lo scroll della pagina se il menu è aperto
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
        });
    }

    // Chiude il menu quando clicchi su un link (Home, Video, ecc.)
    links.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
});