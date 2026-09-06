window.addEventListener("DOMContentLoaded", () => {

    /* LENIS SMOOTH SCROLL (OPTIONAL) */
    lenis = new Lenis({
        autoRaf: true,
    })
    /* LENIS SMOOTH SCROLL (OPTIONAL) */
    
    const root = document.querySelector('.mwg_effect054')
    const pinHeight = root.querySelector('.pin-height')
    const container = root.querySelector('.container')
    const medias = root.querySelectorAll('.media')

    gsap.to('.scroll', {
        autoAlpha:0,
        duration:0.2,
        scrollTrigger: {
            trigger: root,
            start:'top top',
            end:'top top-=1',
            toggleActions: "play none reverse none"
        }
    })

    medias.forEach(media => {
        media.classList.add('media' + (Math.floor(Math.random() * 4) + 1))
        gsap.set(media, {
            x: Math.random() * window.innerWidth
        })
    })

    gsap.to(medias, {
        rotateX: -180,
        ease: 'none',
        stagger: 0.05,
        scrollTrigger: {
            trigger: pinHeight,
            start: 'top top',
            end: 'bottom bottom',
            pin: container,
            scrub: true
        }
    })
})