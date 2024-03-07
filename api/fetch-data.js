import puppeteer from 'puppeteer';

export default async (req, res) => {
  try {
    // Launch a headless browser
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set custom headers
    await page.setExtraHTTPHeaders({
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'Accept-Encoding': 'gzip, deflate, br, zstd',
      'Accept-Language': 'en-US,en;q=0.9',
      'Cookie': 'your_cookies_here',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36',
    });

    // Navigate to the URL
    const url = 'https://core-api.prod.blur.io/v1/collections/yogapetz/prices?filters=%7B%22traits%22%3A%5B%5D%2C%22hasAsks%22%3Atrue%7D';
    await page.goto(url, { waitUntil: 'networkidle0' });

    // Get the page content
    const responseBody = await page.evaluate(() => document.body.innerText);
    const jsonResponse = JSON.parse(responseBody);

    // Close the browser
    await browser.close();

    // Send the JSON response back to the client
    res.json(jsonResponse);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
}
