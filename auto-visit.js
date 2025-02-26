const puppeteer = require('puppeteer');

(async () => {
    while (true) {
        console.log("Starting browser...");
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        // Load cookies from environment variable
        const cookiesEnv = process.env.COOKIES;  // Make sure COOKIES is set in Render

        if (!cookiesEnv) {
            console.log("No saved cookies found in ENV. Set the COOKIES environment variable.");
            process.exit(1);
        }

        try {
            const cookies = JSON.parse(cookiesEnv);
            await page.setCookie(...cookies);
        } catch (error) {
            console.log("Error parsing cookies:", error);
            process.exit(1);
        }

        await page.goto('https://optiklink.com/', { waitUntil: 'networkidle2' });

        console.log('Visited successfully! Staying on the page for 2 minutes...');
        await new Promise(resolve => setTimeout(resolve, 2 * 60 * 1000));

        await browser.close();
        console.log('Browser closed. Waiting 12 hours before next visit...');
        
        await new Promise(resolve => setTimeout(resolve, 12 * 60 * 60 * 1000));
    }
})();