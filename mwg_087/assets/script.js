window.addEventListener("DOMContentLoaded", () => {

    /* LENIS SMOOTH SCROLL (OPTIONAL) */
    lenis = new Lenis({
        autoRaf: true,
    })
    /* LENIS SMOOTH SCROLL (OPTIONAL) */

    const root = document.querySelector('.mwg_effect087')
    const container = root.querySelector('.container')
    const cardsContainer = root.querySelector('.cards')
    const cards = root.querySelectorAll('.card')

    const distance = cardsContainer.clientWidth - window.innerWidth
    
    gsap.to('.scroll', {
        autoAlpha:0,
        duration:0.2,
        scrollTrigger: {
            trigger: cardsContainer,
            start:'top top',
            end:'top top-=1',
            toggleActions: "play none reverse none"
        }
    })

    const scrollTween = gsap.to(cardsContainer, {
        x: - distance,
        ease: 'none',
        scrollTrigger: {
            trigger: container,
            pin: true,
            scrub: true,
            start: 'top top',
            end: '+=' + distance
        }
    })

    let transformBetweenTwoTicks = 0
    let oldTransform = 0
    function tick() {
        const currentTransform = gsap.getProperty(cardsContainer, "x")
        transformBetweenTwoTicks = currentTransform - oldTransform
        oldTransform = currentTransform
    }

    cards.forEach(card => {
        ScrollTrigger.create({
            trigger: card,
            containerAnimation: scrollTween,
            start: 'left 100%',
            end: 'right 0%',
            onEnter: () => {
                transformCard(card.children[0])
            },
            onEnterBack: () => {
                transformCard(card.children[0])
            }
        })
    })

    function transformCard(el) {
        gsap.fromTo(el, {
            xPercent: -transformBetweenTwoTicks * 3,
        }, {
            xPercent: 0,
            ease: 'power3.out',
            duration: 0.7
        })
    }

    // PLAY/PAUSE TICKER WHEN IN/OFF SCREEN
    ScrollTrigger.create({
        trigger: root,
        onEnter: () => {gsap.ticker.add(tick)},
        onLeave: () => {gsap.ticker.remove(tick)},
        onEnterBack: () => {gsap.ticker.add(tick)},
        onLeaveBack: () => {gsap.ticker.remove(tick)},
    })
})