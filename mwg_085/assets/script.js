window.addEventListener("DOMContentLoaded", () => {

    /* LENIS SMOOTH SCROLL (OPTIONAL) */
    lenis = new Lenis({
        autoRaf: true,
    })
    /* LENIS SMOOTH SCROLL (OPTIONAL) */

    const root = document.querySelector('.mwg_effect085')
    const sentence = root.querySelector('.sentence')
    const pinHeight = root.querySelector('.pin-height')
    const container = root.querySelector('.container')

    wrapWordsInSpan(sentence)

    const words = root.querySelectorAll('.word')
    for (let i = 0; i < 4 && i < words.length; i++) words[i].classList.add('on')

    ScrollTrigger.create({
        trigger: pinHeight,
        start: 'top top',
        end: 'bottom bottom',
        pin: container
    })

    centerSentence()

    Array.from(words).slice(4).forEach((word, index) => {
        ScrollTrigger.create({
            trigger: root,
            start: 'top top-=' + ((pinHeight.clientHeight - window.innerHeight) / (words.length - 4)) * index,
            onEnter: () => {
                words[index + 4].classList.add('on')
                words[index].classList.remove('on')
                centerSentence()
            },
            onLeaveBack: () => {
                words[index + 4].classList.remove('on')
                words[index].classList.add('on')
                centerSentence()
            }
        })
    })

    function centerSentence() {
        const firstWord = root.querySelector('.word.on')
        const lastWord = firstWord.nextElementSibling.nextElementSibling.nextElementSibling
        const widthWords = lastWord.getBoundingClientRect().right - firstWord.getBoundingClientRect().left
        const distBeginSentence = firstWord.getBoundingClientRect().left - sentence.getBoundingClientRect().left

        gsap.to(sentence, {
            x: window.innerWidth/2 - distBeginSentence - widthWords / 2,
            duration:0.15,
            ease:'power1.inOut'
        })
    }

    // UTLS
    function wrapWordsInSpan(element) {
        const text = element.textContent
        element.innerHTML = text
            .split(' ')
            .map(word => `<span class="word">${word}</span>`)
            .join(' ')
    }
})