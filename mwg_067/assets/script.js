window.addEventListener("DOMContentLoaded", () => {

    /* LENIS SMOOTH SCROLL (OPTIONAL) */
    lenis = new Lenis({
        autoRaf: true,
    })
    /* LENIS SMOOTH SCROLL (OPTIONAL) */

    const root = document.querySelector('.mwg_effect067')
	const pinHeight = root.querySelector('.pin-height')
    const container = root.querySelector('.container')

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

	const text = root.querySelector('.text')
	wrapLettersInSpan(text)

	const chars = text.querySelectorAll('.char')

	const tl = gsap.timeline({
		scrollTrigger: {
			trigger: pinHeight,
			start: 'top top',
			end: 'bottom bottom',
			pin: container,
			scrub: true
		},
		defaults: {
			stagger: {
				each: 0.03,
				from: 'random'
			}
		}
	})
	tl.to(chars, {
		rotateX: 0,
		ease: 'power3.out',
	})
	tl.to(chars, {
		rotateX: -60,
		ease: 'power3.in',
	})

    // UTIL
    function wrapLettersInSpan(element) {
        const text = element.textContent;
        element.innerHTML = text
            .split('')
            .map(char => char === ' ' ? '<span><span>&nbsp;</span></span>' : `<span class="char"><span>${char}</span></span>`)
            .join(' ');
    }
})