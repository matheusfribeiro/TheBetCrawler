exports.delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

exports.waitAndClick = async (page, selector) => {
  try {
    await page.waitForSelector(selector);
    await page.click(selector);
  } catch (error) {
    console.log("Error:", error);
  }
};

exports.checkBox = async (page, selector, timeout) => {
  try {
    await page.waitForSelector(selector, { timeout });
    console.log("Selector appeared on screen.");
    await page.keyboard.press("Escape");
  } catch (error) {
    if (error.name === "TimeoutError") {
      console.log("Selector did not appear within the timeout.");
    } else {
      console.error("An error occurred:", error);
    }
  }
};

exports.waitAndType = async (page, selector, text) => {
  try {
    await page.waitForSelector(selector);
    await page.focus(selector);
    await page.keyboard.type(text);
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

exports.getDate = () => {
  const currentDate = new Date();

  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1; // Month is 0-based, so add 1
  const year = currentDate.getFullYear() % 100; // Get last two digits of the year

  // Format numbers with leading zeros if needed
  const formattedDay = day.toString().padStart(2, "0");
  const formattedMonth = month.toString().padStart(2, "0");
  const formattedYear = year.toString().padStart(2, "0");

  const formattedDate = `${formattedDay}/${formattedMonth}/${formattedYear}`;
  console.log("Current Date:", formattedDate);
  return formattedDate;
};

exports.scrapeAndValidate = async (page, team) => {
  try {
    // Clicks on search icon
    await this.waitAndClick(page, 'mat-icon.btn-search[role="img"]');
    // Waits for the input and type team name
    await this.waitAndType(
      page,
      'input.mat-autocomplete-trigger.mat-input-element[role="combobox"]',
      team
    );

    // Waits for the dropdown options to become visible
    const optionsSelector = "mat-option.auto-complete-search-option";
    await page.waitForSelector(optionsSelector, { visible: true });

    const options = await page.$$(optionsSelector);

    // Use arrow keys to navigate through options
    for (let i = 0; i < options.length; i++) {
      await page.keyboard.press("ArrowDown");

      // Check if the option has the mat-active class indicating it's selected
      const isActive = await options[i].evaluate(
        (option) => option.classList.contains("mat-active")
      );

      if (isActive) {
        // Click on the selected option
        await options[i].click();
        console.log("Clicked on the selected option");
        break;
      }
    }

    // Get the text content from the <div> element
    const divElement = await page.waitForSelector(
      "div.event-date.ng-star-inserted"
    );

    const divContent = await page.evaluate((el) => el.textContent, divElement);

    // Extract the date using string manipulation
    const parts = divContent.trim().split(" ");
    const matchDate = parts[0];
    const matchTime = parts[1];

    const currentDate = this.getDate();
    console.log(
      `The current date is ${currentDate} and it should be equal to the game date, that is: ${matchDate} and game time: ${matchTime}`
    );

    // Fail fast
    if (currentDate !== matchDate) {
      console.log("Game date does not match current date.");
      throw new Error(`Script halted due to validation mismatch`);
    }

    //Checks if team is home or away
    const teamSelector = ".team-name";
    const teamElements = await page.$$(teamSelector);
    let teamName = ''

    let teamPosition = null; // Variable to store team position
    for (let i = 0; i < teamElements.length; i++) {
      teamName = await teamElements[i].evaluate((element) =>
        element.textContent.trim().toLowerCase()
      );

      if (teamName.includes(team)) {
        teamPosition = i;
        if (teamPosition !== null) {
          const teamType = teamPosition === 0 ? "Casa" : "Fora";
          console.log(
            `Team found: ${team}/${teamName}, at position: (${teamType})`
          );
          console.log("Match validation ok");
        } else {
          console.log(`Team: ${team} not found.`);
          throw new Error('mismatch validations')
        }
        break; // Exit the loop as soon as the team is found
      }
    }

    

    
  } catch (error) {
    throw new Error(error)
  }
}