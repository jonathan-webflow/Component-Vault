window.addEventListener("DOMContentLoaded", () => {

    const root = document.querySelector('.mwg_effect071')
    const container = root.querySelector('.container')
    const medias = root.querySelectorAll('.media')

    const cols = Math.ceil(Math.sqrt(medias.length));
    container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    const W = document.body.clientWidth
    const H = window.innerHeight
    const clampX = gsap.utils.clamp(0, W)
    const clampY = gsap.utils.clamp(0, H)

    let mouse = {x: 0, y: 0}

    const innerRadius = 0.2 * W  // near-center band → scale = 1
    const outerRadius = 0.7 * W  // max distance → scale = 0.1

    const cW = container.clientWidth - W
    const cH = container.clientHeight - H

    const xTo = gsap.quickTo(container, 'x', {duration: 1, ease: 'power4', onUpdate: () => {
        medias.forEach((img, index) => {
            const rect = img.getBoundingClientRect()
            const centerX = rect.left + rect.width / 2
            const centerY = rect.top + rect.height / 2

            const dist = Math.hypot(mouse.x - centerX, mouse.y - centerY)
            
            let targetScale
            if(dist <= innerRadius) {
                targetScale = 1
            } else if(dist >= outerRadius) {
                targetScale = 0.1
            } else {
                // linear scale between innerRadius and outerRadius
                targetScale = 1 - ((dist - innerRadius) / (outerRadius - innerRadius))
                targetScale = Math.max(0.1, targetScale)
            }

            // apply scale
            mediasQuickTo[index][0](targetScale)
            mediasQuickTo[index][1](targetScale)
        })
    }})
    const yTo = gsap.quickTo(container, 'y', {duration: 1, ease: 'power4'})

    
    let mediasQuickTo = []
    medias.forEach(media => {
        const scaleX = gsap.quickTo(media, 'scaleX', {duration: 1, ease: 'power4'})
        const scaleY = gsap.quickTo(media, 'scaleY', {duration: 1, ease: 'power4'})
        mediasQuickTo.push([scaleX, scaleY])
    })

    function snapToEdges(clientX, clientY) {
        if (clientX <= 0) xTo(0)
        if (clientX >= W) xTo(-cW)

        if (clientY <= 0) yTo(0)
        if (clientY >= H) yTo(-cH)
    }
    function handleMouseLeave(e) {
        snapToEdges(e.clientX, e.clientY)
    }
    root.addEventListener('mouseleave', handleMouseLeave)

    function applyMove(clientX, clientY) {
        mouse.x = clampX(clientX)
        mouse.y = clampY(clientY)

        xTo(-mouse.x / W * cW)
        yTo(-mouse.y / H * cH)
    }
    function handleMouseMove(e) {
        applyMove(e.clientX, e.clientY)
    }
    function handleTouchMove(e) {
        if (!e.touches || !e.touches[0]) return
        applyMove(e.touches[0].clientX, e.touches[0].clientY)
    }
    function handleTouchEnd(e) {
        const t = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0] : null
        if (!t) return
        snapToEdges(t.clientX, t.clientY)
    }
    root.addEventListener('mousemove', handleMouseMove)
    root.addEventListener('touchstart', handleTouchMove, {passive: true})
    root.addEventListener('touchmove', handleTouchMove, {passive: true})
    root.addEventListener('touchend', handleTouchEnd, {passive: true})
    root.addEventListener('touchcancel', handleTouchEnd, {passive: true})
})