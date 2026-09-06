window.addEventListener("DOMContentLoaded", () => {

    /* LENIS SMOOTH SCROLL (OPTIONAL) */
    lenis = new Lenis({
        autoRaf: true,
    })
    /* LENIS SMOOTH SCROLL (OPTIONAL) */

    const root = document.querySelector('.mwg_effect060')
    const pinHeight = root.querySelector('.pin-height')
    const container = root.querySelector('.container')
    const slidesContainer = root.querySelector('.slides')
    const slides = Array.from(root.querySelectorAll('.slide'))

    // The 5 flex and clip-path values that define our visible "window"
    const flexValues = [0.1, 0.12, 0.56, 0.12, 0.1]
    const clipPathValues = [15, 5, 0, 5, 15, 15] // one extra value for the gsap fromTo start state
    
    // Initialize state on load (scroll at 0)
    slides.forEach((slide, index) => {
        const media = slide.querySelector('.media')
        if (index < 5) {
            // First 5 slides are set from the arrays
            gsap.set(slide, { flex: flexValues[index] })
            gsap.set(media, { clipPath: `inset(0% ${clipPathValues[index]}% round 20px)` })
        }
    })

    // Total number of steps: total slides minus 5
    const totalSteps = slides.length - 5

    gsap.set(slidesContainer, {
        height: window.innerHeight + (totalSteps - 2) * 0.01 * window.innerHeight + 'px'
    })

    // Master timeline driven by scroll
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: pinHeight,
            start: 'top top',
            end: 'bottom bottom',
            pin: container,
            scrub: true
        },
        defaults: {
            duration: 1,
            ease: 'none'
        }
    })

    // Build the timeline step by step
    for (let i = 0; i < totalSteps; i++) {
        
        // 1. The slide exiting at the top disappears (flex 0 and clip-path)
        tl.to(slides[i], {
            flex: 0
        }, i)

        tl.to(slides[i].querySelector('.media'), {
            clipPath: 'inset(0% 15% round 20px)'
        }, i)

        tl.to(slidesContainer, {
            y: '-=' + 0.01 * window.innerHeight + 'px'
        }, i)

        // 2. The next 5 slides shift into their new positions
        for (let j = 0; j < 5; j++) {
            const slideIdx = i + 1 + j
            if (slides[slideIdx]) {
                const media = slides[slideIdx].querySelector('.media')

                tl.to(slides[slideIdx], {
                    flex: flexValues[j]
                }, i)

                tl.fromTo(media, {
                    clipPath: 'inset(0% ' + clipPathValues[j + 1] + '% round 20px)',
                }, {
                    clipPath: 'inset(0% ' + clipPathValues[j] + '% round 20px)'
                }, i)
            }
        }
    }
})