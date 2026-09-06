window.addEventListener("DOMContentLoaded", () => {

    const root = document.querySelector('.mwg_effect106')
    const mediasContainer = root.querySelector('.medias')
    const medias = root.querySelectorAll('.media')

    const baseAngles = Array.from({ length: medias.length }, (_, i) => (i / medias.length) * Math.PI * 2)

    const DESKTOP_MEDIA_VW = 12
    const MOBILE_MEDIA_VW = 30

    let mediaVw = DESKTOP_MEDIA_VW
    let layout

    function getLayout() {
        const w = window.innerWidth
        const h = window.innerHeight
        const scale = mediaVw / DESKTOP_MEDIA_VW
        return {
            w, h, scale,
            radiusDivisor: 3.5 / scale,
            minDivisor: 2.2 / scale,
            wheelRadiusFactor: 0.12 / scale,
            translateZ: -26 * scale,
        }
    }

    const transform = { rotateX: 90, rotateY: 0, rotateZ: 0, translateX: 0, translateY: 0 }
    const autoOffset = { value: 0 }
    const wheelOffset = { value: 0 }
    const wheelIntensity = { value: 0 }

    function renderTilt() {
        const { translateX, translateY, rotateX, rotateY, rotateZ } = transform
        const { translateZ } = layout
        mediasContainer.style.transform =
            `translate3d(${translateX}vw, ${translateY}vw, ${translateZ}vw) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`
        medias.forEach(el => {
            gsap.set(el, { rotationX: -rotateX, rotationY: -rotateY, rotation: -rotateZ })
        })
    }

    function updateScene() {
        root.style.perspective = `${100 + wheelIntensity.value * 30}vw` // default perspective is 100vw
        const offset = autoOffset.value + wheelOffset.value
        const { w, radiusDivisor, minDivisor, wheelRadiusFactor } = layout
        const radius = w / Math.max(minDivisor, radiusDivisor - wheelIntensity.value * wheelRadiusFactor)
        medias.forEach((el, i) => {
            const angle = offset + baseAngles[i]
            gsap.set(el, { x: Math.sin(angle) * radius, y: Math.cos(angle) * radius })
        })
    }

    const tilt = { duration: 0.8, ease: "power3" }
    const setRotateX = gsap.quickTo(transform, "rotateX", tilt)
    const setRotateY = gsap.quickTo(transform, "rotateY", tilt)
    const setRotateZ = gsap.quickTo(transform, "rotateZ", { ...tilt, onUpdate: renderTilt })
    const setWheelIntensity = gsap.quickTo(wheelIntensity, "value", { duration: 1.3, ease: "power2.out", onUpdate: updateScene })
    const setWheelOffset = gsap.quickTo(wheelOffset, "value", { duration: 0.5, ease: "power2", onUpdate: updateScene })

    let wheelSpeed = 0
    let wheelResetTimer

    function applyTilt(clientX, clientY) {
        const { w, h } = layout
        setRotateY((clientX / w) * 50 - 25)
        setRotateX((clientY / h) * 40 - 20 + 90)
        setRotateZ(-(clientX / w) * 10 + 5)
    }

    function handleMouseMove(e) {
        applyTilt(e.clientX, e.clientY)
    }

    function handleTouchMove(e) {
        if (!e.touches?.[0]) return
        applyTilt(e.touches[0].clientX, e.touches[0].clientY)
    }

    function applyScroll(delta) {
        wheelSpeed += delta / 20
        setWheelOffset(wheelSpeed * 0.017)
        setWheelIntensity(Math.abs(delta) / 12)
        clearTimeout(wheelResetTimer)
        wheelResetTimer = setTimeout(() => setWheelIntensity(0), 120)
    }

    function handleWheel(e) {
        applyScroll(e.deltaY)
    }

    const autoTween = gsap.to(autoOffset, {
        value: Math.PI * 2,
        duration: 12,
        repeat: -1,
        ease: "none",
        onUpdate: updateScene
    })

    const mm = gsap.matchMedia()
    mm.add("(max-width: 768px)", () => {
        mediaVw = MOBILE_MEDIA_VW
    })
    mm.add("(min-width: 769px)", () => {
        mediaVw = DESKTOP_MEDIA_VW
    })

    if (!layout) {
        layout = getLayout()
        renderTilt()
        updateScene()
    }
    root.addEventListener("mousemove", handleMouseMove)
    root.addEventListener("touchstart", handleTouchMove, { passive: true })
    root.addEventListener("touchmove", handleTouchMove, { passive: true })
    root.addEventListener("wheel", handleWheel)

    const observer = new MutationObserver(mutations => {
        const isRootRemoved = mutations.some(mutation =>
            mutation.type === "childList" &&
            Array.from(mutation.removedNodes).includes(root)
        )
        if (!isRootRemoved) return
        autoTween.kill()
        clearTimeout(wheelResetTimer)
        root.removeEventListener("mousemove", handleMouseMove)
        root.removeEventListener("touchstart", handleTouchMove)
        root.removeEventListener("touchmove", handleTouchMove)
        root.removeEventListener("wheel", handleWheel)
        observer.disconnect()
    })
    observer.observe(document.body, { childList: true, subtree: true })
})