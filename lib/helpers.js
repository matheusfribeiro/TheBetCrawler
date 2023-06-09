module.exports = {
  waitAndClick: async function (page, selector) {
    try {
      await page.waitForSelector(selector)
      await page.click(selector)
    } catch (error) {
      throw new Error(`Could not click on selector: ${selector}`)

    }

  },

  getText: async function (page, selector) {
    try {
      await page.waitForSelector(selector)
      return await page.$eval(selector, element => element.innerHTML)
    } catch (error) {
      throw new Error(`Cannot get text from selector: ${selector}`)
    }
  },

  waitAndType: async function (page, selector, text) {
    try {
      await page.waitForSelector(selector)
      await page.type(selector, text)
    } catch (error) {
      throw new Error(`Could not type into selector: ${selector}`)
    }
  },

  waitForText: async function (page, selector, text) {
    try {
      await page.waitForSelector(selector)
      await page.waitForFunction((selector, text) => {
        document.querySelector(selector).innerText.includes(text), 
          {}, 
          selector, 
          text

      })
    } catch (error) {
      throw new Error(`Text: ${text} not found for selector: ${selector}`)
    }
  },

  
}