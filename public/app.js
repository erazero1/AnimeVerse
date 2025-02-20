document.addEventListener("DOMContentLoaded", () => {
    fetch("/api/animes")
      .then((response) => response.json())
      .then((data) => {
        const animeList = document.getElementById("anime-list");
        if (data.animes && data.animes.length > 0) {
          data.animes.forEach((anime) => {
            const li = document.createElement("li");
            li.textContent = `${anime.name} - $${anime.price}`;
            animeList.appendChild(li);
          });
        } else {
          animeList.textContent = "No anime available";
        }
      })
      .catch((err) => console.error("Error fetching anime:", err));
  });
  