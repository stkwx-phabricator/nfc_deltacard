"C:\Program Files (x86)\Java\jdk1.7.0_75\bin\jarsigner" -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore "D:\Projects\NFC_Delta\key\delta.keystore" "D:\Projects\NFC_Delta\nfc_user\platforms\android\ant-build\MainActivity-release-unsigned.apk" delta

copy "D:\Projects\NFC_Delta\nfc_user\platforms\android\ant-build\MainActivity-release-unsigned.apk" "D:\Projects\NFC_Delta\"
rename MainActivity-release-unsigned.apk delta_user.apk