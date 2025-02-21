document.addEventListener('DOMContentLoaded', () => {
  const applyFiltersBtn = document.querySelector('.apply-filters');
  const animeGrid = document.querySelector('.anime-grid');
  const paginationContainer = document.querySelector('.pagination');

  let currentPage = 1;
  let totalPages = 1;

  fetchAllAnime();

  applyFiltersBtn.addEventListener('click', (e) => {
    e.preventDefault();
    currentPage = 1; 
    fetchFilteredAnime();
  });

  paginationContainer.addEventListener('click', (e) => {
    if (e.target.matches('.prev-page')) {
      if (currentPage > 1) {
        currentPage--;
        fetchFilteredAnime();
      }
    } else if (e.target.matches('.next-page')) {
      if (currentPage < totalPages) {
        currentPage++;
        fetchFilteredAnime();
      }
    }
  });

  function fetchAllAnime() {
    fetch(`/api/animes?page=${currentPage}&limit=32`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log("All anime fetched:", data);
        renderAnimeCards(data.animes);
        totalPages = data.totalPages;
        currentPage = data.currentPage;
        renderPagination();
      })
      .catch(error => {
        console.error('Fetch error:', error);
      });
  }
  

  function fetchFilteredAnime() {
    const filters = getFiltersData();
    filters.page = currentPage;
    filters.limit = 32;


    fetch('/api/animes/filter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filters)
    })
      .then(res => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then(data => {
        totalPages = data.totalPages;
        currentPage = data.currentPage;
        renderAnimeCards(data.animes);
        renderPagination();
      })
      .catch(err => console.error('Fetch error (filtered anime):', err));
  }

  function getFiltersData() {
    const filters = {};

    const statusInputs = document.querySelectorAll('input[name="status"]:checked');
    filters.status = Array.from(statusInputs).map(input => input.value);

    const typeInputs = document.querySelectorAll('input[name="type"]:checked');
    filters.type = Array.from(typeInputs).map(input => input.value);

    const myListInputs = document.querySelectorAll('input[name="my-list"]:checked');
    filters.myList = Array.from(myListInputs).map(input => input.value);

    const sortingInput = document.querySelector('input[name="sorting"]:checked');
    filters.sorting = sortingInput ? sortingInput.value : null;

    const yearInputs = document.querySelectorAll('input[name="year"]');
    if (yearInputs.length >= 2) {
      filters.yearFrom = yearInputs[0].value;
      filters.yearTo = yearInputs[1].value;
    }

    const episodesInput = document.querySelector('input[name="episodes"]');
    filters.episodes = episodesInput ? episodesInput.value : null;

    const durationInput = document.querySelector('input[name="duration"]');
    filters.duration = durationInput ? durationInput.value : null;

    return filters;
  }

  function renderAnimeCards(animeList) {
    animeGrid.innerHTML = '';
    animeList.forEach(anime => {
      const card = document.createElement('a');
      card.href = `/title/?title="${anime.title}"`;
      card.className = 'anime-card';

      const img = document.createElement('img');
      img.src = anime.cover;
      img.alt = `${anime.title} Cover`;
      card.appendChild(img);

      const title = document.createElement('h3');
      title.className = 'anime-title';
      title.textContent = anime.title;
      card.appendChild(title);

      const meta = document.createElement('div');
      meta.className = 'anime-meta';

      const typeSpan = document.createElement('span');
      typeSpan.className = 'anime-type';
      typeSpan.textContent = anime.Type;
      meta.appendChild(typeSpan);

      const yearSpan = document.createElement('span');
      yearSpan.className = 'anime-year';
      yearSpan.textContent = anime.Year;
      meta.appendChild(yearSpan);

      card.appendChild(meta);

      const details = document.createElement('div');
      details.className = 'anime-details';

      const fullTitle = document.createElement('h3');
      fullTitle.className = 'full-title';
      fullTitle.textContent = anime.title;
      details.appendChild(fullTitle);

      const typeDetail = document.createElement('p');
      typeDetail.className = 'detail-type';
      typeDetail.innerHTML = `<strong>Type:</strong> ${anime.Type}`;
      details.appendChild(typeDetail);

      const studioDetail = document.createElement('p');
      studioDetail.className = 'detail-studio';
      studioDetail.innerHTML = `<strong>Studio:</strong> ${anime.Studio}`;
      details.appendChild(studioDetail);

      const episodesDetail = document.createElement('p');
      episodesDetail.className = 'detail-episodes';
      episodesDetail.innerHTML = `<strong>Episodes:</strong> ${anime.Episodes}`;
      details.appendChild(episodesDetail);

      const genresDetail = document.createElement('p');
      genresDetail.className = 'detail-genres';
      // Проверяем, что anime.Genres — массив
      genresDetail.innerHTML = `<strong>Genres:</strong> ${Array.isArray(anime.Genres) ? anime.Genres.join(', ') : ''}`;
      details.appendChild(genresDetail);

      card.appendChild(details);
      animeGrid.appendChild(card);
    });
  }

  // Отрисовка пагинации – вынесенная функция
  function renderPagination() {
    paginationContainer.innerHTML = `
      <a href="#" class="prev-page">&laquo; Prev</a>
      <span>Page ${currentPage} of ${totalPages}</span>
      <a href="#" class="next-page">Next &raquo;</a>
    `;
  }
});
