/* eslint-disable object-curly-newline */
/* eslint-disable no-undef */
import fetchMock from 'fetch-mock';
import { fetchRestaurants, fetchRestaurantDetail } from '../src/scripts/api';
import { initDB, saveFavorite, removeFavorite, getFavorites, isFavorite } from '../src/scripts/idb';

describe('Restaurant API Integration Tests', () => {
    beforeAll(async () => {
        await initDB();
    });

    afterEach(() => {
        fetchMock.restore();
    });

    it('fetch list restaurants', async () => {
        const mockResponse = {
            restaurants: [
                { id: '1', name: 'Restaurant 1' },
                { id: '2', name: 'Restaurant 2' },
            ],
        };

        fetchMock.get('https://restaurant-api.dicoding.dev/list', mockResponse);

        const data = await fetchRestaurants();

        expect(data.restaurants).toEqual(mockResponse.restaurants);
    });

    it('fetch restaurant detail by id', async () => {
        const restaurantId = '1';
        const mockResponse = {
            restaurant: { id: '1', name: 'Restaurant 1', description: 'Description 1' },
        };

        fetchMock.get(`https://restaurant-api.dicoding.dev/detail/${restaurantId}`, mockResponse);

        const data = await fetchRestaurantDetail(restaurantId);

        expect(data.restaurant).toEqual(mockResponse.restaurant);
    });

    it('fungsi menyukai dan batal menyukai restoran', async () => {
        const restaurant = { id: '1', name: 'Restaurant 1' };

        // Add to favorite
        await saveFavorite(restaurant);
        let favorites = await getFavorites();
        expect(favorites).toEqual([restaurant]);

        // Check if restaurant is favorite
        let favorite = await isFavorite(restaurant.id);
        expect(favorite).toBe(true);

        // Remove from favorite
        await removeFavorite(restaurant.id);
        favorites = await getFavorites();
        expect(favorites).toEqual([]);

        // Check if restaurant is not favorite
        favorite = await isFavorite(restaurant.id);
        expect(favorite).toBe(false);
    });
});
