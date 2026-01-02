/**
 * Paws & Preferences - script.js
 * Requirement: Source images from Cataas (https://cataas.com/)
 */

// Generate a list of cat images from the Cataas API
const cats = [
    'https://cataas.com/cat?1',
    'https://cataas.com/cat?2',
    'https://cataas.com/cat?3',
    'https://cataas.com/cat?4',
    'https://cataas.com/cat?5',
    'https://cataas.com/cat?6',
    'https://cataas.com/cat?7',
    'https://cataas.com/cat/gif' // One GIF as per your original list
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
    // If no more cats, show summary
    if (index >= cats.length) {
        showSummary();
        return;
    }

    // Create the card element
    const card = document.createElement('div');
    card.classList.add('card');
    card.style.backgroundImage = `url(${cats[index]})`;
    cardContainer.appendChild(card);

    let startX = 0;
    let isDragging = false;

    // --- Interaction Handlers ---

    // 1. Swipe Logic
    card.addEventListener('mousedown', startDrag);
    card.addEventListener('touchstart', startDrag, { passive: true });

    function startDrag(e) {
        isDragging = true;
        startX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
        
        card.style.transition = 'none'; // Disable transitions while dragging
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', endDrag);
        document.addEventListener('touchmove', drag, { passive: false });
        document.addEventListener('touchend', endDrag);
    }

    function drag(e) {
        if (!isDragging) return;
        const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const dx = clientX - startX;
        
        // Tilt and move the card
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

        // Threshold of 100px for swipe
        if (dx > 100) {
            handleAction(true); // Like
        } else if (dx < -100) {
            handleAction(false); // Dislike
        } else {
            // Snap back to center
            card.style.transition = 'transform 0.3s ease';
            card.style.transform = '';
        }
    }

    // 2. Button Logic
    likeBtn.onclick = () => handleAction(true);
    dislikeBtn.onclick = () => handleAction(false);

    /**
     * Internal function to handle the result (Like/Dislike)
     * @param {boolean} isLiked 
     */
    function handleAction(isLiked) {
        if (isLiked) {
            likedCats.push(cats[currentIndex]);
        }
        
        // Remove card with animation
        const direction = isLiked ? 1 : -1;
        card.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
        card.style.transform = `translateX(${direction * 500}px) rotate(${direction * 40}deg)`;
        card.style.opacity = '0';

        // Wait for animation to finish then load next
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