window.addEventListener("DOMContentLoaded", () => {

    /* LENIS SMOOTH SCROLL (OPTIONAL) */
    lenis = new Lenis({
        autoRaf: true,
    })
    /* LENIS SMOOTH SCROLL (OPTIONAL) */

    const root = document.querySelector('.mwg_effect076')
    const pinHeight = root.querySelector('.pin-height')
    const container = root.querySelector('.container')
    const circlesElement = root.querySelector('.circles')
    const circles = root.querySelectorAll('.circle')
    const text = container.querySelector('p')
    const total = circles.length

    let currentIndex = -1

    gsap.to(text, {
        autoAlpha: 1,
        duration: 0.2,
        scrollTrigger: {
            trigger: pinHeight,
            start: 'top top',
            toggleActions: 'play none none reverse'
        }
    })
    gsap.to(circlesElement, {
        rotation: -120,
        ease: 'none',
        scrollTrigger: {
            trigger: pinHeight,
            start: 'top top',
            end: 'bottom bottom',
            pin: container,
            scrub: 1,
            onUpdate: ({ progress }) => {
                const index = Math.floor(progress * total)
                if (progress < 0.001) {
                    if (currentIndex >= 0) {
                        circles[currentIndex].classList.remove('on')
                        currentIndex = -1
                    }
                    return
                }
                if (index === currentIndex || index >= total) return

                if (index > currentIndex) {
                    circles[index].classList.add('on')
                    gsap.fromTo(circles[index], { scale: 1.2 }, {
                        scale: 1,
                        ease: 'back.out(4)',
                        duration: 0.4
                    })
                } else {
                    circles[currentIndex].classList.remove('on')
                }

                distributeCircles(index)
                currentIndex = index
            },
            onLeaveBack: () => {
                currentIndex = -1
                circles[0].classList.remove('on')
            }
        }
    })

    function distributeCircles(index) {
        if (index === 0) {
            gsap.to(circles[0], { rotation: 0, ease: 'elastic.out(0.8,0.3)', duration: 1 })
            return
        }

        const prevAngle = gsap.getProperty(circles[index - 1], 'rotation')
        const startAngle = (index === 1 && gsap.getProperty(circles[0], 'rotation') === prevAngle)
            ? 180
            : 200 + prevAngle / 2

        gsap.set(circles[index], { rotation: startAngle })

        for (let i = 0; i <= index; i++) {
            gsap.to(circles[i], {
                rotation: 360 / (index + 1) * i + 20 * index,
                ease: 'elastic.out(0.8,0.3)',
                duration: 1
            })
        }
    }
})