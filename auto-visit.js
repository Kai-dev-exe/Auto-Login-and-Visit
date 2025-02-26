const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    while (true) {
        const browser = await puppeteer.launch({ headless: true }); // Runs in the background
        const page = await browser.newPage();

        const cookiesFilePath = 'cookies.json';

        // Load saved cookies
        if (fs.existsSync(cookiesFilePath)) {
            const cookies = JSON.parse(fs.readFileSync(cookiesFilePath, 'utf8'));
            await page.setCookie(...cookies);
        } else {
            console.log("No saved cookies found. Please run save_cookies.js first.");
            process.exit(1);
        }

        // Visit the required page
        await page.goto('https://optiklink.com/', { waitUntil: 'networkidle2' });

        console.log('Visited successfully! Staying on the page for 2 minutes...');

        // Stay on the page for 2 minutes (120,000 milliseconds)
        await new Promise(resolve => setTimeout(resolve, 2 * 60 * 1000));

        await browser.close();
        console.log('Browser closed.');

        console.log('Waiting 12 hours before next visit...');
        
        // Wait for 12 hours (12 * 60 * 60 * 1000 milliseconds)
        await new Promise(resolve => setTimeout(resolve, 12 * 60 * 60 * 1000));
    }
})();
