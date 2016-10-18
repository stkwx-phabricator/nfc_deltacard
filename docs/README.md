## built in Mac
> cd /Users/kaishen/Documents/Confidential/github/nfc_deltacard/android_app  
  cordova build --release  
  jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ../docs/delta.keystore "/Users/kaishen/Documents/Confidential/github/nfc_deltacard/android_app/platforms/android/build/outputs/apk/android-release-unsigned.apk" delta  
  cp /Users/kaishen/Documents/Confidential/github/nfc_deltacard/android_app/platforms/android/build/outputs/apk/android-release-unsigned.apk ../dist/delta_kaya_mac.apk  

## Test in MAC emulator for android
> cordova build android  
  cordova emulate android
  

## Debug by GapDebug
> start GapDebug App, it will open the Emulator in chrome auto.

  
## To build maintenance version or user version
> need change the www/js/index.js file following line:  
`var version_maintenance = true;`
  


## Test Account
> User = georges@hotmail.com
  Password = 123456
  User ID = 11748068
  equipmentId = 51802
  equipmentId = 53805
  equipmentId = 55801
  equipmentId = 55802
  
  User = landon.donovan@usa.com
  Password = 123123123
  UserId = 11877150
  
  User = jhdz@mexico.com
  Password = 123456
  UserId = 11877160
  
  User = derek.wu@softtek.com
  Password = 88888888
  UserId = 11940029
  
  var liferaywsUserAdmin = "annualcheckserviceadmin";
  var liferaywsPasswordAdmin = "annualcheckserviceadmin!789";
  
## Remote Server URLs
> //Production Environment
  var web_server_delta = "https://www.deltaplus.eu/api/jsonws/deltaplus-deltaweb-annualCheck-portlet.annualcheckuseraccount/";
  Jerry  12:01:37
  var web_server_equipment = "https://www.deltaplus.eu/api/jsonws/deltaplus-deltaweb-annualCheck-portlet.equipment/";
  
## This is the site you can check for new users
> https://www.deltaplus.eu/en_US/annual-check-service

**NOTE**: all these are Prod environment because for Dev we need VPN


