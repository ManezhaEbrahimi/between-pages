const bookGrid = document.getElementById("bookGrid");

const searchInput = document.getElementById("searchInput");
const genreFilter = document.getElementById("genreFilter");
const statusFilter = document.getElementById("statusFilter");


// ------------------------------
// Theme
// ------------------------------

const savedTheme =
    localStorage.getItem("betweenPagesTheme");


if (savedTheme === "dark") {
    document.body.classList.add("dark");
}


const themeToggle =
    document.getElementById("themeToggle");


function updateThemeButton() {

    if (!themeToggle) return;

    themeToggle.textContent =
        document.body.classList.contains("dark")
            ? "☀"
            : "☾";
}


updateThemeButton();


if (themeToggle) {

    themeToggle.addEventListener("click", () => {

        document.body.classList.toggle("dark");


        const isDark =
            document.body.classList.contains("dark");


        localStorage.setItem(
            "betweenPagesTheme",
            isDark ? "dark" : "light"
        );


        updateThemeButton();

    });

}


// ------------------------------
// Genres
// ------------------------------

const genres = [
    ...new Set(
        books.map(book => book.genre)
    )
];


genres.forEach(genre => {

    const option =
        document.createElement("option");

    option.value = genre;
    option.textContent = genre;

    genreFilter.appendChild(option);

});


// ------------------------------
// Favorites
// ------------------------------

function getFavorites() {

    return JSON.parse(
        localStorage.getItem(
            "betweenPagesFavorites"
        )
    ) || [];

}


function toggleFavorite(id) {

    let favorites =
        getFavorites();


    if (favorites.includes(id)) {

        favorites =
            favorites.filter(
                bookId => bookId !== id
            );

    } else {

        favorites.push(id);

    }


    localStorage.setItem(
        "betweenPagesFavorites",
        JSON.stringify(favorites)
    );


    renderBooks();
    updateStats();

}


// ------------------------------
// Render Books
// ------------------------------

function renderBooks() {

    const search =
        searchInput.value
            .trim()
            .toLowerCase();


    const selectedGenre =
        genreFilter.value;


    const selectedStatus =
        statusFilter.value;


    const filteredBooks =
        books.filter(book => {


            const matchesSearch =

                book.title
                    .toLowerCase()
                    .includes(search)

                ||

                book.author
                    .toLowerCase()
                    .includes(search);


            const matchesGenre =

                selectedGenre === "all"

                ||

                book.genre === selectedGenre;


            const matchesStatus =

                selectedStatus === "all"

                ||

                book.status === selectedStatus;


            return (
                matchesSearch &&
                matchesGenre &&
                matchesStatus
            );

        });


    bookGrid.innerHTML = "";


    if (filteredBooks.length === 0) {

        bookGrid.innerHTML = `
            <div class="empty-state">
                No books found.
            </div>
        `;

        return;
    }


    const favorites =
        getFavorites();


    filteredBooks.forEach(book => {


        const isFavorite =
            favorites.includes(book.id);


        const card =
            document.createElement("article");


        card.className =
            "book-card";


        const rating =
            book.rating
                ? "★".repeat(book.rating)
                : "☆";


        card.innerHTML = `

            <div class="book-cover">

                ${
                    book.cover

                    ?

                    `<img
                        src="${book.cover}"
                        alt="${escapeHTML(book.title)}"
                        onerror="this.style.display='none'; this.parentElement.classList.add('cover-fallback');"
                    >`

                    :

                    `<div class="no-cover">
                        No Cover
                    </div>`
                }


                <button
                    class="favorite-btn ${isFavorite ? "active" : ""}"
                    data-id="${book.id}">
                    ${isFavorite ? "♥" : "♡"}
                </button>

            </div>


            <div class="book-card-content">


                <span class="book-status">
                    ${getStatusText(book.status)}
                </span>


                <h3>
                    ${escapeHTML(book.title)}
                </h3>


                <p class="book-author">
                    ${escapeHTML(book.author)}
                </p>


                <div class="book-bottom">

                    <span>
                        ${escapeHTML(book.genre)}
                    </span>


                    <span class="rating">
                        ${rating}
                    </span>

                </div>


                <a
                    class="book-link"
                    href="book.html?id=${book.id}">
                    View Book →
                </a>

            </div>
        `;


        const favoriteButton =
            card.querySelector(
                ".favorite-btn"
            );


        favoriteButton.addEventListener(
            "click",
            event => {

                event.preventDefault();

                toggleFavorite(book.id);

            }
        );


        bookGrid.appendChild(card);

    });

}


// ------------------------------
// Status
// ------------------------------

function getStatusText(status) {

    if (status === "reading")
        return "Currently Reading";


    if (status === "read")
        return "Read";


    if (status === "want")
        return "Want to Read";


    return status;

}


// ------------------------------
// Stats
// ------------------------------

function updateStats() {

    document.getElementById("totalBooks")
        .textContent = books.length;


    document.getElementById("readBooks")
        .textContent =
            books.filter(
                book => book.status === "read"
            ).length;


    document.getElementById("readingBooks")
        .textContent =
            books.filter(
                book => book.status === "reading"
            ).length;


    document.getElementById("favoriteBooks")
        .textContent =
            getFavorites().length;

}


// ------------------------------
// Search / Filters
// ------------------------------

searchInput.addEventListener(
    "input",
    renderBooks
);


genreFilter.addEventListener(
    "change",
    renderBooks
);


statusFilter.addEventListener(
    "change",
    renderBooks
);


// ------------------------------
// Contact
// ------------------------------

const contactForm =
    document.getElementById("contactForm");


if (contactForm) {

    contactForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            document.getElementById(
                "contactStatus"
            ).textContent =
                "Thanks! Your message is ready to be sent.";


            contactForm.reset();

        }
    );

}


// ------------------------------
// Security
// ------------------------------

function escapeHTML(value) {

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


// ------------------------------
// Start
// ------------------------------

renderBooks();
updateStats();