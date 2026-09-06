window.addEventListener("DOMContentLoaded", () => {

    /* LENIS SMOOTH SCROLL (OPTIONAL) */
    lenis = new Lenis({
        autoRaf: true,
    })
    /* LENIS SMOOTH SCROLL (OPTIONAL) */

    const root = document.querySelector('.mwg_effect074')
    const pinHeight = root.querySelector('.pin-height')
    const container = root.querySelector('.container')
    const cards = root.querySelectorAll('.card')

    gsap.to(cards, {
        rotationX: -360,
        stagger: -0.2,
        ease: 'power3.in',
        scrollTrigger: {
            trigger: pinHeight, // Listens to pin-height
            start: 'top top',
            end: 'bottom bottom',
            pin: container, // The pinned section
            scrub: true
        }
    })
})