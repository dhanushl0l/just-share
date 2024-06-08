document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('div[class^="about-page"]');
    const scrollableContainer = document.querySelector('.container-Founder-doc');
    let currentIndex = 0;
    let isScrolling = false;
    let startY = 0;
    let endY = 0;

    const showSection = (index) => {
        if (index < 0 || index >= sections.length) return;
        sections.forEach((section, i) => {
            section.style.transform = `translateY(${(i - index) * 100}vh)`;
        });
        currentIndex = index;
    };

    const handleScroll = (event) => {
        if (isScrolling) return;

        const delta = Math.sign(event.deltaY);

        if (scrollableContainer.contains(event.target)) {
            const scrollTop = scrollableContainer.scrollTop;
            const scrollHeight = scrollableContainer.scrollHeight;
            const containerHeight = scrollableContainer.clientHeight;

            if ((delta < 0 && scrollTop === 0) || (delta > 0 && scrollTop + containerHeight >= scrollHeight)) {
                isScrolling = true;
                setTimeout(() => {
                    isScrolling = false;
                }, 1000);

                if (delta > 0) {
                    showSection(currentIndex + 1);
                } else if (delta < 0) {
                    showSection(currentIndex - 1);
                }
            }
        } else {
            isScrolling = true;
            setTimeout(() => {
                isScrolling = false;
            }, 1000);

            if (delta > 0) {
                showSection(currentIndex + 1);
            } else if (delta < 0) {
                showSection(currentIndex - 1);
            }
        }
    };

    const handleTouchStart = (event) => {
        startY = event.touches[0].clientY;
    };

    const handleTouchMove = (event) => {
        endY = event.touches[0].clientY;
        const deltaY = startY - endY;

        if (currentIndex === 1 && deltaY < 0 && window.scrollY === 0) {
            event.preventDefault();
        }

        if (scrollableContainer.contains(event.target)) {
            const scrollTop = scrollableContainer.scrollTop;
            const scrollHeight = scrollableContainer.scrollHeight;
            const containerHeight = scrollableContainer.clientHeight;

            if ((deltaY < 0 && scrollTop === 0) || (deltaY > 0 && scrollTop + containerHeight >= scrollHeight)) {
                event.preventDefault();
            }
        }
    };

    const handleTouchEnd = (event) => {
        const deltaY = startY - endY;

        if (scrollableContainer.contains(event.target)) {
            const scrollTop = scrollableContainer.scrollTop;
            const scrollHeight = scrollableContainer.scrollHeight;
            const containerHeight = scrollableContainer.clientHeight;

            if ((deltaY < 0 && scrollTop === 0) || (deltaY > 0 && scrollTop + containerHeight >= scrollHeight)) {
                if (Math.abs(deltaY) > 50) {
                    if (deltaY > 0) {
                        showSection(currentIndex + 1);
                    } else {
                        showSection(currentIndex - 1);
                    }
                }
            }
        } else {
            if (Math.abs(deltaY) > 50) {
                if (deltaY > 0) {
                    showSection(currentIndex + 1);
                } else {
                    showSection(currentIndex - 1);
                }
            }
        }
    };

    document.addEventListener('wheel', handleScroll, { passive: false });
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });

    showSection(currentIndex);
});


function openLink() {
    window.location.href = "https://github.com/dhanushl0l/just-share";
}


