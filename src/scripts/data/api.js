const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

export const API_BASE_URL = isLocal ? "http://localhost:5000" : "https://telco-app-production.up.railway.app";

function getAuthHeaders() {
  const userId = localStorage.getItem("user_id");
  return {
    'Content-Type': 'application/json',
    'X-User-ID': userId 
  };
}

export async function login(email, password) {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return res.json();
}

export async function registerUser(name, email, phone) {
  const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, phone })
  });
  return res.json();
}

export async function verifyOtp(email, otp) {
  const res = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp })
  });
  return res.json();
}

export async function resendOtp(email) {
  const res = await fetch(`${API_BASE_URL}/api/auth/resend-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  return res.json();
}

export async function completeRegistration(email, password, confirm_password) {
  const res = await fetch(`${API_BASE_URL}/api/auth/complete-registration`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, confirm_password })
  });
  return res.json();
}

export async function getAllProducts() {
  const res = await fetch(`${API_BASE_URL}/api/products/`);
  return res.json();
}

export async function getProductDetail(id) {
  const res = await fetch(`${API_BASE_URL}/api/products/${id}`);
  return res.json();
}

export async function getProductsByCategory(category) {
  const res = await fetch(`${API_BASE_URL}/api/products/category/${category}`);
  return res.json();
}

export async function getPromoProducts() {
  const res = await fetch(`${API_BASE_URL}/api/products/promo`);
  return res.json();
}

export async function searchProducts(keyword, minPrice, maxPrice) {
  const params = new URLSearchParams();
  if (keyword) params.append("q", keyword);
  if (minPrice) params.append("min", minPrice);
  if (maxPrice) params.append("max", maxPrice);

  const res = await fetch(`${API_BASE_URL}/api/products/search?${params.toString()}`);
  return res.json();
}

export async function getLastPurchasedProducts(userId) {
  const res = await fetch(`${API_BASE_URL}/api/user/last-bought/${userId}`);
  return res.json();
}

export async function getRecommendationProducts(userId) {
  const res = await fetch(`${API_BASE_URL}/api/products/recommendation/${userId}`, {
    headers: getAuthHeaders() 
  });
  return res.json();
}

export async function getUserStats(userId) {
  const res = await fetch(`${API_BASE_URL}/api/user/stats/${userId}`);
  return res.json();
}

export async function getUserActiveQuotas(userId) {
  const res = await fetch(`${API_BASE_URL}/api/user/quotas/${userId}`);
  return res.json();
}

export async function completeProfile(user_id, device_brand, plan_type) {
  const res = await fetch(`${API_BASE_URL}/api/user/complete-profile`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id, device_brand, plan_type }),
  });
  return res.json();
}

export async function getAllRewards() {
  const res = await fetch(`${API_BASE_URL}/api/rewards/`);
  return res.json();
}

export async function getRewardDetail(id) {
  const res = await fetch(`${API_BASE_URL}/api/rewards/${id}`);
  return res.json();
}

export async function getUserPoints() {
  const res = await fetch(`${API_BASE_URL}/api/rewards/points`, {
    headers: getAuthHeaders()
  });
  return res.json();
}

export async function redeemReward(rewardId) {
  const res = await fetch(`${API_BASE_URL}/api/rewards/redeem`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ reward_id: rewardId })
  });
  return res.json();
}

export async function getDailyCheckInStatus() {
  const res = await fetch(`${API_BASE_URL}/api/rewards/daily-status`, {
    headers: getAuthHeaders()
  });
  return res.json();
}

export async function claimDailyCheckIn() {
  const res = await fetch(`${API_BASE_URL}/api/rewards/daily-claim`, {
    method: 'POST',
    headers: getAuthHeaders()
  });
  return res.json();
}

export async function purchaseProduct(userId, productId) {
  const res = await fetch(`${API_BASE_URL}/api/purchase/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId, product_id: productId }),
  });
  return res.json();
}

export async function topUpBalance(userId, amount, method) {
  const res = await fetch(`${API_BASE_URL}/api/purchase/topup`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-User-ID': userId
    },
    body: JSON.stringify({ amount, method })
  });
  return res.json();
}

export async function getUserNotifications(userId) {
  const res = await fetch(`${API_BASE_URL}/api/notifications/`, {
    headers: {
        'Content-Type': 'application/json',
        'X-User-ID': userId
    }
  });
  return res.json();
}

export async function markNotificationsRead(userId) {
  const res = await fetch(`${API_BASE_URL}/api/notifications/mark-read`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-User-ID': userId
    }
  });
  return res.json();
}

export async function useQuotaSimulation(amount) {
  const userId = localStorage.getItem("user_id");

  const res = await fetch(`${API_BASE_URL}/api/simulation/use-quota`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-User-ID": userId
    },
    body: JSON.stringify({ amount })
  });

  return res.json();
}

export async function simulateUserProfileUpdate(userId, profileData) {
  const res = await fetch(`${API_BASE_URL}/api/simulation/update-profile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-User-ID": userId
    },
    body: JSON.stringify({ 
        user_id: userId,
        ...profileData 
    })
  });
  return res.json();
}