/**
 * Paws & Preferences - script.js
 * Requirement: Source images from Cataas (https://cataas.com/)
 */

// Generate a list of cat images from the Cataas API
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

let currentIndex = 0;
let likedCats = [];

const cardContainer = document.getElementById('card-container');
const summary = document.getElementById('summary');
const likedCount = document.getElementById('liked-count');
const likedCatsContainer = document.getElementById('liked-cats');

// Initialize the buttons once
const likeBtn = document.getElementById('like-btn');
const dislikeBtn = document.getElementById('dislike-btn');

function createCard(index) {
    if (index >= cats.length) {
        showSummary();
        return;
    }

    // Clear previous card (if any)
    cardContainer.innerHTML = ''; 

    const card = document.createElement('div');
    card.classList.add('card');
    
    // Use a high-quality random cat URL from the API
    const imageUrl = cats[index];
    
    // Create a temporary image object to check if it loads
    const imgLoader = new Image();
    imgLoader.src = imageUrl;
    imgLoader.onload = () => {
        card.style.backgroundImage = `url(${imageUrl})`;
        // Remove loading state once image is ready
        card.textContent = ""; 
    };
    imgLoader.onerror = () => {
        card.style.backgroundColor = "#ffcccc";
        card.textContent = "Failed to load cat 😿";
    };

    card.textContent = "Loading Cat..."; // Placeholder text
    cardContainer.appendChild(card);

    // --- Interaction Handlers (Keep the same logic as before) ---
    let startX = 0;
    let isDragging = false;

    card.addEventListener('mousedown', startDrag);
    card.addEventListener('touchstart', startDrag, { passive: true });

    function startDrag(e) {
        isDragging = true;
        startX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
        card.style.transition = 'none';
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', endDrag);
        document.addEventListener('touchmove', drag, { passive: false });
        document.addEventListener('touchend', endDrag);
    }

    function drag(e) {
        if (!isDragging) return;
        const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const dx = clientX - startX;
        card.style.transform = `translate(${dx}px, 0) rotate(${dx / 20}deg)`;
    }

    function endDrag(e) {
        if (!isDragging) return;
        isDragging = false;
        const clientX = e.type.includes('mouse') ? e.clientX : e.changedTouches[0].clientX;
        const dx = clientX - startX;

        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', endDrag);
        document.removeEventListener('touchmove', drag);
        document.removeEventListener('touchend', endDrag);

        if (dx > 100) { handleAction(true); } 
        else if (dx < -100) { handleAction(false); } 
        else {
            card.style.transition = 'transform 0.3s ease';
            card.style.transform = '';
        }
    }

    likeBtn.onclick = () => handleAction(true);
    dislikeBtn.onclick = () => handleAction(false);

    function handleAction(isLiked) {
        if (isLiked) likedCats.push(cats[currentIndex]);
        const direction = isLiked ? 1 : -1;
        card.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
        card.style.transform = `translateX(${direction * 500}px) rotate(${direction * 40}deg)`;
        card.style.opacity = '0';
        setTimeout(() => {
            card.remove();
            currentIndex++;
            createCard(currentIndex);
        }, 300);
    }
}

function showSummary() {
    cardContainer.style.display = 'none';
    document.querySelector('.buttons').style.display = 'none';
    summary.classList.remove('hidden');
    likedCount.textContent = likedCats.length;

    likedCats.forEach(catUrl => {
        const img = document.createElement('img');
        img.src = catUrl;
        img.alt = "A cat you liked";
        likedCatsContainer.appendChild(img);
    });
}

// Start the app
createCard(currentIndex);