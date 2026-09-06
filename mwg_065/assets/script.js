window.addEventListener("DOMContentLoaded", () => {

    /* LENIS SMOOTH SCROLL (OPTIONAL) */
    lenis = new Lenis({
        autoRaf: true,
    })
    /* LENIS SMOOTH SCROLL (OPTIONAL) */

    const root = document.querySelector('.mwg_effect065')
    const pinHeight = root.querySelector('.pin-height')
    const container = root.querySelector('.container')
    const medias = root.querySelectorAll('.medias')
    const images = root.querySelectorAll('.media')

    // Wait until all images have loaded
    Promise.all(Array.from(images).map(img => {
        if (img.complete) return Promise.resolve()
        return new Promise(resolve => img.addEventListener('load', resolve))
    })).then(() => {
        // Pin the container while scrolling
        ScrollTrigger.create({
            trigger: pinHeight,
            start: 'top top',
            end: 'bottom bottom',
            pin: container,
        })

        // Timeline: animate each row to the left
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: pinHeight,
                start: 'top top',
                end: 'bottom bottom',
                scrub: true
            }
        })

        

        // For each row, compute how far to translate
        medias.forEach((media, index) => {
            // Full row width minus viewport width — distance so the right edge of the row aligns with the viewport
            const distance = media.scrollWidth - document.body.clientWidth
            
            // Translate left
            tl.to(media, {
                x: -distance,
                ease: 'none',
                duration: 1
            }, 0) // 0 = all tweens start together
        })
    })
})