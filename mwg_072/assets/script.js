window.addEventListener("DOMContentLoaded", () => {

    /* LENIS SMOOTH SCROLL (OPTIONAL) */
    lenis = new Lenis({
        autoRaf: true,
    })
    /* LENIS SMOOTH SCROLL (OPTIONAL) */

    const root = document.querySelector('.mwg_effect072');
    const pinHeight = root.querySelector('.pin-height')
    const container = root.querySelector('.container')
    const medias = root.querySelectorAll('.media')

    gsap.to('.scroll', {
        autoAlpha:0,
        duration:0.2,
        scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: 'top top-=1',
            toggleActions: "play none reverse none"
        }
    })

    ScrollTrigger.create({
        trigger: pinHeight,
        start: 'top top',
        end: 'bottom bottom',
        pin: container
    })

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: pinHeight,
            start:'top top',
            end: 'bottom bottom',
            scrub: true
        },
        defaults: {
            stagger: 0.1
        }
    })
    
    tl.to(medias, {
        xPercent: 100,
        x: (window.innerWidth > 500) ? (-1 * document.body.clientWidth) : (-1.5 * document.body.clientWidth),
        ease: 'none',
        duration: 1,
    })
    tl.to(medias, {
        yPercent: () => {return (Math.random() - 0.5) * 160},
        scale: 1,
        duration: 0.5,
        ease: 'power1.inOut'
    }, '<')
    tl.to(medias, {
        yPercent: 0,
        scale: 0,
        duration: 0.5,
        ease: 'power1.inOut'
    }, '<+=0.5')
})