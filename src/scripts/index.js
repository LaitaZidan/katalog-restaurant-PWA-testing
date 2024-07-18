// index.js
import 'regenerator-runtime'; // untuk async await
import '../styles/main.scss';
import { fetchRestaurants, fetchRestaurantDetail } from './api';
import {
    initDB, saveFavorite, removeFavorite, getFavorites, isFavorite,
} from './idb';
import './custom-element';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'lazysizes';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'lazysizes/plugins/parent-fit/ls.parent-fit';

// Inisialisasi IndexedDB
initDB();

// Fungsi untuk menampilkan daftar restoran
async function renderRestaurants(restaurants) {
    if (!Array.isArray(restaurants)) {
        console.error('Expected restaurants to be an array, but got:', restaurants);
        return;
    }

    const restaurantContainer = document.getElementById('restaurant-list');
    let restaurantsHTML = '';
    restaurants.forEach((restaurant) => {
        restaurantsHTML += `
            <div class="restaurant-item">
                <img class="lazyload" data-src="https://restaurant-api.dicoding.dev/images/small/${restaurant.pictureId}" alt="${restaurant.name}">
                <h3>${restaurant.name}</h3>
                <p>${restaurant.city} - Rating: ${restaurant.rating}</p>
                <a href="restaurant-detail.html?id=${restaurant.id}" class="btn-detail">Detail</a>
            </div>
        `;
    });
    restaurantContainer.innerHTML = restaurantsHTML;
}

// Fungsi untuk menampilkan detail restoran
async function renderRestaurantDetail(restaurant) {
    const restaurantDetailContainer = document.getElementById('restaurant-detail');
    const restaurantHTML = `
        <h1>${restaurant.name}</h1>
        <img class="lazyload" dat-src="https://restaurant-api.dicoding.dev/images/small/${restaurant.pictureId}" alt="${restaurant.name}">
        <p>${restaurant.address}, ${restaurant.city}</p>
        <p>${restaurant.description}</p>
        <h3>Menu Makanan</h3>
        <ul>
            ${restaurant.menus.foods.map((food) => `<li>${food.name}</li>`).join('')}
        </ul>
        <h3>Menu Minuman</h3>
        <ul>
            ${restaurant.menus.drinks.map((drink) => `<li>${drink.name}</li>`).join('')}
        </ul>
        <h3>Customer Reviews</h3>
        <ul>
            ${restaurant.customerReviews.map((review) => `<li>${review.name}: ${review.review}</li>`).join('')}
        </ul>
        <button id="favorite-btn" data-id="${restaurant.id}">
            ${await isFavorite(restaurant.id) ? 'Hapus Favorit' : 'Tambah Favorit'}
        </button>
    `;
    restaurantDetailContainer.innerHTML = restaurantHTML;

    const favoriteBtn = document.getElementById('favorite-btn');
    favoriteBtn.addEventListener('click', async () => {
        const restaurantId = favoriteBtn.getAttribute('data-id');
        if (await isFavorite(restaurantId)) {
            await removeFavorite(restaurantId);
            favoriteBtn.innerText = 'Tambah Favorit';
        } else {
            await saveFavorite(restaurant);
            favoriteBtn.innerText = 'Hapus Favorit';
        }

        // Setelah mengubah status favorit, perbarui tombol favorit di halaman home
        renderRestaurants(await fetchRestaurants());
    });
}

// Fungsi untuk menampilkan daftar restoran favorit
async function displayFavoriteRestaurants() {
    try {
        const favorites = await getFavorites();
        const restaurantFavoriteContainer = document.getElementById('restaurant-favorite-list');

        let favoritesHTML = '';
        favorites.forEach((favorite) => {
            favoritesHTML += `
                <div class="restaurant-item">
                    <img src="https://restaurant-api.dicoding.dev/images/small/${favorite.pictureId}" alt="${favorite.name}">
                    <h3>${favorite.name}</h3>
                    <p>${favorite.city} - Rating: ${favorite.rating}</p>
                    <a href="restaurant-detail.html?id=${favorite.id}">Detail</a>
                    <button class="remove-favorite-btn" data-id="${favorite.id}">Remove from Favorites</button>
                </div>
            `;
        });

        if (restaurantFavoriteContainer) {
            restaurantFavoriteContainer.innerHTML = favoritesHTML;
        }

        const removeFavoriteBtns = document.querySelectorAll('.remove-favorite-btn');
        removeFavoriteBtns.forEach((btn) => {
            btn.addEventListener('click', async () => {
                const restaurantId = btn.getAttribute('data-id');
                await removeFavorite(restaurantId);
                await displayFavoriteRestaurants();
            });
        });
    } catch (error) {
        console.error('Error displaying favorite restaurants:', error);
    }
}

// Panggil fungsi fetchAndRenderRestaurantDetail saat halaman telah dimuat
document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (id) {
        try {
            const data = await fetchRestaurantDetail(id);
            await renderRestaurantDetail(data.restaurant);
        } catch (error) {
            console.error('Error fetching restaurant detail:', error);
        }
    } else {
        try {
            const data = await fetchRestaurants();
            console.log('Fetched restaurants data:', data);
            if (data && data.restaurants) {
                await renderRestaurants(data.restaurants);
            } else {
                console.error('Unexpected data format from fetchRestaurants:', data);
            }
        } catch (error) {
            console.error('Error fetching restaurant data:', error);
        }
    }
    await displayFavoriteRestaurants();
});

// register service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.bundle.js').then((registration) => {
            console.log('SW registered: ', registration);
        }).catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
        });
    });
}
// Fungsi untuk mengontrol carousel
function setupCarousel() {
    const carouselContainer = document.querySelector('.carousel-container');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    const items = document.querySelectorAll('.carousel-item');

    if (!carouselContainer || !prevButton || !nextButton || items.length === 0) {
        console.error('Carousel elements not found or empty.');
        return;
    }

    let currentIndex = 0;

    function updateCarousel() {
        const width = items[0].clientWidth;
        carouselContainer.style.transform = `translateX(${-currentIndex * width}px)`;
    }

    prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : items.length - 1;
        updateCarousel();
    });

    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex < items.length - 1) ? currentIndex + 1 : 0;
        updateCarousel();
    });

    window.addEventListener('resize', updateCarousel);
    updateCarousel();
}

// Fungsi untuk menangani klik pada tombol hamburger
function toggleNavMenu() {
    const menuButton = document.getElementById('menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    menuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

// Panggil fungsi untuk toggle menu dan setup carousel
document.addEventListener('DOMContentLoaded', () => {
    toggleNavMenu();
    setupCarousel();
});
