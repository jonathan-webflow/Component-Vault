window.addEventListener("DOMContentLoaded", () => {

    document.fonts.ready.then(() => {
        const root = document.querySelector('.mwg_effect086')
        const texts = root.querySelectorAll('.text')

        function handleMouseLeave(e) {
            const text = e.currentTarget
            if(!text.classList.contains('outro')) {
                text.classList.add('outro')
                if(text.tl) {
                    text.tl.reverse()
                }
            }
        }

        function handleLetterMouseEnter(e) {
            const letter = e.currentTarget
            const parent = letter.closest('.text')

            if(parent.classList.contains('hovered')) {
                if(parent.classList.contains('outro')) {
                    parent.classList.remove('outro')
                    if(parent.tl) parent.tl.play()
                }
                return;
            }
            
            parent.classList.add('hovered')

            const siblings = Array.from(parent.querySelectorAll('.letter'))
            const index = siblings.indexOf(letter)

            const rect = letter.getBoundingClientRect()
            const isPastMidpoint = e.clientX > rect.left + rect.width / 2
            const splitIndex = isPastMidpoint ? index : index - 1

            const leftLetters = siblings.slice(0, splitIndex + 1)
            const rightLetters = siblings.slice(splitIndex + 1)

            const media = parent.parentElement.querySelector('.media')
            const lastLeftLetter = leftLetters[leftLetters.length - 1]
            const leftDistance = lastLeftLetter ? lastLeftLetter.getBoundingClientRect().right - parent.getBoundingClientRect().left : 0
            
            
            const tl = gsap.timeline({
                onReverseComplete: () => {
                    parent.classList.remove('hovered')
                    parent.classList.remove('outro')
                }
            })
            
            parent.tl = tl

            tl.fromTo(media, {
                x: leftDistance,
                xPercent: -50
            }, {
                clipPath: 'inset(0% 0% round 1vw)',
                duration: 0.4,
                ease: 'expo.inOut'
            }, 0)
            if (leftLetters.length) tl.to(leftLetters, {
                x: -0.086 * window.innerWidth,
                duration: 0.4,
                ease: 'expo.inOut'
            }, 0)
            if (rightLetters.length) tl.to(rightLetters, {
                x: 0.086 * window.innerWidth,
                duration: 0.4,
                ease: 'expo.inOut'
            }, 0)
        }

        texts.forEach(text => {
            wrapLettersInSpan(text)
            text.addEventListener('mouseleave', handleMouseLeave)
        })

        const letters = root.querySelectorAll('.letter')
        letters.forEach(letter => {
            letter.addEventListener('mouseenter', handleLetterMouseEnter)
        })
    })

    function wrapLettersInSpan(element) {
        const textStr = element.textContent;
        element.innerHTML = textStr
            .split('')
            .map(char => char === ' ' ? '<span class="letter">&nbsp;</span>' : `<span class="letter">${char}</span>`)
            .join('');
    }
})