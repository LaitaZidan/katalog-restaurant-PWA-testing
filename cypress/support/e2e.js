beforeEach(() => {
  cy.visit('/');
  cy.window().then((win) => {
    const unregisterSW = () => {
      return new Cypress.Promise((resolve, reject) => {
        if (win.navigator && win.navigator.serviceWorker) {
          win.navigator.serviceWorker.getRegistrations().then((registrations) => {
            const promises = registrations.map((registration) => registration.unregister());
            Promise.all(promises).then(resolve).catch(reject);
          }).catch(reject);
        } else {
          resolve();
        }
      });
    };
    
    const retryUnregisterSW = () => {
      return unregisterSW().catch(() => {
        // Retry after 500ms if there's an error
        return Cypress.Promise.delay(500).then(retryUnregisterSW);
      });
    };

    return retryUnregisterSW();
  });
});