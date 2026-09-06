window.addEventListener("DOMContentLoaded", () => {

    /* LENIS SMOOTH SCROLL (OPTIONAL) */
    lenis = new Lenis({
        autoRaf: true,
    })
    /* LENIS SMOOTH SCROLL (OPTIONAL) */

    const root = document.querySelector('.mwg_effect069')
    const pinHeight = root.querySelector('.pin-height')
    const container = root.querySelector('.container')
    const medias = root.querySelectorAll('.media')

    gsap.to('.scroll', {
        autoAlpha: 0,
        duration: 0.2,
        scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: 'top top-=1',
            toggleActions: "play none reverse none"
        }
    })

    const master = gsap.timeline({
        scrollTrigger: {
            trigger: pinHeight,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            pin: container
        }
    })

    const totalDistance = document.body.clientWidth + medias[0].clientWidth

    const n = medias.length
    const overlap = 1.22
    const duration = overlap / n

    medias.forEach((media, i) => {
        let tl = gsap.timeline({
            defaults: {
                ease: "power2.inOut", 
                duration
            }
        })
            
        tl.set(media, { yPercent: 35 })
            .to(media, {
                x: -0.2 * totalDistance, 
                yPercent: -35,
                rotation: () => {return (Math.random() - 0.5) * 50 }, 
            })
            .to(media, { 
                x: -0.4 * totalDistance, 
                yPercent: 35,
                rotation: () => {return (Math.random() - 0.5) * 50 }
            })
            .to(media, { 
                x: -0.6 * totalDistance, 
                yPercent: -35,
                rotation: () => {return (Math.random() - 0.5) * 50 }
            })
            .to(media, {
                x: -0.8 * totalDistance, 
                yPercent: 35,
                rotation: () => {return (Math.random() - 0.5) * 50 }
            })
            .to(media, { 
                x: -1 * totalDistance, 
                yPercent: -35,
                rotation: 0
            })

        master.add(tl, i * (1 / medias.length))
    })
})