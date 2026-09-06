window.addEventListener("DOMContentLoaded", () => {

    /* LENIS SMOOTH SCROLL (OPTIONAL) */
    lenis = new Lenis({
        autoRaf: true,
    })
    /* LENIS SMOOTH SCROLL (OPTIONAL) */

    const root = document.querySelector('.mwg_effect058')
    const paragraph = root.querySelector('.paragraph')

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

    wrapLettersInSpan(paragraph)

    const letters = root.querySelectorAll('.letter span')

    const lines = [[]];
    let lineIndex = 0;

    for (let i = 0; i < letters.length; i++) {
        const letter = letters[i];
        // Distance of the top outer border of the letter to to the top edge of its parent
        const offsetTop = letter.offsetTop;

        // If distance is different from previous word we start a new line
        if (i > 0 && offsetTop !== letters[i - 1].offsetTop) {
            // We start a new line
            lines.push([]);
            lineIndex++;
        }

        lines[lineIndex].push(letter);
    }

    gsap.set(letters, { 
        rotate: -80,
        xPercent: -14
     })

    const timelines = []
    const triggers = []

    lines.forEach(line => {
        const tl = gsap.timeline({ paused: true })
        timelines.push(tl)

        tl.to(line, {
            rotate: 0,
            xPercent: 0,
            duration: 0.4,
            stagger: 0.007,
            ease: "back.out(1.1)",
        })

        tl.addLabel('visible')

        tl.to(line, {
            rotate: 80,
            xPercent: 14,
            duration: 0.4,
            stagger: 0.007,
            ease: "back.in(1.1)",
        })

        triggers.push(ScrollTrigger.create({
            trigger: line[0],
            start: "bottom 80%",
            end: "top 30%",
            onEnter: () => tl.tweenTo('visible'),
            onLeave: () => tl.play(),
            onEnterBack: () => tl.tweenTo('visible'),
            onLeaveBack: () => tl.reverse()
        }))
    })

    // UTILS
    function wrapLettersInSpan(element) {
        const text = element.textContent
        element.innerHTML = text
            .split(' ')
            .map(word =>
                `<span class="word">${word
                    .split('')
                    .map(char => `<span class="letter"><span>${char}</span></span>`)
                    .join('')}</span>`
            )
            .join(' ')
    }
})