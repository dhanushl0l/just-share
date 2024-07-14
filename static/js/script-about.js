document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('div[class^="about-page"]');
    const scrollableContainer = document.querySelector('.container-Founder-doc');
    let currentIndex = 0;
    let isScrolling = false;
    let touchStartY = 0;
    let touchEndY = 0;

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

        if (currentIndex === 2 && scrollableContainer.contains(event.target)) {
            const scrollTop = scrollableContainer.scrollTop;
            const scrollHeight = scrollableContainer.scrollHeight;
            const containerHeight = scrollableContainer.clientHeight;

            if ((delta < 0 && scrollTop === 0) || (delta > 0 && scrollTop + containerHeight >= scrollHeight)) {
                isScrolling = true;
                setTimeout(() => {
                    isScrolling = false;
                }, 1000);

                if (delta > 0 && scrollTop + containerHeight >= scrollHeight) {
                    showSection(currentIndex + 1);
                } else if (delta < 0 && scrollTop === 0) {
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
        touchStartY = event.touches[0].clientY;
    };

    const handleTouchEnd = (event) => {
        touchEndY = event.changedTouches[0].clientY;
        handleSwipe();
    };

    const handleSwipe = () => {
        const deltaY = touchEndY - touchStartY;
        if (Math.abs(deltaY) > 10) {
            if (currentIndex === 2) {
                const scrollTop = scrollableContainer.scrollTop;
                const scrollHeight = scrollableContainer.scrollHeight;
                const containerHeight = scrollableContainer.clientHeight;

                if ((deltaY > 0 && scrollTop === 0) || (deltaY < 0 && scrollTop + containerHeight >= scrollHeight)) {
                    if (deltaY > 0) {
                        showSection(currentIndex - 1); // Swipe down
                    } else {
                        showSection(currentIndex + 1); // Swipe up
                    }
                }
            } else {
                if (deltaY > 0) {
                    showSection(currentIndex - 1); // Swipe down
                } else {
                    showSection(currentIndex + 1); // Swipe up
                }
            }
        }
    };

    document.addEventListener('wheel', handleScroll, { passive: false });
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    showSection(currentIndex);
});


function openLink() {
    window.location.href = "https://github.com/dhanushl0l/just-share";
}
