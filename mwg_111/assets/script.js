window.addEventListener("DOMContentLoaded", () => {

    const root = document.querySelector('.mwg_effect111')
    const content = root.querySelector('.content')
    const heroItems = [...root.querySelectorAll('.media')]
    const textState1 = root.querySelector('.text-state-1')
    const textState2 = root.querySelector('.text-state-2')
    const distDrag = content.clientWidth - window.innerWidth

    let isTouch = false
    let stopAutoplay = () => {}
    let scrollSt = null
    let gsapObs = null
    const mm = gsap.matchMedia()
    mm.add('(hover: none)', () => { isTouch = true })

    mm.add('(max-width: 900px)', () => {
        const heroContainer = root.querySelector('.container')
        heroContainer.scrollLeft = (heroContainer.scrollWidth - heroContainer.clientWidth) / 2
    })

    mm.add('(min-width: 901px)', () => {
        if (textState2) textState2.style.left = ''

        const EASE = 'expo.inOut'
        const NEG_MARGIN = 40
        const AUTOPLAY_DELAY = 2.5
        const AUTOPLAY_DURATION = 0.8

        let incrTick = 0
        let pivotIndex = Math.floor((heroItems.length - 1) / 2)
        let isPressed = false
        let isDragging = false
        let lastCenteredIndex = -1
        let autoplayCall = null
        let mediaCenters = []

        const syncCenters = () => {
            mediaCenters = heroItems.map(el => el.offsetLeft + el.offsetWidth / 2)
        }

        const setText = (el) => {
            const text = el?.dataset.text || ''
            textState1.textContent = text
            if (textState2) textState2.textContent = text
        }

        const findClosest = () => {
            if (mediaCenters.length !== heroItems.length) syncCenters()
            const halfVw = window.innerWidth / 2
            const left = content.getBoundingClientRect().left
            let best = 0
            let bestDist = Infinity
            for (let i = 0; i < heroItems.length; i++) {
                const d = Math.abs(left + mediaCenters[i] - halfVw)
                if (d < bestDist) { bestDist = d; best = i }
            }
            return best
        }

        const xTo = gsap.quickTo(content, 'x', {
            duration: 0.4,
            ease: 'power4',
            onUpdate: () => {
                if (!isPressed) return
                const closest = findClosest()
                if (closest !== lastCenteredIndex) {
                    lastCenteredIndex = closest
                    setText(heroItems[closest])
                }
            },
        })

        stopAutoplay = () => {
            autoplayCall?.kill()
            autoplayCall = null
        }

        const startAutoplay = () => {
            stopAutoplay()
            autoplayCall = gsap.delayedCall(AUTOPLAY_DELAY, () => {
                autoplayCall = null
                if (isPressed) return
                centerItem((pivotIndex + 1) % heroItems.length, { duration: AUTOPLAY_DURATION })
            })
        }

        const reorderMediaDOM = () => {
            const N = heroItems.length
            const center = Math.floor(N / 2)
            if (pivotIndex === center) return

            const reordered = Array.from({ length: N }, (_, i) =>
                heroItems[(pivotIndex + i - center + N) % N]
            )
            reordered.forEach(el => content.appendChild(el))
            heroItems.splice(0, N, ...reordered)

            centerItem(center, { animate: false })
            syncCenters()
            setText(heroItems[center])
        }

        const centerItem = (index, { animate = true, duration = 0.4 } = {}) => {
            const el = heroItems[index]
            if (!el) return
            pivotIndex = index

            const vw = window.innerWidth
            const halfVw = vw / 2
            const distCenter = -el.offsetLeft + halfVw - el.offsetWidth / 2
            const pivotCenter = el.offsetLeft + el.offsetWidth / 2
            incrTick = distCenter

            if (animate) {
                gsap.to(textState1, { autoAlpha: 0, duration: 0.3, ease: EASE })
                gsap.to(content, {
                    x: distCenter,
                    ease: EASE,
                    duration,
                    onUpdate: () => {
                        if (isDragging) return
                        const x = gsap.getProperty(content, 'x')
                        xTo(x, x)
                    },
                    onComplete: () => {
                        gsap.to(textState1, { autoAlpha: 1, duration: 0.3, ease: EASE })
                        if (!isPressed) {
                            reorderMediaDOM()
                            startAutoplay()
                        }
                    }
                })
            } else {
                xTo(distCenter, distCenter)
            }

            heroItems.forEach((item, i) => {
                let vars
                if (i === index) {
                    vars = { x: 0, scale: 1.4 }
                } else {
                    const itemCenter = item.offsetLeft + item.offsetWidth / 2
                    const currentX = halfVw + (itemCenter - pivotCenter)
                    const edge = i < index
                        ? -item.offsetWidth / 2 + NEG_MARGIN
                        : vw + item.offsetWidth / 2 - NEG_MARGIN
                    const extra = Math.abs(i - index) === 1 ? 0 : (i < index ? -halfVw : halfVw)
                    vars = { x: edge - currentX + extra, scale: 1 }
                }

                if (animate) gsap.to(item, { ...vars, ease: EASE, duration })
                else gsap.set(item, vars)
            })
        }

        scrollSt = ScrollTrigger.create({
            trigger: root,
            start: 'top bottom',
            end: 'bottom top',
            onEnter: startAutoplay,
            onEnterBack: startAutoplay,
            onLeave: stopAutoplay,
            onLeaveBack: stopAutoplay,
        })

        // init + intro
        centerItem(pivotIndex, { animate: false })
        setText(heroItems[pivotIndex])

        const center = heroItems[pivotIndex]
        const neighbors = [heroItems[pivotIndex - 1], heroItems[pivotIndex + 1]]
        gsap.set([center, ...neighbors], { autoAlpha: 0 })
        gsap.fromTo(center,
            { autoAlpha: 1, scale: 1.25 },
            { autoAlpha: 1, scale: 1.4, ease: 'back.out(1.3)', duration: 0.4, delay: 0.3, immediateRender: false }
        )
        gsap.fromTo(neighbors,
            { autoAlpha: 1, scale: 0.85 },
            { autoAlpha: 1, scale: 1, ease: 'back.out(1.3)', duration: 0.4, delay: 0.3, immediateRender: false }
        )
        gsap.to(textState1, { autoAlpha: 1, duration: 0.8, ease: 'power4.inOut', delay: 0.7 })

        gsap.delayedCall(0.3, () => {
            root.classList.remove('intro-playing')
            if (isTouch) return

            gsapObs = Observer.create({
                target: root,
                type: 'pointer,touch',
                preventDefault: true,
                onPress: (self) => {
                    isPressed = true
                    stopAutoplay()
                    self?.event?.preventDefault?.()

                    gsap.killTweensOf(heroItems)
                    gsap.to(heroItems, { x: 0, scale: 1, ease: EASE, duration: 0.4 })

                    lastCenteredIndex = findClosest()
                    setText(heroItems[lastCenteredIndex])

                    root.classList.add('grey')
                    gsap.to(textState2, { autoAlpha: 1, duration: 0.3, ease: EASE, delay: 0.1 })
                },
                onRelease: () => {
                    if (!isPressed) return
                    isPressed = false
                    centerItem(findClosest())
                    root.classList.remove('grey')
                    gsap.to(textState2, { autoAlpha: 0, duration: 0.3, ease: EASE })
                },
                onDrag: () => { isDragging = true },
                onDragEnd: () => { isDragging = false },
                onChange: (e) => {
                    incrTick = gsap.utils.clamp(-distDrag, 0, incrTick + e.deltaX)
                    xTo(incrTick)
                },
            })
        })
    })

    // KILL
    const observer = new MutationObserver(mutations => {
        const isRootRemoved = mutations.some(mutation =>
            mutation.type === 'childList' &&
            Array.from(mutation.removedNodes).includes(root)
        )
        if (isRootRemoved) {
            stopAutoplay()
            scrollSt?.kill()
            gsapObs?.kill()
            mm.revert()
            observer.disconnect()
        }
    })
    observer.observe(document.body, { childList: true, subtree: true })
})