const puppeteer = require('puppeteer');
const puppeteerExtra = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const {
  delay,
  
} = require("./helpers/helpers");

// Register the Stealth plugin
puppeteerExtra.use(StealthPlugin());

const puppeteerOptions = {
  headless: false, // Whether to run the browser in headless mode ('new') or show the browser window (false)
  slowMo: 10, // Slows down Puppeteer operations by the specified amount of milliseconds (useful for debugging)
  devtools: false, // Whether to enable DevTools in the browser
  defaultViewport: { width: 1200, height: 800 }, // Sets the initial page viewport. Set to `null` to use the default (800x600).
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
    browser = await puppeteer.launch(puppeteerOptions);
    context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();

    //Section 1 - goes to the page
    try {
      console.log("it should open the page")
      await page.goto(
        "https://www.betpremium.io/home/events-area"
      );
      await delay(4000)
      
    } catch (error) {
      
    }



  } catch (error) {
    console.log("Error:", error)
  } finally {
    if (browser) {
      console.log("Browser closed successfully.");
      await browser.close();
    }
  }


}


theBetCrawler()