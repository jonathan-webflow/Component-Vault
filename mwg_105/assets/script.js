window.addEventListener("DOMContentLoaded", () => {

    /* LENIS SMOOTH SCROLL (OPTIONAL) */
    lenis = new Lenis({
        autoRaf: true,
    })
    /* LENIS SMOOTH SCROLL (OPTIONAL) */

    const root = document.querySelector('.mwg_effect105')
    const container = root.querySelector('.container')
    const medias = root.querySelector('.medias')
    const mediaImgs = root.querySelectorAll('img')
    const items = root.querySelectorAll('li')
    const timelines = []
    const offset = container.clientWidth * 0.26

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

    items.forEach(item => {

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: item,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.3
            }
        })

        // STEP 1
        tl.to(item, {
            x: offset,
            duration: 1,
            ease: 'power1.inOut'
        })
        // STEP 2
        tl.to(item, {
            x: 0,
            duration: 1,
            ease: 'power1.inOut'
        })
        
        timelines.push(tl)
    })

    let currentIndex = -1
    const centerY = window.innerHeight / 2

    function updateMedia() {
        let closestIndex = -1
        let closestDist = Infinity

        items.forEach((item, i) => {
            const rect = item.getBoundingClientRect()
            if (centerY < rect.top || centerY > rect.bottom) return

            const dist = Math.abs(rect.top + rect.height / 2 - centerY)
            if (dist < closestDist) {
                closestDist = dist
                closestIndex = i
            }
        })

        if (closestIndex !== currentIndex) {
            gsap.fromTo(medias, {
                scale: 1.1
            }, {
                scale: 1,
                rotation: 0,
                duration: 0.3,
                ease: 'back.out(2)'
            })
            items.forEach((item, i) => {
                gsap.set(item, { autoAlpha: i === closestIndex ? 1 : 0.35 })
            })
            mediaImgs.forEach((img, i) => {
                gsap.set(img, { visibility: i === closestIndex ? 'visible' : 'hidden' })
            })
            currentIndex = closestIndex
        }
    }

    const scrollSt = ScrollTrigger.create({
        trigger: root,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: updateMedia
    })

    updateMedia()

    // KILL
    const observer = new MutationObserver(mutations => {
        const isRootRemoved = mutations.some(mutation =>
            mutation.type === 'childList' &&
            Array.from(mutation.removedNodes).includes(root)
        )
        if (isRootRemoved) {
            timelines.forEach(tl => tl.kill())
            scrollSt.kill()
            observer.disconnect()
        }
    })
    observer.observe(document.body, {childList: true, subtree: true})
})