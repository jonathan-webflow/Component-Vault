window.addEventListener("DOMContentLoaded", () => {

    const root = document.querySelector('.mwg_effect057')
    const container = root.querySelector('.container')
    const left = root.querySelector('.left')
    const right = root.querySelector('.right')
    const media = root.querySelectorAll('.media')
    
    // Create the timeline
    const tl = gsap.timeline({paused: true})
    
    // Compute positions so the outer edges sit an equal distance from the viewport edges
    // Inset from the viewport edges
    const margin = 0.1 * window.innerWidth
    
    // For .left: align its left edge 'margin' px from the viewport’s left edge
    // Target left edge of .left = margin
    // Current left edge of .left = left.getBoundingClientRect().left
    const leftRect = left.getBoundingClientRect()
    const leftTargetLeft = margin
    const leftDistance = leftTargetLeft - leftRect.left
    
    // For .right: align its right edge 'margin' px from the viewport’s right edge
    // Target right edge of .right = window.innerWidth - margin
    // Current right edge of .right = right.getBoundingClientRect().right
    const rightRect = right.getBoundingClientRect()
    const rightTargetRight = window.innerWidth - margin
    const rightDistance = rightTargetRight - rightRect.right
    
    // Compute the center of the gap between the two words after they translate
    // Final right edge of .left (viewport coordinates)
    const leftFinalRight = leftRect.right + leftDistance
    // Final left edge of .right (viewport coordinates)
    const rightFinalLeft = rightRect.left + rightDistance
    // Center of the gap between the two (viewport coordinates)
    const centerXViewport = (leftFinalRight + rightFinalLeft) / 2
    const centerYViewport = (leftRect.top + leftRect.bottom) / 2
    
    // Convert to translation relative to the container
    // Media is at left:0, top:0 in CSS, so x and y are the offset from (0, 0)
    const containerRect = container.getBoundingClientRect()
    const translateX = centerXViewport - containerRect.left
    const translateY = centerYViewport - containerRect.top
    
    // yPercent: same range as -50 + (Math.random() - 0.5) * 200, spread by index
    const yPercentMin = -50 + (-0.5) * 200
    const yPercentMax = -50 + (0.5) * 200
    const mediaCount = media.length
    
    // Place media at the center (transform: translate(-50%, -50%) is already in CSS)
    
    // Animate both elements at the same time
    tl.to(left, { 
        x: leftDistance,
        duration: 0.8,
        ease: 'expo.inOut'
    })
    tl.to(right, { 
        x: rightDistance,
        duration: 0.8,
        ease: 'expo.inOut'
    }, '<')

    tl.fromTo(media, {
        display: 'none',
        scale: () => 0.8,
        rotate: () => { return (Math.random() - 0.5) * 10 },
        x: translateX,
        y: translateY,
        xPercent: () => { return -50 + (Math.random() - 0.5) * 120 },
        yPercent: (i) => {
            if (mediaCount <= 1) return (yPercentMin + yPercentMax) / 2
            return yPercentMin + (i / (mediaCount - 1)) * (yPercentMax - yPercentMin)
        },
    }, {
        display: 'block',
        scale: () => { return Math.random()/5 + 1 },
        rotate: () => { return (Math.random() - 0.5) * 10 },
        ease: 'back.out(2)',
        duration: 0.3,
        stagger: {
            each: 0.045,
            from: 'random'
        }
    }, '<0.3')

    function handleMouseEnter() {
        tl.play()
    }
    function handleMouseLeave() {
        tl.reverse()
    }
    container.addEventListener('mouseenter', handleMouseEnter)
    container.addEventListener('mouseleave', handleMouseLeave)
})