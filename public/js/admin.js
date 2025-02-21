document.addEventListener('DOMContentLoaded', () => {
    const animeForm = document.getElementById('animeForm');
    const formTitle = document.getElementById('formTitle');
  
    const titleField = document.getElementById('animeTitle');
    const descField = document.getElementById('animeDescription');
    const coverField = document.getElementById('animeCover');
    const statusField = document.getElementById('animeStatus');
    const typeField = document.getElementById('animeType');
    const yearField = document.getElementById('animeYear');
    const episodesField = document.getElementById('animeEpisodes');
    const durationField = document.getElementById('animeDuration');
    const studioField = document.getElementById('animeStudio');
    const genresField = document.getElementById('animeGenres');
    const authorField = document.getElementById('animeAuthor');
    const scoreField = document.getElementById('animeScore');
    const ratingField = document.getElementById('animeRating');
  
    const animeTableBody = document.getElementById('animeTableBody');
    let editMode = false;
    let editAnimeId = null;
  
    fetchAnimeList();
  
    animeForm.addEventListener('submit', (e) => {
      e.preventDefault();
  
      const animeData = {
        title: titleField.value.trim(),
        description: descField.value.trim(),
        cover: coverField.value.trim(),
        status: statusField.value.trim(),
        Type: typeField.value.trim(),
        Year: parseInt(yearField.value) || null,
        Episodes: parseInt(episodesField.value) || null,
        Duration: parseInt(durationField.value) || null,
        Studio: studioField.value.trim(),
        Genres: genresField.value.trim().split(',').map(g => g.trim()).filter(Boolean),
        Author: authorField.value.trim(),
        Score: parseFloat(scoreField.value) || null,
        Rating: ratingField.value.trim()
      };
  
      if (!animeData.title) {
        alert('Title is required.');
        return;
      }
  
      if (editMode && editAnimeId) {
        fetch(`/api/admin/anime/${editAnimeId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(animeData)
        })
        .then(res => res.json())
        .then(result => {
          if (result.success) {
            alert('Anime updated successfully!');
            resetForm();
            fetchAnimeList();
          } else {
            alert('Update failed: ' + result.message);
          }
        })
        .catch(err => console.error(err));
      } else {
        fetch('/api/admin/anime', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(animeData)
        })
        .then(res => res.json())
        .then(result => {
          if (result.success) {
            alert('Anime created successfully!');
            resetForm();
            fetchAnimeList();
          } else {
            alert('Creation failed: ' + result.message);
          }
        })
        .catch(err => console.error(err));
      }
    });
  
    const resetFormBtn = document.getElementById('resetFormBtn');
    resetFormBtn.addEventListener('click', (e) => {
      e.preventDefault();
      resetForm();
    });
  
    function fetchAnimeList() {
      fetch('/api/admin/anime')
        .then(res => res.json())
        .then(data => {
          renderAnimeList(data);
        })
        .catch(err => {
          console.error('Error fetching anime list:', err);
        });
    }
  
    function renderAnimeList(animeArray) {
      animeTableBody.innerHTML = '';
  
      animeArray.forEach(item => {
        const row = document.createElement('tr');
  
        const coverCell = document.createElement('td');
        if (item.cover) {
          const img = document.createElement('img');
          img.src = item.cover;
          img.alt = item.title + ' Cover';
          img.className = 'cover-img';
          coverCell.appendChild(img);
        } else {
          coverCell.textContent = 'No Cover';
        }
        row.appendChild(coverCell);
  
        const titleCell = document.createElement('td');
        titleCell.textContent = item.title || 'N/A';
        row.appendChild(titleCell);
  
        const statusCell = document.createElement('td');
        statusCell.textContent = item.status || 'N/A';
        row.appendChild(statusCell);
  
        const authorCell = document.createElement('td');
        authorCell.textContent = item.Author || 'N/A';
        row.appendChild(authorCell);
  
        // YEA
        const yearCell = document.createElement('td');
        yearCell.textContent = item.Year || 'N/A';
        row.appendChild(yearCell);
  
        const scoreCell = document.createElement('td');
        scoreCell.textContent = (item.Score != null) ? item.Score : 'N/A';
        row.appendChild(scoreCell);
  
        const actionsCell = document.createElement('td');
  
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.className = 'action-btn edit';
        editBtn.addEventListener('click', () => {
          populateFormForEdit(item);
        });
        actionsCell.appendChild(editBtn);
  
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'action-btn delete';
        deleteBtn.addEventListener('click', () => {
          if (confirm(`Delete "${item.title}"?`)) {
            deleteAnime(item._id);
          }
        });
        actionsCell.appendChild(deleteBtn);
  
        row.appendChild(actionsCell);
        animeTableBody.appendChild(row);
      });
    }
  
    function deleteAnime(id) {
      fetch(`/api/admin/anime/${id}`, {
        method: 'DELETE'
      })
        .then(res => res.json())
        .then(result => {
          if (result.success) {
            alert('Anime deleted successfully!');
            fetchAnimeList();
          } else {
            alert('Deletion failed: ' + result.message);
          }
        })
        .catch(err => console.error(err));
    }
  
    function populateFormForEdit(anime) {
      editMode = true;
      editAnimeId = anime._id;
      formTitle.textContent = 'Edit Anime: ' + (anime.title || '');
  
      titleField.value = anime.title || '';
      descField.value = anime.description || '';
      coverField.value = anime.cover || '';
      statusField.value = anime.status || '';
      typeField.value = anime.Type || '';
      yearField.value = anime.Year || '';
      episodesField.value = anime.Episodes || '';
      durationField.value = anime.Duration || '';
      studioField.value = anime.Studio || '';
      genresField.value = anime.Genres ? anime.Genres.join(', ') : '';
      authorField.value = anime.Author || '';
      scoreField.value = anime.Score || '';
      ratingField.value = anime.Rating || '';
    }
  
    function resetForm() {
      editMode = false;
      editAnimeId = null;
      formTitle.textContent = 'Create New Anime';
  
      animeForm.reset(); 
    }
  });
  