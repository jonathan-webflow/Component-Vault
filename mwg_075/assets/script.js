window.addEventListener("DOMContentLoaded", () => {

    /* LENIS SMOOTH SCROLL (OPTIONAL) */
    lenis = new Lenis({
        autoRaf: true,
    })
    /* LENIS SMOOTH SCROLL (OPTIONAL) */

    const root = document.querySelector('.mwg_effect075')
    const pinHeight = root.querySelector('.pin-height')
    const container = root.querySelector('.container')

    const circlesElement = root.querySelector('.circles')
    const circles = root.querySelectorAll('.circle')

    const angle = 5

    let currentIndex = -1
    ScrollTrigger.create({
        trigger: pinHeight,
        start: 'top top',
        end: 'bottom bottom',
        pin: container,
        scrub: true,
        onUpdate: self => {

            const index = Math.floor(self.progress * (circles.length));
            
            if(index !== currentIndex && index < circles.length) {

                if(index > currentIndex) {
                    circles[index].classList.add('on')
                    gsap.set(circles[index], {
                        rotation: (index) * angle
                    })
                    gsap.from(circles[index], {
                        scale: 0.94,
                        ease: 'elastic.out(0.6, 0.3)',
                        duration: 0.5
                    })
                } else if(index < currentIndex) {
                    circles[currentIndex].classList.remove('on')
                }

                gsap.to(circlesElement, {
                    rotation: - index * angle + (angle / 2) * index,
                    ease: 'elastic.out(0.6, 0.3)',
                    duration: 0.5
                })

                currentIndex = index
            }
        },
        onLeaveBack: () => {
            currentIndex = -1
            circles[0].classList.remove('on')
        }
    })
})