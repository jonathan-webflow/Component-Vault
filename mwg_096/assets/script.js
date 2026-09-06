window.addEventListener("DOMContentLoaded", () => {

    /* LENIS SMOOTH SCROLL (OPTIONAL) */
    lenis = new Lenis({
        autoRaf: true,
    })
    /* LENIS SMOOTH SCROLL (OPTIONAL) */

    gsap.to('.scroll', {
        autoAlpha: 0,
        duration: 0.2,
        scrollTrigger: {
            trigger: '.mwg_effect096',
            start: 'top top',
            end: 'top top-=1',
            toggleActions: "play none reverse none"
        }
    })

    const root = document.querySelector('.mwg_effect096')
    const pinHeight = root.querySelector('.pin-height')
    const container = root.querySelector('.container')
    const mediaElements = root.querySelectorAll('.media')

    const vw = window.innerWidth
    const vh = window.innerHeight
    const centerX = vw / 2
    const centerY = vh / 2
    const forceStrength = 0.0004

    const { Engine, World, Bodies, Runner, Body } = Matter
    const engine = Engine.create({ gravity: { x: 0, y: 0 } })

    const mediaItems = [...mediaElements].map(el => {
        const img = el.querySelector('img')
        if (img.naturalWidth > img.naturalHeight) img.classList.add('landscape')

        const w = el.clientWidth
        const h = el.clientHeight
        const body = Bodies.rectangle(
            centerX + (Math.random() - 0.5) * 0.6 * vw,
            centerY + (Math.random() - 0.5) * 0.4 * vh,
            w, h,
            { frictionAir: 0.03 }
        )
        el.style.visibility = 'hidden'
        return { el, body, w, h }
    })

    const manageMediasVisibility = (progress) => {
        mediaItems.forEach((item, i) => {
            const threshold = mediaItems.length > 1 ? (i + 1) / mediaItems.length : 0
            const inWorld = engine.world.bodies.includes(item.body)

            if (progress >= threshold && !inWorld) {
                Body.setAngle(item.body, 0)
                World.add(engine.world, item.body)
                gsap.from(item.el.querySelector('img'), {
                    scale: 0.7,
                    duration: 0.2,
                    ease: 'back.out(3.5)'
                })
                item.el.style.visibility = 'visible'
            } else if (progress < threshold && inWorld) {
                World.remove(engine.world, item.body)
                item.el.style.visibility = 'hidden'
                Body.setPosition(item.body, {
                    x: centerX + (Math.random() - 0.5) * 0.6 * vw,
                    y: centerY + (Math.random() - 0.5) * 0.4 * vh,
                })
            }
        })
    }

    const runner = Runner.create()
    Runner.run(runner, engine)

    ScrollTrigger.create({
        trigger: pinHeight,
        start: 'top top',
        end: 'bottom bottom',
        pin: container,
        scrub: true,
        onUpdate: (self) => manageMediasVisibility(self.progress)
    })

    function tick() {
        mediaItems.forEach(({ el, body, w, h }) => {
            if (!engine.world.bodies.includes(body)) return

            Body.applyForce(body, body.position, {
                x: (centerX - body.position.x) * forceStrength,
                y: (centerY - body.position.y) * forceStrength
            })

            el.style.transform = `translate(${body.position.x - w / 2}px, ${body.position.y - h / 2}px) rotate(${body.angle}rad)`
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