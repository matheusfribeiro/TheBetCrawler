const {
  waitAndType,
} = require("./helpers");

exports.betTypeHomeAwayBothDouble = async (page, targetBet) => {
  try {
    // choose bet field
    const oddButtonSelector = "app-odd-button-plus2";

    await page.waitForSelector(oddButtonSelector);
    const oddButtons = await page.$$(oddButtonSelector);

    for (const oddButton of oddButtons) {
      const hasMatchingTitle = await page.evaluate(
        (button, targetBet) => {
          const titleElement = button.querySelector(".title");
          return (
            titleElement && titleElement.textContent.trim() === targetBet
          );
        },
        oddButton,
        targetBet
      );

      if (hasMatchingTitle) {
        await oddButton.click();
        console.log("Clicked on the bet button with matching BET:", targetBet);
        break; // Break out of the loop after clicking one button
      }
    }

  } catch (error) {
    console.log("error on placing the bet:", error);
  }
};

exports.betTypeOverUnder = async (page, overUnder) => {
  try {
    const tabContainerSelector = ".mat-tab-links";
    const tabElementsSelector =
      'a.mat-tab-link[aria-disabled="false"][tabindex="0"]';
    await page.waitForSelector(tabContainerSelector);
    const tabContainer = await page.$(tabContainerSelector);
    const tabElements = await tabContainer.$$(tabElementsSelector);
    let foundGolsTab = false;

    // loops through tablinks to select gols tab
    for (const tabElement of tabElements) {
      const tabText = await tabElement.evaluate((tab) =>
        tab.textContent.trim()
      );
      if (tabText === "Gols") {
        foundGolsTab = true;
        await tabElement.click();
        console.log('Clicked on the "Gols" tab.');
        break; // Exit the loop after clicking the "Gols" tab
      }
    }

    if (!foundGolsTab) {
      throw new Error('Could not find the "Gols" tab.');
    }

    // Searches for the over/under bet
    const mainDivSelectors =
      '.content app-odd-button-plus2[type="goals_over_under"] .frame-container';
    const mainDivElements = await page.$$(mainDivSelectors);

    for (const mainDivElement of mainDivElements) {
      try {
        const titleElement = await mainDivElement.$(".title");
        const titleText = (
          await titleElement.evaluate((title) =>
            title.textContent.trim().replace(/\s+/g, "")
          )
        ).toString();
        console.log(titleText, titleElement);

        if (titleText === overUnder) {
          console.log("entered")
          await page.waitForSelector('.title')

          await page.evaluate((element) => {
            element.click()
            console.log('element', element)
          }, titleElement)
          break
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    }
  } catch (error) {
    console.error(error);
  }
};

exports.confirmMultipleBet = async (page, betAmount) => {
  const betFieldInput = 'input.mat-input-element[formcontrolname="value"]';
  await waitAndType(page, betFieldInput, betAmount)
  await this.waitButtonEnabledClick(page, 'button.bet-button.ng-star-inserted')
  await this.placeBetConfirmModal(page)
}

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
