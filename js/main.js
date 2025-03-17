
// -----------------------------------------------------------------------------
// This file includes deliberate formatting errors in order for you to verify
// that ESLint and EditorConfig are working properly. If both tools are, indeed,
// working correctly, then you’d see errors in your editor about indentation and
// improper use of footmarks instead of back ticks. When you save this file,
// your editor should strip all excess newlines and whitespace characters from
// the file. If both of these events occur, then ESLint and EditorConfig are
// working correctly.
//
// DON’T PROCEED UNTIL YOU’RE SURE ESLINT AND EDITORCONFIG ARE WORKING CORRECTLY
// -----------------------------------------------------------------------------

document.addEventListener(`DOMContentLoaded`, async () => {
    try {
        const response = await fetch(`./json/data.json`);
        const data = await response.json();
        if (!data || data.length === 0) {
            console.error(`No data found in JSON.`);
            return;
        }
        createSlides(data);
    } catch (error) {
        console.error(`Error loading JSON data:`, error);
    }
});

const createSlides = (data) => {
    const carouselContainer = document.querySelector(`.carousel-slides`);

    if (!carouselContainer) {
        console.error(`Carousel container not found!`);
        return;
    }

    data.forEach((album, index) => {
        const slide = document.createElement(`div`);
        slide.className = `carousel-slide`;
        if (index === 0) slide.classList.add(`active`);

        slide.innerHTML = `
            <img src="${album.cover_image.path}"
                 alt="${album.cover_image.alt_content}"
                 width="${album.cover_image.width}"
                 height="${album.cover_image.height}">
            <h2>${album.album}</h2>
            <h3>${album.artist}</h3>
            <p>${album.review.content}</p>
            <a href='${album.review.url}' target='_blank' class='review-link'>${album.review.source}</a>
        `;

        carouselContainer.appendChild(slide);
    });

    setTimeout(() => {
        initializeCarousel();
    }, 100);
};


const initializeCarousel = () => {
    const slides = document.querySelectorAll(`.carousel-slide`);
    let currentIndex = 0;
    const totalSlides = slides.length;

    if (totalSlides === 0) {
        console.error(`No slides found!`);
        return;
    }

    const navButtons = document.querySelectorAll(`.carousel-navigation a`);
    if (navButtons.length < 2) {
        console.error(`Navigation buttons not found!`);
        return;
    }

    const prevButton = navButtons[0]; // First <a> is "Previous"
    const nextButton = navButtons[1]; // Second <a> is "Next"

    const showSlide = (index) => {
        slides.forEach((slide, i) => {
            slide.style.display = i === index ? `block` : `none`;
            slide.classList.toggle(`active`, i === index);
        });

        // Disable/Enable navigation buttons based on current index
        prevButton.style.opacity = (index === 0) ? `0.5` : `1`; // Fade out when on the first slide
        prevButton.style.pointerEvents = (index === 0) ? `none` : `auto`; // Disable if on first slide
        nextButton.style.opacity = (index === totalSlides - 1) ? `0.5` : `1`; // Fade out on last slide
        nextButton.style.pointerEvents = (index === totalSlides - 1) ? `none` : `auto`; // Disable if on last slide
    };

    prevButton.addEventListener(`click`, (event) => {
        event.preventDefault();
        if (currentIndex > 0) { // Prevent looping back
            currentIndex--;
            showSlide(currentIndex);
        }
    });

    nextButton.addEventListener(`click`, (event) => {
        event.preventDefault();
        if (currentIndex < totalSlides - 1) { // Prevent looping forward
            currentIndex++;
            showSlide(currentIndex);
        }
    });

    document.addEventListener(`keydown`, (event) => {
        if (event.key === `ArrowLeft` && currentIndex > 0) {
            currentIndex--;
            showSlide(currentIndex);
        } else if (event.key === `ArrowRight` && currentIndex < totalSlides - 1) {
            currentIndex++;
            showSlide(currentIndex);
        }
    });

    showSlide(currentIndex);
};
