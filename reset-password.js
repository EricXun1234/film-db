(function () {
  'use strict';
  // Read and remove the token before any request. Do not persist it in browser storage.
  const fragment = new URLSearchParams(location.hash.slice(1));
  const query = new URLSearchParams(location.search);
  let token = fragment.get('token') || query.get('token') || '';
  query.delete('token');
  fragment.delete('token');
  history.replaceState(null, '', location.pathname + (query.toString() ? '?' + query : '') + (fragment.toString() ? '#' + fragment : ''));
  const form = document.getElementById('resetPasswordForm');
  const password = document.getElementById('newPassword');
  const confirmation = document.getElementById('confirmPassword');
  const button = document.getElementById('savePassword');
  const message = document.getElementById('resetResult');
  let busy = false;
  function show(text, error) {
    message.textContent = text;
    message.className = 'reset-message ' + (error ? 'error' : 'success');
  }
  if (!token) {
    button.disabled = true;
    show('此連結缺少重設憑證，請返回首頁重新申請重設密碼。', true);
  }
  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    if (busy || !token) return;
    if (password.value.length < 6) { show('新密碼至少需要 6 個字元。', true); return; }
    if (password.value !== confirmation.value) { show('兩次輸入的新密碼不一致。', true); return; }
    busy = true; button.disabled = true; button.textContent = '更新中…';
    let succeeded = false;
    try {
      await MoodlumaMemberAPI.resetPassword(token, password.value);
      succeeded = true; token = ''; form.reset();
      try {
        localStorage.removeItem('moodluma-auth-token');
        localStorage.removeItem('moodluma-current-user');
      } catch (_) { /* Password already changed; storage access is optional here. */ }
      password.disabled = true; confirmation.disabled = true;
      show('密碼已更新，請返回首頁使用新密碼登入。', false);
    } catch (error) {
      show(error.message || '目前無法更新密碼，請稍後再試。', true);
    } finally {
      busy = false; button.disabled = succeeded;
      button.textContent = succeeded ? '密碼已更新' : '設定新密碼';
    }
  });
})();
