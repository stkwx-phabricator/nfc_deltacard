"C:\Program Files\Java\jdk1.8.0_221\bin\jarsigner" -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore "D:\Projects\nfc_deltacard\docs\delta.keystore" "D:\Projects\nfc_deltacard\android_app\platforms\android\build\outputs\apk\android-release-unsigned.apk" delta

copy "D:\Projects\nfc_deltacard\android_app\platforms\android\build\outputs\apk\android-release-unsigned.apk" "D:\Projects\nfc_deltacard\dist\"
rename D:\Projects\nfc_deltacard\dist\android-release-unsigned.apk delta_user.apk