Feature: Summary

  Scenario: Character name is visible
    Given a "chrome" web browser is launched
    When the player is on the summary page
    Then the "Name" field should be visible
