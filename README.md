# dgca-verifier-android-app-setup-guide

## 下載
```
git clone https://github.com/eu-digital-green-certificates/dgca-verifier-app-android.git
git clone https://github.com/eu-digital-green-certificates/dgca-app-core-android
git clone https://github.com/eu-digital-green-certificates/dgc-certlogic-android.git
```
> 請放在同一目錄
```
android-app
|___dgca-verifier-app-android
|___dgca-app-core-android
|___dgc-certlogic-android
```
## 設定
- Build Variant (可選擇tst or acc)
> 上方選單->Build->Select Build Variant
### 寫死憑證
由於沒有公開的verifier以及自己的verifier所以把憑證寫死在app裡
- kid
可以使用`getKid.js`獲取
- public key
    -  可以用 java keystore explore 匯出公私鑰，記得匯出為x.509格式的certificate
- 建議位置 `app/src/main/java/dgca/verifier/app/android/data/VerifierRepositoryImpl.kt` 中的 `fetchCertificates` function
```kotlin=
    override suspend fun fetchCertificates(statusUrl: String, updateUrl: String): Boolean? {
        mutex.withLock {
            return execute {
                val response = apiService.getCertStatus(statusUrl)
                val body = response.body() ?: return@execute false
                validCertList.clear()
                validCertList.addAll(body)

                val resumeToken = preferences.resumeToken
                fetchCertificate(updateUrl, resumeToken)
                db.keyDao().deleteAllExcept(validCertList.toTypedArray())
                db.keyDao().deleteById()
                val twkid = "kid"
                val twPubkey = "publickey"
                val twkey = Key(kid = twkid!!, key = keyStoreCryptor.encrypt(twPubkey)!!)
                db.keyDao().deleteById(twkid)
                db.keyDao().insert(twkey)
                preferences.lastKeysSyncTimeMillis = System.currentTimeMillis()
                lastSyncLiveData.postValue(preferences.lastKeysSyncTimeMillis)
                return@execute true
            }
        }
    }
```


## 開始使用
- 掃描從自架`dgca-issuance-web`發出來的qrcode
- 顯示結果

![](https://i.imgur.com/tY9wzQw.jpg)
![](https://i.imgur.com/jvBhrOQ.jpg)

