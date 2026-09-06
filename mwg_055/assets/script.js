window.addEventListener("DOMContentLoaded", () => {
    
    const root = document.querySelector('.mwg_effect055')
    const sentence = root.querySelector('.sentence')
    const medias = root.querySelectorAll('.media')

    const xClasses = ['mediaX1', 'mediaX2', 'mediaX3']
    const rotClasses = ['mediaRot1', 'mediaRot2', 'mediaRot3']
    let xIndex = 0
    medias.forEach((media) => {
        media.classList.add(xClasses[xIndex])
        xIndex = (xIndex + 1) % xClasses.length
        media.classList.add(rotClasses[Math.floor(Math.random() * rotClasses.length)])
    })

    const W = window.innerWidth

    const xTo = gsap.quickTo(sentence, "x", {duration: 0.4, ease: "power3"})

    const xToMedia1 = gsap.quickTo(root.querySelectorAll('.mediaX1'), "x", {duration: 1, ease: "elastic"})
    const xToMedia2 = gsap.quickTo(root.querySelectorAll('.mediaX2'), "x", {duration: 1.3, ease: "elastic"})
    const xToMedia3 = gsap.quickTo(root.querySelectorAll('.mediaX3'), "x", {duration: 1.6, ease: "elastic"})

    const rotToMedia1 = gsap.quickTo(root.querySelectorAll('.mediaRot1'), "rotation", {duration: 2, ease: "elastic"})
    const rotToMedia2 = gsap.quickTo(root.querySelectorAll('.mediaRot2'), "rotation", {duration: 1.7, ease: "elastic"})
    const rotToMedia3 = gsap.quickTo(root.querySelectorAll('.mediaRot3'), "rotation", {duration: 1.4, ease: "elastic"})

    const sentenceW = sentence.clientWidth - W

    let old = 0, isMoving;

    const clampX = gsap.utils.clamp(0, W)
    const clampDist = gsap.utils.clamp(-Math.max(0, sentenceW), 0)

    function applyMove(clientX) {
        const safeX = clampX(clientX)
        const dist = clampDist(-safeX * Math.max(0, sentenceW) / W)

        const xValue = old - dist
        const rotValue = (old - dist)/10
        
        xTo(dist)
        xToMedia1(xValue)
        xToMedia2(xValue)
        xToMedia3(xValue)
        rotToMedia1(rotValue)
        rotToMedia2(rotValue)
        rotToMedia3(rotValue)

        old = dist

        window.clearTimeout( isMoving );
        isMoving = setTimeout( () => {
            rotToMedia1(0)
            rotToMedia2(0)
            rotToMedia3(0)
            xToMedia1(0)
            xToMedia2(0)
            xToMedia3(0)
        }, 66);
    }
    function handleMouseMove(e) {
        applyMove(e.clientX)
    }
    function handleTouchMove(e) {
        if (!e.touches || !e.touches[0]) return
        applyMove(e.touches[0].clientX)
    }

    root.addEventListener("mousemove", handleMouseMove)
    root.addEventListener("touchstart", handleTouchMove, {passive: true})
    root.addEventListener("touchmove", handleTouchMove, {passive: true})
})