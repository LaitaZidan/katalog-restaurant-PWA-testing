Cypress.Commands.add('clearServiceWorkers', () => {
    cy.window().then((win) => {
      return new Cypress.Promise((resolve, reject) => {
        if (win.navigator && win.navigator.serviceWorker) {
          win.navigator.serviceWorker.getRegistrations().then((registrations) => {
            registrations.forEach((registration) => {
              registration.unregister().then(resolve).catch(reject);
            });
          }).catch(reject);
        } else {
          resolve();
        }
      });
    });
  });