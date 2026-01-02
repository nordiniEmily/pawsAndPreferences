// Array of cat images (local folder)
const cats = [
    'cat-images/cat1.jpg',
    'cat-images/cat2.png',
    'cat-images/cat3.jpg',
    'cat-images/cat4.jpg',
    'cat-images/cat5.jpg',
    'cat-images/cat6.jpg',
    'cat-images/cat7.jpg',
    'cat-images/catGif.gif'
];

let currentIndex = 0;          // Track current cat index
let likedCats = [];            // Store liked cats

const cardContainer = document.getElementById('card-container');
const summary = document.getElementById('summary');
const likedCount = document.getElementById('liked-count');
const likedCatsContainer = document.getElementById('liked-cats');

// Initialize the first card
function createCard(index) {
    if(index >= cats.length) {
        showSummary();
        return;
    }

    const card = document.createElement('div');
    card.classList.add('card');
    card.style.backgroundImage = `url(${cats[index]})`;
    cardContainer.appendChild(card);

    // Drag/swipe variables
    let offsetX = 0;
    let offsetY = 0;
    let isDragging = false;

    // Mouse/touch events for swipe
    card.addEventListener('mousedown', startDrag);
    card.addEventListener('touchstart', startDrag);

    function startDrag(e) {
        isDragging = true;
        const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
        const clientY = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY;
        offsetX = clientX;
        offsetY = clientY;

        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', endDrag);
        document.addEventListener('touchmove', drag);
        document.addEventListener('touchend', endDrag);
    }

    function drag(e) {
        if(!isDragging) return;
        const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
        const dx = clientX - offsetX;
        const dy = clientY - offsetY;

        card.style.transform = `translate(${dx}px, ${dy}px) rotate(${dx/20}deg)`;
    }

    function endDrag(e) {
        isDragging = false;
        const clientX = e.type.includes('mouse') ? e.clientX : e.changedTouches[0].clientX;
        const dx = clientX - offsetX;

        // If swipe distance is significant, count as like/dislike
        if(dx > 100) {
            likeCard();
        } else if(dx < -100) {
            dislikeCard();
        } else {
            // Reset card
            card.style.transform = '';
        }

        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', endDrag);
        document.removeEventListener('touchmove', drag);
        document.removeEventListener('touchend', endDrag);
    }

    // Like button handler
    function likeCard() {
        likedCats.push(cats[currentIndex]);
        removeCard();
    }

    // Dislike button handler
    function dislikeCard() {
        removeCard();
    }

    function removeCard() {
        card.style.transform = `translateX(${dx > 0 ? 500 : -500}px) rotate(${dx > 0 ? 30 : -30}deg)`;
        card.style.opacity = 0;
        setTimeout(() => {
            card.remove();
            currentIndex++;
            createCard(currentIndex);
        }, 300);
    }

    // Desktop buttons
    document.getElementById('like-btn').onclick = likeCard;
    document.getElementById('dislike-btn').onclick = dislikeCard;
}

// Show summary at the end
function showSummary() {
    cardContainer.style.display = 'none';
    document.querySelector('.buttons').style.display = 'none';
    summary.classList.remove('hidden');
    likedCount.textContent = likedCats.length;

    likedCats.forEach(cat => {
        const img = document.createElement('img');
        img.src = cat;
        likedCatsContainer.appendChild(img);
    });
}

// Start the app
createCard(currentIndex);
