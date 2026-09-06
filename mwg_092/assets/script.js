window.addEventListener("DOMContentLoaded", () => {

    const root = document.querySelector('.mwg_effect092')
    const srcs = Array.from(root.querySelectorAll('.medias img'), el => el.src)

    let isTouch = false
	gsap.matchMedia().add("(hover: none)", () => {isTouch = true})

    let distance = 0
    let lastX = 0
    let firstMove = true
    let mediaIndex = 0

    const activeImages = []
    const easeIn = gsap.parseEase('power2.in')
    const maxZ = window.innerWidth * 10
    const spawnDist = window.innerWidth / (isTouch ? 6 : 12)

    const W = window.innerWidth
    const H = window.innerHeight
    const clampX = gsap.utils.clamp(0, W)
    const clampY = gsap.utils.clamp(0, H)
    const rectTop = () => root.getBoundingClientRect().top

    function applyMove(clientX, clientY) {
        const x = clampX(clientX)
        const y = clampY(clientY)

        if (firstMove) {
            firstMove = false
            lastX = x
            return
        }

        const delta = Math.abs(x - lastX)
        distance += delta
        lastX = x

        const inputDelta = delta * window.innerWidth * 0.06

        activeImages.forEach(entry => {
            entry.recessionInput += inputDelta
            const progress = Math.min(entry.recessionInput / (window.innerWidth * 45), 1)
            entry.zTo(-easeIn(progress) * maxZ)

            if (progress >= 0.98 && !entry.fadedOut) {
                entry.fadedOut = true
                gsap.to(entry.img, {
                    autoAlpha: 0,
                    duration: 0.2,
                    ease: 'power2.in',
                    onComplete: () => {
                        entry.img.remove()
                        activeImages.splice(activeImages.indexOf(entry), 1)
                    }
                })
            }
        })

        if (distance > spawnDist) {
            distance = 0
            createMedia(x, y - rectTop())
        }
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

    function createMedia(x, y) {
        const img = document.createElement('img')
        img.src = srcs[mediaIndex]
        root.appendChild(img)

        gsap.fromTo(img, {
            x, y, z: 0,
            xPercent: -50,
            yPercent: -50,
            rotation: (Math.random() - 0.5) * 14,
            scale: 1.3
        }, {
            scale: 1,
            ease: 'elastic.out(2, 0.6)',
            duration: 0.6
        })

        const zTo = gsap.quickTo(img, 'z', { duration: 1.2, ease: 'power2' })
        activeImages.push({ img, recessionInput: 0, zTo, fadedOut: false })

        mediaIndex = (mediaIndex + 1) % srcs.length
    }
})