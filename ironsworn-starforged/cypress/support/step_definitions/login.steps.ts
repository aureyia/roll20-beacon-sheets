import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'
import AuthPage from '../pages/auth.page'

Given(/^a user is on the "([^"]*)" page$/, (page) => {
  if (page === 'auth') {
    AuthPage.goTo()
  }
})

When(/^they complete the "([^"]*)" form$/, () =>{
  AuthPage.completeLogin()
})

Then(/^their account dashboard should be displayed$/, () =>{
  AuthPage.dashboardIsDisplayed()
})
