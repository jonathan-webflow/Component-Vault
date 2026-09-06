window.addEventListener("DOMContentLoaded", () => {
	
    const root = document.querySelector('.mwg_effect114')
    const container = root.querySelector('.container')

    const cards = root.querySelectorAll('.card')
    const cardsLength = cards.length
    const cardContents = root.querySelectorAll('.card .content')

    const centerIndex = Math.floor((cardsLength - 1) / 2)
    let currentPortion = centerIndex + 1
    let isMobile = false

    const mm = gsap.matchMedia()
    mm.add('(max-width: 767px)', () => {
        isMobile = true
        return () => {
            isMobile = false
            gsap.set(container, { x: 0 })
        }
    })

    newPortion(centerIndex, 0)

    function applyMove(clientX) {
        const bounds = root.getBoundingClientRect()
        const percentage = (clientX - bounds.left) / bounds.width
        const activePortion = Math.ceil(percentage * cardsLength)
        
        if(
            currentPortion !== activePortion &&
            activePortion > 0 &&
            activePortion <= cardsLength
        ){
            currentPortion = activePortion
            newPortion(currentPortion - 1)
        }
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

    function newPortion(i, duration = 0.8) {
        cards.forEach((card, index) => {
            const dist = index - i

            gsap.to(card, {
                xPercent: dist === 0 ? 0 : Math.sign(dist) * (80 + (Math.abs(dist) - 1) * (42 - Math.abs(dist)) / 2),
                duration,
                ease: 'elastic.out(1, 0.75)',
            })

            gsap.to(cardContents[index], {
                rotationY: dist === 0
                    ? 0
                    : Math.sign(dist) * Math.max(-100, -45 - (Math.abs(dist) - 1) * 10),
                scale: dist === 0 ? (isMobile ? 0.85 : 0.94) : 1,
                duration,
                ease: 'elastic.out(1, 0.75)',
            })

            card.style.zIndex = cardsLength - Math.abs(dist)
            card.classList.toggle('active', dist === 0)
        })

        if (isMobile) {
            const card = cards[i]
            const x = root.clientWidth / 2 - (card.offsetLeft + card.offsetWidth / 2)
            gsap.to(container, {
                x,
                duration,
                ease: 'elastic.out(1, 0.75)',
            })
        }
    }


    // KILL
    const observer = new MutationObserver(mutations => {
        const isRootRemoved = mutations.some(mutation => 
            mutation.type === 'childList' && 
            Array.from(mutation.removedNodes).includes(root)
        )
        
        if (isRootRemoved) {
            root.removeEventListener("mousemove", handleMouseMove)
            root.removeEventListener("touchstart", handleTouchMove, {passive: true})
            root.removeEventListener("touchmove", handleTouchMove, {passive: true})
            mm.revert()
            observer.disconnect()
        }
    })
    observer.observe(document.body, {childList: true, subtree: true})
})