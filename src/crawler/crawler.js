const puppeteer = require("puppeteer");
const puppeteerExtra = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const {
  delay,
  waitAndClick,
  checkBox,
  waitAndType,
  getDate,
  betTypeHomeAwayBothDouble,
  confirmMultipleBet,
  betTypeOverUnder,
} = require("./helpers/helpers");
require("dotenv").config();

// Register the Stealth plugin
puppeteerExtra.use(StealthPlugin());

const puppeteerOptions = {
  headless: false, // Whether to run the browser in headless mode ('new') or show the browser window (false)
  slowMo: 1, // Slows down Puppeteer operations by the specified amount of milliseconds (useful for debugging)
  devtools: false, // Whether to enable DevTools in the browser
  defaultViewport: { width: 1300, height: 900 }, // Sets the initial page viewport. Set to `null` to use the default (800x600).
  args: [
    "--start-maximized",
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-gpu",
    "--disable-dev-shm-usage",
    "--disable-infobars",
    "--window-size=1920,1080",
    "--lang=pt-BR,pt",
  ],
};

async function theBetCrawler() {
  let browser;
  let page;
  let context;

  try {
    browser = await puppeteerExtra.launch(puppeteerOptions);
    context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();

    //Section 1 - goes to the page
    try {
      console.log("it should open the page");
      await page.goto(process.env.URL);
      await delay(4000);
      await checkBox(page, ".box-image", 3000);
      await waitAndClick(page, ".cookies-button.cookies-accept-button");
    } catch (error) {
      throw new Error("Error in opening the page: ", error);
    }

    //Section 2 - Login
    try {
      console.log("it should login into the account");
      const button = await page.waitForSelector("button.mat-button", {
        text: "Entrar",
      });
      await button.click();

      const loginSelector =
        'input.mat-input-element[formcontrolname="username"]';
      const pwdSelector =
        'input.mat-input-element[formcontrolname="password"][type="password"]';
      const login = process.env.LOGIN;
      const pwd = process.env.LOGIN_PWD;
      await waitAndType(page, loginSelector, login);
      await waitAndType(page, pwdSelector, pwd);

      await waitAndClick(page, 'button.confirm.mat-button[type="submit"]');
      await page.waitForSelector(
        "button.vertical-button.mat-menu-trigger[mat-button]"
      );

      console.log("The login was successful");
    } catch (error) {
      throw new Error("Error in logging in: ", error);
    }

    //Section 3 - Scraping games and validating
    try {
      const team = "palmeiras";

      // Clicks on search icon
      await waitAndClick(page, 'mat-icon.btn-search[role="img"]');
      // Waits for the input and type team name
      await waitAndType(
        page,
        'input.mat-autocomplete-trigger.mat-input-element[role="combobox"]',
        team
      );
      // Clicks on the first option of the dropdown
      await waitAndClick(page, "#mat-option-0");

      // Get the text content from the <div> element
      const divElement = await page.waitForSelector(
        "div.event-date.ng-star-inserted"
      );

      const divContent = await page.evaluate(
        (el) => el.textContent,
        divElement
      );

      // Extract the date using string manipulation
      const parts = divContent.trim().split(" ");
      const matchDate = parts[0];
      const matchTime = parts[1];

      const currentDate = getDate();
      console.log(
        `The current date is ${currentDate} and it should be equal to the game date, that is: ${matchDate} and game time: ${matchTime}`
      );

      // Fail fast
      if (currentDate !== matchDate) {
        console.log("Game date does not match current date.");
        throw new Error(`Script halted due to validation mismatch`);
      }


      //Check if team is home or away
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
          break; // Exit the loop as soon as the team is found
        }
      }

      if (teamPosition !== null) {
        const teamType = teamPosition === 0 ? "Home Team" : "Away Team";
        console.log(
          `Team found: ${team}/${teamName}, at position: ${teamPosition} (${teamType})`
        );
      } else {
        console.log(`Team ${team} not found.`);
      }

      console.log("Match validation ok");
    } catch (error) {
      throw new Error(error);
    }

    //Section 4 - Placing the bet on a single game
    // Choose a bet between home, away, both teams to score and double chance
    //await betTypeHomeAwayBothDouble(page, 'Casa')

    // Choose a bet between over or under goals
    //await betTypeOverUnder(page, '+1.5')

    //await confirmMultipleBet(page, '3')

    

    await delay(5000);

  } catch (error) {
    console.log("Error:", error);
  } finally {
    if (browser) {
      console.log("Browser closed successfully.");
      await browser.close();
    }
  }
}

theBetCrawler();
