const params =
    new URLSearchParams(
        window.location.search
    );


const bookId =
    Number(params.get("id"));


const book =
    books.find(
        item => item.id === bookId
    );


const bookDetail =
    document.getElementById(
        "bookDetail"
    );


if (!book) {

    bookDetail.innerHTML = `
        <div class="empty-state">
            Book not found.
        </div>
    `;

} else {

    renderBook();

    setupFavorite();

    setupNotes();

    setupQuotes();

    setupReview();

    setupProgress();

    setupComments();

    setupNavigation();

}


// ------------------------------
// Theme
// ------------------------------

const savedTheme =
    localStorage.getItem(
        "betweenPagesTheme"
    );


if (savedTheme === "dark") {

    document.body.classList.add("dark");

}


const themeToggle =
    document.getElementById(
        "themeToggle"
    );


function updateThemeButton() {

    if (!themeToggle) return;

    themeToggle.textContent =
        document.body.classList.contains("dark")
            ? "☀"
            : "☾";
}


updateThemeButton();


if (themeToggle) {

    themeToggle.addEventListener(
        "click",
        () => {

            document.body.classList.toggle(
                "dark"
            );


            const isDark =
                document.body.classList.contains(
                    "dark"
                );


            localStorage.setItem(
                "betweenPagesTheme",
                isDark
                    ? "dark"
                    : "light"
            );


            updateThemeButton();

        }
    );

}


// ------------------------------
// Render Book
// ------------------------------

function renderBook() {

    document.title =
        `${book.title} | Between Pages`;


    const cover =
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
        </div>`;


    const rating =
        book.rating
            ? "★".repeat(book.rating)
            : "☆";


    bookDetail.innerHTML = `

        <div class="book-detail">


            <div class="detail-cover">

                ${cover}

            </div>


            <div class="detail-info">


                <span class="eyebrow">
                    ${getStatusText(book.status)}
                </span>


                <h1>
                    ${escapeHTML(book.title)}
                </h1>


                <p class="detail-author">
                    ${escapeHTML(book.author)}
                </p>


                <p class="detail-genre">
                    ${escapeHTML(book.genre)}
                    ·
                    ${book.year}
                </p>


                <div class="detail-rating">
                    ${rating}
                </div>


                <button
                    id="detailFavorite"
                    class="secondary-btn">
                    ♡ Add to Favorites
                </button>


                <div class="detail-progress">

                    <div class="progress">

                        <span
                            style="width:${book.progress}%">
                        </span>

                    </div>


                    <span>
                        ${book.progress}% completed
                    </span>

                </div>

            </div>

        </div>
    `;

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
// Favorites
// ------------------------------

function setupFavorite() {

    const button =
        document.getElementById(
            "detailFavorite"
        );


    let favorites =
        JSON.parse(
            localStorage.getItem(
                "betweenPagesFavorites"
            )
        ) || [];


    updateButton();


    button.addEventListener(
        "click",
        () => {


            if (
                favorites.includes(book.id)
            ) {

                favorites =
                    favorites.filter(
                        id => id !== book.id
                    );

            } else {

                favorites.push(book.id);

            }


            localStorage.setItem(
                "betweenPagesFavorites",
                JSON.stringify(favorites)
            );


            updateButton();

        }
    );


    function updateButton() {

        button.textContent =
            favorites.includes(book.id)

                ? "♥ Remove from Favorites"

                : "♡ Add to Favorites";

    }

}


// ------------------------------
// Notes
// ------------------------------

function setupNotes() {

    const key =
        `book_notes_${book.id}`;


    let notes =
        JSON.parse(
            localStorage.getItem(key)
        ) || [];


    const form =
        document.getElementById(
            "noteForm"
        );


    const list =
        document.getElementById(
            "notesList"
        );


    renderNotes();


    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const page =
                document.getElementById(
                    "notePage"
                ).value;


            const date =
                document.getElementById(
                    "noteDate"
                ).value;


            const text =
                document.getElementById(
                    "noteText"
                ).value.trim();


            notes.push({
                page,
                date,
                text
            });


            localStorage.setItem(
                key,
                JSON.stringify(notes)
            );


            form.reset();

            renderNotes();

        }
    );


    function renderNotes() {

        list.innerHTML = "";


        notes.forEach(note => {

            const div =
                document.createElement("div");


            div.className =
                "note-card";


            div.innerHTML = `

                <div class="note-meta">

                    ${
                        note.page
                            ? `Page ${escapeHTML(note.page)}`
                            : ""
                    }

                    ${
                        note.date
                            ? ` · ${escapeHTML(note.date)}`
                            : ""
                    }

                </div>


                <p>
                    ${escapeHTML(note.text)}
                </p>

            `;


            list.appendChild(div);

        });

    }

}


// ------------------------------
// Quotes
// ------------------------------

function setupQuotes() {

    const key =
        `book_quotes_${book.id}`;


    let quotes =
        JSON.parse(
            localStorage.getItem(key)
        ) || [];


    const form =
        document.getElementById(
            "quoteForm"
        );


    const list =
        document.getElementById(
            "quotesList"
        );


    renderQuotes();


    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const text =
                document.getElementById(
                    "quoteText"
                ).value.trim();


            const page =
                document.getElementById(
                    "quotePage"
                ).value.trim();


            quotes.push({
                text,
                page
            });


            localStorage.setItem(
                key,
                JSON.stringify(quotes)
            );


            form.reset();

            renderQuotes();

        }
    );


    function renderQuotes() {

        list.innerHTML = "";


        quotes.forEach(quote => {

            const div =
                document.createElement("div");


            div.className =
                "quote-card";


            div.innerHTML = `

                <p>
                    “${escapeHTML(quote.text)}”
                </p>


                ${
                    quote.page
                        ? `<small>
                            Page ${escapeHTML(quote.page)}
                           </small>`
                        : ""
                }

            `;


            list.appendChild(div);

        });

    }

}


// ------------------------------
// Review
// ------------------------------

function setupReview() {

    const key =
        `book_review_${book.id}`;


    const form =
        document.getElementById(
            "reviewForm"
        );


    const textarea =
        document.getElementById(
            "reviewText"
        );


    textarea.value =
        localStorage.getItem(key) || "";


    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            localStorage.setItem(
                key,
                textarea.value
            );

        }
    );

}


// ------------------------------
// Progress
// ------------------------------

function setupProgress() {

    const range =
        document.getElementById(
            "progressRange"
        );


    const value =
        document.getElementById(
            "progressValue"
        );


    const saved =
        localStorage.getItem(
            `book_progress_${book.id}`
        );


    range.value =
        saved !== null
            ? saved
            : book.progress;


    value.textContent =
        `${range.value}%`;


    range.addEventListener(
        "input",
        () => {

            value.textContent =
                `${range.value}%`;

        }
    );


    document.getElementById(
        "saveProgress"
    ).addEventListener(
        "click",
        () => {

            localStorage.setItem(
                `book_progress_${book.id}`,
                range.value
            );

            book.progress =
                Number(range.value);

        }
    );

}


// ------------------------------
// Comments
// ------------------------------

function setupComments() {

    const key =
        `comments_book_${book.id}`;


    let comments =
        JSON.parse(
            localStorage.getItem(key)
        ) || [];


    const form =
        document.getElementById(
            "commentForm"
        );


    const list =
        document.getElementById(
            "commentsList"
        );


    renderComments();


    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const name =
                document.getElementById(
                    "commentName"
                ).value.trim();


            const text =
                document.getElementById(
                    "commentText"
                ).value.trim();


            comments.push({

                name,
                text,

                date:
                    new Date()
                        .toLocaleDateString(
                            "en-US"
                        )

            });


            localStorage.setItem(
                key,
                JSON.stringify(comments)
            );


            form.reset();

            renderComments();

        }
    );


    function renderComments() {

        list.innerHTML = "";


        comments.forEach(comment => {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "comment-card";


            div.innerHTML = `

                <strong>
                    ${escapeHTML(comment.name)}
                </strong>


                <small>
                    ${escapeHTML(comment.date)}
                </small>


                <p>
                    ${escapeHTML(comment.text)}
                </p>

            `;


            list.appendChild(div);

        });

    }

}


// ------------------------------
// Previous / Next
// ------------------------------

function setupNavigation() {

    const index =
        books.findIndex(
            item => item.id === book.id
        );


    const previous =
        books[index - 1];


    const next =
        books[index + 1];


    const previousButton =
        document.getElementById(
            "prevBook"
        );


    const nextButton =
        document.getElementById(
            "nextBook"
        );


    if (previous) {

        previousButton.onclick =
            () => {

                window.location.href =
                    `book.html?id=${previous.id}`;

            };

    } else {

        previousButton.disabled = true;

    }


    if (next) {

        nextButton.onclick =
            () => {

                window.location.href =
                    `book.html?id=${next.id}`;

            };

    } else {

        nextButton.disabled = true;

    }

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