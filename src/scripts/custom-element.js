class RestaurantItem extends HTMLElement {
    connectedCallback() {
        this.render();
    }

    set restaurant(restaurant) {
        this._restaurant = restaurant;
        this.render();
    }

    render() {
        this.innerHTML = `
          <div class="restaurant-item">
              <img src="${this._restaurant.pictureId}" alt="${this._restaurant.name}">
              <h3>${this._restaurant.name}</h3>
              <p>${this._restaurant.city} - Rating: ${this._restaurant.rating}</p>
              <a href="restaurant-detail.html?id=${this._restaurant.id}">Detail</a>
          </div>
      `;
    }
}

customElements.define('restaurant-item', RestaurantItem);
