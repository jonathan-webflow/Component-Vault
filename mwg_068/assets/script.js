window.addEventListener("DOMContentLoaded", () => {

    /* LENIS SMOOTH SCROLL (OPTIONAL) */
    lenis = new Lenis({
        autoRaf: true,
    })
    /* LENIS SMOOTH SCROLL (OPTIONAL) */

    const root = document.querySelector('.mwg_effect068')
    const pinHeight = root.querySelector('.pin-height')
    const container = root.querySelector('.container')
	const medias = root.querySelectorAll('.media')

	gsap.to('.scroll', {
        autoAlpha:0,
        duration:0.2,
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
			start: 'top top',
			end: 'bottom bottom',
			pin: container,
			scrub: true
		}
	})

	const isPortrait = window.innerHeight > window.innerWidth
	const step = (isPortrait ? 1.5 : 1) / medias.length

	medias.forEach((media, i) => {
		const tl = gsap.timeline()

		tl.fromTo(media, {
            rotateX: -90,
			zIndex: medias.length - i
		}, {
			xPercent: 100,
			x: window.innerWidth,
            rotateX: 90,
			ease: 'power1.inOut',
			duration: 1.1
		})
		tl.set(media, {
			zIndex: 0,
			ease: 'power1.in',
		}, "-=0.55")
		
		
		master.add(tl, i * step)
	})
})