window.addEventListener("DOMContentLoaded", () => {

    /* LENIS SMOOTH SCROLL (OPTIONAL) */
    lenis = new Lenis({
        autoRaf: true,
    })
    /* LENIS SMOOTH SCROLL (OPTIONAL) */

    const pinHeight = document.querySelector('.mwg_effect073 .pin-height')
    const container = document.querySelector('.mwg_effect073 .container')
    const titles = document.querySelectorAll('.mwg_effect073 .title')

    const scrollTween = gsap.to(container, {
        xPercent: -100,
        x: window.innerWidth,
        ease: 'none',
        scrollTrigger: {
            trigger: pinHeight,
            start: 'top top',
            end: 'bottom bottom',
            pin: container,
            scrub: true
        }
    })

    titles.forEach(title => {
        gsap.to(title, {
            rotation: -90,
            x: window.innerWidth - title.offsetHeight,
            y: title.offsetHeight,
            ease: 'expo.inOut',
            scrollTrigger: {
                trigger: title.parentNode,
                containerAnimation: scrollTween,
                start: 'left 0%',
                end: 'left -100%',
                scrub: true
            }
        })
        gsap.from(title, {
            rotation: 90,
            y: - window.innerHeight + title.offsetHeight,
            x: title.offsetHeight,
            ease: 'expo.inOut',
            scrollTrigger: {
                trigger: title.parentNode,
                containerAnimation: scrollTween,
                start: 'left 100%',
                end: 'left 0%',
                scrub: true
            }
        })
    })
})