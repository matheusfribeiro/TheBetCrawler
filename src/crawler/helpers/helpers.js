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

exports.betTypeHomeOrAway = async (page, homeOrAway) => {
  try {
    // choose bet field
    const oddButtonSelector = "app-odd-button-plus2";

    await page.waitForSelector(oddButtonSelector);
    const oddButtons = await page.$$(oddButtonSelector);

    for (const oddButton of oddButtons) {
      const hasMatchingTitle = await page.evaluate(
        (button, homeOrAway) => {
          const titleElement = button.querySelector(".title");
          return (
            titleElement && titleElement.textContent.trim() === homeOrAway
          );
        },
        oddButton,
        homeOrAway
      );

      if (hasMatchingTitle) {
        await oddButton.click();
        console.log("Clicked on the button with matching title:", homeOrAway);
        break; // Break out of the loop after clicking one button
      }
    }

  } catch (error) {
    console.log("error on placing the bet:", error);
  }
};


exports.waitButtonEnabledClick = async (page, selector) => {
  try {
    
    await page.waitForSelector(selector);
    
    const button = await page.$(selector);
    const isDisabled = await button.evaluate(button => button.hasAttribute('disabled'));
    
    // Wait for the button to become enabled
    while (isDisabled) {
      await page.waitForTimeout(100); // Adjust the delay as needed
      isDisabled = await button.evaluate(button => button.hasAttribute('disabled'));
    }
    
    await button.click();
  } catch (error) {
    console.log('Error: Could not place bet', error)
  }
}

exports.placeBetConfirmModal = async (page) => {
  try {
    const buttonSelector = 'button.confirm.mat-button.mat-button-base.ng-star-inserted';
    const spanSelector = `${buttonSelector} span.mat-button-wrapper`;

    await page.waitForSelector(spanSelector);

    const span = await page.$(spanSelector);
    const spanText = await span.evaluate(span => span.textContent.trim());
    console.log(spanText)

    if (spanText === 'Confirmar') {
      const button = await span.evaluateHandle(span => span.closest('button'));
      await button.click();
      console.log('Bet placed')
    } else {
      console.log('The span does not have the expected text content.');
      throw new Error('Error validating')
    }
  } catch (error) {
    console.log(error)
  }
}