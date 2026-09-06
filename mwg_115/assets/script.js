window.addEventListener("DOMContentLoaded", () => {

    /* LENIS SMOOTH SCROLL (OPTIONAL) */
    lenis = new Lenis({
        autoRaf: true,
    })
    /* LENIS SMOOTH SCROLL (OPTIONAL) */
	
    const root = document.querySelector('.mwg_effect115')
    const pinHeight = root.querySelector('.pin-height')
    const container = root.querySelector('.container')
    const roll = root.querySelector('.roll')
    const lines = root.querySelectorAll('.line')

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

    const radius = (window.innerWidth <= 768 ? 0.4 : 0.6) * window.innerHeight
    const zOffset = -radius/3
    const lineHeight = lines[0].offsetHeight
    const angle = 2 * Math.asin(Math.min(lineHeight / (2 * radius), 0.99)) * (180 / Math.PI)
    const visibleAngle = Math.asin(Math.min(window.innerHeight / (2 * radius), 0.99)) * (180 / Math.PI)
    const lineCount = lines.length
    const startRot = -visibleAngle - angle
    const endRot = startRot + lineCount * angle + 2 * visibleAngle

    lines.forEach((line, i) => {
        gsap.set(line, {
            xPercent: -50,
            yPercent: -50,
            rotateX: -i * angle
        })
        gsap.set(line.children, {
            z: radius
        })
    })

    gsap.set(roll, {
        z: zOffset
    })

    gsap.fromTo(roll, {
        rotateX: startRot
    }, {
        rotateX: endRot,
        ease: 'none',
        scrollTrigger: {
            trigger: pinHeight,
            start: 'top top',
            end: 'bottom bottom',
            pin: container,
            scrub: true
        }
    })
})