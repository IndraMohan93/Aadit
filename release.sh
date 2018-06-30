# This generates the production apk
rm AaditLife.apk
ionic cordova build --release android
# password is aaditlife
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore AaditLife.keystore /home/thimmaiah/work/angular/AaditLifeUI/platforms/android/build/outputs/apk/android-release-unsigned.apk AaditLife
zipalign -v 4 /home/thimmaiah/work/angular/AaditLifeUI/platforms/android/build/outputs/apk/android-release-unsigned.apk AaditLife.apk
apksigner verify AaditLife.apk 
