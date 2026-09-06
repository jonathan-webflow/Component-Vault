window.addEventListener("DOMContentLoaded", () => {

    const root = document.querySelector('.mwg_effect088')
    const container = root.querySelector('.container')
    const viewportWidth = document.body.clientWidth
    const inViewport = new Set()
    let total = 0
    let oldX = 0

    const mediasData = Array.from(root.querySelectorAll('.media-parent')).map(parent => ({
        parent,
        media: parent.querySelector('.media'),
        offsetLeft: parent.offsetLeft,
        width: parent.offsetWidth
    }))

    mediasData.forEach(({ parent, media, offsetLeft, width }) => {
        if (offsetLeft < viewportWidth && offsetLeft + width > 0) {
            inViewport.add(parent)
        } else {
            gsap.set(media, { autoAlpha: 0})
        }
    })

    const xTo = gsap.quickTo(container, "x", {
        duration: 0.5, 
        ease: 'power4',
        onUpdate: () => {
            checkViewport()
        }
    })

    function checkViewport() {
        const currentX = gsap.getProperty(container, "x")
        const delta = currentX - oldX
        if (delta === 0) return
        oldX = currentX

        mediasData.forEach(({ parent, media, offsetLeft, width }) => {
            const left = offsetLeft + currentX
            const isInView = left < viewportWidth && left + width > 0

            if (isInView && !inViewport.has(parent)) {
                inViewport.add(parent)

                const direction = Math.sign(delta)
                const xFrom = direction * (-100 / (1 + delta / 500))

                gsap.fromTo(media, {
                    x: xFrom * 4,
                    scale: 0.6,
                    autoAlpha: 1
                }, {
                    x: 0,
                    scale: 1,
                    duration: 0.8,
                    ease: 'power3.out'
                })
            } else if (!isInView && inViewport.has(parent)) {
                inViewport.delete(parent)
                gsap.set(media, { autoAlpha: 0 })
            }
        })
    }

    let isTouch = false
	gsap.matchMedia().add("(hover: none)", () => {isTouch = true})

    const gsapObs = Observer.create({
        target: container,
        type: "touch,pointer",
        onDrag: (self) => {
            total += isTouch ? (self.deltaX * 1.5) : (self.deltaX * 1.4)
            total = gsap.utils.clamp(document.body.clientWidth - container.clientWidth, 0, total)
            xTo(total)
        }
    })
})