const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Sleep function to avoid nesting timeouts
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
    while (true) {
        try {
            console.log("Starting browser...");
            const browser = await puppeteer.launch({
                headless: true, 
                args: [
                    "--no-sandbox",
                    "--disable-setuid-sandbox",
                    "--disable-dev-shm-usage",
                    "--disable-gpu",
                    "--single-process"
                ]
            });

            const page = await browser.newPage();

            // Path to the cookies file
            const cookiesFilePath = path.join(__dirname, 'cookies.json');

            // Load saved cookies
            if (fs.existsSync(cookiesFilePath)) {
                try {
                    const cookies = JSON.parse(fs.readFileSync(cookiesFilePath, 'utf8'));
                    await page.setCookie(...cookies);
                } catch (error) {
                    console.error("Error reading cookies.json:", error);
                    await browser.close();
                    console.log("Exiting process due to invalid cookies.");
                    process.exit(1);
                }
            } else {
                console.log("No saved cookies found. Please run save_cookies.js first.");
                process.exit(1);
            }

            // Visit the required page
            console.log("Visiting site...");
            await page.goto('https://optiklink.com/', { waitUntil: 'networkidle2' });

            console.log('Visited successfully! Staying on the page for 2 minutes...');
            await sleep(2 * 60 * 1000); // Wait for 2 minutes

            await browser.close();
            console.log('Browser closed.');

            console.log('Waiting 12 hours before next visit...');
            await sleep(12 * 60 * 60 * 1000); // Wait for 12 hours

        } catch (error) {
            console.error("An error occurred:", error);
            console.log("Restarting in 30 minutes...");
            await sleep(30 * 60 * 1000); // Wait 30 minutes before retrying
        }
    }
})();