window.addEventListener("DOMContentLoaded", () => {
    const root = document.querySelector('.mwg_effect107')
	const medias = root.querySelectorAll('.media')
	const totalMedias = medias.length
	const goldenAngle = Math.PI * (3 - Math.sqrt(5))
	let radius // set by matchMedia below

	// Initial positions on the sphere (Fibonacci spiral)
	const positions = []
	medias.forEach((media, index) => {
		const y = 1 - (2 * index) / (totalMedias - 1 || 1)
		const phi = Math.acos(y) - Math.PI / 2
		const theta = (index * goldenAngle) % (2 * Math.PI)
		positions.push({
			x: Math.cos(phi) * Math.cos(theta),
			y: Math.sin(phi),
			z: Math.cos(phi) * Math.sin(theta)
		})
	})

	// Current orientation of the sphere: 3×3 matrix (row-major)
	const m = [1, 0, 0, 0, 1, 0, 0, 0, 1]
	const mTmp = [0, 0, 0, 0, 0, 0, 0, 0, 0]
	const R = [0, 0, 0, 0, 0, 0, 0, 0, 0]

	/** Replace m with left × m (row-major matrices). */
	function premultiply3x3(left) {
		for (let i = 0; i < 3; i++) {
			const a = left[i * 3], b = left[i * 3 + 1], c = left[i * 3 + 2]
			for (let j = 0; j < 3; j++) {
				mTmp[i * 3 + j] = a * m[j] + b * m[3 + j] + c * m[6 + j]
			}
		}
		for (let k = 0; k < 9; k++) m[k] = mTmp[k]
	}

	/** Rotation matrix around a unit axis (Rodrigues). */
	function axisAngleMatrix(ax, ay, az, angle) {
		const c = Math.cos(angle), s = Math.sin(angle), t = 1 - c
		return [
			t * ax * ax + c, t * ax * ay - s * az, t * ax * az + s * ay,
			t * ax * ay + s * az, t * ay * ay + c, t * ay * az - s * ax,
			t * ax * az - s * ay, t * ay * az + s * ax, t * az * az + c
		]
	}

	/** Basis for a plane tangent to the sphere: forward = normal, up ≈ screen vertical. */
	function orientationMatrix(fx, fy, fz) {
		let ux = 0, uy = -1, uz = 0

		let rx = uy * fz - uz * fy
		let ry = uz * fx - ux * fz
		let rz = ux * fy - uy * fx

		let len = Math.hypot(rx, ry, rz)
		if (len < 1e-6) {
			ux = 0; uy = 0; uz = 1
			rx = uy * fz - uz * fy
			ry = uz * fx - ux * fz
			rz = ux * fy - uy * fx
			len = Math.hypot(rx, ry, rz)
		}
		const il = 1 / len
		rx *= il; ry *= il; rz *= il

		const ux2 = fy * rz - fz * ry
		const uy2 = fz * rx - fx * rz
		const uz2 = fx * ry - fy * rx

		return [rx, -ux2, fx, ry, -uy2, fy, rz, -uz2, fz]
	}

	/** Position of media i once rotated by m. */
	function transformedPosition(i) {
		const p = positions[i]
		return [
			m[0] * p.x + m[1] * p.y + m[2] * p.z,
			m[3] * p.x + m[4] * p.y + m[5] * p.z,
			m[6] * p.x + m[7] * p.y + m[8] * p.z
		]
	}

	/** Front-facing media closest to the screen center. */
	function findClosestIndex() {
		let closestIndex = 0
		let closestDist = Infinity

		for (let i = 0; i < totalMedias; i++) {
			const [x, y, z] = transformedPosition(i)
			if (z <= 0) continue

			const dist = x * x + y * y
			if (dist < closestDist) {
				closestDist = dist
				closestIndex = i
			}
		}
		return closestIndex
	}

	function renderMedias() {
		medias.forEach((media, i) => {
			const [x, y, z] = transformedPosition(i)
			const len = Math.hypot(x, y, z) || 1
			const rot = orientationMatrix(x / len, -y / len, z / len)

			media.style.transform = `translate3d(${x * radius}px, ${-y * radius}px, ${z * radius}px) matrix3d(${rot[0]},${rot[3]},${rot[6]},0,${rot[1]},${rot[4]},${rot[7]},0,${rot[2]},${rot[5]},${rot[8]},0,0,0,0,1) scaleX(-1)`
		})
	}

	// GESTURE — target accumulates the wheel/drag, smooth eases toward it (degrees).
	// Each frame, the delta of smooth is applied to m as a rotation about screen axes.
	const smooth = { x: 0, y: 0 }
	const target = { x: 0, y: 0 }
	let prevX = 0, prevY = 0
	let snapTween = null
	let moving = false

	function updateMedias() {
		const dY = (smooth.y - prevY) * Math.PI / 180
		const dX = (smooth.x - prevX) * Math.PI / 180
		prevY = smooth.y
		prevX = smooth.x

		if (dX !== 0 || dY !== 0) {
			const cy = Math.cos(dY), sy = Math.sin(dY)
			const cx = Math.cos(dX), sx = Math.sin(dX)
			R[0] = cy; R[1] = 0; R[2] = sy
			R[3] = sx * sy; R[4] = cx; R[5] = -sx * cy
			R[6] = -cx * sy; R[7] = sx; R[8] = cx * cy
			premultiply3x3(R)
		}
		renderMedias()
	}

	const quickY = gsap.quickTo(smooth, 'y', {
		duration: 1,
		ease: 'power2',
		onUpdate: updateMedias,
		onComplete: settle
	})
	const quickX = gsap.quickTo(smooth, 'x', {
		duration: 1,
		ease: 'power2'
	})

	/** Stop any easing/snap and zero the angles: next deltas apply from the current orientation (m). */
	function rebase() {
		snapTween?.kill()
		snapTween = null
		target.x = target.y = 0
		prevX = prevY = 0
		// Reset the quickTo tweens in place (0 → 0) without killing them
		quickX(0, 0)
		quickY(0, 0)
		smooth.x = smooth.y = 0
	}

	/** Once the easing is fully done (no gesture, no snap running), center the closest media. */
	function settle() {
		if (moving || snapTween) return
		if (Math.abs(target.x - smooth.x) > 0.5 || Math.abs(target.y - smooth.y) > 0.5) return
		snapToClosest()
	}

	/** Rotate the sphere so media `index` lands at the screen center. */
	function snapToIndex(index, instant) {
		const [vx, vy, vz] = transformedPosition(index)
		const sin = Math.hypot(vx, vy)
		if (sin < 0.02) return // already centered

		// Axis = v × z (normalized), angle between v and (0, 0, 1)
		const ax = vy / sin
		const ay = -vx / sin
		const angle = Math.acos(Math.max(-1, Math.min(1, vz)))

		rebase()

		if (instant) {
			premultiply3x3(axisAngleMatrix(ax, ay, 0, angle))
			renderMedias()
			return
		}

		const mStart = m.slice()
		const snap = { t: 0 }

		snapTween = gsap.to(snap, {
			t: 1,
			duration: 1,
			ease: 'expo.inOut',
			onUpdate() {
				for (let k = 0; k < 9; k++) m[k] = mStart[k]
				premultiply3x3(axisAngleMatrix(ax, ay, 0, angle * snap.t))
				renderMedias()
			},
			onComplete() {
				snapTween = null
			}
		})
	}

	function snapToClosest(instant) {
		snapToIndex(findClosestIndex(), instant)
	}

	// RESPONSIVE — sphere radius + perspective per breakpoint
	const sphere = root.querySelector('.sphere')
	const sphereContainer = root.querySelector('.sphere-container')
	// preserve-3d: to prevent safari perspective bug
	gsap.set(sphere, {transformStyle: 'preserve-3d'})

	let isTouch = false
	const mm = gsap.matchMedia()
	mm.add("(hover: none)", () => {isTouch = true})
	mm.add({
		isMobile: "(max-width: 500px)",
		isFixed: "(min-width: 501px) and (max-width: 1400px)",
		isDesktop: "(min-width: 1401px)",
	}, (context) => {
		const { isMobile, isFixed } = context.conditions

		if (isMobile) {
			radius = 310
			gsap.set(sphere, {translateZ: '250px'})
			gsap.set(sphereContainer, {perspective: '1000px'})
		} else if (isFixed) {
			radius = 980
			gsap.set(sphere, {translateZ: '-310px'})
			gsap.set(sphereContainer, {perspective: '3920px'})
		} else {
			radius = 0.7 * window.innerWidth
			gsap.set(sphere, {translateZ: '-22vw'})
			gsap.set(sphereContainer, {perspective: '280vw'})
		}
		renderMedias()
	})

	// Center the closest media right away on load
	snapToClosest(true)

	// INPUT
	let dragDist = 0
	const gsapObs = Observer.create({
		target: root,
		type: "wheel,touch,pointer",
		onPress: () => { dragDist = 0 },
		onWheel: (e) => {
			onInput()
			target.y -= e.deltaX / 10
			target.x -= e.deltaY / 10
			quickY(target.y)
			quickX(target.x)
		},
		onDrag: (e) => {
			dragDist += Math.abs(e.deltaX) + Math.abs(e.deltaY)
			onInput()
			const factor = isTouch ? 1 : 0.25
			target.y += e.deltaX * factor
			target.x += e.deltaY * factor
			quickY(target.y)
			quickX(target.x)
		},
		onDragEnd: endGesture,
		onStop: endGesture,
	})

	/** First event of a gesture: stop leftover easing/snap so it starts from the current orientation. */
	function onInput() {
		if (!moving) {
			moving = true
			rebase()
		}
	}

	function endGesture() {
		moving = false
		settle() // easing may already be done (short gesture); otherwise its onComplete will call settle()
	}

	// Click on a media: rotate the sphere to center it (ignored right after a drag)
	function onMediaClick(e) {
		if (dragDist > 3) return
		const media = e.target.closest('.media')
		if (!media) return
		const index = Array.prototype.indexOf.call(medias, media)
		if (index === -1) return
		moving = false
		snapToIndex(index)
	}
	root.addEventListener('click', onMediaClick)

	// KILL
	const observer = new MutationObserver(mutations => {
		const isRootRemoved = mutations.some(mutation => 
			mutation.type === 'childList' && 
			Array.from(mutation.removedNodes).includes(root)
		)
		if (isRootRemoved) {
			snapTween?.kill()
			gsap.killTweensOf(smooth)
			root.removeEventListener('click', onMediaClick)
			mm.revert()
			gsapObs.kill()
			observer.disconnect()
		}
	})
	observer.observe(document.body, {childList: true, subtree: true})
})