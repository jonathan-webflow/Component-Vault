window.addEventListener("DOMContentLoaded", () => {

    /* LENIS SMOOTH SCROLL (OPTIONAL) */
    lenis = new Lenis({
        autoRaf: true,
    })
    /* LENIS SMOOTH SCROLL (OPTIONAL) */

    const root = document.querySelector('.mwg_effect112')
    const titles = root.querySelector('.titles')
    const lines = root.querySelectorAll('.titles p')
    const { Engine, World, Bodies, Body } = Matter

    const mobile = window.matchMedia('(max-width: 767px)')
    const shuffle = arr => [...arr].sort(() => Math.random() - 0.5)

    const engine = Engine.create({ gravity: { x: 0, y: 0 } })
    const letters = [] // letters currently simulated
    const scrollTriggers = []

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

    function tick() {
        Engine.update(engine, 1000 / 60)
        letters.forEach(l => {
            gsap.set(l.dom, {
                x: l.body.position.x - l.ix,
                y: l.body.position.y - l.iy,
                rotation: l.body.angle * 40,
                scale: l.scale,
            })
        })
    }

    function startTicker() {
        gsap.ticker.remove(tick)
        gsap.ticker.add(tick)
    }

    // Freezes the letter on its last simulated transform
    function releaseLetter(l) {
        const i = letters.indexOf(l)
        if (i === -1) return
        letters.splice(i, 1)
        World.remove(engine.world, l.body)
        if (!letters.length) gsap.ticker.remove(tick)
    }

    document.fonts.ready.then(() => {
        lines.forEach(line => {
            const split = SplitText.create(line, {
                type: 'chars',
                charsClass: 'char'
            })

            split.chars.forEach(char => {
                const inner = document.createElement('span')
                inner.className = 'char-inner'
                inner.textContent = char.textContent
                char.textContent = ''
                char.appendChild(inner)
            })

            let lineLetters = []
            let exploded = false

            function explode() {
                const inners = line.querySelectorAll('.char-inner')
                gsap.killTweensOf(inners)
                gsap.set(inners, { clearProps: 'transform,opacity,visibility' })

                const titlesRect = titles.getBoundingClientRect()
                const lineRect = line.getBoundingClientRect()
                const cx = lineRect.left + lineRect.width / 2 - titlesRect.left
                const cy = lineRect.top + lineRect.height / 2 - titlesRect.top
                const power = mobile.matches ? 0.45 : 1

                lineLetters = []
                inners.forEach(inner => {
                    const r = inner.getBoundingClientRect()
                    if (!r.width) return

                    const x = r.left + r.width / 2 - titlesRect.left
                    const y = r.top + r.height / 2 - titlesRect.top
                    const body = Bodies.rectangle(x, y, r.width, r.height, {
                        frictionAir: 0.08,
                        restitution: 0.4,
                        density: 0.001,
                    })

                    const dx = x - cx
                    const dy = y - cy
                    const dist = Math.hypot(dx, dy) || 1
                    const speed = (9 + Math.random() * 10) * power * 1.5
                    Body.setVelocity(body, {
                        x: dx / dist * speed + (Math.random() - 0.5) * 2,
                        y: dy / dist * speed - (Math.random() * 5 + 8)
                    })
                    Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.5)

                    const letter = { dom: inner, body, ix: x, iy: y, scale: 1 }
                    lineLetters.push(letter)
                    letters.push(letter)
                    World.add(engine.world, body)
                })

                startTicker()

                shuffle(lineLetters).forEach((l, i) => {
                    const delay = 0.4 + i * 0.006
                    gsap.to(l, {
                        scale: 0.8,
                        duration: 0.2,
                        delay,
                        ease: 'back.in(2)'
                    })
                    gsap.to(l.dom, {
                        autoAlpha: 0,
                        duration: 0.2,
                        delay,
                        ease: 'power3.in',
                        onComplete: () => releaseLetter(l)
                    })
                })
            }

            function reset() {
                shuffle(lineLetters).forEach((l, i) => {
                    gsap.killTweensOf([l, l.dom])
                    releaseLetter(l)

                    gsap.to(l.dom, {
                        x: 0,
                        y: 0,
                        scale: 1,
                        rotation: 0,
                        delay: i * 0.005,
                        duration: 0.3,
                        ease: 'back.out(.6)',
                        onComplete: () => {
                            gsap.set(l.dom, { clearProps: 'transform' })
                        }
                    })
                    gsap.to(l.dom, {
                        autoAlpha: 1,
                        delay: i * 0.005,
                        duration: 0.06,
                        ease: 'power2.inOut'
                    })
                })

                lineLetters = []
            }

            scrollTriggers.push(ScrollTrigger.create({
                trigger: line,
                start: 'top center',
                onEnter: () => {
                    if (exploded) return
                    exploded = true
                    explode()
                },
                onLeaveBack: () => {
                    if (!exploded) return
                    exploded = false
                    reset()
                }
            }))
        })
    })

    // KILL
    const observer = new MutationObserver(mutations => {
        const isRootRemoved = mutations.some(mutation =>
            mutation.type === 'childList' &&
            Array.from(mutation.removedNodes).includes(root)
        )
        if (isRootRemoved) {
            gsap.ticker.remove(tick)
            observer.disconnect()
        }
    })
    observer.observe(document.body, { childList: true, subtree: true })
})