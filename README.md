# Shwapno AutoScraper (Node.js)

A simple **Node.js + Selenium** based automation and scraping tool for **Shwapno.com**.

This script opens the website, lets you log in using OTP, searches for a product, scrapes product details (name, price, link), and saves everything into a clean **CSV file**.

---

## 🚀 Features

* Manual OTP-based login support
* Automated product search
* Scrapes all valid products from search results
* Skips empty or fake product cards
* Saves data into a structured `products.csv` file
* Easy to understand and modify

---

## 🛠️ Tools & Libraries

* **Node.js**
* **Selenium WebDriver**
* **ChromeDriver**
* **csv-writer**

---

## ⚙️ Installation

### 1️⃣ Clone the repository

```bash
git clone <repo-url>
cd <repo-folder>
```

### 2️⃣ Install dependencies

```bash
npm install selenium-webdriver chromedriver csv-writer
```

Make sure **Google Chrome** is installed on your system.

---

## ▶️ Usage

Run the script using:

```bash
node scraper.js
```

### Steps after running:

1. The browser will open **shwapno.com**
2. Enter your **phone number and OTP manually**
3. The script will automatically:

   * Search for the product (example: `rice`)
   * Scrape product name, price, and link
   * Save results to `products.csv`

---

## 📄 Output

All scraped product data is saved in:

```
products.csv
```

### Example format:

| sl | product_name | price | product_url |
| -- | ------------ | ----- | ----------- |
| 1  | Rice Brand A | ৳150  | https://... |
| 2  | Rice Brand B | ৳120  | https://... |

---

## ⚠️ Notes

* OTP login **must be done manually**
* Script uses **explicit waits** to handle dynamic page loading
* Designed for learning, testing, and personal automation
* Can be extended for pagination, headless mode, or cloud deployment (AWS)

---

## 📌 License

This project is for **learning and personal use only**.
