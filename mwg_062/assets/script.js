window.addEventListener("DOMContentLoaded", () => {

    gsap.registerPlugin(InertiaPlugin) 

    const root = document.querySelector('.mwg_effect062')
    // root.style.touchAction = "none"
    const images = []
    root.querySelectorAll('.medias img').forEach(image => {
        images.push(image.getAttribute('src'))
    })

    let isTouch = false
	gsap.matchMedia().add("(hover: none)", () => {isTouch = true})

    let incr = 0, 
        oldIncrX = 0, 
        oldIncrY = 0, 
        resetDist = window.innerWidth / (isTouch ? 3 : 8), 
        indexImg = 0

    const rectTop = () => root.getBoundingClientRect().top
    const W = window.innerWidth
    const H = window.innerHeight
    const clampX = gsap.utils.clamp(0, W)
    const clampY = gsap.utils.clamp(0, H)

    function applyMove(clientX, clientY) {
        const valX = clampX(clientX)
        const valY = clampY(clientY)
        
        incr += Math.abs(valX - oldIncrX) + Math.abs(valY - oldIncrY)
    
        if(incr > resetDist) {
            incr = 0
            createMedia(valX, valY - rectTop(), valX - oldIncrX, valY - oldIncrY)  
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

    const initPointer = (clientX, clientY) => {
        oldIncrX = clampX(clientX)
        oldIncrY = clampY(clientY)
    }

    root.addEventListener("mousemove", (e) => initPointer(e.clientX, e.clientY), {once: true})
    root.addEventListener("touchstart", (e) => {
        if (!e.touches || !e.touches[0]) return
        initPointer(e.touches[0].clientX, e.touches[0].clientY)
    }, {once: true, passive: true})

    root.addEventListener("mousemove", handleMouseMove)
    root.addEventListener("touchmove", handleTouchMove, {passive: true})

    function createMedia(x, y, deltaX, deltaY) {
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
            scaleY: 1.3
        }, {
            scaleX:1,
            scaleY:1,
            ease:'elastic.out(2, 0.6)',
            duration:0.6
        })

        tl.fromTo(image, {
            x,
            y,
            rotation:(Math.random() - 0.5) * 30,
        }, {
            rotation:(Math.random() - 0.5) * 30,
            inertia: {
                x: {
                    velocity: deltaX * 40,
                    end: x
                },
                y: {
                    velocity: deltaY * 40,
                    end: y
                },
            },
        }, '<')
        
        tl.to(image, {
            duration: 0.3,
            scale: 0.5,
            delay: 0.2,
            ease:'back.in(1.5)'
        })
    
        indexImg = (indexImg + 1) % images.length
    }
})