window.addEventListener("DOMContentLoaded", () => {

    const root = document.querySelector('.mwg_effect077')
	const media = root.querySelector('.media')
	const mediaBackground = root.querySelector('.media-background')

	const rotX = gsap.quickTo(media, 'rotationX', { duration: 0.6, ease: 'power2' })
    const rotY = gsap.quickTo(media, 'rotationY', { duration: 0.6, ease: 'power2' })

	const rotZ = gsap.quickTo(media, 'rotation', { duration: 1, ease: 'power2' })
	const xPercentTo = gsap.quickTo(media, 'xPercent', { duration: 1, ease: 'power1' })
	const yPercentTo = gsap.quickTo(media, 'yPercent', { duration: 1, ease: 'power1' })
	
	const childXPercentTo = gsap.quickTo(mediaBackground, 'xPercent', { duration: 0.6, ease: 'power2' })
	const childYPercentTo = gsap.quickTo(mediaBackground, 'yPercent', { duration: 0.6, ease: 'power2' })
	const mapRangeX = gsap.utils.mapRange(0, window.innerWidth, 8, -8)
	const mapRangeY = gsap.utils.mapRange(0, window.innerHeight, 8, -8)

	let isMoving,
		oldPosX = 0,
		oldPosY = 0

	const W = window.innerWidth
	const H = window.innerHeight
	const clampX = gsap.utils.clamp(0, W)
	const clampY = gsap.utils.clamp(0, H)

	function applyMove(clientX, clientY) {
		const posX = clampX(clientX)
		const posY = clampY(clientY)
		const mouseX = (posX / W) * 2 - 1
		const mouseY = (posY / H) * 2 - 1

		const valueX = (posX - oldPosX)
		const valueY = (posY - oldPosY)
	
		rotY(mouseX * 40)
		rotX(-mouseY * 30)
		rotZ((posX - oldPosX) / 4)
		xPercentTo(valueX)
		yPercentTo(valueY)
		childXPercentTo(mapRangeX(posX))
		childYPercentTo(mapRangeY(posY))

		oldPosX = posX
		oldPosY = posY

		window.clearTimeout(isMoving)
		isMoving = setTimeout(() => {
			rotZ(0)
			xPercentTo(0)
			yPercentTo(0)
		}, 66)
	}
	function handleMouseMove(e) {
		applyMove(e.clientX, e.clientY)
	}
	function handleTouchMove(e) {
		if (!e.touches || !e.touches[0]) return
		applyMove(e.touches[0].clientX, e.touches[0].clientY)
	}

	root.addEventListener('mousemove', handleMouseMove)
	root.addEventListener('touchstart', handleTouchMove, {passive: true})
	root.addEventListener('touchmove', handleTouchMove, {passive: true})
})