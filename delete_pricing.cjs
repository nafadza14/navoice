const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Remove Desktop Nav link
html = html.replace(/<button class="nav-link" id="nav-pricing" data-view="view-pricing">Pricing<\/button>\n/g, '');

// 2. Remove Mobile Nav link
const mobileNavRegex = /\s*<button class="mobile-nav-link" data-view="view-pricing">[\s\S]*?<\/button>\n/;
html = html.replace(mobileNavRegex, '');

// 3. Remove data-navigate from trust row
html = html.replace(/data-navigate="view-pricing"/g, '');

// 4. Remove the pricing section
const pricingSectionRegex = /\s*<!-- VIEW 4: PRICING \(SaaS Subscription Tiers\) -->\s*<section class="view-panel" id="view-pricing">[\s\S]*?<\/section>\n/;
html = html.replace(pricingSectionRegex, '');

fs.writeFileSync('index.html', html);
