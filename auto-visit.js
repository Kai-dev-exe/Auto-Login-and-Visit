const puppeteer = require("puppeteer");

// ✅ Debugging - Check environment variable
console.log("Type of COOKIES:", typeof process.env.COOKIES);
console.log("Raw COOKIES from env:", process.env.COOKIES);

let cookies;
try {
    // Ensure it's parsed only once
    if (typeof process.env.COOKIES === "string") {
        cookies = JSON.parse(process.env.COOKIES);
    } else {
        cookies = process.env.COOKIES; // Already parsed
    }
    console.log("✅ Parsed Cookies:", cookies);
} catch (error) {
    console.error("❌ Failed to parse cookies:", error);
    process.exit(1);
}

(async () => {
    console.log("Starting browser...");
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // ✅ Only set cookies if correctly parsed
    if (Array.isArray(cookies) && cookies.length > 0) {
        await page.setCookie(...cookies);
        console.log("✅ Cookies applied to browser");
    } else {
        console.log("❌ No valid cookies found. Exiting...");
        process.exit(1);
    }

    await page.goto("https://optiklink.com", { waitUntil: "networkidle2", timeout: 60000 });

    console.log("Visited successfully! Staying on the page for 2 minutes...");
    await new Promise(resolve => setTimeout(resolve, 2 * 60 * 1000));

    await browser.close();
    console.log("Browser closed.");

    console.log("Waiting 12 hours before next visit...");
    await new Promise(resolve => setTimeout(resolve, 12 * 60 * 60 * 1000));
})();