const puppeteer = require("puppeteer");
const puppeteerExtra = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const {
  delay,
  waitAndClick,
  checkBox,
  waitAndType,
  getDate,
  scrapeAndValidate,
  takeScreenshot
} = require("./helpers/helpers");
const {
  betTypeHomeAwayBothDouble,
  confirmMultipleBet,
  betTypeOverUnder,
} = require("./helpers/betTypes");
const { multipleBet } = require('./helpers/multipleBet')
require("dotenv").config();

// Register the Stealth plugin
puppeteerExtra.use(StealthPlugin());

const puppeteerOptions = {
  headless: false, // Whether to run the browser in headless mode ('new') or show the browser window (false)
  slowMo: 50, // Slows down Puppeteer operations by the specified amount of milliseconds (useful for debugging)
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

async function theBetCrawler(bets) {
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
    // variables - page, team,
    for (const bet of bets) {
      const {selectedBets, betAmount} = bet
      const betAmountString = betAmount.toString();
      
      await multipleBet(page, selectedBets, betAmountString); // Pass the current object as an argument to multipleBet
      
    }
    


  } catch (error) {
    console.log("Error:", error);
  } finally {
    if (browser) {
      console.log("Browser closed successfully.");
      await browser.close();
    }
  }
}

//theBetCrawler();

module.exports = theBetCrawler
