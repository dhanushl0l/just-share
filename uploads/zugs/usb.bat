@echo off

adb shell svc data disable

timeout /t 2 /nobreak > nul

adb shell svc data enable

timeout /t 2 /nobreak > nul

adb shell svc usb setFunctions none

timeout /t 2 /nobreak > nul

adb shell svc usb setFunctions rndis

echo Commands executed successfully.

timeout /t 5 /nobreak > nul