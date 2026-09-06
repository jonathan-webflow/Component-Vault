window.addEventListener("DOMContentLoaded", () => {
    const root = document.querySelector('.mwg_effect051')
    let hasInteracted = false
    const hideScrollHint = () => {
        if (hasInteracted) return
        hasInteracted = true
        gsap.to('.scroll', {
            autoAlpha: 0,
            duration: 0.2,
        })
    }

    const mediasSrc = []
    const listMedias = root.querySelectorAll('.listMedia')
    listMedias.forEach((media) => {
        mediasSrc.push(media.getAttribute('src'))
    })
    const mediasLength = listMedias.length
    let mediaIndex = 0,
        incr = 0


    const media1 = root.querySelector('.media1')
    const media2 = root.querySelector('.media2')
    const media3 = root.querySelector('.media3')
    const rangeX = window.innerWidth - media1.clientWidth

    updateMedia(media1)
    updateMedia(media2)
    updateMedia(media3)
    
    const max1 = -(window.innerHeight + media1.clientHeight)
    const wrap1 = gsap.utils.wrap(0, max1)
    const round1 = gsap.utils.snap(max1)
    let iteration1 = max1,
        yTo1 = gsap.quickTo(media1, 'y', {
        duration: 1,
        ease: "power4",
        modifiers: {
            y: value => {
                let y = parseFloat(value),
                    newIteration = round1(y + max1 / 2);
                if (newIteration !== iteration1) {
                    iteration1 = newIteration;

                    updateMedia(media1)
                }
                return wrap1(y) + "px";
            } 
        }
    })

    const max2 = -(window.innerHeight + media2.clientHeight ) - 200 // pour pas qu'ils soient pile alignés
    const wrap2 = gsap.utils.wrap(0, max2)
    const round2 = gsap.utils.snap(max2)
    let iteration2 = max2,
        yTo2 = gsap.quickTo(media2, 'y', {
        duration: 2,
        ease: "power4",
        modifiers: {
            y: value => {
                let y = parseFloat(value),
                    newIteration = round2(y + max2 / 2);
                if (newIteration !== iteration2) {
                    iteration2 = newIteration;

                    updateMedia(media2)
                }
                return wrap2(y) + "px";
            } 
        }
    })

    const max3 = -(window.innerHeight + media3.clientHeight) - 400 // décalé par rapport à media1 et media2
    const wrap3 = gsap.utils.wrap(0, max3)
    const round3 = gsap.utils.snap(max3)
    let iteration3 = max3,
        yTo3 = gsap.quickTo(media3, 'y', {
        duration: 3,
        ease: "power4",
        modifiers: {
            y: value => {
                let y = parseFloat(value),
                    newIteration = round3(y + max3 / 2);
                if (newIteration !== iteration3) {
                    iteration3 = newIteration;

                    updateMedia(media3)
                }
                return wrap3(y) + "px";
            }
        }
    })

    let isTouch = false
	gsap.matchMedia().add("(hover: none)", () => {isTouch = true})

    const gsapObs = Observer.create({
        target: root,
        type: "wheel,touch",
        onChange: (e) => {
            hideScrollHint()
            incr += isTouch ? e.deltaY * 3 : -e.deltaY
            yTo1(incr)
            yTo2(incr)
            yTo3(incr)
        },
    })

    function updateMedia(media) {
        media.setAttribute('src', mediasSrc[mediaIndex])
        gsap.set(media, {
            x: Math.random() * rangeX + 'px'
        })

        mediaIndex = (mediaIndex + 1) % mediasLength
    }
})