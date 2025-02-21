document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const animeId = urlParams.get('id');

    if (!animeId) {
        console.error('No anime ID specified in query parameters.');
        return;
    }

    fetch(`/api/animes/${animeId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error fetching anime: ${response.status}`);
            }
            return response.json();
        })
        .then(anime => {
            document.getElementById('animeTitle').textContent = anime.title || 'Untitled';
            document.getElementById('animeStatus').textContent = anime.status || '-';
            document.getElementById('animeType').textContent = anime.Type || '-';
            document.getElementById('animeYear').textContent = anime.Year || '-';
            document.getElementById('animeEpisodes').textContent = anime.Episodes || '-';
            document.getElementById('animeDuration').textContent = anime.Duration || '-';
            document.getElementById('animeStudio').textContent = anime.Studio || '-';
            document.getElementById('animeAuthor').textContent = anime.Author || '-';
            document.getElementById('animeRating').textContent = anime.Rating || '-';

            const genresText = Array.isArray(anime.Genres) ? anime.Genres.join(', ') : '-';
            document.getElementById('animeGenres').textContent = genresText;

            const scoreElem = document.getElementById('animeScore');
            scoreElem.textContent = (anime.Score != null) ? anime.Score : '-';

            const coverElem = document.getElementById('animeCover');
            coverElem.src = anime.cover || '';
            coverElem.alt = anime.title ? `${anime.title} Cover` : 'Anime Cover';

            const descriptionElem = document.getElementById('animeDescription');
            descriptionElem.textContent = anime.description || 'No description available.';

            if (anime.Score != null) {
                renderStarRating(anime.Score);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });

    function renderStarRating(score) {
        const starContainer = document.getElementById('starContainer');
        starContainer.innerHTML = '';

        const starCount = 5;
        let rating = score / 2;

        for (let i = 1; i <= starCount; i++) {
            const starSpan = document.createElement('span');
            starSpan.classList.add('star');

            if (rating >= 1) {
                // Full star
                starSpan.textContent = '★';
                rating -= 1;
            } else if (rating > 0) {
                starSpan.textContent = '★';
                starSpan.style.color = '#ccc';
                rating = 0;
            } else {
                starSpan.textContent = '★';
                starSpan.style.color = '#ccc';
            }
            starContainer.appendChild(starSpan);
        }
    }
});
