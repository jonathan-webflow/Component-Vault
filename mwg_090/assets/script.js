window.addEventListener("DOMContentLoaded", () => {

    /* LENIS SMOOTH SCROLL (OPTIONAL) */
    lenis = new Lenis({
        autoRaf: true,
    })
    /* LENIS SMOOTH SCROLL (OPTIONAL) */

    gsap.to('.scroll', {
        autoAlpha:0,
        duration:0.2,
        scrollTrigger: {
            trigger:'.mwg_effect090',
            start:'top top',
            end:'top top-=1',
            toggleActions: "play none reverse none"
        }
    })

    document.fonts.ready.then(() => {
        window.addEventListener('resize', () => {
            ScrollTrigger.refresh()
        })
        
        const pinHeight = document.querySelector('.mwg_effect090 .pin-height')
        const container = document.querySelector('.mwg_effect090 .container')
        const paragraph = document.querySelector(".mwg_effect090 .paragraph")
        
        let split = SplitText.create(paragraph, { 
            type: "lines, words, chars",
            charsClass: "char"
        });
    
        // once lines are known, hide the characters
        split.chars.forEach(char => {
            char.style.display = "none"
        })
    
        ScrollTrigger.create({
            trigger: pinHeight,
            start: 'top top',
            end: 'bottom bottom',
            pin: container
        })
    
        split.lines.forEach(line => {
            const letters = line.querySelectorAll('.char'); // all characters on this line
    
            gsap.to(letters, {
                display: "inline",
                stagger: {
                    each: 0.2,
                    from: "random"
                },
                ease: 'none',
                scrollTrigger: {
                    trigger: '.mwg_effect090',
                    start: 'top -10%', // avoid early-revealed letters staying too long visible/invisible with smooth scroll at the top of the page
                    end: 'bottom bottom',
                    scrub: true
                }
            })
        })
    })
})