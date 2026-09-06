window.addEventListener("DOMContentLoaded", () => {
    const root = document.querySelector('.mwg_effect103')
    const container = root.querySelector('.container')
    const travel = container.offsetWidth
    const mediasUrls = [...root.querySelectorAll('.medias-loader img')].map(el =>
        new URL(el.getAttribute('src'), document.baseURI).href
    )

    const medias = root.querySelectorAll('.media')
    const n = medias.length
    const mediaItems = []
    const zPeak = 0.3 * window.innerWidth
    const centerIndex = (n - 1) / 2
    const step = 1 / n
    const mod = (v, m) => (v % m + m) % m
    const timelines = []
    const maxZ = Math.ceil(n / 2)
    const ease = 'power2.inOut'
    const easeFn = gsap.parseEase(ease)
    const zPhaseStart = 4 * Math.PI / 3
    const zPhaseSpan = 7 * Math.PI / 3

    const posState = { pos: 0 }
    let dragTarget = 0
    let didDrag = false
    let posTo
    const dragFactor = 0.5 / window.innerWidth

    function zAt(p) {
        return Math.sin(zPhaseStart + p * zPhaseSpan) * zPeak + 0.5 * zPeak;
    }

    function progressFor(i) {
        return mod(0.5 + (i - centerIndex) * step + posState.pos, 1)
    }

    function distanceFromCenter(progress) {
        const d = Math.abs(progress - 0.5)
        return Math.min(d, 1 - d)
    }

    function updateZIndexes() {
        medias.forEach((media, i) => {
            const steps = Math.round(distanceFromCenter(timelines[i].progress()) / step)
            media.style.zIndex = maxZ - steps
        })
    }

    medias.forEach((media, index) => {
        const img = media.querySelector('img')
        const raw = (index - centerIndex) * step + posState.pos
        mediaItems.push({
            img,
            index,
            progress: 0,
            lastStep: Math.floor(raw + 0.5)
        })

        const tl = gsap.timeline({ paused: true })
        tl.to(media, {
            x: travel,
            xPercent: -100,
            duration: 1,
            ease,
            onUpdate() {
                gsap.set(this.targets()[0], { z: zAt(easeFn(this.progress())) })
                updateZIndexes()
            }
        })

        tl.fromTo(media, { scale: 0.66 }, { scale: 1, duration: 0.4, ease: 'power2.in' }, 0)
        tl.fromTo(img, { xPercent: -10, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 1, duration: 0.02, ease: 'power1.in' }, 0)
        tl.fromTo(media, { scale: 1 }, { scale: 0.66, duration: 0.4, delay: 0.6, ease: 'power2.out' }, 0)
        tl.fromTo(img, { xPercent: 0, autoAlpha: 1 }, { xPercent: 10, autoAlpha: 0, duration: 0.02, delay: 0.98, ease: 'power1.out' }, 0)

        timelines.push(tl)
    })

    function urlIndexFromSrc(src) {
        const resolved = new URL(src, document.baseURI).href
        const i = mediasUrls.indexOf(resolved)
        return i >= 0 ? i : 0
    }

    function getFirstItem(exclude) {
        const pool = exclude ? mediaItems.filter(i => i !== exclude) : mediaItems
        return pool.length ? [...pool].sort((a, b) => b.progress - a.progress)[0] : exclude
    }

    function getLastItem(exclude) {
        const pool = exclude ? mediaItems.filter(i => i !== exclude) : mediaItems
        return pool.length ? [...pool].sort((a, b) => a.progress - b.progress)[0] : exclude
    }

    function assignNewSrc(wrappingItem, direction) {
        const len = mediasUrls.length
        if (direction > 0) {
            const last = getLastItem(wrappingItem)
            const refIndex = urlIndexFromSrc(last.img.src)
            wrappingItem.img.src = mediasUrls[(refIndex - 1 + len) % len]
        } else {
            const first = getFirstItem(wrappingItem)
            const refIndex = urlIndexFromSrc(first.img.src)
            wrappingItem.img.src = mediasUrls[(refIndex + 1) % len]
        }
    }

    function updateMediaUrls() {
        mediaItems.forEach(item => {
            const raw = (item.index - centerIndex) * step + posState.pos
            item.progress = progressFor(item.index)
            const stepVal = Math.floor(raw + 0.5)

            if (stepVal !== item.lastStep) {
                const direction = stepVal > item.lastStep ? 1 : -1
                const steps = Math.abs(stepVal - item.lastStep)
                for (let i = 0; i < steps; i++) {
                    assignNewSrc(item, direction)
                }
            }
            item.lastStep = stepVal
        })
    }

    function render() {
        timelines.forEach((tl, i) => tl.progress(progressFor(i)))
        updateMediaUrls()
    }

    function nearestPosFor(targetMod) {
        let delta = mod(targetMod - posState.pos, 1)
        if (delta > 0.5) delta -= 1
        return posState.pos + delta
    }

    function posForIndex(index) {
        return nearestPosFor(mod((centerIndex - index) * step, 1))
    }

    function centeredIndex() {
        return mod(Math.round(centerIndex - posState.pos / step), n)
    }

    function animateToIndex(index, duration, ease) {
        gsap.to(posState, {
            pos: posForIndex(index),
            duration,
            ease,
            overwrite: true,
            onUpdate: render
        })
    }

    function resetPosTo() {
        posTo = gsap.quickTo(posState, 'pos', {
            duration: 0.5,
            ease: 'power3',
            onUpdate: render
        })
    }

    mediaItems.forEach((item, index) => {
        item.img.src = mediasUrls[index % mediasUrls.length]
    })
    render()

    const gsapObs = Observer.create({
        target: root,
        type: 'pointer,touch',
        onPress: () => {
            didDrag = false
            gsap.killTweensOf(posState)
            resetPosTo()
            dragTarget = posState.pos
        },
        onDrag: (self) => {
            if (Math.abs(self.deltaX) > 2) didDrag = true
            dragTarget += self.deltaX * dragFactor
            posTo(dragTarget)
        },
        onRelease: () => animateToIndex(centeredIndex(), 0.6, 'expo.out')
    })

    medias.forEach((media, index) => {
        media.addEventListener('click', () => {
            if (didDrag) return
            const indexToCenter = centeredIndex() === index ? mod(index + 1, n) : index
            animateToIndex(indexToCenter, 1, 'expo.inOut')
        })
    })

    // KILL
    const observer = new MutationObserver(mutations => {
        const isRootRemoved = mutations.some(mutation =>
            mutation.type === 'childList' &&
            Array.from(mutation.removedNodes).includes(root)
        )
        if (isRootRemoved) {
            gsapObs.kill()
            gsap.killTweensOf(posState)
            timelines.forEach(tl => tl.kill())
            observer.disconnect()
        }
    })
    observer.observe(document.body, { childList: true, subtree: true })
})