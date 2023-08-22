

exports.delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

exports.waitAndClick = async (page, selector) => {
  try {
    await page.waitForSelector(selector)
    await page.click(selector)
  } catch (error) {
    console.log('Error:', error)
  }
}

exports.checkBox = async (page, selector, timeout) => {
  try {
    await page.waitForSelector(selector, { timeout });
    console.log('Selector appeared on screen.');
    await page.keyboard.press('Escape');
  } catch (error) {
    if (error.name === 'TimeoutError') {
      console.log('Selector did not appear within the timeout.');
    } else {
      console.error('An error occurred:', error);
    }
  }
}

exports.waitAndType = async (page, selector, text) => {
  try {
    await page.waitForSelector(selector);
    await page.focus(selector)
    await page.keyboard.type(text);
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

exports.getDate = () => {
  const currentDate = new Date();

  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1; // Month is 0-based, so add 1
  const year = currentDate.getFullYear() % 100; // Get last two digits of the year

  // Format numbers with leading zeros if needed
  const formattedDay = day.toString().padStart(2, '0');
  const formattedMonth = month.toString().padStart(2, '0');
  const formattedYear = year.toString().padStart(2, '0');

  const formattedDate = `${formattedDay}/${formattedMonth}/${formattedYear}`;
  console.log('Current Date:', formattedDate);
  return formattedDate
}