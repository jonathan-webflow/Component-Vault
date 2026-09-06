window.addEventListener("DOMContentLoaded", () => {

    /* LENIS SMOOTH SCROLL (OPTIONAL) */
    lenis = new Lenis({
        autoRaf: true,
    })
    /* LENIS SMOOTH SCROLL (OPTIONAL) */
    
    const root = document.querySelector('.mwg_effect102')
    const pinHeight = root.querySelector('.pin-height')
    const container = root.querySelector('.container')
    const paragraphs = root.querySelectorAll('p')

    const master = gsap.timeline({
        scrollTrigger: {
            trigger: pinHeight,
            start: 'top top',
            end: 'bottom bottom',
            pin: container,
            scrub: true
        }
    })

    const transitions = paragraphs.length - 1
    const step = transitions > 0 ? 1 / transitions : 1
    const ease = 'expo.inOut'

    gsap.set(paragraphs, {
        rotateX: -90
    })
    gsap.set(paragraphs[0], {
        rotateX: 0
    })

    for (let i = 0; i < paragraphs.length - 1; i++) {
        const pos = i * step

        let angle = 20
        if (i % 2 === 0) {
            angle = -angle
        }

        // ELEMENT OUT
        master.to(paragraphs[i], {
            rotateX: 90,
            duration: step,
            ease
        }, pos)
        master.to(paragraphs[i].querySelector('span'), {
            rotateZ: angle,
            duration: step,
            ease
        }, pos)
        master.to(paragraphs[i].querySelector('span'), {
            autoAlpha: 0,
            duration: 0.2 * step,
            delay: 0.5 * step,
            ease
        }, pos)

        // ELEMENT IN
        master.fromTo(paragraphs[i + 1], {
            rotateX: -90,
        }, {
            rotateX: 0,
            ease,
            duration: step
        }, pos)
        master.from(paragraphs[i + 1].querySelector('span'), {
            rotateZ: angle,
            ease,
            duration: step
        }, pos)
        master.from(paragraphs[i + 1].querySelector('span'), {
            autoAlpha: 0,
            duration: 0.2 * step,
            delay: 0.3 * step,
            ease
        }, pos)
    }
})