window.addEventListener("DOMContentLoaded", () => {

    /* LENIS SMOOTH SCROLL (OPTIONAL) */
    lenis = new Lenis({
        autoRaf: true,
    })
    /* LENIS SMOOTH SCROLL (OPTIONAL) */
	
    const root = document.querySelector('.mwg_effect110')
    const pinHeight = root.querySelector('.pin-height')
    const container = root.querySelector('.container')
    const cards = root.querySelectorAll('.card')
    const moveEase = CustomEase.create('custom', 'M0,0 C0.199,0 0.198,0.701 0.5,0.5 0.8,0.299 0.805,1 1,1 ')

    const isMobile = window.innerWidth < 768
    const stagger = isMobile ? 6.2 : 5.1

    gsap.to(root.querySelector('.scroll'), {
        autoAlpha: 0,
        duration: 0.2,
        scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: 'top top-=1',
            toggleActions: 'play none reverse none'
        }
    })

    const master = gsap.timeline({
        scrollTrigger: {
            trigger: pinHeight,
            start: 'top top',
            end: 'bottom bottom',
            pin: container,
            scrub: true
        }
    })

    cards.forEach((card, i) => {
        const tl = gsap.timeline()

        tl.to(card, {
            xPercent: -100,
            x: () => -window.innerWidth,
            duration: 10,
            ease: moveEase
        })
        tl.from(card, {
            scale: 0.9,
            duration: 3,
            ease: 'power1.in',
        }, '<')
        tl.to(card, {
            scale: 0.9,
            duration: 3,
            delay: 7,
            ease: 'power1.out',
        }, '<')
        tl.to(card, {
            rotationY: 180,
            duration: 8,
            ease: 'power1.inOut'
        }, 1)
        tl.to(card, {
            z: 0.2 * window.innerWidth,
            duration: 3.5,
            yoyo: true,
            repeat: 1,
            ease: 'power1.inOut'
        }, '<')

        master.add(tl, i * stagger)
    })
})