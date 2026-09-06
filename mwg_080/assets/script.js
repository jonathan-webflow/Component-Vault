window.addEventListener("DOMContentLoaded", () => {

    const root = document.querySelector('.mwg_effect080')
    const mediaElements = root.querySelectorAll('.media')

    const vw = window.innerWidth
    const vh = window.innerHeight
    const clampX = gsap.utils.clamp(0, vw)
    const clampY = gsap.utils.clamp(0, vh)

    const { Engine, World, Bodies, Runner, Body } = Matter
    const engine = Engine.create()
    engine.world.gravity.x = 0
    engine.world.gravity.y = 0

    const airExtra = [0.1, 0.25, 0.35]
    
    // Spread the NodeList into a real Array so we can use .map() to build
    // mediaItems in one pass (NodeList.forEach exists, but has no .map()).
    const mediaItems = [...mediaElements].map((el, i) => {
        const img = el.querySelector('img')
        if (img.naturalWidth > img.naturalHeight) {
            img.classList.add('landscape')
        }

        const w = el.clientWidth
        const h = el.clientHeight
        const body = Bodies.rectangle(
            vw / 2 + (Math.random() - 0.5) * 0.6 * vw,
            vh / 2 + (Math.random() - 0.5) * 0.4 * vh,
            w, h,
            { frictionAir: 0.05 + airExtra[i % 3] }
        )
        World.add(engine.world, body)
        return { el, body, w, h }
    })

    let targetX = vw / 2
    let targetY = vh / 2
    const force = { multiplier: 0 }

    function applyMove(clientX, clientY) {
        targetX = clampX(clientX)
        targetY = clampY(clientY)
        gsap.to(force, { multiplier: 1, duration: 0.15, overwrite: true })
        gsap.to(force, { multiplier: 0, duration: 0.6, delay: 0.15 })
    }
    function handleMouseMove(e) {
        applyMove(e.clientX, e.clientY)
    }
    function handleTouchMove(e) {
        if (!e.touches || !e.touches[0]) return
        applyMove(e.touches[0].clientX, e.touches[0].clientY)
    }
    root.addEventListener('mousemove', handleMouseMove)
    root.addEventListener('touchstart', handleTouchMove, {passive: true})
    root.addEventListener('touchmove', handleTouchMove, {passive: true})

    const runner = Runner.create()
    Runner.run(runner, engine)

    function tick() {
        mediaItems.forEach(({ el, body, w, h }) => {
            Body.applyForce(body, body.position, {
                x: (targetX - body.position.x) * 0.0012 * force.multiplier,
                y: (targetY - body.position.y) * 0.0012 * force.multiplier
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