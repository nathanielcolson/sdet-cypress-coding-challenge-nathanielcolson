describe('DateRangePicker', () => {
  it('should render', () => {
    cy.visit('/');
    cy.get('.DateRangeSelect').should('be.visible');
  });

  describe('Select start and end date', () => {
    beforeEach(() => {
      // It was slightly convenient to pick a month that starts on a Sunday, since we're getting days by index
      cy.clock(new Date(Date.parse('1999-09-01')).getTime(), ['Date']);
      cy.visit('/');
    });

    it('should select the start date when you click the first time', () => {
      const startDayIndex = 15;
      cy.get('.MuiInputBase-input').eq(0).click(); // Open calendar
      cy.get('button.MuiPickersDay-root').eq(startDayIndex).click();

      cy.get('.MuiInputBase-input').eq(0).should('have.value', '08/16/1999')
      cy.get('button.MuiPickersDay-root').eq(startDayIndex).should('have.class', 'Mui-selected')
    });

    it('should select the end date when you click the second time, and highlight all intermediate dates', () => {
      // Pick a range that spans two months, just to make it interesting
      const startDayIndex = 28;
      const endDayIndex = 33;
      cy.get('.MuiInputBase-input').eq(0).click(); // Open calendar
      cy.get('button.MuiPickersDay-root').eq(startDayIndex).click();
      cy.get('button.MuiPickersDay-root').eq(endDayIndex).click();

      cy.get('.MuiInputBase-input').eq(0).should('have.value', '08/29/1999');
      cy.get('.MuiInputBase-input').eq(1).should('have.value', '09/03/1999');
      cy.get('button.MuiPickersDay-root').eq(startDayIndex).should('have.class', 'Mui-selected');
      cy.get('button.MuiPickersDay-root').eq(endDayIndex).should('have.class', 'Mui-selected');
      for (let i = startDayIndex + 1; i < endDayIndex; i++) {
        cy.get('button.MuiPickersDay-root').eq(i).should('have.class', 'MuiDateRangePickerDay-dayInsideRangeInterval')
      }
    });

    // This feels like a bug to me. When you enter an end date, the previously entered start date clears. That seems
    // like something a user would do pretty often. Without this, it's very difficult to navigate to a date range
    // that's far away from your current date.
    // Repro steps:
    // - Click the start date input and type 01/01/2000
    // - Click the end date input
    // - Observe that the start date is now empty
    // - Workaround: You can TAB over to the end date without clearing the start date, you just can't focus it with the mouse.
    it.skip('should display a manually entered date on the calendar', () => {
      const startDayIndex = 28;
      const endDayIndex = 33;
      cy.get('.MuiInputBase-input').eq(0).click();
      cy.get('.MuiInputBase-input').eq(0).type('08/29/1999');
      // Workaround is to press the Tab key here
      cy.get('button.MuiPickersDay-root').eq(startDayIndex).click();

      cy.get('.MuiInputBase-input').eq(1).click();
      cy.get('.MuiInputBase-input').eq(1).type('09/03/1999');

      cy.get('.MuiInputBase-input').eq(0).should('have.value', '08/29/1999');
      cy.get('.MuiInputBase-input').eq(1).should('have.value', '09/03/1999');
      cy.get('button.MuiPickersDay-root').eq(startDayIndex).should('have.class', 'Mui-selected');
      cy.get('button.MuiPickersDay-root').eq(endDayIndex).should('have.class', 'Mui-selected');
      for (let i = startDayIndex + 1; i < endDayIndex; i++) {
        cy.get('button.MuiPickersDay-root').eq(i).should('have.class', 'MuiDateRangePickerDay-dayInsideRangeInterval')
      }
    });
  });
});
