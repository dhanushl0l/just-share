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

        // Check if the scroll event is within the scrollable container
        if (scrollableContainer.contains(event.target)) {
            const scrollTop = scrollableContainer.scrollTop;
            const scrollHeight = scrollableContainer.scrollHeight;
            const containerHeight = scrollableContainer.clientHeight;

            // Allow page transition only if at the top or bottom of the container
            if ((delta < 0 && scrollTop === 0) || (delta > 0 && scrollTop + containerHeight >= scrollHeight)) {
                isScrolling = true;
                setTimeout(() => {
                    isScrolling = false;
                }, 1000); // Adjust timeout to match the CSS transition duration

                if (delta > 0) {
                    showSection(currentIndex + 1);
                } else if (delta < 0) {
                    showSection(currentIndex - 1);
                }
            }
        } else {
            // If the scroll event is outside the container, handle page transition
            isScrolling = true;
            setTimeout(() => {
                isScrolling = false;
            }, 1000); // Adjust timeout to match the CSS transition duration

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
    };

    const handleTouchEnd = () => {
        const deltaY = startY - endY;

        if (scrollableContainer.contains(event.target)) {
            const scrollTop = scrollableContainer.scrollTop;
            const scrollHeight = scrollableContainer.scrollHeight;
            const containerHeight = scrollableContainer.clientHeight;

            // Allow page transition only if at the top or bottom of the container
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
            // If the touch event is outside the container, handle page transition
            if (Math.abs(deltaY) > 50) {
                if (deltaY > 0) {
                    showSection(currentIndex + 1);
                } else {
                    showSection(currentIndex - 1);
                }
            }
        }
    };

    document.addEventListener('wheel', handleScroll);
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    showSection(currentIndex); // Initialize the first section
});


function openLink() {
    window.location.href = "https://github.com/dhanushl0l/just-share";
}


