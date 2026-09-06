window.addEventListener("DOMContentLoaded", () => {

    /* LENIS SMOOTH SCROLL (OPTIONAL) */
    lenis = new Lenis({
        autoRaf: true,
    })
    /* LENIS SMOOTH SCROLL (OPTIONAL) */

    const root = document.querySelector('.mwg_effect084')
    const pinHeight = root.querySelector('.pin-height')
    const container = root.querySelector('.container')
    const medias = root.querySelectorAll('.media')

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

    const divs = []
    const perRow = window.innerWidth <= 768 ? 3 : 5
    for (let i = 0; i < medias.length; i++) {
        if (i % perRow === 0) divs.push([])
            divs[divs.length - 1].push(medias[i])
    }
    
    divs.forEach((group) => {
        const wrap = document.createElement('div')
        wrap.className = 'group'
        group.forEach((el) => wrap.appendChild(el))
        container.appendChild(wrap)
    })
    
    const groups = root.querySelectorAll('.group')

    const master = gsap.timeline({
        scrollTrigger: {
            trigger: pinHeight,
            start: 'top top',
            end: 'bottom bottom',
            pin: container,
            scrub: true
        }
    })

    groups.forEach((group, i) => {
        const tl = gsap.timeline()
        const groupMedias = group.querySelectorAll('.media')

        // tl.set(groupMedias, {
        //     z: () => {return (Math.random() - 0.5) * 0.2 * window.innerWidth; }
        // })
        tl.fromTo(group, {
            zIndex: groups.length - i,
            z: -0.8 * window.innerWidth,
            yPercent: -100
        }, {
            z: 0,
            yPercent: -50,
            y: '50vh',
            duration: 0.5,
            ease: 'power3.inOut'
        })
        tl.from(groupMedias, {
            // rotateX: -50,
            yPercent: -200,
            stagger: {
                each: 0.03,
                from: 'center'
            },
            duration: 0.35,
            ease: 'power3.inOut'
        }, '<')

        tl.to(group, {
            z: 0.8 * window.innerWidth,
            yPercent: 0,
            y: '100vh',
            duration: 0.5,
            ease: 'power3.inOut'
        })
        tl.to(groupMedias, {
            // rotateX: 50,
            yPercent: 200,
            stagger: {
                each: 0.03,
                from: 'center'
            },
            duration: 0.35,
            ease: 'power3.inOut'
        }, '<')
        

        master.add(tl, i * (1 / groups.length))
    })
})