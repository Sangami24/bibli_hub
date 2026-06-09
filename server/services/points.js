// Points calculation based on Category × Condition
const POINTS_MAP = {
  competitive: { new: 20, like_new: 17, good: 14, fair: 10 },
  textbook:    { new: 15, like_new: 13, good: 10, fair: 7 },
  reference:   { new: 15, like_new: 13, good: 10, fair: 7 },
  non_fiction:  { new: 12, like_new: 10, good: 8,  fair: 6 },
  fiction:      { new: 10, like_new: 8,  good: 7,  fair: 5 },
  children:    { new: 10, like_new: 8,  good: 7,  fair: 5 },
  comics:      { new: 8,  like_new: 7,  good: 5,  fair: 4 },
  other:       { new: 8,  like_new: 7,  good: 5,  fair: 4 },
};

// Estimated retail prices (INR) by category for "money saved" calculation
const ESTIMATED_PRICES = {
  competitive: { new: 650, like_new: 600, good: 500, fair: 400 },
  textbook:    { new: 450, like_new: 400, good: 350, fair: 250 },
  reference:   { new: 500, like_new: 450, good: 350, fair: 250 },
  non_fiction:  { new: 400, like_new: 350, good: 300, fair: 200 },
  fiction:      { new: 350, like_new: 300, good: 250, fair: 150 },
  children:    { new: 250, like_new: 200, good: 150, fair: 100 },
  comics:      { new: 300, like_new: 250, good: 200, fair: 120 },
  other:       { new: 300, like_new: 250, good: 200, fair: 120 },
};

function calculatePoints(category, condition) {
  const catMap = POINTS_MAP[category] || POINTS_MAP.other;
  return catMap[condition] || catMap.good;
}

function estimatePrice(category, condition) {
  const catMap = ESTIMATED_PRICES[category] || ESTIMATED_PRICES.other;
  return catMap[condition] || catMap.good;
}

function getEstimatedDeliveryDate() {
  const days = Math.floor(Math.random() * 5) + 3; // 3-7 days
  const date = new Date();
  date.setDate(date.getDate() + days);
  return { days, date: date.toISOString().split('T')[0] };
}

module.exports = { POINTS_MAP, ESTIMATED_PRICES, calculatePoints, estimatePrice, getEstimatedDeliveryDate };
