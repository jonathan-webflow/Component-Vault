window.addEventListener("DOMContentLoaded", () => {

    /* LENIS SMOOTH SCROLL (OPTIONAL) */
    lenis = new Lenis({
        autoRaf: true,
    })
    /* LENIS SMOOTH SCROLL (OPTIONAL) */

    document.fonts.ready.then(() => {
        const root = document.querySelector('.mwg_effect052')
        const container = root.querySelector('.container')

        const linesContainer = root.querySelector('.lines')
        linesContainer.querySelectorAll('.line').forEach(line => wrapLettersInSpan(line))

        const letters = linesContainer.querySelectorAll('.letter')

        const distance = linesContainer.clientWidth - window.innerWidth
        
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

        const scrollTween = gsap.to(linesContainer, {
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

        letters.forEach(letter => {
            gsap.fromTo(letter.querySelector('span'), {
                autoAlpha: 0,
            }, {
                autoAlpha: 1,
                x: 0,
                ease: 'none',
                scrollTrigger:{
                    trigger: letter,
                    containerAnimation: scrollTween,
                    start:'left 90%' ,
                    // start:'left ' + (80 + Math.random() * 20) + '%' ,
                    end: '+=' + letter.offsetWidth,
                    scrub:true
                }
            })
        })
    })

    // UTILS
    function wrapLettersInSpan(element) {
        const text = element.textContent
        element.innerHTML = text
            .split('')
            .map(char => char === ' ' ? '<span>&nbsp;</span>' : `<span class="letter"><span>${char}</span></span>`)
            .join('')
    }
})