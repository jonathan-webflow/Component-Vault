window.addEventListener("DOMContentLoaded", () => {

    /* LENIS SMOOTH SCROLL (OPTIONAL) */
    lenis = new Lenis({
        autoRaf: true,
    })
    /* LENIS SMOOTH SCROLL (OPTIONAL) */

    const root = document.querySelector('.mwg_effect094')
	const container = root.querySelector('.container')
    const cardsContainer = root.querySelector('.cards')
    const cards = root.querySelectorAll('.card')
    const distance = cardsContainer.clientWidth - window.innerWidth
    const isPortrait = window.innerWidth < window.innerHeight

    const scrollTween = gsap.to(cardsContainer, {
        x: - distance,
        ease: 'none',
        scrollTrigger: {
            trigger: container,
            pin: true,
            scrub: true,
            start: 'top top',
            end: '+=' + distance
        }
    });

    cards.forEach((card, i) => {
        const sign = i % 2 === 0 ? 1 : -1;
        const rotation = (Math.random() - 0.5) * 6;
        const amplitude = isPortrait ? 0.38 : 0.48;

        gsap.fromTo(card, {
            rotation: rotation
        }, {
            rotation: - rotation,
			y: () => sign * -amplitude * window.innerHeight,
			yPercent: () => sign * 50,
			yoyo: true,
			repeat: 1,
            ease: 'power1.inOut',
            scrollTrigger:{
                trigger:card,
                containerAnimation: scrollTween,
                start:'left 90%' ,
                end:'right 10%',
                scrub:true,
            }
        })
		gsap.to(card, {
            scale: 1.4,
			yoyo: true,
			repeat: 1,
            ease: 'back.inOut(3)',
            scrollTrigger:{
                trigger:card,
                containerAnimation: scrollTween,
                start:'left 90%' ,
                end:'right 10%',
                scrub:true,
            }
        })
    })
})