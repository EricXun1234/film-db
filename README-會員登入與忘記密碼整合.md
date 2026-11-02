# Moodluma 最新搜尋版＋後端會員登入＋忘記密碼前端

## 基礎版本與修改範圍

以 Moodluma-search-optimized-20261025.zip 為基礎，只整合會員功能。舊 moodluma-cloud-sync-deploy.zip 作為既有註冊／登入 API 的參考，沒有用舊版 app.js 覆蓋新版。

原有檔案只改 app.js、index.html、service-worker.js。其餘 38 個既有檔案與基礎版逐位元組相同。搜尋引擎、同義詞、句型解析、排序、結果頁、推薦、收藏、歷史、群組、樣式和圖片未移植或覆寫為舊版本。

## 本次完成

- 註冊呼叫 POST /api/auth/register，登入呼叫 POST /api/auth/login，基底網址沿用 https://filmdb-68z4.onrender.com。
- 註冊／登入必須回傳 ok:true、user.username 與非空 token 才顯示成功，不會缺少 token 仍顯示成功。不再以本機 users 陣列驗證帳密或保存新密碼。
- 保留後端 user 的 username、email、createdAt 與 token，沒有保存明文密碼。
- 登出清除該瀏覽器的 user/token；未新增後端登出或撤銷所有裝置功能，因未提供該 API。
- 原本登入視窗的「忘記密碼」現在只輸入註冊 Email，呼叫寄送連結 API。
- 新增 reset-password.html，從信件連結讀取一次性 token，設定新密碼後提交後端。
- 重設頁支援 #token=...（建議）或 ?token=...，讀取後立即移除網址中的 token，不保存於 localStorage。成功後清空欄位、停用提交並清除本機登入，讓使用者重新登入。
- 有缺少憑證、密碼不一致、密碼太短、連結過期、限流、連線失敗及 API 尚未開放的提示。
- 寄信 API 成功接受請求後使用統一提示，不顯示「這個帳號存在／不存在」。

## 後端配合：既有登入／註冊 API

登入 POST /api/auth/login
Request: { "username": "帳號", "password": "密碼" }

註冊 POST /api/auth/register
Request: { "username": "帳號", "email": "Email", "password": "密碼" }

成功回應（兩者）：
{ "ok": true, "user": { "username": "帳號", "email": "Email", "createdAt": "時間" }, "token": "登入憑證" }

失敗回應：HTTP 4xx/5xx，JSON { "ok": false, "error": "錯誤說明" }。

這兩支是舊雲端版已呼叫的 API，線上實際可用性仍需部署後以測試帳號驗收。新瀏覽器會向同一後端登入，前端不再要求該裝置先有本機帳號；多裝置同時登入是否允許、token 到期、撤銷及更新政策由後端決定。

## 後端配合：寄信與重設 API（新約定，尚未確認後端已實作）

路徑集中於 member-config.js，後端可提供實際規格後再調整。

1. POST /api/auth/forgot-password
Request: { "email": "註冊信箱" }
Response: { "ok": true }

後端查詢會員資料，將信寄到註冊信箱，產生足夠隨機的一次性憑證，儲存憑證雜湊與期限，並且對存在／不存在帳號回傳同樣結果。寄信 API key 必須留在後端。

2. POST /api/auth/reset-password
Request: { "token": "信件憑證", "newPassword": "新密碼" }
Response: { "ok": true }

後端驗證 token 對應帳號、期限、未使用狀態，安全更新密碼並原子性消耗 token；舊登入憑證應按後端政策撤銷。過期、無效、已使用回 400/401/403/410；限流回 429。

Email 連結請由後端設定受信任的前端網址，例如：
https://正式前端網址/reset-password.html#token=一次性憑證

本地測試則是：
http://127.0.0.1:8080/reset-password.html#token=後端提供的測試憑證

前端不自行產生憑證、不生成模擬信件、不接受只填帳號 Email 就直接更新密碼的舊流程。後端若仍提供舊 /api/auth/reset，請由後端負責人確認其驗證機制；本次前端不再使用它。

兩個新端點未完成前，這包不會真的寄信或修改後端密碼，也不會假裝成功。只有後端回應成功才顯示對應成功提示。API 成功接收請求也不等於郵件必定送達，仍需信箱實測。

後端需允許實際前端來源的 CORS，POST 與 Content-Type: application/json。前端網站自己的 CORS 標頭不能取代後端設定。

## 其他功能與帳號資料

本次只整合會員身分與密碼重設，不移植舊版的收藏／歷史／設定雲端同步。這些功能保留最新版原有本機儲存方式，因此「不同裝置可向同一後端登入」與「不同裝置收藏同步」是兩件事；後者不在本次修改範圍。

先前只建立在 localStorage 的帳號不會自動變成後端帳號，需要在後端有同一筆會員才能登入。原本收藏與歷史資料未刪除，登入後仍按最新版的 username key 讀寫。舊本機密碼資料沒有新增、修改、上傳或刪除。

## 測試與部署

1. 解壓縮整包，雙擊 start-preview.cmd，保持視窗開啟。
2. 開 http://127.0.0.1:8080/index.html，測試登入及註冊。前端直接連原會員後端，不是本地會員模擬。
3. 在第二個瀏覽器或另一台裝置開同一個已部署前端網址，用相同帳號登入（勿重新註冊）。原裝置也測試是否仍能使用。127.0.0.1 只指各裝置自己，不能拿它當跨裝置網站網址。
4. 忘記密碼：從原本登入視窗點「忘記密碼」，輸入註冊 Email；後端完成新 API 後，檢查真實信箱，點連結，設定新密碼，再用新／舊密碼各試一次。
5. 重設連結過期／已使用時應失敗。後端必須負責這個驗證，前端不能單獨保證一次性。
6. 整包部署，勿只換 app.js。新增 member-config.js、member-api.js、reset-password.html/js/css 都需上傳。會員後端與寄信金鑰不用放在前端。

## 已完成驗證

- 29 項會員與重設頁模擬檢查：登入請求、資料欄位、token 儲存、沒有 token 時不成功、新裝置儲存環境、錯誤帳密、註冊、Email 格式、寄信失敗、token 清除、缺少 token、密碼確認、過期回應、重複提交等。
- 4 項變更範圍檢查，確認會員區塊以外僅有相關常數、表單事件與快取引用差異；其餘 38 個檔案位元組一致。
- 原有 41 項搜尋測試通過。
- 另附 tests/member.test.cjs 可執行 16 項純 API 模擬測試；node tests/member.test.cjs。
- JavaScript 語法、HTML 本地腳本引用、ZIP 內容與 CRC 檢查。
- 未建立任何線上帳號、未寄出真實郵件、未部署。未完成真實瀏覽器／正式後端端到端驗收；實際寄信需要後端配合。
