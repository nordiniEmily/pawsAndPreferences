/**
 Paws & Preferences 😻
 
 Like - swipe right or press Like
 Dislike - swipe left or press Dislike
 */

const TOTAL_CATS = 10;
const cats = [];

// Generate some random cat images
for (let i = 0; i < TOTAL_CATS; i++) {
    cats.push(`https://cataas.com/cat?width=300&height=400&rand=${Math.random()}`);
}

let currentIndex = 0;       // which cat are currently showing
let likedCats = [];         // store cats user liked

// the DOM elements 
const cardContainer = document.getElementById('card-container');
const summary = document.getElementById('summary');
const likedCount = document.getElementById('liked-count');
const likedCatsContainer = document.getElementById('liked-cats');
const cardCounter = document.getElementById('card-counter');

// buttons
const likeBtn = document.getElementById('like-btn');
const dislikeBtn = document.getElementById('dislike-btn');

// update progress text (example: 3 / 10)
function updateCounter() {
    cardCounter.textContent = `${currentIndex + 1} / ${TOTAL_CATS}`;
}

// main card creator function
function createCard(index) {
    // if no more cats → show result page
    if (index >= cats.length) {
        showSummary();
        return;
    }

    updateCounter();
    cardContainer.innerHTML = '';   // remove previous card

    // create card
    const card = document.createElement('div');
    card.classList.add('card', 'loading');
    card.textContent = "Loading cat...";

    const img = new Image();
    img.src = cats[index];

    // when image loads successfully
    img.onload = () => {
        card.style.backgroundImage = `url(${cats[index]})`;
        card.textContent = "";
        card.classList.remove('loading');
    };

    // if image fails
    img.onerror = () => {
        card.textContent = "Oops, cat failed to load 😿";
        card.classList.remove('loading');
    };

    cardContainer.appendChild(card);

    // -----------------------
    // swipe logic
    // -----------------------
    let startX = 0;
    let dragging = false;

    // start dragging
    card.addEventListener('mousedown', startDrag);
    card.addEventListener('touchstart', startDrag, { passive: true });

    function startDrag(e) {
        dragging = true;
        startX = e.touches ? e.touches[0].clientX : e.clientX;
        card.style.transition = 'none';

        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', endDrag);
        document.addEventListener('touchmove', drag);
        document.addEventListener('touchend', endDrag);
    }

    // while dragging
    function drag(e) {
        if (!dragging) return;

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const dx = clientX - startX;
        const rotate = dx / 20;   // small rotation effect

        card.style.transform = `translateX(${dx}px) rotate(${rotate}deg)`;

        // show border color depending swipe direction
        if (dx > 50) card.style.border = '3px solid #ff6b81';     // like
        else if (dx < -50) card.style.border = '3px solid #95a5a6'; // dislike
        else card.style.border = 'none';
    }

    // when let go
    function endDrag(e) {
        if (!dragging) return;
        dragging = false;

        const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
        const dx = clientX - startX;

        // stop listening when done
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', endDrag);
        document.removeEventListener('touchmove', drag);
        document.removeEventListener('touchend', endDrag);

        // decide action
        if (dx > 100) handleAction(true);       // like
        else if (dx < -100) handleAction(false); // dislike
        else {
            // snap back if not swiped enough
            card.style.transition = '0.3s';
            card.style.transform = '';
            card.style.border = 'none';
        }
    }

    // button events
    likeBtn.onclick = () => handleAction(true);
    dislikeBtn.onclick = () => handleAction(false);

    // what happens when like / dislike
    function handleAction(liked) {
        if (liked) likedCats.push(cats[currentIndex]);

        const dir = liked ? 1 : -1; // right if liked, left if not
        card.style.transition = '0.5s';
        card.style.transform = `translateX(${dir * 500}px) rotate(${dir * 40}deg)`;
        card.style.opacity = '0';

        // move to next cat
        setTimeout(() => {
            currentIndex++;
            createCard(currentIndex);
        }, 400);
    }
}

// summary page after finishing
function showSummary() {
    cardContainer.style.display = 'none';
    document.querySelector('.buttons').style.display = 'none';
    cardCounter.style.display = 'none';

    summary.classList.remove('hidden');
    likedCount.textContent = likedCats.length;

    // handle plural text (cat / cats)
    document.getElementById('plural').textContent =
        likedCats.length === 1 ? '' : 's';

    // if user didn't like anything :(
    if (likedCats.length === 0) {
        likedCatsContainer.innerHTML = "<p>You didn't like any cats 😿</p>";
        return;
    }

    // show liked cats
    likedCats.forEach(url => {
        const img = document.createElement('img');
        img.src = url;
        likedCatsContainer.appendChild(img);
    });
}

// start app
createCard(currentIndex);
