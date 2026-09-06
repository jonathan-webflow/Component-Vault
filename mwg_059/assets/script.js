window.addEventListener("DOMContentLoaded", () => {

    /* LENIS SMOOTH SCROLL (OPTIONAL) */
    lenis = new Lenis({
        autoRaf: true,
    })
    /* LENIS SMOOTH SCROLL (OPTIONAL) */

    document.fonts.ready.then(() => {
        const root = document.querySelector('.mwg_effect059')
        const pinHeight = root.querySelector('.pin-height')
        const container = root.querySelector('.container')

        gsap.to('.scroll', {
            autoAlpha: 0,
            duration: 0.2,
            scrollTrigger: {
                trigger: root,
                start: 'top top',
                end: 'top top-=1',
                toggleActions: "play none reverse none"
            }
        })

        const svg = root.querySelector('#mysvg')
        const path = root.querySelector('#mypath')

        const { width: vbW, height: vbH } = svg.viewBox.baseVal;
        svg.style.aspectRatio = vbW / vbH

        
        const svgCssW = svg.getBoundingClientRect().width;
        const visibleW = container.getBoundingClientRect().width;
        const scaleFactor = visibleW / svgCssW; 

        const position = {x: 0, y: 0}
        const updateViewBox = () => svg.setAttribute('viewBox', `${position.x} ${position.y} ${vbW} ${vbH}`)
        const tweenOpts = { duration: 0.2, ease: 'power1', onUpdate: updateViewBox }
        const xTo = gsap.quickTo(position, "x", tweenOpts)
        const yTo = gsap.quickTo(position, "y", tweenOpts)

        const tp = document.querySelector('textPath');
        const str = tp.textContent.trim()
        const chars = str.split('');
        const totalChars = chars.length

        // Measure text length along the path (= arc length spanned by the string)
        tp.textContent = str;
        const textLen = tp.getComputedTextLength();
        tp.textContent = '';

        // Build evenly spaced positions (points) along the path
        // only over the portion covered by the text
        const stepCount = 1000
        const points = [];
        for (let i = 0; i < stepCount; i++) {
            const u = i / (stepCount - 1);
            const len = u * textLen;
            const p = path.getPointAtLength(len);
            points.push({ x: p.x, y: p.y });
        }

        ScrollTrigger.create({
            trigger: pinHeight,
            start: 'top top',
            end: 'bottom bottom',
            pin: container,
            scrub: true,
            onUpdate: self => {
                const idx = Math.floor(self.progress * (points.length - 1)); // index of the nearest point
                const p = points[idx];

                // Center the viewBox on this point
                xTo(p.x - (vbW * scaleFactor) / 2);
                yTo(p.y - vbH / 2 - 60); // -60 to account for letter height when centering

                // Reveal the string character by character from scroll progress; when self.progress === 1 the string is complete
                // Only update when different to avoid unnecessary DOM writes
                const next = chars.slice(0, Math.floor(self.progress * totalChars)).join('');
                if (tp.textContent !== next) tp.textContent = next;
            }
        })
    })
})