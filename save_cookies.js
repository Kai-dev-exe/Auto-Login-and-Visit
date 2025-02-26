const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({ headless: false }); // Open browser for manual login
    const page = await browser.newPage();
    
    const cookiesFilePath = 'cookies.json';

    console.log("Opening login page...");
    await page.goto('https://optiklink.com/auth', { waitUntil: 'domcontentloaded' });

    console.log("Please log in manually... You have 2 minutes.");
    
    // Increased wait time from 30 seconds to 120 seconds (2 minutes)
    await new Promise(resolve => setTimeout(resolve, 120000)); // 120,000ms = 2 minutes

    // Save cookies after login
    const cookies = await page.cookies();
    fs.writeFileSync(cookiesFilePath, JSON.stringify(cookies, null, 2));

    console.log("Cookies saved successfully! You can now automate future logins.");
    await browser.close();
})();
