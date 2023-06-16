//const puppeteer = require('puppeteer')
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const randomUseragent = require('random-useragent')
const request = require('request')
//const userAgent = require('user-agents');
const {waitAndClick, waitAndType, sleep} = require('../lib/helpers')
const { executablePath } = require("puppeteer"); 
const { url, apiKey } = require('../config');
const {bypass} = require('../bypass')



///Enable stealth mode
puppeteer.use(StealthPlugin())

const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36';


describe("The Bet Crawler", () => {
  let page
  let browser
  let userAgent
  let UA
  
  before(async () => {

    browser = await puppeteer.launch({
      headless: false,
      executablePath: executablePath() || 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      slowMo: 10,
      devtools: false,
      defaultViewport: null,
      args: [
        "--start-maximized",
        "--no-sandbox",
        "--disabel-setui-sandbox",
        "--disable-web-security",
        "--incognito",
      ],
    });

     //Randomize User agent or Set a valid one
     userAgent = randomUseragent.getRandom();
     UA = userAgent || USER_AGENT;
     const context = await browser.createIncognitoBrowserContext()
     page = await context.newPage();

    //Randomize viewport size
    await page.setViewport({
      width: 1920 + Math.floor(Math.random() * 100),
      height: 3000 + Math.floor(Math.random() * 100),
      deviceScaleFactor: 1,
      hasTouch: false,
      isLandscape: false,
      isMobile: false,
    });

    await page.setUserAgent(UA);
    await page.setJavaScriptEnabled(true);
    await page.setDefaultNavigationTimeout(0);
    
    await page.evaluateOnNewDocument(() => {
      // Pass webdriver check
      Object.defineProperty(navigator, 'webdriver', {
        get: () => false,
      });
    });

    await page.evaluateOnNewDocument(() => {
      // Pass chrome check
      window.chrome = {
        runtime: {},
        // etc.
      };
    });

    await page.evaluateOnNewDocument(() => {
      //Pass notifications check
      const originalQuery = window.navigator.permissions.query;
      return window.navigator.permissions.query = (parameters) => (
        parameters.name === 'notifications' ?
          Promise.resolve({ state: Notification.permission }) :
          originalQuery(parameters)
      );
    });

    await page.evaluateOnNewDocument(() => {
      // Overwrite the `plugins` property to use a custom getter.
      Object.defineProperty(navigator, 'plugins', {
        // This just needs to have `length > 0` for the current test,
        // but we could mock the plugins too if necessary.
        get: () => [1, 2, 3, 4, 5],
      });
    });

    await page.evaluateOnNewDocument(() => {
      // Overwrite the `languages` property to use a custom getter.
      Object.defineProperty(navigator, 'languages', {
        get: () => ['pt-BR', 'pt'],
      });
    });

    // Mock date
    browser.on('targetchanged', async target => {
      const targetPage = await target.page();
      const client = await targetPage.target().createCDPSession();
      await client.send('Runtime.evaluate', {
        expression: `Date.now = function() { return 0; }`
      });
    });

    //page = await browser.newPage()
    //await page.setUserAgent(random_useragent.getRandom())
    //await page.setUserAgent(userAgent.random().toString())
    //await page.setDefaultTimeout(10000)
    //await page.setDefaultNavigationTimeout(20000)
  })

  after(async () => {
    //browser.close()
  })

  it('Should open the browser...', async () => {
    await page.goto(url, { waitUntil: 'networkidle2',timeout: 0 } );
    await page.waitForSelector('.sb-modal__body')
    await page.keyboard.press('Escape')
    return page;
  })

  it('Should login into account...', async () => {

    const usernameLogin = 'test'
    //const passwordLogin = ''

    const loginBtn = '.GTM-login'
    const usernameId = '#username'
    

    
    await sleep(2)
    await waitAndClick(page, loginBtn)
    await sleep(5)

    


    //await new Promise(r => setTimeout(r, 100000))


    //await waitAndType(page, usernameId, usernameLogin)
  })
})