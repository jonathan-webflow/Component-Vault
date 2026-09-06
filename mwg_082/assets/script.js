window.addEventListener("DOMContentLoaded", () => {

    /* LENIS SMOOTH SCROLL (OPTIONAL) */
    lenis = new Lenis({
        autoRaf: true,
    })
    /* LENIS SMOOTH SCROLL (OPTIONAL) */

    const root = document.querySelector('.mwg_effect082')
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

	const revealTimelines = []

	medias.forEach((media, index) => {
		const tlReveal = gsap.timeline({
			paused: true
		})
		tlReveal.set(media, {
			autoAlpha: 1,

		}, 'media' + index)
		tlReveal.fromTo(media, {
            scaleX: 0.9,
            scaleY: 0.9,
        }, {
            scaleX:1,
            scaleY:1,
			immediateRender: false,
            ease: 'elastic.out(2, 0.6)',
            duration: 0.5
        }, '<')

		revealTimelines.push(tlReveal)
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

	medias.forEach((media, i) => {
        const tl = gsap.timeline({
			onStart: () => {
				revealTimelines[i].play()
			},
			onReverseComplete: () => {
				revealTimelines[i].progress(-1).pause()
			}
		})

		const angle = (Math.random() - 0.5) * 40

		tl.to(media, {
			z: - window.innerWidth,
			rotation: angle,
			duration: 1,
			ease: 'power1.inOut'
		})
		tl.to(media, {
			x: angle * 0.01 * window.innerWidth,
			y: - 2 * window.innerHeight,
			duration: 0.6,
			ease: 'power1.in',
		}, '<+=0.4')
        master.add(tl, 0.1 *i);
    })
})