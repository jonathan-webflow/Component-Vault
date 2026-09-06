window.addEventListener("DOMContentLoaded", () => {

    /* LENIS SMOOTH SCROLL (OPTIONAL) */
    lenis = new Lenis({
        autoRaf: true,
    })
    /* LENIS SMOOTH SCROLL (OPTIONAL) */

    document.fonts.ready.then(() => {

        const root = document.querySelector('.mwg_effect098')
        const pinHeight = root.querySelector('.pin-height')
        const container = root.querySelector('.container')
        
        gsap.to('.scroll', {
            autoAlpha:0,
            duration:0.2,
            scrollTrigger: {
                trigger: root,
                start:'top top',
                end:'top top-=1',
                toggleActions: "play none reverse none"
            }
        })

        const placeholderEl = root.querySelector('.placeholder')
        const pathsContainer = root.querySelector('.paths')

        const fullText = placeholderEl.textContent.trim()

        const svgTemplate = pathsContainer.querySelector('svg')
        pathsContainer.removeChild(svgTemplate)

        let svgIndex = 0

        function scaleForIndex(index) {
            return Math.max(0.1, 1 - 0.1 * (index - 1))
        }

        // Circumcenter from three samples along the path (start, midpoint, end)
        function getArcCenter(path) {
            const len = path.getTotalLength()
            const [{ x: ax, y: ay }, { x: bx, y: by }, { x: cx, y: cy }] = [0, len / 2, len].map((t) =>
                path.getPointAtLength(t)
            )
            const a2 = ax * ax + ay * ay
            const b2 = bx * bx + by * by
            const c2 = cx * cx + cy * cy
            const d = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by))
            return {
                x: (a2 * (by - cy) + b2 * (cy - ay) + c2 * (ay - by)) / d,
                y: (a2 * (cx - bx) + b2 * (ax - cx) + c2 * (bx - ax)) / d,
            }
        }

        // Set transform-origin on .circle so rotation pivots around the arc’s
        // circumcenter (circle through the three path samples).
        function applyArcTransformOrigin(circle, path, scale) {
            const svg = circle.querySelector('svg')
            const vb = svg.viewBox.baseVal
            const center = getArcCenter(path)
            const cxNorm = (center.x - vb.x) / vb.width
            const cyNorm = (center.y - vb.y) / vb.width
            const cxPct = (1 - scale) * 50 + cxNorm * scale * 100
            const cyPct = cyNorm * scale * 100
            circle.style.transformOrigin = `${cxPct}% ${cyPct}%`
        }

        function createArc() {
            svgIndex += 1
            const svg = svgTemplate.cloneNode(true)

            const path = svg.querySelector('path')
            const pathId = `path${svgIndex}`
            path.id = pathId

            const textPath = svg.querySelector('textPath')
            textPath.setAttribute('href', `#${pathId}`)
            textPath.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#${pathId}`)

            const scale = scaleForIndex(svgIndex)
            svg.querySelector('text').setAttribute('font-size', String(Math.round(60 / scale)))

            const circle = document.createElement('div')
            circle.className = 'circle'
            circle.appendChild(svg)
            pathsContainer.appendChild(circle)

            applyArcTransformOrigin(circle, path, scale)

            return { path, textPath }
        }

        function measureTextLength(textPath, content) {
            textPath.textContent = content
            let length = 0
            if (typeof textPath.getComputedTextLength === 'function') {
                length = textPath.getComputedTextLength()
            }
            if (!length) {
                try {
                    const bbox = textPath.getBBox()
                    length = bbox ? bbox.width : 0
                } catch (e) {
                    length = 0
                }
            }
            return length
        }

        function splitTextAcrossSvgs(text) {
            const words = text.split(/\s+/).filter(Boolean)
            let wordIndex = 0

            while (wordIndex < words.length) {
                const { path, textPath } = createArc()
                const pathLength = path.getTotalLength() * 0.98

                let current = ''
                let lastGood = ''

                while (wordIndex < words.length) {
                    const nextWord = words[wordIndex]
                    const candidate = current ? current + ' ' + nextWord : nextWord
                    const textLength = measureTextLength(textPath, candidate)

                    if (textLength <= pathLength) {
                        current = candidate
                        lastGood = candidate
                        wordIndex += 1
                    } else {
                        if (!current) {
                            let fit = ''
                            let charIdx = 0
                            while (charIdx < nextWord.length) {
                                const tryFit = fit + nextWord[charIdx]
                                if (measureTextLength(textPath, tryFit) <= pathLength) {
                                    fit = tryFit
                                    charIdx += 1
                                } else break
                            }
                            if (fit) {
                                current = fit
                                const remaining = nextWord.slice(fit.length)
                                if (remaining) words[wordIndex] = remaining
                                else wordIndex += 1
                            }
                        }
                        break
                    }
                }

                textPath.textContent = current || lastGood
            }
        }
        splitTextAcrossSvgs(fullText)

        // ANIMATION ON SCROLL

        const master = gsap.timeline({
            scrollTrigger: {
                trigger: pinHeight,
                start: 'top top',
                end: 'bottom bottom',
                pin: container,
                scrub: 1
            }
        })

        const circles = root.querySelectorAll('.circle')
        const texts = []

        circles.forEach(circle => {
            const textPath = circle.querySelector('textPath')
            texts.push(textPath.textContent)
            textPath.textContent = ''
        })
        circles.forEach((circle, i) => {
            const textPath = circle.querySelector('textPath')
            const text = texts[i]

            master.add(gsap.to(circle, {
                rotate: 0,
                ease: 'power2.inOut',
                duration: 2,
                onUpdate() {
                    const count = Math.floor(this.progress() * text.length)
                    textPath.textContent = text.substring(0, count)
                }
            }), i * (1 / circles.length))
        })
    })
})