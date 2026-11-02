(function (root) {
  'use strict';
  const config = root.MOODLUMA_MEMBER_CONFIG;
  async function post(path, body, kind) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), config.timeoutMs || 45000);
    try {
      const response = await fetch(config.baseUrl + path, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body), signal: controller.signal,
        cache: 'no-store', credentials: 'omit', referrerPolicy: 'no-referrer'
      });
      let data = null;
      try { data = await response.json(); } catch (_) {}
      if (response.status === 429) throw new Error('操作太頻繁，請稍後再試。');
      if (response.status === 404 || response.status === 501) throw new Error('此服務目前尚未開放，請稍後再試或聯絡客服。');
      if (kind === 'reset' && [400,401,403,410].includes(response.status)) {
        throw new Error('重設連結無效、已使用或已過期，請重新申請。');
      }
      if (!response.ok || !data || data.ok !== true) {
        const fallback = kind === 'login' ? '登入失敗，請確認帳號與密碼。' : '操作失敗，請稍後再試。';
        throw new Error(data && typeof data.error === 'string' ? data.error : fallback);
      }
      return data;
    } catch (error) {
      if (error.name === 'AbortError') throw new Error('伺服器回應逾時，請稍後再試。');
      if (error instanceof TypeError) throw new Error('無法連線伺服器，請確認網路後再試。');
      throw error;
    } finally { clearTimeout(timer); }
  }
  function requireSession(data) {
    if (!data.user || typeof data.user.username !== 'string' || !data.user.username.trim()
      || typeof data.token !== 'string' || !data.token.trim()) {
      throw new Error('未取得有效登入憑證，請稍後重新登入。');
    }
    return data;
  }
  root.MoodlumaMemberAPI = Object.freeze({
    login: async body => requireSession(await post(config.loginPath, body, 'login')),
    register: async body => requireSession(await post(config.registerPath, body, 'register')),
    requestReset: email => post(config.forgotPasswordPath, { email }, 'forgot'),
    resetPassword: (token, newPassword) => post(config.resetPasswordPath, { token, newPassword }, 'reset')
  });
})(typeof window !== 'undefined' ? window : globalThis);
