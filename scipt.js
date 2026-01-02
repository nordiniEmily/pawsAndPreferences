/**
 * Paws & Preferences - Using Cataas API
 */

// Generate unique cat image URLs from Cataas API
const TOTAL_CATS = 10;
const cats = [];

// Generate unique cat URLs with random parameters to ensure different cats
for (let i = 0; i < TOTAL_CATS; i++) {
    // Add timestamp and random seed to get different cats
    cats.push(`https://cataas.com/cat?width=300&height=400&t=${Date.now()}_${i}`);
}

let currentIndex = 0;
let likedCats = [];

const cardContainer = document.getElementById('card-container');
const summary = document.getElementById('summary');
const likedCount = document.getElementById('liked-count');
const likedCatsContainer = document.getElementById('liked-cats');
const cardCounter = document.getElementById('card-counter');

// Initialize the buttons
const likeBtn = document.getElementById('like-btn');
const dislikeBtn = document.getElementById('dislike-btn');

function updateCounter() {
    cardCounter.textContent = `${currentIndex + 1} / ${TOTAL_CATS}`;
}

function createCard(index) {
    if (index >= cats.length) {
        showSummary();
        return;
    }

    updateCounter();

    // Clear previous card
    cardContainer.innerHTML = ''; 

    const card = document.createElement('div');
    card.classList.add('card', 'loading');
    card.textContent = "Loading Cat...";
    
    const imageUrl = cats[index];
    
    // Preload the image
    const imgLoader = new Image();
    imgLoader.src = imageUrl;
    
    imgLoader.onload = () => {
        card.style.backgroundImage = `url(${imageUrl})`;
        card.textContent = "";
        card.classList.remove('loading');
    };
    
    imgLoader.onerror = () => {
        card.style.backgroundColor = "#ffcccc";
        card.textContent = "Failed to load cat 😿";
        card.classList.remove('loading');
    };

    cardContainer.appendChild(card);

    // --- Drag/Swipe Interaction ---
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
        const rotation = dx / 20;
        card.style.transform = `translate(${dx}px, 0) rotate(${rotation}deg)`;
        
        // Add color hint based on swipe direction
        if (dx > 50) {
            card.style.border = '3px solid #ff6b81';
        } else if (dx < -50) {
            card.style.border = '3px solid #95a5a6';
        } else {
            card.style.border = 'none';
        }
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

        if (dx > 100) { 
            handleAction(true); 
        } else if (dx < -100) { 
            handleAction(false); 
        } else {
            card.style.transition = 'transform 0.3s ease';
            card.style.transform = '';
            card.style.border = 'none';
        }
    }

    likeBtn.onclick = () => handleAction(true);
    dislikeBtn.onclick = () => handleAction(false);

    function handleAction(isLiked) {
        if (isLiked) {
            likedCats.push(cats[currentIndex]);
        }
        
        const direction = isLiked ? 1 : -1;
        card.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
        card.style.transform = `translateX(${direction * 500}px) rotate(${direction * 40}deg)`;
        card.style.opacity = '0';
        card.style.border = 'none';
        
        setTimeout(() => {
            card.remove();
            currentIndex++;
            createCard(currentIndex);
        }, 500);
    }
}

function showSummary() {
    cardContainer.style.display = 'none';
    document.querySelector('.buttons').style.display = 'none';
    cardCounter.style.display = 'none';
    summary.classList.remove('hidden');
    
    likedCount.textContent = likedCats.length;
    
    // Handle plural
    document.getElementById('plural').textContent = likedCats.length === 1 ? '' : 's';

    if (likedCats.length === 0) {
        const noLikes = document.createElement('p');
        noLikes.textContent = "You didn't like any cats! 😿";
        noLikes.style.color = '#666';
        noLikes.style.marginTop = '20px';
        likedCatsContainer.appendChild(noLikes);
    } else {
        likedCats.forEach(catUrl => {
            const img = document.createElement('img');
            img.src = catUrl;
            img.alt = "A cat you liked";
            likedCatsContainer.appendChild(img);
        });
    }
}

// Start the app
createCard(currentIndex);