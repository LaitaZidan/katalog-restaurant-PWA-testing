describe('Testing Favorite dan Unfavorite  Restauran', () => {
  it('visit passes', () => {
    cy.visit('/');
    cy.get('.restaurant-list').should('exist');
    cy.get('.restaurant-item').should('exist');

    cy.get('.restaurant-item .btn-detail').contains('Detail').click();

    cy.get('#favorite-btn').click().then(($el) => {
      cy.log('Berhasil menyukai restaurant');
    });
  

    cy.get('#favorite-btn').click().then(($el) => {
      cy.log('Berhasil batal menyukai restaurant');
    });
  });

});