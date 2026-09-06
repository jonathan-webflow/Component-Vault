window.addEventListener("DOMContentLoaded", () => {

	/* LENIS SMOOTH SCROLL (OPTIONAL) */
    lenis = new Lenis({
        autoRaf: true,
    })
    /* LENIS SMOOTH SCROLL (OPTIONAL) */

    document.fonts.ready.then(() => {

        const root = document.querySelector('.mwg_effect079')
        const pinHeight = root.querySelector('.pin-height')
        const container = root.querySelector('.container')
        const text = root.querySelector('.text')

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
        
        SplitText.create(text, { 
            type: "chars",
            charsClass: "char"
        })

        const chars = text.querySelectorAll('.char')
        gsap.set(pinHeight, {
            height: text.clientWidth - document.body.clientWidth
        })

        gsap.to(text, {
            xPercent: -100,
            x: document.body.clientWidth,
            ease: 'none',
            scrollTrigger: {
                trigger: pinHeight,
                start: "top top",
                end: "bottom bottom",
                scrub: true,
                pin: container
            }
        })

        const master = gsap.timeline({
            scrollTrigger: {
                trigger: pinHeight,
                start: "top top",
                end: "bottom bottom",
                scrub: true
            }
        })

        const duration = 0.5
        const letterTotal = duration * 2
        const simultaneousLetters = 6
        const offset = letterTotal / simultaneousLetters

        chars.forEach((char, i) => {
            const tl = gsap.timeline()

            tl.to(char, {
                '--wght': 750,
                duration,
                ease: 'power1.inOut'
            }).to(char, {
                '--wght': 250,
                duration,
                ease: 'power1.inOut'
            })

            master.add(tl, i * offset)
        })
    })
})