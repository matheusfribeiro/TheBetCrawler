const path = require('path')

exports.delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

exports.takeScreenshot = async (page, screenshotName) => {
  await this.delay(2000)
  await page.screenshot({
    path: path.join(__dirname, `../../screenshots/${screenshotName}.png`),
    fullPage: true,
  })
  console.log('screenshot taken')
}

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
  //console.log("Current Date:", formattedDate);
  return formattedDate;
};

exports.getNextDateDay = () => {
  const currentDate = new Date();

  // Calculate the next day by adding 1 to the current day
  const nextDay = new Date(currentDate);
  nextDay.setDate(nextDay.getDate() + 1);

  // Extract day, month, and year
  const day = nextDay.getDate();
  const month = nextDay.getMonth() + 1; // Month is 0-based, so add 1
  const year = nextDay.getFullYear() % 100; // Get last two digits of the year

  // Format numbers with leading zeros if needed
  const formattedDay = day.toString().padStart(2, "0");
  const formattedMonth = month.toString().padStart(2, "0");
  const formattedYear = year.toString().padStart(2, "0");

  // Create the formatted date string
  const formattedDate = `${formattedDay}/${formattedMonth}/${formattedYear}`;
  //console.log("Next Day:", formattedDate);
  return formattedDate;
};

exports.scrapeAndValidate = async (page, team) => {
  try {
    console.log('Searching for a new match...')
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

    //await this.delay(5000)

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
    const nextDate = this.getNextDateDay()
    console.log(
      `Match date: ${matchDate} - Match time: ${matchTime} - The match date should be equal to the current date: ${currentDate} or the day after: ${nextDate}`
    );

    // Fail fast
    if (currentDate === matchDate || nextDate === matchDate) {
      console.log('Date matches the current date or the next date')
    } else {
      console.log("Game date does not match current date.");
      throw new Error(`Script halted due to validation mismatch`);
    }

    await this.delay(5000)
    //Checks if team is home or away
    const teamSelector = ".team-name";
    await page.waitForSelector(teamSelector)
    const teamElements = await page.$$(teamSelector);
    let teamName = ''
    let homeOrAway = ''
    let teamPosition = null; // Variable to store team position

    for (let i = 0; i < teamElements.length; i++) {
      await this.delay(1000)
      teamName = await teamElements[i].evaluate((element) =>
        element.textContent.trim().toLowerCase()
      );

      console.log('Comparing:', teamName, team)
      if (teamName.includes(team)) {
        console.log(`${teamName} includes ${team}`)
        teamPosition = i;
        console.log(teamPosition)
        break
      }
    }

    if (teamPosition !== null) {
      console.log('team position is not null')
      homeOrAway = teamPosition === 0 ? "casa" : "fora";
      console.log(
        `Team found: ${team}/${teamName}, at position: (${homeOrAway})`
      );
      console.log("Match validation ok");
    } else {
      console.log(`Team: ${team} not found.`);
      throw new Error('mismatch validations')
    }

    return homeOrAway
  } catch (error) {
    if (error.name === 'TimeoutError') {
      console.error('Timeout occurred while waiting for an element.');
    } else if (error.name === 'NoSuchElementError') {
      console.error('Element not found.');
    } else {
      console.error('An error occurred:', error);
    }
    throw new Error(error.message);
  }
}