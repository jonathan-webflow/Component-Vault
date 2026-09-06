window.addEventListener("DOMContentLoaded", () => {

    /* LENIS SMOOTH SCROLL (OPTIONAL) */
    lenis = new Lenis({
        autoRaf: true,
    })
    /* LENIS SMOOTH SCROLL (OPTIONAL) */

    const root = document.querySelector('.mwg_effect104')
    const pinHeight = root.querySelector('.pin-height')
    const container = root.querySelector('.container')
    const svgPath = root.querySelector('#line')
    const track = root.querySelector('#track')

    const GAP = 90
    const IMG_HEIGHT = 310
    let segments = []
    let totalLength = 0
    let scrollProgress = 0
    let scrollSt, wheelTimeout, prevScroll = null

    const morphTl = gsap.timeline({ paused: true })
        .to('#line', { morphSVG: '#wave', duration: 1, ease: 'none' })

    const amplitude = { value: 0 }
    const amplitudeTo = gsap.quickTo(amplitude, 'value', {
        duration: 1,
        ease: 'power2',
        onUpdate: () => {
            morphTl.progress(gsap.utils.clamp(0, 1, amplitude.value / 50))
            update()
        }
    })

    function sizeImages() {
        return Promise.all([...track.querySelectorAll('image.segment')].map(img =>
            new Promise(resolve => {
                const probe = new Image()
                const apply = () => {
                    img.setAttribute('width', Math.round(IMG_HEIGHT * probe.naturalWidth / probe.naturalHeight))
                    img.setAttribute('height', IMG_HEIGHT)
                    resolve()
                }
                probe.onload = apply
                probe.onerror = resolve
                probe.src = img.getAttribute('href')
                if (probe.complete) apply()
            })
        ))
    }

    function measureTextWidth(textEl, content) {
        const fontSize = parseFloat(textEl.getAttribute('font-size')) || 350
        const canvas = measureTextWidth._canvas || (measureTextWidth._canvas = document.createElement('canvas'))
        const ctx = canvas.getContext('2d')
        const { fontWeight, fontFamily } = getComputedStyle(textEl)
        ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`
        return ctx.measureText(content).width
    }

    function measureSegments() {
        segments = [...track.children].map(el => {
            if (el.tagName === 'image') {
                const w = +el.getAttribute('width'), h = +el.getAttribute('height')
                return { type: 'image', el, size: w, width: w, height: h }
            }
            const tp = el.querySelector('textPath')
            return { type: 'text', el, textPath: tp, size: measureTextWidth(el, tp.textContent) }
        })
        totalLength = segments.reduce((sum, seg, i) =>
            sum + seg.size + (i < segments.length - 1 ? GAP : 0), 0)
    }

    function placeImageOnPath(el, len, width, height) {
        const pl = svgPath.getTotalLength()
        if (len < -width || len > pl + width) { el.style.opacity = 0; return }

        el.style.opacity = 1
        const clamped = gsap.utils.clamp(0, pl, len)
        const pt = svgPath.getPointAtLength(clamped)
        const next = svgPath.getPointAtLength(gsap.utils.clamp(0, pl, clamped + 1))
        const angle = Math.atan2(next.y - pt.y, next.x - pt.x) * 180 / Math.PI

        el.setAttribute('x', pt.x - width / 2)
        el.setAttribute('y', pt.y - height)
        el.setAttribute('transform', `rotate(${angle} ${pt.x} ${pt.y})`)
    }

    function update() {
        const pl = svgPath.getTotalLength()
        let cursor = pl + totalLength - scrollProgress * (pl + totalLength)

        for (let i = segments.length - 1; i >= 0; i--) {
            const seg = segments[i]
            cursor -= seg.size

            if (seg.type === 'image') {
                placeImageOnPath(seg.el, cursor + seg.size / 2, seg.width, seg.height)
            } else {
                seg.textPath.setAttribute('startOffset', `${(cursor / pl) * 100}%`)
                seg.el.style.opacity = (cursor >= pl || cursor + seg.size <= 0) ? 0 : 1
            }
            cursor -= GAP
        }
    }

    function bumpAmplitude(amount) {
        amplitudeTo(Math.abs(amount))
        clearTimeout(wheelTimeout)
        wheelTimeout = setTimeout(() => amplitudeTo(0), 66)
    }

    function handleWheel(e) {
        bumpAmplitude(e.deltaY)
    }

    Promise.all([
        document.fonts.ready,
        ...[...track.querySelectorAll('text.segment')].map(el => {
            const fontSize = el.getAttribute('font-size') || '350'
            return document.fonts.load(`500 ${fontSize}px LayGrotesk`)
        }),
        sizeImages()
    ]).then(() => {
        measureSegments()
        update()

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

        scrollSt = ScrollTrigger.create({
            trigger: pinHeight,
            start: 'top top',
            end: 'bottom bottom',
            pin: container,
            scrub: true,
            onUpdate: self => {
                const scroll = self.scroll()
                if (prevScroll != null) bumpAmplitude(scroll - prevScroll)
                prevScroll = scroll
                scrollProgress = self.progress
                update()
            }
        })

        root.addEventListener('wheel', handleWheel, { passive: true })
        ScrollTrigger.refresh()
    })

    // KILL
    const observer = new MutationObserver(mutations => {
        const isRootRemoved = mutations.some(mutation =>
            mutation.type === 'childList' &&
            Array.from(mutation.removedNodes).includes(root)
        )
        if (isRootRemoved) {
            root.removeEventListener('wheel', handleWheel)
            window.clearTimeout(wheelTimeout)
            scrollSt?.kill()
            tl.kill()
            observer.disconnect()
        }
    })
    observer.observe(document.body, { childList: true, subtree: true })
})