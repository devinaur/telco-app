import HomePage from "../pages/home/home-page.js";
import BeliPage from "../pages/beli/beli-page.js";
import BeliDetailPage from "../pages/beli/beli-detail-page.js";
import RewardPage from "../pages/reward/reward-page.js";
import RewardDetailPage from "../pages/reward/reward-detail-page.js";
import DailyCheckInPage from "../pages/reward/daily-checkin-page.js";
import QuotaPage from "../pages/quota/quota-page.js";
import SearchPage from "../pages/search/search-page.js";
import LoginPage from "../pages/auth/login-page.js";
import RegisterPage from "../pages/auth/register-page.js";
import OtpPage from "../pages/auth/otp-page.js";
import PasswordPage from "../pages/auth/password-page.js";
import TopupPage from "../pages/topup/topup-page.js";
import CompleteProfilePage from "../pages/auth/complete-profile-page.js";
import SimulationPage from "../pages/simulation/simulation-page.js";

const routes = {
  "/": new HomePage(),
  "/beli": new BeliPage(),
  "/beli-detail/:id": BeliDetailPage,
  "/reward": RewardPage,
  "/reward-detail/:id": RewardDetailPage,
  "/daily-checkin": DailyCheckInPage,
  "/quota": QuotaPage,
  "/search": SearchPage,
  "/login": LoginPage,
  "/register": RegisterPage,
  "/otp": OtpPage,
  "/password-setup": PasswordPage,
  "/complete-profile": CompleteProfilePage,
  "/topup": new TopupPage(),
  "/simulation": new SimulationPage(),
};

export default routes;