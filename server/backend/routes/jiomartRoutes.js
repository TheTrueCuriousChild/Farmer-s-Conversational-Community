const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Utility to load mock JioMart data
function loadJioMartTrends() {
  const filePath = path.join(__dirname, '../data/jiomart/trends.json');
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

// Get top trends for retailers (what to buy from farmers)
router.get('/retailer-recommendations', (req, res) => {
  const data = loadJioMartTrends();
  // Suggest top 5 items to buy
  const topItems = data.trends.slice(0, 5);
  res.json({ success: true, recommendations: topItems });
});

// Get price and trend suggestions for farmers
router.get('/farmer-recommendations', (req, res) => {
  const data = loadJioMartTrends();
  // Suggest top 5 items to sell and their avg price
  const topItems = data.trends.slice(0, 5).map(item => ({
    item: item.item,
    avg_price: item.avg_price,
    orders: item.orders,
    category: item.category
  }));
  res.json({ success: true, recommendations: topItems });
});

// Get retailer rankings
router.get('/retailer-rankings', (req, res) => {
  const data = loadJioMartTrends();
  res.json({ success: true, rankings: data.retailer_rankings });
});

// Get farmer rankings
router.get('/farmer-rankings', (req, res) => {
  const data = loadJioMartTrends();
  res.json({ success: true, rankings: data.farmer_rankings });
});

module.exports = router;
