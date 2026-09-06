window.addEventListener("DOMContentLoaded", () => {

    /* LENIS SMOOTH SCROLL (OPTIONAL) */
    lenis = new Lenis({
        autoRaf: true,
    })
    /* LENIS SMOOTH SCROLL (OPTIONAL) */

    const root = document.querySelector('.mwg_effect064')
    const pinHeight = root.querySelector('.pin-height')
    const container = root.querySelector('.container')
    const medias = root.querySelectorAll('.media')
    const text = root.querySelector('.text')
    
    const vw = window.innerWidth
    const vh = window.innerHeight
    const mediaSize = vw * 0.14
    const total = medias.length

    // Vogel spiral (sunflower pattern) — uniform circular distribution
    const radiusX = (vw - mediaSize) / 2
    const radiusY = (vh - mediaSize) / 2
    const goldenAngle = Math.PI * (3 - Math.sqrt(5))
    const startAngle = Math.random() * Math.PI * 2

    const positions = Array.from({ length: total }, (_, i) => {
        const r = Math.sqrt((i + 0.5) / total)
        const angle = startAngle + i * goldenAngle
        return {
            x: Math.cos(angle) * r * radiusX,
            y: Math.sin(angle) * r * radiusY
        }
    })

    const applyImageOrientation = (img) => {
        const orientation = img.naturalHeight > img.naturalWidth ? 'portrait' : 'landscape'
        img.classList.add(orientation)
    }
    const onImgLoadApplyOrientation = (e) => {
        applyImageOrientation(e.currentTarget)
    }

    medias.forEach((media, i) => {
        gsap.set(media, {
            opacity: 0,
            x: positions[i].x,
            y: positions[i].y,
            xPercent: -50,
            yPercent: -50
        })

        const img = media.querySelector('img')
        if (img.complete && img.naturalWidth) {
            applyImageOrientation(img)
        } else {
            img.addEventListener('load', onImgLoadApplyOrientation, { once: true })
        }
    })

    // ANIMATION
    // ANIMATION
    // ANIMATION

    const masterTl = gsap.timeline({
        scrollTrigger: {
            trigger: pinHeight,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
            pin: container
        }
    })

    // Shuffle media order for a more organic effect
    // const shuffledMedias = Array.from(medias).sort(() => Math.random() - 0.5)
    // shuffledMedias.forEach((media, index) => {

    masterTl.to(text, {
        autoAlpha: 0,
        scale: 0.9,
        duration: 0.1,
        ease: 'power1.in'
    })

    medias.forEach((media, index) => {

        const startOffset = index * 0.1 // Staggered delay

        // Step 1: Entry (reveal + zoom)
        masterTl.fromTo(media, {
            z: 0.9 * vw,
            scale: 1
        }, {
            z: 0,
            duration: 2,
            ease: 'back.out(1.7)'
        }, startOffset)

        // Step 2: Exit
        masterTl.to(media, {
            opacity: 1,
            duration: 0.1,
            ease: 'power2.in'
        }, '<')
    })
})