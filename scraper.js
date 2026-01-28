const fs = require("fs");
const { Builder, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const { createObjectCsvWriter } = require("csv-writer");

// ===============================
// Chrome Options
// ===============================
const options = new chrome.Options();
options.addArguments(
  "--disable-blink-features=AutomationControlled",
  "--no-sandbox",
  "--disable-dev-shm-usage",
  "--start-maximized"
);

// ===============================
// Helper: clean price
// ===============================
function cleanPrice(rawPrice) {
  if (!rawPrice) return "N/A";

  const lines = rawPrice.split("\n");
  for (const line of lines) {
    if (line.includes("৳")) return line.trim();
  }
  return rawPrice.trim();
}

(async function scrapeShwapno() {
  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  try {
    // ===============================
    // 1️⃣ Open Website
    // ===============================
    await driver.get("https://www.shwapno.com/");

    // ===============================
    // 2️⃣ Login
    // ===============================
    const loginBtn = await driver.wait(
      until.elementLocated(By.xpath("//button[@aria-label='User login Button']")),
      40000
    );
    await loginBtn.click();

    const phoneInput = await driver.wait(
      until.elementLocated(By.xpath("//input[@type='tel']")),
      40000
    );
    await phoneInput.click();

    console.log("👉 এখন নিজে হাতে Phone Number ও OTP দিয়ে Login করুন");

    // wait until login button disappears
    await driver.wait(
      until.stalenessOf(loginBtn),
      60000
    );

    console.log("🔓 Login successful");

    // ===============================
    // 3️⃣ Product Search
    // ===============================
    const searchInput = await driver.wait(
      until.elementLocated(By.id("search-input")),
      40000
    );

    await searchInput.clear();
    await searchInput.sendKeys("rice", Key.ENTER);

    console.log("🔍 Product search করা হয়েছে");

    // ===============================
    // 4️⃣ Product Grid
    // ===============================
    const productGrid = await driver.wait(
      until.elementLocated(By.id("product-grid")),
      40000
    );

    // ===============================
    // CSV Setup
    // ===============================
    const csvFile = "products.csv";
    const fileExists = fs.existsSync(csvFile);

    const csvWriter = createObjectCsvWriter({
      path: csvFile,
      header: [
        { id: "sl", title: "sl" },
        { id: "product_name", title: "product_name" },
        { id: "price", title: "price" },
        { id: "product_url", title: "product_url" }
      ],
      append: fileExists
    });

    // ===============================
    // 5️⃣ Scrape Products
    // ===============================
    const products = await productGrid.findElements(
      By.xpath(".//div[contains(@class,'product-box')]")
    );

    console.log(`\n🛒 Total Raw Boxes Found: ${products.length}\n`);

    let validCount = 0;
    const records = [];

    for (const product of products) {
      const titleLinks = await product.findElements(
        By.xpath(".//div[contains(@class,'product-box-title')]//a")
      );

      if (!titleLinks.length) continue;

      const titleEl = titleLinks[0];
      const name = (await titleEl.getText()).trim();
      const link = await titleEl.getAttribute("href");

      const priceEls = await product.findElements(
        By.xpath(".//div[contains(@class,'product-price')]")
      );

      const rawPrice = priceEls.length ? await priceEls[0].getText() : "";
      const price = cleanPrice(rawPrice);

      validCount++;

      console.log(`🔹 Product ${validCount}`);
      console.log(`   📦 Name  : ${name}`);
      console.log(`   💰 Price : ${price}`);
      console.log(`   🔗 Link  : ${link}`);
      console.log("-".repeat(50));

      records.push({
        sl: validCount,
        product_name: name,
        price,
        product_url: link
      });
    }

    if (records.length) {
      await csvWriter.writeRecords(records);
    }

    console.log(`\n✅ Total Valid Products Saved: ${validCount}`);
    console.log("📁 products.csv file updated successfully");

  } catch (err) {
    console.error("❌ Error:", err);
  }


  
  // keep browser open for manual inspection
  // finally { await driver.quit(); }
})();
