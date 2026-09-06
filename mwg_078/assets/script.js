window.addEventListener("DOMContentLoaded", () => {

	/* LENIS SMOOTH SCROLL (OPTIONAL) */
    lenis = new Lenis({
        autoRaf: true,
    })
    /* LENIS SMOOTH SCROLL (OPTIONAL) */

    const root = document.querySelector('.mwg_effect078')
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

	const master = gsap.timeline({
		scrollTrigger: {
			trigger: pinHeight,
			start: 'top top',
			end: 'bottom bottom',
			pin: container,
			scrub: true
		}
	})

	medias.forEach((media, i) => {
		const tl = gsap.timeline()

		const yTranslate = Math.random() * 0.5 * window.innerHeight + 0.5 * window.innerHeight
		const rotX = (Math.random() - 0.5) * 120
		const rotY = (Math.random() - 0.5) * 120
		const rotZ = (Math.random() - 0.5) * 120
		
		tl.fromTo(media, {
			xPercent: -30,
			yPercent: -50,
			y: yTranslate,
			rotationX: rotX,
			rotationY: rotY,
			rotationZ: rotZ
		}, {
			xPercent: 130,
			x: window.innerWidth,
			y: yTranslate - 0.5 * window.innerHeight,
			rotationX: -rotX,
			rotationY: -rotY,
			rotationZ: -rotZ,
			ease: CustomEase.create("custom", "M0,0 C0,0.301 0.299,0.447 0.5,0.5 0.71,0.554 1,0.703 1,1 "),
			duration: 0.4
		})
		
		master.add(tl, i * (1 / medias.length))
	})
})