window.addEventListener("DOMContentLoaded", () => {

    /* LENIS SMOOTH SCROLL (OPTIONAL) */
    lenis = new Lenis({
        autoRaf: true,
    })
    /* LENIS SMOOTH SCROLL (OPTIONAL) */

    document.fonts.ready.then(() => {
        const root = document.querySelector('.mwg_effect066')
        const pinHeight = root.querySelector('.pin-height')
        const container = root.querySelector('.container')

        gsap.to('.scroll', {
            autoAlpha: 0,
            duration: 0.2,
            scrollTrigger: {
                trigger: root,
                start: 'top top',
                end: 'top top-=1',
                toggleActions: "play none reverse none"
            }
        })

        const paragraph = container.querySelector('p')
        let split = SplitText.create(paragraph, { 
            type: "lines,chars",
            linesClass: "line",
            charsClass: "char",
        })

        const lineHeight = paragraph.clientHeight / split.lines.length
        gsap.set(paragraph, {
            yPercent: 50
        })

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: pinHeight,
                start: 'top top',
                end: 'bottom bottom',
                pin: container,
                scrub: true,
            }
        })

        const moveParagraph = (offsetIndex) => {
            gsap.killTweensOf(paragraph)
            gsap.to(paragraph, {
                y: -lineHeight * offsetIndex / 2,
                duration: 0.2,
                ease: 'power2.inOut'
                // ease: 'back.out(2)'
            })
        }

        // pour chaque ligne on ajoute un tween positionné avec un décalage (stagger)
        split.lines.forEach((line, i) => {
            tl.to(line, {
                maskImage: 'linear-gradient(90deg, #000 100%, transparent 125%)',
                ease: 'power1.inOut',
                duration: 1,
                onStart: () => moveParagraph(i + 1),
                onReverseComplete: () => moveParagraph(i),
            })
        })
    })
})