const puppeteer = require('puppeteer');

(async () => {
    while (true) {
        console.log("Starting browser...");
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        // Read cookies from environment variable
        const cookiesEnv = process.env.COOKIES;
        if (!cookiesEnv) {
            console.error("No cookies found in environment variables!");
            process.exit(1);
        }

        try {
            // Parse the double-encoded JSON
            const cookies = JSON.parse(JSON.parse(cookiesEnv));
            await page.setCookie(...cookies);
            console.log("Cookies loaded successfully!");
        } catch (error) {
            console.error("Error parsing cookies:", error);
            process.exit(1);
        }

        // Visit the site
        await page.goto('https://optiklink.com/', { waitUntil: 'networkidle2' });
        console.log('Visited successfully! Staying on the page for 2 minutes...');

        // Wait for 2 minutes
        await new Promise(resolve => setTimeout(resolve, 2 * 60 * 1000));

        await browser.close();
        console.log('Browser closed.');

        console.log('Waiting 12 hours before next visit...');
        await new Promise(resolve => setTimeout(resolve, 12 * 60 * 60 * 1000));
    }
})();