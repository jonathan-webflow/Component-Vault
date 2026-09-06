window.addEventListener("DOMContentLoaded", () => {

    /* LENIS SMOOTH SCROLL (OPTIONAL) */
    lenis = new Lenis({
        autoRaf: true,
    })
    /* LENIS SMOOTH SCROLL (OPTIONAL) */
    
    const root = document.querySelector('.mwg_effect056')
    const pinHeight = root.querySelector('.pin-height')
    const container = root.querySelector('.container')
    const mediasA = root.querySelector('.medias-a')
    const mediasB = root.querySelector('.medias-b')
    const itemsA = mediasA.querySelectorAll('.media')
    const itemsB = mediasB.querySelectorAll('.media')

    const stepsCount = itemsA.length
    let currentStep = -1

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: pinHeight,
            start: 'top top',
            end: 'bottom bottom',
            pin: container,
            scrub: true,
            onUpdate: self => {
                const step = Math.round(self.progress * (stepsCount - 1))
                if (step !== currentStep) {
                    setVisible(step)
                    currentStep = step
                }
            }
        }
    })

    gsap.set(mediasA, { xPercent: -60 })
    gsap.set(mediasB, { xPercent: 60 })

    for (let i = 0; i < stepsCount - 1; i++) {
        const dirA = i % 2 === 0 ? 1 : -1

        tl.to(mediasA, {
            xPercent: dirA * 60,
            rotateY: '+=' + 180,
            duration: 1,
            ease: 'power2.inOut'
        })
        tl.to(mediasA, {
            z: -150,
            duration: 0.5,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut'
        }, '<')
        tl.to(mediasB, {
            xPercent: -dirA * 60,
            rotateY: '-=' + 180,
            duration: 1,
            ease: 'power2.inOut'
        }, '<')
        tl.to(mediasB, {
            z: 150,
            duration: 0.5,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut'
        }, '<')

        const rx = (Math.random() - 0.5) * 40
        const rz = (Math.random() - 0.5) * 40
        tl.to([mediasA, mediasB], {
            rotateX: rx,
            rotateZ: rz,
            scale: 1.1,
            duration: 0.5,
            repeat: 1,
            yoyo: true,
            ease: 'power2.in'
        }, '<')
    }

    function setVisible(index) {
        itemsA.forEach((m, i) => m.style.visibility = i === index ? 'visible' : 'hidden')
        itemsB.forEach((m, i) => m.style.visibility = i === index ? 'visible' : 'hidden')
    }
})