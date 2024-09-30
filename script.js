const accessKey = '0GyvyKsUIUN3er4BubiivVgDmUZajsUPxPwcEHOWjjI';
const imgContainer = document.getElementById("img");
const favoritesContainer = document.getElementById("favorites");
const imageDetailsContainer = document.getElementById("imageDetails");
const filterInput = document.getElementById("filterInput");
let page = 1;
let loading = false;
let images = [];

async function fetchImages(query) {
    const url = `https://api.unsplash.com/search/photos?page=${page}&query=${query}&client_id=${accessKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        images = data.results;

        if (page === 1) {
            imgContainer.innerHTML = ''; 
        }

        displayImages(images);

        loading = false;
    } catch (error) {
        console.error("Erro ao carregar as imagens.", error);
    }
}

function displayImages(imagesToDisplay) {
    imgContainer.innerHTML = '';
    imagesToDisplay.forEach(pic => {
        const image = document.createElement("img");
        image.src = pic.urls.small;
        image.alt = pic.alt_description || "Imagem do Unsplash";
        image.width = 400;
        image.height = 300;

        const favoriteButton = document.createElement("button");
        favoriteButton.textContent = "Favoritar";
        favoriteButton.onclick = () => toggleFavorite(pic);

        const imageContainer = document.createElement("div");
        imageContainer.appendChild(image);
        imageContainer.appendChild(favoriteButton);
        imgContainer.appendChild(imageContainer);
    });
}

function toggleFavorite(pic) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const isFavorite = favorites.find(fav => fav.id === pic.id);

    if (isFavorite) {

        const updatedFavorites = favorites.filter(fav => fav.id !== pic.id);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        alert("Imagem removida dos favoritos.");
    } else {

        favorites.push(pic);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        alert("Imagem adicionada aos favoritos.");
    }

    displayFavorites();
}

function displayFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favoritesContainer.innerHTML = '';

    favorites.forEach(pic => {
        const image = document.createElement("img");
        image.src = pic.urls.small;
        image.alt = pic.alt_description || "Imagem favorita";
        image.width = 400;
        image.height = 300;

        image.addEventListener('click', () => showImageDetails(pic));

        favoritesContainer.appendChild(image);
    });
}

function showImageDetails(pic) {
    imageDetailsContainer.innerHTML = `
        <img src="${pic.urls.regular}" alt="${pic.alt_description}">
        <h3>Autor: ${pic.user.name}</h3>
        <p>Descrição: ${pic.alt_description || 'Sem descrição'}</p>
        <p>Resolução: ${pic.width} x ${pic.height}</p>
        <a href="${pic.links.html}" target="_blank">Ver no Unsplash</a>
    `;
    imageDetailsContainer.style.display = 'block';
}

window.onload = displayFavorites;

document.getElementById("searchButton").addEventListener("click", () => {
    const query = document.getElementById("searchInput").value;
    if (query) {
        page = 1;
        fetchImages(query);
    }
});

filterInput.addEventListener("input", (event) => {
    const query = event.target.value.toLowerCase();
    const filteredImages = images.filter(pic => 
        pic.alt_description && pic.alt_description.toLowerCase().includes(query)
    );
    displayImages(filteredImages);
});

window.onscroll = function() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight && !loading) {
        loading = true;
        const query = document.getElementById("searchInput").value;
        page++;
        if (query) {
            fetchImages(query);
        }
    }
};