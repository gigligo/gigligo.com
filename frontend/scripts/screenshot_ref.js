const puppeteer = require('puppeteer');

(async () => {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 1080 });

    console.log('Navigating to https://qazqaz.framer.website ...');
    await page.goto('https://qazqaz.framer.website', { waitUntil: 'networkidle2' });

    console.log('Extracting styles...');
    const designSystem = await page.evaluate(() => {
        const bodyStyle = window.getComputedStyle(document.body);

        // Find main typography
        const heading = document.querySelector('h1, h2');
        const headingStyle = heading ? window.getComputedStyle(heading) : null;

        // Try to get primary colors from buttons
        const button = document.querySelector('button, .framer-button, a');
        const buttonStyle = button ? window.getComputedStyle(button) : null;

        return {
            body: {
                fontFamily: bodyStyle.fontFamily,
                backgroundColor: bodyStyle.backgroundColor,
                color: bodyStyle.color
            },
            heading: headingStyle ? {
                fontFamily: headingStyle.fontFamily,
                fontSize: headingStyle.fontSize,
                fontWeight: headingStyle.fontWeight,
                color: headingStyle.color
            } : null,
            button: buttonStyle ? {
                backgroundColor: buttonStyle.backgroundColor,
                color: buttonStyle.color,
                borderRadius: buttonStyle.borderRadius
            } : null
        };
    });

    console.log(JSON.stringify(designSystem, null, 2));

    const screenshotPath = '/Users/Apple/Documents/gigligo.com/qazqaz_ref.png';
    console.log('Taking screenshot...');
    await page.screenshot({ path: screenshotPath, fullPage: true });

    console.log('Screenshot saved to ' + screenshotPath);
    await browser.close();
})();
