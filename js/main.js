// -----------------------------------------------------------------------------
// This file includes deliberate formatting errors in order for you to verify
// that ESLint and EditorConfig are working properly. If both tools are, indeed,
// working correctly, then you’d see errors in your editor about indentation and
// improper use of footmarks instead of back ticks. When you save this file,
// your editor should strip all excess newlines and whitespace characters from
// the file. If both of these events occur, then ESLint and EditorConfig are
// working correctly/.
// DON’T PROCEED UNTIL YOU’RE SURE ESLINT AND EDITORCONFIG ARE WORKING CORRECTLY
// -----------------------------------------------------------------------------


document.addEventListener(`DOMContentLoaded`, () => {

    const prevButton = document.querySelector(`.carousel-navigation a:first-child`);
    const nextButton = document.querySelector(`.carousel-navigation a:last-child`);
    const slidesContainer = document.querySelector(`.carousel-slides`);

    let albums = [];
    let index = 0;
    let totalItems = 0;


    const loadAlbums = async () => {
        try {
            const res = await fetch(`/json/data.json`);
            albums = await res.json();
            totalItems = albums.length;
            displaySlides();
        } catch (error) {
            console.error(`Error`);
        }
    };


    const displaySlides = () => {
        slidesContainer.innerHTML = `
            <div class="carousel-items-container">
                ${albums.map((album) => `
                    <div class="slide-item">
                        <a href="${album.url}" target="_blank">
                            <img src="${album.cover_image.path}" alt="${album.cover_image.alt_content}" width="640">
                        </a>
                        <h3>${album.album}</h3>
                        <p>${album.artist}</p>
                        <section>
                            <p>${album.review.content}</p>
                            <p>Credit: ${album.cover_image.credit}</p>
                            <p>— ${album.review.source}</p>
                        </section>
                    </div>
                `).join(``)}
            </div>`;
    };

    const nextSlide = () => {
        if (index < totalItems - 1) {
            index++;
        } else {
            index = 0;
        }
        updateCarousel();
    };


    const prevSlide = () => {
        if (index > 0) {
            index--;
        } else {
            index = totalItems - 1;
        }
        updateCarousel();
    };


    const updateCarousel = () => {
        document.querySelectorAll(`.slide-item`).forEach((slide, slideIndex) => {
            let offset = (slideIndex - index) * 100 - (slideIndex * 100);
            slide.style.transform = `translateX(${offset}%)`;
        });
    };


    nextButton.addEventListener(`click`, (e) => {
        e.preventDefault();
        nextSlide();
    });

    prevButton.addEventListener(`click`, (e) => {
        e.preventDefault();
        prevSlide();
    });

    loadAlbums();
});
