window.addEventListener("DOMContentLoaded", () => {
    const root = document.querySelector('.mwg_effect101')

    const mediasUrls = []
    root.querySelectorAll('.medias-loader img').forEach(el => {
        mediasUrls.push(new URL(el.getAttribute('src'), document.baseURI).href)
    })

    const Z_SPACING = 52
    const amplitude = { value: 0 }

    const mediaItems = []
    let scrollIncr = 0
    let waveIncr = 0
    let interactionTimeout

    let isTouch = false
	gsap.matchMedia().add("(hover: none)", () => {isTouch = true})

    const medias = root.querySelectorAll('.media')
    const count = medias.length
    const halfDepth = count / 2
    const totalSpan = count * Z_SPACING
    const waveDivisor = (count * Z_SPACING) / (2 * Math.PI)
    const baseY = -0.15 * window.innerHeight

    medias.forEach((media, index) => {
        const raw = scrollIncr - index * Z_SPACING
        mediaItems.push({
            el: media,
            index,
            z: 0,
            intensity: 0.4,
            lastStep: Math.floor(raw / totalSpan)
        })
        media.setAttribute('src', mediasUrls[index % mediasUrls.length])
        gsap.set(media, { 
            scale: 1,
            y: baseY,
            rotationX: 18
         })
    })
    
    function urlIndexFromSrc(src) {
        const resolved = new URL(src, document.baseURI).href
        const i = mediasUrls.indexOf(resolved)
        return i >= 0 ? i : 0
    }

    function getFirstItem(exclude) {
        const pool = exclude ? mediaItems.filter(i => i !== exclude) : mediaItems
        return pool.length ? [...pool].sort((a, b) => b.z - a.z)[0] : exclude
    }

    function getLastItem(exclude) {
        const pool = exclude ? mediaItems.filter(i => i !== exclude) : mediaItems
        return pool.length ? [...pool].sort((a, b) => a.z - b.z)[0] : exclude
    }

    function assignNewSrc(wrappingItem, direction) {
        const len = mediasUrls.length
        if (direction > 0) {
            const last = getLastItem(wrappingItem)
            const refIndex = urlIndexFromSrc(last.el.src)
            wrappingItem.el.src = mediasUrls[(refIndex - 1 + len) % len]
        } else {
            const first = getFirstItem(wrappingItem)
            const refIndex = urlIndexFromSrc(first.el.src)
            wrappingItem.el.src = mediasUrls[(refIndex + 1) % len]
        }
    }

    function revealFront(item) {
        gsap.killTweensOf(item.el, 'scale')
        gsap.fromTo(item.el, {
            scale: 0.9
        }, {
            scale: 1,
            ease: 'elastic.out(2, 0.6)',
            duration: 0.5,
            overwrite: true
        })
    }

    function updateIntensities() {
        const sorted = [...mediaItems].sort((a, b) => b.z - a.z)
        sorted.forEach((item, rank) => {
            item.intensity = 0.08 * rank + 0.1
        })
    }

    function render() {
        mediaItems.forEach(item => {
            const raw = scrollIncr - item.index * Z_SPACING
            const pos = ((raw % totalSpan) + totalSpan) % totalSpan
            item.z = halfDepth * Z_SPACING - pos
            const step = Math.floor(raw / totalSpan)

            if (step !== item.lastStep) {
                const direction = step > item.lastStep ? 1 : -1
                const steps = Math.abs(step - item.lastStep)
                for (let i = 0; i < steps; i++) {
                    assignNewSrc(item, direction)
                }
                item.justWrapped = true
            }
            item.lastStep = step
        })

        const front = [...mediaItems].sort((a, b) => b.z - a.z)[0]
        if (front.justWrapped) {
            revealFront(front)
        }

        mediaItems.forEach(item => {
            item.justWrapped = false
        })

        updateIntensities()
    }
    render()

    function draw() {
        mediaItems.forEach(item => {
            const raw = scrollIncr - item.index * Z_SPACING
            const clampAmplitude = isTouch ? gsap.utils.clamp(-50, 50, amplitude.value) : amplitude.value

            gsap.set(item.el, {
                x: Math.sin(-raw / waveDivisor + waveIncr) * 200 * item.intensity * (clampAmplitude / 100),
                z: item.z
            })
        })
    }
    draw()

    const amplitudeTo = gsap.quickTo(amplitude, 'value', {
        duration: 2,
        ease: 'power4',
        onUpdate: () => {
            waveIncr += amplitude.value / 600
            draw()
        }
    })

    function applyScroll(deltaY) {
        scrollIncr -= deltaY / 20 // 20 is to handle the speed of the z-axis movement
        render()
        amplitudeTo(deltaY)

        window.clearTimeout(interactionTimeout)
        interactionTimeout = setTimeout(() => {
            amplitudeTo(0)
        }, 66)
    }

    const gsapObs = Observer.create({
        target: root,
        type: 'wheel,touch,pointer',
        onWheel: (e) => {
            applyScroll(e.deltaY)
        },
        onDrag: (e) => {
            isTouch ? applyScroll(e.deltaY * 6) : applyScroll(e.deltaY * 2)
        }
    })

    // KILL
    const observer = new MutationObserver(mutations => {
        const isRootRemoved = mutations.some(mutation =>
            mutation.type === 'childList' &&
            Array.from(mutation.removedNodes).includes(root)
        )
        if (isRootRemoved) {
            gsapObs.kill()
            window.clearTimeout(interactionTimeout)
            observer.disconnect()
        }
    })
    observer.observe(document.body, { childList: true, subtree: true })
})