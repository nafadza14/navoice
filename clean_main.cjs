const fs = require('fs');
let js = fs.readFileSync('main.js', 'utf8');

js = js.replace(/    "btn-pricing-free",\n/g, '');
js = js.replace(/    "btn-pricing-pro",\n/g, '');
js = js.replace(/    "btn-pricing-enterprise",\n/g, '');
js = js.replace(/Pricing, /g, '');

fs.writeFileSync('main.js', js);
