const catImages = [
  "cat-images/cat1.jpg",
  "cat-images/cat2.jpg",
  "cat-images/cat3.jpg",
  "cat-images/cat4.jpg",
  "cat-images/cat5.jpg",
  "cat-images/cat6.jpg",
  "cat-images/cat7.jpg",
  "cat-images/catGif.gif"
];

let currentIndex = 0;
let likedCats = [];

const card = document.getElementById("card");
const catImage = document.getElementById("catImage");
const likeBtn = document.getElementById("likeBtn");
const dislikeBtn = document.getElementById("dislikeBtn");

let startX = 0;
let currentX = 0;

// Load first image
loadCat();

function loadCat() {
  catImage.src = catImages[currentIndex];
  card.style.transform = "translateX(0)";
}

function likeCat() {
  likedCats.push(catImages[currentIndex]);
  nextCat();
}

function dislikeCat() {
  nextCat();
}

function nextCat() {
  currentIndex++;

  if (currentIndex >= catImages.length) {
    showSummary();
  } else {
    loadCat();
  }
}

/* Swipe Events */
card.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
});

card.addEventListener("touchmove", e => {
  currentX = e.touches[0].clientX;
  const diff = currentX - startX;
  card.style.transform = `translateX(${diff}px) rotate(${diff / 10}deg)`;
});

card.addEventListener("touchend", () => {
  const diff = currentX - startX;

  if (diff > 120) {
    likeCat();
  } else if (diff < -120) {
    dislikeCat();
  } else {
    card.style.transform = "translateX(0)";
  }
});

// Desktop buttons
likeBtn.addEventListener("click", likeCat);
dislikeBtn.addEventListener("click", dislikeCat);

function showSummary() {
  document.body.innerHTML = `
    <h1>You liked ${likedCats.length} cats 🐱</h1>
    <div class="gallery">
      ${likedCats.map(cat => `<img src="${cat}" />`).join("")}
    </div>
    <button onclick="location.reload()">Restart</button>
  `;

  const style = document.createElement("style");
  style.innerHTML = `
    .gallery {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 10px;
      margin: 20px;
    }
    .gallery img {
      width: 100%;
      border-radius: 10px;
    }
    button {
      padding: 12px 20px;
      font-size: 16px;
      border-radius: 10px;
      border: none;
      cursor: pointer;
    }
  `;
  document.head.appendChild(style);
}
