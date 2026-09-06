window.addEventListener("DOMContentLoaded", () => {
    const root = document.querySelector('.mwg_free_effect002')
    const images = []
    root.querySelectorAll('.medias img').forEach(image => {
        images.push(image.getAttribute('src'))
    })

    let incr = 0,
        oldIncrX = 0,
        oldIncrY = 0,
        firstMove = true,
        indexImg = 0

    const isCoarsePointer = window.matchMedia('(hover: none)').matches
    const resetDist = window.innerWidth / (isCoarsePointer ? 6 : 8)

    const W = window.innerWidth
    const H = window.innerHeight
    const clampX = gsap.utils.clamp(0, W)
    const clampY = gsap.utils.clamp(0, H)

    function applyMove(clientX, clientY) {
        const valX = clampX(clientX)
        const valY = clampY(clientY)

        if (firstMove) {
            firstMove = false
            oldIncrX = valX
            oldIncrY = valY
            return
        }

        incr += Math.abs(valX - oldIncrX) + Math.abs(valY - oldIncrY)

        if (incr > resetDist) {
            incr = 0
            createMedia(valX, valY - root.getBoundingClientRect().top, valX - oldIncrX, valY - oldIncrY)
        }

        oldIncrX = valX
        oldIncrY = valY
    }

    function handleMouseMove(e) {
        applyMove(e.clientX, e.clientY)
    }

    function handleTouchMove(e) {
        if (!e.touches || !e.touches[0]) return
        applyMove(e.touches[0].clientX, e.touches[0].clientY)
    }

    root.addEventListener('mousemove', handleMouseMove)
    root.addEventListener('touchstart', handleTouchMove, { passive: true })
    root.addEventListener('touchmove', handleTouchMove, { passive: true })

    function createMedia(x, y, deltaX, deltaY) {
        const H = window.innerHeight

        if (y > H - 200) return

        const image = document.createElement("img")


        image.setAttribute('src', images[indexImg])
        root.appendChild(image)
    
        const tl = gsap.timeline({
            onComplete: () => {
                root.removeChild(image);
                tl && tl.kill()
            }
        })
    
        tl.fromTo(image, {
            xPercent: -50 + (Math.random() - 0.5) * 80,
            yPercent: -50 + (Math.random() - 0.5) * 10,
            scaleX: 1.3,
            scaleY: 1.3,
            rotation:(Math.random() - 0.5) * 20
        }, {
            scaleX:1,
            scaleY:1,
            ease: 'elastic.out(2, 0.6)',
            duration: 0.4
        })

        tl.fromTo(image, {
            x,
        }, {
            x: '+=' + deltaX * 2,
            rotation: 0,
            ease: 'power1.in',
            duration: 0.4
        }, '<')
    
        tl.fromTo(image, {
            y
        }, {
            y: '+=' + (H - y),
            scale: 0.9,
            yPercent: -95, // pour que le bord bas s'arrête pile au bas du viewport combiné avec le scale a 0.9
            ease: 'back.in(1.1)',
            duration: 0.4
        }, '<')
        
        // BOUNCE
        tl.to(image, {
            x: '+=' + deltaX * 1.6,
            rotation:(Math.random() - 0.5) * 40,
            ease: 'power1.in',
            duration: 0.3
        })
        tl.to(image, {
            yPercent: 150,
            ease: 'back.in(' + (1.5 + (1 - y/H)) + ')',
            duration: 0.3
        }, '<')
    
        indexImg = (indexImg + 1) % images.length
    }


    // KILL
    const observer = new MutationObserver(mutations => {
        const isRootRemoved = mutations.some(mutation => 
            mutation.type === 'childList' && 
            Array.from(mutation.removedNodes).includes(root)
        )
        
        if (isRootRemoved) {
            root.removeEventListener('mousemove', handleMouseMove)
            root.removeEventListener('touchstart', handleTouchMove, { passive: true })
            root.removeEventListener('touchmove', handleTouchMove, { passive: true })
            observer.disconnect()
        }
    })
    observer.observe(document.body, {childList: true, subtree: true})
})