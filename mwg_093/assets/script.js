window.addEventListener("DOMContentLoaded", () => {

    const root = document.querySelector('.mwg_effect093')

    const mediaSrcs = Array.from(root.querySelectorAll('.medias .media'), el => el.src)
    let mediaIndex = 0

    const word = root.querySelector('.word')
    wrapLettersInSpan(word)

    const letters = [...word.querySelectorAll('.letter')]
    const overflows = new Array(letters.length).fill(0)
    const mediaWidth = 0.095 * window.innerWidth

    letters.forEach(letter => {
        letter.addEventListener('mouseenter', () => {
            if (letter.children.length === 0) createMedia(letter)
        })
    })

    function applyLetterOffsets() {
        if (letters.length === 0) return

        let sumLeft = 0
        const targets = overflows.map((ov, i) => {
            const sumRight = overflows.slice(i + 1).reduce((a, v) => a + v, 0)
            const x = sumLeft - sumRight
            sumLeft += ov
            return x
        })

        gsap.to(letters, {
            x: i => targets[i],
            duration: 0.3,
            ease: 'back.out(3)',
            overwrite: 'auto'
        })
    }

    function createMedia(letter) {
        const img = document.createElement('img')
        img.src = mediaSrcs[mediaIndex]
        img.classList.add('created-media')
        letter.appendChild(img)

        gsap.set(img, {
            yPercent: -50,
            xPercent: -50,
        })
        gsap.from(img, {
            rotation: (Math.random() - 0.5) * 20,
            scale: 1.05,
            duration: 0.3,
            ease: 'back.out(2)'
        })

        mediaIndex = (mediaIndex + 1) % mediaSrcs.length

        const index = letters.indexOf(letter)
        if (index === -1) return

        const overflowX = Math.max(0, (mediaWidth - letter.getBoundingClientRect().width) / 2)
        overflows[index] = Math.max(overflows[index], overflowX)
        applyLetterOffsets()

        gsap.delayedCall(1.2, () => {
            const parent = img.parentElement
            const idx = letters.indexOf(parent)
            if (idx !== -1) overflows[idx] = 0

            img.remove()
            applyLetterOffsets()

            gsap.from(parent, {
                rotation: (Math.random() - 0.5) * 20,
                scale: 1.05,
                duration: 0.3,
                ease: 'back.out(2)'
            })
        })
    }

    // UTIL
    function wrapLettersInSpan(element) {
        element.innerHTML = element.textContent
            .split('')
            .map(char => char === ' ' ? '<span>&nbsp;</span>' : `<span class="letter">${char}</span>`)
            .join(' ');
    }
})