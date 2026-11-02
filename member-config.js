// 登入／註冊沿用舊雲端版 API；忘記密碼兩個端點需由後端實作並核對規格。
window.MOODLUMA_MEMBER_CONFIG = Object.freeze({
  baseUrl: 'https://filmdb-68z4.onrender.com',
  loginPath: '/api/auth/login',
  registerPath: '/api/auth/register',
  forgotPasswordPath: '/api/auth/forgot-password',
  resetPasswordPath: '/api/auth/reset-password',
  timeoutMs: 45000
});
