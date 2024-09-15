import { Then } from '@badeball/cypress-cucumber-preprocessor'

Then(/^a screenshot should be taken$/, () =>{
  // @ts-expect-error
  cy.percySnapshot();
})