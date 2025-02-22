document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const title = urlParams.get('title');
    if (!title) {
      console.error('No anime title specified in query parameters.');
      return;
    }
  
    let currentAnime = null; // переменная для хранения загруженного аниме
  
    // 1) Загружаем данные аниме с сервера
    fetch(`/api/animes/search?title=${encodeURIComponent(title)}`, {
      method: 'GET',
      headers: {
        'Authorization': localStorage.getItem('token')
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error fetching anime: ${response.status}`);
        }
        return response.json();
      })
      .then(anime => {
        // Сохраняем объект аниме в переменную
        currentAnime = anime;
  
        // Заполняем данные на странице
        document.getElementById('animeTitle').textContent = anime.title || 'Untitled';
        document.getElementById('animeStatus').textContent = anime.status || '-';
        document.getElementById('animeType').textContent = anime.Type || '-';
        document.getElementById('animeYear').textContent = anime.Year || '-';
        document.getElementById('animeEpisodes').textContent = anime.Episodes || '-';
        document.getElementById('animeDuration').textContent = anime.Duration || '-';
        document.getElementById('animeStudio').textContent = anime.Studio || '-';
        document.getElementById('animeAuthor').textContent = anime.Author || '-';
        document.getElementById('animeRating').textContent = anime.Rating || '-';
  
        const genresText = Array.isArray(anime.Genres)
          ? anime.Genres.join(", ")
          : "-";
        document.getElementById("animeGenres").textContent = genresText;
  
        const scoreElem = document.getElementById("animeScore");
        scoreElem.textContent = (anime.Score != null) ? anime.Score : "-";
  
        const coverElem = document.getElementById("animeCover");
        coverElem.src = anime.cover || "";
        coverElem.alt = anime.title ? `${anime.title} Cover` : "Anime Cover";
  
        const descriptionElem = document.getElementById("animeDescription");
        descriptionElem.textContent = anime.description || "No description available.";
  
        if (anime.Score != null) {
          renderStarRating(anime.Score);
        }
  
        // 2) Добавляем слушатель на кнопку "Add to Cart" ТОЛЬКО после того, как у нас есть данные 'anime'
        const addToCartBtn = document.getElementById("btn");
        addToCartBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
  
          // Считываем массив корзины из localStorage (или пустой)
          let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
          // Проверяем, нет ли уже этого аниме в корзине
          const found = cart.find(item => item._id === anime._id);
          if (!found) {
            // Добавляем
            cart.push({
              _id: anime._id,
              title: anime.title,
              cover: anime.cover,
              price: anime.price
            });
            localStorage.setItem('cart', JSON.stringify(cart));
            alert(`"${anime.title}" added to Cart!`);
          } else {
            alert(`${anime.title} is already in the cart!`);
          }
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  
    function renderStarRating(score) {
      const starContainer = document.getElementById("starContainer");
      if (!starContainer) return; // если вдруг элемента нет
      starContainer.innerHTML = "";
  
      const starCount = 5;
      let rating = score / 2;
  
      for (let i = 1; i <= starCount; i++) {
        const starSpan = document.createElement("span");
        starSpan.classList.add("star");
  
        if (rating >= 1) {
          // Full star
          starSpan.textContent = "★";
          rating -= 1;
        } else if (rating > 0) {
          starSpan.textContent = "★";
          starSpan.style.color = "#ccc";
          rating = 0;
        } else {
          starSpan.textContent = "★";
          starSpan.style.color = "#ccc";
        }
        starContainer.appendChild(starSpan);
      }
    }
  });
  