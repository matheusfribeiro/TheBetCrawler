const path = require('path');
const fs = require('fs');
const archiver = require('archiver');
const theBetCrawler = require('../crawler/crawler');

exports.postCrawler = async (req, res, next) => {
  const data = req.body
  console.log(data)
  //console.log(data[0])

  try {
    await theBetCrawler(data);
    
    res.status(200).send('Bot processing completed.');
  } catch (error) {
    console.error('Bot error:', error);
    res.status(500).send('Bot encountered an error.');
  }
  
}

exports.getDownloadScreenshots = (req, res, next) => {

  const currentDate = new Date();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is zero-based
  const day = String(currentDate.getDate()).padStart(2, '0');

  const screenshotDirectory = path.join(__dirname, `../screenshots/${day}${month}`); // Update with the actual path to your screenshots directory
  console.log('screenshotdirectory', screenshotDirectory)

  // Check if the screenshots directory exists
  if (!fs.existsSync(screenshotDirectory)) {
    return res.status(404).send('Screenshots directory not found.');
  }

  // Create a ZIP archive
  const archive = archiver('zip', {
    zlib: { level: 9 }, // Set compression level
  });

  // Pipe the archive to a writable stream (in this case, the response)
  archive.pipe(res);

  // Append all files from the screenshot directory to the archive
  archive.directory(screenshotDirectory, false);

  // Finalize the archive
  archive.finalize();

  res.attachment('screenshots.zip'); // Set the download filename
}