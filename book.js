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

// ------------------------------
// Comments - Supabase
// ------------------------------

async function setupComments() {

    const form =
        document.getElementById("commentForm");

    const list =
        document.getElementById("commentsList");

    if (!form || !list) return;


    // Load comments
    await loadComments();


    // Add new comment
    form.addEventListener("submit", async event => {

        event.preventDefault();


        const name =
            document.getElementById("commentName")
                .value.trim();

        const text =
            document.getElementById("commentText")
                .value.trim();


        if (!name || !text) {
            alert("Please enter your name and comment.");
            return;
        }


        const { error } =
            await supabaseClient
                .from("comments")
                .insert([
                    {
                        book_id: book.id,
                        user_name: name,
                        content: text
                    }
                ]);


        if (error) {

            console.error(error);

            alert(
                "Sorry, your comment could not be posted."
            );

            return;
        }


        form.reset();

        await loadComments();

    });


    // --------------------------------
    // Load comments from Supabase
    // --------------------------------

    async function loadComments() {

        list.innerHTML =
            "<p class='comments-loading'>Loading comments...</p>";


        const { data: comments, error } =
            await supabaseClient
                .from("comments")
                .select("*")
                .eq("book_id", book.id)
                .order("created_at", {
                    ascending: true
                });


        if (error) {

            console.error(error);

            list.innerHTML =
                "<p>Could not load comments.</p>";

            return;
        }


        if (!comments || comments.length === 0) {

            list.innerHTML =
                "<p class='comments-empty'>No comments yet. Be the first to comment.</p>";

            return;
        }


        list.innerHTML = "";


        for (const comment of comments) {

            await renderComment(comment);

        }

    }


    // --------------------------------
    // Render one comment
    // --------------------------------

    async function renderComment(comment) {

        const div =
            document.createElement("div");


        div.className =
            "comment-card";


        const date =
            comment.created_at
                ? new Date(
                    comment.created_at
                ).toLocaleDateString("en-US")
                : "";


        // Get likes
        const { data: likes } =
            await supabaseClient
                .from("comment_likes")
                .select("id, user_name")
                .eq("comment_id", comment.id);


        const likeCount =
            likes ? likes.length : 0;


        // Get replies
        const { data: replies } =
            await supabaseClient
                .from("comment_replies")
                .select("*")
                .eq("comment_id", comment.id)
                .order("created_at", {
                    ascending: true
                });


        div.innerHTML = `

            <div class="comment-header">

                <strong>
                    ${escapeHTML(comment.user_name)}
                </strong>

                <small>
                    ${escapeHTML(date)}
                </small>

            </div>


            <p>
                ${escapeHTML(comment.content)}
            </p>


            <div class="comment-actions">

                <button
                    type="button"
                    class="comment-like-btn"
                    data-comment-id="${comment.id}"
                >
                    ♡ Like
                    <span>${likeCount}</span>
                </button>


                <button
                    type="button"
                    class="comment-reply-btn"
                    data-comment-id="${comment.id}"
                >
                    Reply
                </button>

            </div>


            <div
                class="reply-form-container"
                id="reply-form-${comment.id}"
            ></div>


            <div class="comment-replies">

                ${
                    replies && replies.length
                        ? replies.map(reply => `

                            <div class="comment-reply">

                                <strong>
                                    ${escapeHTML(reply.user_name)}
                                </strong>

                                <small>
                                    ${
                                        reply.created_at
                                            ? new Date(
                                                reply.created_at
                                            ).toLocaleDateString("en-US")
                                            : ""
                                    }
                                </small>

                                <p>
                                    ${escapeHTML(reply.content)}
                                </p>

                            </div>

                        `).join("")
                        : ""
                }

            </div>

        `;


        list.appendChild(div);


        // Like button
        const likeButton =
            div.querySelector(
                ".comment-like-btn"
            );


        likeButton.addEventListener(
            "click",
            async () => {

                const userName =
                    getCommentUserName();


                if (!userName) return;


                // Check if this person already liked it
                const { data: existingLike } =
                    await supabaseClient
                        .from("comment_likes")
                        .select("id")
                        .eq(
                            "comment_id",
                            comment.id
                        )
                        .eq(
                            "user_name",
                            userName
                        )
                        .maybeSingle();


                if (existingLike) {

                    // Remove like
                    await supabaseClient
                        .from("comment_likes")
                        .delete()
                        .eq(
                            "id",
                            existingLike.id
                        );

                } else {

                    // Add like
                    await supabaseClient
                        .from("comment_likes")
                        .insert([
                            {
                                comment_id:
                                    comment.id,

                                user_name:
                                    userName
                            }
                        ]);

                }


                await loadComments();

            }
        );


        // Reply button
        const replyButton =
            div.querySelector(
                ".comment-reply-btn"
            );


        replyButton.addEventListener(
            "click",
            () => {

                const container =
                    div.querySelector(
                        ".reply-form-container"
                    );


                if (container.innerHTML) {

                    container.innerHTML = "";

                    return;

                }


                container.innerHTML = `

                    <form
                        class="reply-form"
                    >

                        <input
                            type="text"
                            class="reply-name"
                            placeholder="Your name"
                            required
                        >

                        <textarea
                            class="reply-text"
                            placeholder="Write a reply..."
                            rows="3"
                            required
                        ></textarea>

                        <button
                            type="submit"
                        >
                            Post Reply
                        </button>

                    </form>

                `;


                const replyForm =
                    container.querySelector(
                        ".reply-form"
                    );


                replyForm.addEventListener(
                    "submit",
                    async event => {

                        event.preventDefault();


                        const name =
                            container
                                .querySelector(
                                    ".reply-name"
                                )
                                .value.trim();


                        const text =
                            container
                                .querySelector(
                                    ".reply-text"
                                )
                                .value.trim();


                        if (!name || !text) return;


                        const { error } =
                            await supabaseClient
                                .from(
                                    "comment_replies"
                                )
                                .insert([
                                    {
                                        comment_id:
                                            comment.id,

                                        user_name:
                                            name,

                                        content:
                                            text
                                    }
                                ]);


                        if (error) {

                            console.error(error);

                            alert(
                                "Sorry, your reply could not be posted."
                            );

                            return;
                        }


                        await loadComments();

                    }
                );

            }
        );

    }


    // --------------------------------
    // Remember the name for likes
    // --------------------------------

    function getCommentUserName() {

        let name =
            localStorage.getItem(
                "betweenPagesCommentName"
            );


        if (!name) {

            name =
                prompt(
                    "Enter your name to like this comment:"
                );


            if (!name) return null;


            name = name.trim();


            if (!name) return null;


            localStorage.setItem(
                "betweenPagesCommentName",
                name
            );

        }


        return name;

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