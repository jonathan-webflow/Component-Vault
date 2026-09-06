window.addEventListener("DOMContentLoaded", () => {

    /* LENIS SMOOTH SCROLL (OPTIONAL) */
    lenis = new Lenis({
        autoRaf: true,
    })
    /* LENIS SMOOTH SCROLL (OPTIONAL) */

    const root = document.querySelector('.mwg_effect083')
    const pinHeight = root.querySelector('.pin-height')
    const container = root.querySelector('.container')
    const medias = root.querySelectorAll('.media')

    gsap.to('.scroll', {
        autoAlpha:0,
        duration:0.2,
        scrollTrigger: {
            trigger: root,
            start:'top top',
            end:'top top-=1',
            toggleActions: "play none reverse none"
        }
    })

    const easings = ['ease-1', 'ease-2', 'ease-3', 'ease-4']

    medias.forEach((media, index) => {
        const easingClass = easings[index % easings.length]
        media.classList.add(easingClass)
        const zIndex = parseInt(easingClass.split('-')[1])
        
        const randomY = Math.random()
        gsap.set(media, {
            y: randomY * window.innerHeight,
            yPercent: -randomY * 100,
            zIndex: zIndex
        })
    })
    
    gsap.fromTo(root.querySelectorAll('.ease-1'), {
        x: window.innerWidth,
        xPercent: 10
    }, {
        x: 0,
        xPercent: -110,
        stagger: 0.04,
        ease: 'power1.inOut',
        scrollTrigger: {
			trigger: pinHeight,
			start: 'top top',
			end: 'bottom bottom',
			pin: container,
			scrub: true,
		}
    })
    gsap.fromTo(root.querySelectorAll('.ease-2'), {
        x: window.innerWidth,
        xPercent: 10
    }, {
        x: 0,
        xPercent: -110,
        stagger: 0.04,
        ease: 'power2.inOut',
        scrollTrigger: {
			trigger: pinHeight,
			start: 'top top',
			end: 'bottom bottom',
			scrub: true,
		}
    })
    gsap.fromTo(root.querySelectorAll('.ease-3'), {
        x: window.innerWidth,
        xPercent: 10
    }, {
        x: 0,
        xPercent: -110,
        stagger: 0.04,
        ease: 'power3.inOut',
        scrollTrigger: {
			trigger: pinHeight,
			start: 'top top',
			end: 'bottom bottom',
			scrub: true,
		}
    })
    gsap.fromTo(root.querySelectorAll('.ease-4'), {
        x: window.innerWidth,
        xPercent: 10
    }, {
        x: 0,
        xPercent: -110,
        stagger: 0.04,
        ease: 'power4.inOut',
        scrollTrigger: {
			trigger: pinHeight,
			start: 'top top',
			end: 'bottom bottom',
			scrub: true,
		}
    })
})