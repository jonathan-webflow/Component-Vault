window.addEventListener("DOMContentLoaded", () => {

    /* LENIS SMOOTH SCROLL (OPTIONAL) */
    lenis = new Lenis({
        autoRaf: true,
    })
    /* LENIS SMOOTH SCROLL (OPTIONAL) */

    const root = document.querySelector('.mwg_effect089')
    const text = root.querySelector('.text')
    let isTouch = false
	gsap.matchMedia().add("(hover: none)", () => {isTouch = true})
    
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

    wrapLettersInSpan(text)
    const spans = text.querySelectorAll('.letter')

    const { Engine, World, Bodies, Body, Constraint } = Matter
    const engine = Engine.create()
    engine.world.gravity.y = 0.5

    const group = Body.nextGroup(true)
    const scrollY = window.scrollY
    const mid = (spans.length - 1) / 2
    const letters = []

    spans.forEach((span, index) => {
        const rect = span.getBoundingClientRect()
        if (rect.width === 0) return

        const cx = rect.left + rect.width / 2
        const cy = rect.top + scrollY + rect.height / 2

        const body = Bodies.rectangle(cx, cy, rect.width, rect.height, {
            frictionAir: 0.05, restitution: 0.3, density: 0.001,
            collisionFilter: { group }
        })

        const constraint = Constraint.create({
            pointA: { x: cx, y: cy }, bodyB: body,
            stiffness: 0.005, damping: 0.004, length: 0
        })

        const normDist = mid === 0 ? 0 : Math.abs(index - mid) / mid

        letters.push({
            dom: span, body, constraint,
            initialX: cx, initialY: cy,
            weight: normDist * 1,
            width: rect.width
        })

        World.add(engine.world, [body, constraint])
    })

    for (let i = 0; i < letters.length - 1; i++) {
        World.add(engine.world, Constraint.create({
            bodyA: letters[i].body,
            bodyB: letters[i + 1].body,
            pointA: { x: letters[i].width / 2, y: 0 },
            pointB: { x: -letters[i + 1].width / 2, y: 0 },
            stiffness: 0.6, length: 0
        }))
    }

    ScrollTrigger.create({
        trigger: root,
        start: 'top 150%',
        end: 'bottom -50%',
        onEnter: () => gsap.ticker.add(tick),
        onEnterBack: () => gsap.ticker.add(tick),
        onLeave: () => gsap.ticker.remove(tick),
        onLeaveBack: () => gsap.ticker.remove(tick),
        onUpdate: (self) => {
            const velocity = self.getVelocity()
            letters.forEach(l => {
                l.constraint.pointA.y = l.initialY + velocity * 0.08 * l.weight
            })
        }
    })

    function tick() {
        Engine.update(engine, 1000 / 60)
        letters.forEach(l => {
            Body.setAngle(l.body, l.body.angle * 0.97)
            Body.setAngularVelocity(l.body, l.body.angularVelocity * 0.95)

            const dx = l.body.position.x - l.initialX
            const dy = l.body.position.y - l.initialY
            l.dom.style.transform = `translate(${dx}px, ${dy}px) rotate(${l.body.angle}rad)`
        })
    }

    function wrapLettersInSpan(element) {
        const textStr = element.textContent;
        element.innerHTML = textStr
            .split('')
            .map(char => char === ' ' ? '<span class="letter">&nbsp;</span>' : `<span class="letter">${char}</span>`)
            .join('');
    }

    // TOUCH PART
    function realign() {
        letters.forEach(l => {
            gsap.to(l.constraint.pointA, {
                y: l.initialY,
                duration: 0.35,
                ease: "power3.out",
                overwrite: true,
            })
        })
    }
    function handleTouchEnd() {
        realign()
    }
    if (isTouch) {
        window.addEventListener('touchend', handleTouchEnd, { passive: true })
        window.addEventListener('touchcancel', handleTouchEnd, { passive: true })
    }
})