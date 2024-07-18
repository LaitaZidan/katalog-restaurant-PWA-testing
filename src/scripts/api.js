const API_ENDPOINT = 'https://restaurant-api.dicoding.dev';

export async function fetchRestaurants() {
    try {
        const response = await fetch(`${API_ENDPOINT}/list`);
        const data = await response.json();
        return data; // Pastikan data.restaurants adalah array
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        return { restaurants: [] };
    }
}

export async function fetchRestaurantDetail(id) {
    try {
        const response = await fetch(`${API_ENDPOINT}/detail/${id}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        throw error;
    }
}
