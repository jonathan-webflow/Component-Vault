window.addEventListener("DOMContentLoaded", () => {

    const root = document.querySelector('.mwg_effect063')
    const container = root.querySelector('.container')

    let observers = []
    let lastIndexMoved = null
    let dragElIndex = null
    let hasOneElMoved = false
    let items = root.querySelectorAll(".media")
    let longPressTimer
    let activeDrag = null

    const xTo = gsap.quickTo(container, "scrollLeft", {
        duration: 0.5, 
        ease: 'power4'
    })

    let total = 0
    const gsapObs = Observer.create({
        target: container,
        type: "touch,pointer",
        onDragStart: () => {
            xTo(container.scrollLeft, container.scrollLeft);
            total = container.scrollLeft;
        },
        onDrag: (self) => {
            if (activeDrag) return;
            total -= self.deltaX * 1.4;
            total = gsap.utils.clamp(0, container.scrollWidth - container.clientWidth, total);
            xTo(total);
        }
    })

    function createObserver(item, index, itemWidth) {
        return Observer.create({
            target: item,
            type: "touch,pointer",
            onPress: (self) => {
                const scrollLeft = container.scrollLeft;
                longPressTimer = setTimeout(() => {
                    if(Math.abs(scrollLeft - container.scrollLeft) > 10) return;

                    if (activeDrag === null) {
                        root.classList.add('hover-off')
                        gsap.to(self.target, {
                            scale: 0.9,
                            ease: 'back.out(4)',
                            duration: 0.2
                        });

                        lastIndexMoved = index;
                        dragElIndex = index;

                        activeDrag = Draggable.create(self.target, {
                            type: "x",
                            autoScroll: 2,
                            onDrag: () => {
                                const selectedElRect = self.target.getBoundingClientRect();
                                const distToLeft = itemWidth/2 + selectedElRect.left + container.scrollLeft;
                                moveOtherItems(itemWidth, index, distToLeft);
                            },
                            onDragEnd: () => {
                                observers.forEach(o => o.kill());
                                activeDrag.kill();
                                activeDrag = null;
                                longPressTimer = null;
                                let dist = 0;

                                items.forEach((itemLoop, i) => {
                                    if(lastIndexMoved > dragElIndex) {
                                        if(itemLoop === item || i > lastIndexMoved || i < dragElIndex) return;
                                        dist += itemLoop.clientWidth + parseInt(getComputedStyle(container).gap) || 10;
                                    } else if(lastIndexMoved < dragElIndex) {
                                        if(itemLoop === item || i < lastIndexMoved || i > dragElIndex) return;
                                        dist -= itemLoop.clientWidth + parseInt(getComputedStyle(container).gap) || 10;
                                    }
                                });

                                gsap.to(item, {
                                    x: dist,
                                    rotation: 0,
                                    scale: 1,
                                    duration: .2,
                                    ease: 'back.out(1.5)',
                                    onComplete: () => {
                                        moveDOM(item, lastIndexMoved);
                                        reinit();
                                        console.log('item sorted')
                                    }
                                });
                            }
                        })[0];
                        activeDrag.startDrag(self.event);
                    }
                }, 400);
            },
            onRelease: () => {
                longPressTimer && clearTimeout(longPressTimer);
            }
        });
    }

    function setupObservers() {
    observers = [];
    items.forEach((item, index) => {
        const itemWidth = item.clientWidth;
        item.setAttribute('data-left', itemWidth/2 + item.getBoundingClientRect().left + container.scrollLeft);
        observers.push(createObserver(item, index, itemWidth));
    });
    }

    setupObservers();

    function moveOtherItems(itemWidth, currentDragElIndex, distToLeft) {
        const gap = parseInt(getComputedStyle(container).gap) || 10;
        const offset = itemWidth + gap;
        
        items.forEach((item, index) => {
            if (index === currentDragElIndex) return;

            const itemRect = item.getBoundingClientRect();
            const itemLeft = itemWidth/2 + itemRect.left + container.scrollLeft;
            const hasMoved = item.classList.contains('moved');
            const shouldMove = distToLeft < itemLeft;
            
            if (shouldMove === hasMoved) return;
            
            item.classList.toggle('moved');
            
            const isBefore = index < currentDragElIndex;
            let targetX = 0;
            
            if (shouldMove && isBefore) {
                targetX = offset;
                lastIndexMoved = index;
                hasOneElMoved = true;
            } else if (!shouldMove && !isBefore) {
                targetX = -offset;
                lastIndexMoved = index;
                hasOneElMoved = true;
            } else if (hasOneElMoved) {
                lastIndexMoved = shouldMove ? index - 1 : index + 1;
            }

            gsap.to(item, { x: targetX, duration: 0.2, ease: 'back.out(1.05)' });
        })
    }

    function moveDOM(item, newIndex) {
        const itemsArray = Array.from(items);
        const currentIndex = itemsArray.indexOf(item);
        
        if (currentIndex === -1 || currentIndex === newIndex) return;
        
        itemsArray.splice(currentIndex, 1);
        itemsArray.splice(newIndex, 0, item);
        
        itemsArray.forEach(img => container.appendChild(img));
    }

    function reinit() {
        items = root.querySelectorAll(".media");
        items.forEach(item => {
            gsap.set(item, { clearProps: "all" });
            item.setAttribute('data-left', item.clientWidth/2 + item.getBoundingClientRect().left + container.scrollLeft);
        });
        hasOneElMoved = false;
        setupObservers();

        gsap.delayedCall(0.6, () => {
            root.classList.remove('hover-off')
        })
    }
})