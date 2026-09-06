window.addEventListener("DOMContentLoaded", () => {

    /* LENIS SMOOTH SCROLL (OPTIONAL) */
    lenis = new Lenis({
        autoRaf: true,
    })
    /* LENIS SMOOTH SCROLL (OPTIONAL) */

    document.fonts.ready.then(() => {
        const root = document.querySelector('.mwg_effect081')
        const pinHeight = root.querySelector('.pin-height')
        const container = root.querySelector('.container')
        const paragraphs = root.querySelectorAll(".paragraph")
        const allParagraphsContainer = root.querySelector('.all-paragraphs')

        let maxCharsPerLine = 0
        let maxLinesPerParagraph = 0
        const linesPerParagraph = []

        paragraphs.forEach(paragraph => {
            const split = SplitText.create(paragraph, { 
                type: "lines, chars",
                linesClass: "line",
                charsClass: "char"
            })
            split.chars.forEach(char => char.removeAttribute("style"))
            split.lines.forEach(line => line.removeAttribute("style"))

            linesPerParagraph.push(split.lines)

            if (split.lines.length > maxLinesPerParagraph) {
                maxLinesPerParagraph = split.lines.length
            }
            split.lines.forEach(line => {
                const charCount = line.querySelectorAll('.char').length
                if (charCount > maxCharsPerLine) maxCharsPerLine = charCount
            })
        })

        for (let lineIndex = 0; lineIndex < maxLinesPerParagraph; lineIndex++) {
            const groupDiv = document.createElement('div')
            groupDiv.className = 'all-paragraphs-line'

            linesPerParagraph.forEach(paragraphLines => {
                const sourceLine = paragraphLines[lineIndex]
                if (sourceLine) {
                    const clonedLine = sourceLine.cloneNode(true)
                    groupDiv.appendChild(clonedLine)
                } else {
                    const placeholder = document.createElement('div')
                    placeholder.className = 'line'
                    groupDiv.appendChild(placeholder)
                }
            })

            allParagraphsContainer.appendChild(groupDiv)
        }

        const groups = Array.from(allParagraphsContainer.querySelectorAll('.all-paragraphs-line'))
        const linesMatrix = groups.map(g => Array.from(g.querySelectorAll('.line')))
        const charsMatrix = linesMatrix.map(lines => lines.map(line => Array.from(line.querySelectorAll('.char'))))
        const paragraphCount = linesMatrix[0].length

        const easeFn = gsap.parseEase('power3.inOut')

        ScrollTrigger.create({
            trigger: pinHeight,
            start: 'top top',
            end: 'bottom bottom',
            pin: container,
            scrub: true,
            onUpdate: self => {
                const p = Math.min(1, Math.max(0, self.progress))

                const paraProgress = p * (paragraphCount - 1)
                const fromIndex = Math.max(0, Math.floor(paraProgress))
                const toIndex = Math.min(paragraphCount - 1, fromIndex + 1)
                const intraEased = easeFn(paraProgress - fromIndex)
                const charIndex = Math.min(maxCharsPerLine, Math.max(0, Math.round(intraEased * maxCharsPerLine)))
                const fadeWindow = 3 // letters at (n-1, n-2, n-3) before fully gone
                const toCharIndex = Math.min(
                    maxCharsPerLine,
                    Math.max(0, charIndex - fadeWindow + 1)
                ) // new line waits until the fade finishes before appearing

                // Update only the two active paragraphs, per group
                groups.forEach((_, gi) => {
                    const fromChars = charsMatrix[gi][fromIndex]
                    const toChars = charsMatrix[gi][toIndex]
                    
                    // When fromIndex and toIndex are equal (end of scroll),
                    // avoid double-updating the display and keep the last paragraph visible
                    if (fromIndex === toIndex) {
                        if (fromChars) fromChars.forEach(c => gsap.set(c, { display: 'inline', opacity: 1 }))
                    } else {
                        // End of transition: ensure the old paragraph is fully invisible
                        // (prevents 1–2 characters staying slightly visible due to rounding)
                        if (intraEased >= 0.999) {
                            if (fromChars) fromChars.forEach(c => gsap.set(c, { display: 'none', opacity: 0 }))
                            if (toChars) toChars.forEach(c => gsap.set(c, { display: 'inline', opacity: 1 }))
                            return
                        }

                        // fromChars: fade out letters just before the break
                        // i === charIndex - 1 => low opacity (transparent)
                        // i === charIndex - 2..charIndex - 3 => progressively more visible
                        if (fromChars) {
                            fromChars.forEach((c, i) => {
                                const d = charIndex - i // d > 0 => i is to the left of the break
                                if (i >= charIndex) {
                                    gsap.set(c, { display: 'inline', opacity: 1 })
                                } else if (d > 0 && d <= fadeWindow) {
                                    const opacity = 1 - (d / fadeWindow) // d=1 => ~0.67, d=3 => 0
                                    gsap.set(c, { display: 'inline', opacity })
                                } else {
                                    gsap.set(c, { display: 'none', opacity: 0 })
                                }
                            })
                        }

                        // toChars: wait until the first letter has finished disappearing (end of fadeWindow)
                        if (toChars) toChars.forEach((c, i) => gsap.set(c, { display: i < toCharIndex ? 'inline' : 'none', opacity: i < toCharIndex ? 1 : 0 }))
                    }
                })
            }
        })
    })
})