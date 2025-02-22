document.addEventListener("DOMContentLoaded", () => {
  const animeForm = document.getElementById("animeForm");
  const formTitle = document.getElementById("formTitle");

  const titleField = document.getElementById("animeTitle");
  const descField = document.getElementById("animeDescription");
  const coverField = document.getElementById("animeCover");
  const statusField = document.getElementById("animeStatus");
  const typeField = document.getElementById("animeType");
  const yearField = document.getElementById("animeYear");
  const episodesField = document.getElementById("animeEpisodes");
  const durationField = document.getElementById("animeDuration");
  const studioField = document.getElementById("animeStudio");
  const genresField = document.getElementById("animeGenres");
  const authorField = document.getElementById("animeAuthor");
  const scoreField = document.getElementById("animeScore");
  const ratingField = document.getElementById("animeRating");

  const animeTableBody = document.getElementById("animeTableBody");
  const paginationContainer = document.getElementById("pagination");

  let editMode = false;
  let editAnimeId = null;
  let currentPage = 1;
  let totalPages = 1;

  const searchBtn = document.getElementById("searchBtn");
  const searchQuery = document.getElementById("searchQuery");

  if (searchBtn && searchQuery) {
    searchBtn.addEventListener("click", () => {
      const query = searchQuery.value.trim();
      if (!query) {
        fetchAnimeList();
      } else {
        fetch(`/api/animes/search?title=${encodeURIComponent(query)}`)
          .then((res) => {
            if (!res.ok) {
              throw new Error("Network response was not ok");
            }
            return res.json();
          })
          .then((data) => {
            renderAnimeList(data.animes);
            paginationContainer.innerHTML = "";
          })
          .catch((err) => console.error("Search error:", err));
      }
    });
  }

  // При загрузке страницы — получаем список аниме с пагинацией
  fetchAnimeList();

  animeForm.addEventListener("submit", (e) => {
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
      Genres: genresField.value
        .trim()
        .split(",")
        .map((g) => g.trim())
        .filter(Boolean),
      Author: authorField.value.trim(),
      Score: parseFloat(scoreField.value) || null,
      Rating: ratingField.value.trim(),
    };

    if (!animeData.title) {
      alert("Title is required.");
      return;
    }

    if (editMode && editAnimeId) {
      fetch(`/api/animes/${editAnimeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify(animeData),
      })
        .then((res) => res.json())
        .then((result) => {
          if (result.success) {
            alert("Anime updated successfully!");
            resetForm();
            fetchAnimeList();
          } else {
            alert("Update failed: " + result.message);
          }
        })
        .catch((err) => console.error(err));
    } else {
      fetch("/api/animes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify(animeData),
      })
        .then((res) => res.json())
        .then((result) => {
          if (result.success) {
            alert("Anime created successfully!");
            resetForm();
            fetchAnimeList();
          } else {
            alert("Creation failed: " + result.message);
          }
        })
        .catch((err) => console.error(err));
    }
  });

  const resetFormBtn = document.getElementById("resetFormBtn");
  resetFormBtn.addEventListener("click", (e) => {
    e.preventDefault();
    resetForm();
  });

  // Функция получения списка аниме с пагинацией
  function fetchAnimeList() {
    // Запрос с использованием query-параметров page и limit (например, 20 записей на страницу)
    fetch(`/api/animes?page=${currentPage}&limit=20`)
      .then((res) => res.json())
      .then((data) => {
        totalPages = data.totalPages;
        currentPage = data.currentPage;
        renderAnimeList(data.animes);
        renderPagination();
      })
      .catch((err) => {
        console.error("Error fetching anime list:", err);
      });
  }

  function renderAnimeList(animeArray) {
    animeTableBody.innerHTML = "";
    animeArray.forEach((item) => {
      const row = document.createElement("tr");

      const coverCell = document.createElement("td");
      if (item.cover) {
        const img = document.createElement("img");
        img.src = item.cover;
        img.alt = item.title + " Cover";
        img.className = "cover-img";
        coverCell.appendChild(img);
      } else {
        coverCell.textContent = "No Cover";
      }
      row.appendChild(coverCell);

      const titleCell = document.createElement("td");
      titleCell.textContent = item.title || "N/A";
      row.appendChild(titleCell);

      const statusCell = document.createElement("td");
      statusCell.textContent = item.status || "N/A";
      row.appendChild(statusCell);

      const authorCell = document.createElement("td");
      authorCell.textContent = item.Author || "N/A";
      row.appendChild(authorCell);

      const yearCell = document.createElement("td");
      yearCell.textContent = item.Year || "N/A";
      row.appendChild(yearCell);

      const scoreCell = document.createElement("td");
      scoreCell.textContent = item.Score != null ? item.Score : "N/A";
      row.appendChild(scoreCell);

      const actionsCell = document.createElement("td");

      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.className = "action-btn edit";
      editBtn.addEventListener("click", () => {
        populateFormForEdit(item);
      });
      actionsCell.appendChild(editBtn);

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.className = "action-btn delete";
      deleteBtn.addEventListener("click", () => {
        if (confirm(`Delete "${item.title}"?`)) {
          deleteAnime(item._id);
        }
      });
      actionsCell.appendChild(deleteBtn);

      row.appendChild(actionsCell);
      animeTableBody.appendChild(row);
    });
  }

  function renderPagination() {
    const paginationHTML = `
      <button class="prev-page">Prev</button>
      <span>Page ${currentPage} of ${totalPages}</span>
      <button class="next-page">Next</button>
    `;
    paginationContainer.innerHTML = paginationHTML;

    const prevBtn = paginationContainer.querySelector(".prev-page");
    const nextBtn = paginationContainer.querySelector(".next-page");

    prevBtn.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        fetchAnimeList();
      }
    });
    nextBtn.addEventListener("click", () => {
      if (currentPage < totalPages) {
        currentPage++;
        fetchAnimeList();
      }
    });
  }

  function deleteAnime(id) {
    fetch(`/api/animes/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          alert("Anime deleted successfully!");
          fetchAnimeList();
        } else {
          alert("Deletion failed: " + result.message);
        }
      })
      .catch((err) => console.error(err));
  }

  function populateFormForEdit(anime) {
    editMode = true;
    editAnimeId = anime._id;
    formTitle.textContent = "Edit Anime: " + (anime.title || "");

    titleField.value = anime.title || "";
    descField.value = anime.description || "";
    coverField.value = anime.cover || "";
    statusField.value = anime.status || "";
    typeField.value = anime.Type || "";
    yearField.value = anime.Year || "";
    episodesField.value = anime.Episodes || "";
    durationField.value = anime.Duration || "";
    studioField.value = anime.Studio || "";
    genresField.value = anime.Genres ? anime.Genres.join(", ") : "";
    authorField.value = anime.Author || "";
    scoreField.value = anime.Score || "";
    ratingField.value = anime.Rating || "";
  }

  function resetForm() {
    editMode = false;
    editAnimeId = null;
    formTitle.textContent = "Create New Anime";
    animeForm.reset();
  }
});
