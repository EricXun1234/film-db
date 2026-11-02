// Run: node tests/member.test.cjs. Mock HTTP only; never contacts the real backend.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname,'..');
const config = fs.readFileSync(path.join(root,'member-config.js'),'utf8');
const api = fs.readFileSync(path.join(root,'member-api.js'),'utf8');
function context(response) {
  const calls = [];
  const c = { AbortController, setTimeout, clearTimeout };
  c.window = c;
  c.fetch = async (url,options) => {
    calls.push({ url, options, body: JSON.parse(options.body) });
    return { status:response.status, ok:response.status>=200&&response.status<300, json:async()=>response.data };
  };
  vm.createContext(c); vm.runInContext(config,c); vm.runInContext(api,c);
  return { c, calls };
}
(async () => {
  let count = 0;
  const good = context({status:200,data:{ok:true,user:{username:'test'},token:'mock-token'}});
  const data = await good.c.MoodlumaMemberAPI.login({username:'test',password:'test-only-password'});
  assert.equal(data.token,'mock-token'); count++;
  assert(good.calls[0].url.endsWith('/api/auth/login')); count++;
  assert.equal(good.calls[0].options.method,'POST'); count++;
  assert.deepEqual(good.calls[0].body,{username:'test',password:'test-only-password'}); count++;
  assert.equal(good.calls[0].options.headers.Authorization,undefined); count++;
  assert.equal(good.calls[0].options.referrerPolicy,'no-referrer'); count++;
  const missing = context({status:200,data:{ok:true,user:{username:'test'}}});
  await assert.rejects(()=>missing.c.MoodlumaMemberAPI.login({username:'test',password:'x'}),/登入憑證/); count++;
  const wrong = context({status:401,data:{ok:false,error:'帳號或密碼錯誤'}});
  await assert.rejects(()=>wrong.c.MoodlumaMemberAPI.login({username:'test',password:'x'}),/帳號或密碼錯誤/); count++;
  const forgot = context({status:200,data:{ok:true}});
  await forgot.c.MoodlumaMemberAPI.requestReset('test@example.test');
  assert(forgot.calls[0].url.endsWith('/api/auth/forgot-password')); count++;
  assert.deepEqual(forgot.calls[0].body,{email:'test@example.test'}); count++;
  const notReady = context({status:404,data:{}});
  await assert.rejects(()=>notReady.c.MoodlumaMemberAPI.requestReset('test@example.test'),/尚未開放/); count++;
  const expired = context({status:410,data:{ok:false}});
  await assert.rejects(()=>expired.c.MoodlumaMemberAPI.resetPassword('expired','new-password'),/已過期/); count++;
  const reset = context({status:200,data:{ok:true}});
  await reset.c.MoodlumaMemberAPI.resetPassword('mock-token','new-password');
  assert(reset.calls[0].url.endsWith('/api/auth/reset-password')); count++;
  assert.deepEqual(reset.calls[0].body,{token:'mock-token',newPassword:'new-password'}); count++;
  const register = context({status:200,data:{ok:true,user:{username:'test'},token:'registered-token'}});
  await register.c.MoodlumaMemberAPI.register({username:'test',email:'test@example.test',password:'test-only'});
  assert(register.calls[0].url.endsWith('/api/auth/register')); count++;
  const limited = context({status:429,data:{ok:false}});
  await assert.rejects(()=>limited.c.MoodlumaMemberAPI.requestReset('test@example.test'),/太頻繁/); count++;
  console.log(count + ' member API checks passed.');
})().catch(error=>{ console.error(error); process.exitCode=1; });
