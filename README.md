# SparkAR-FVRDateTimeCountdownScript
Timer and Countdown script developed by Fernando VR (instagram.com/laikezando)

Inputs and outputs configurations:

## FROM SCRIPT ##
* date = Number
* day = Number
* month = Number
* fullyear = Number
* hours = Number
* minutes = Number
* seconds = Number
* milliseconds = Number
* time = Number
* timezoneoffset = Number
* dayofweek = Text
* cddays = Number
* cdhours = Number
* cdminutes = Number
* cdseconds = Number
* countdownstatus = Text
* monthtext = Text
* fulldate = Text
* fulltime = Text
* fullcountdown = Text

## TO SCRIPT ##
* keepUpdate = Boolean (With this option on, you keep the script constantly updated.)
* updateNow = Pulse (If keepUpdate is off the script will only update when it receives a pulse signal in this option.)
* countdowndate = Text (Use dates in YYYY-MM-DD format (Year-Month-Day, ex: 2022-12-25))
* countdowntime = Text (Use time in HH-MM-SS format (Hours-Minutes-Seconds, Ex.: 23:35:56))
* countdownenable = Boolean (Activate this option after configuring the above two steps of date and time, and want to activate the time remaining counter.)
* langselect = Text (Select your preferred language (pt - Portuguese, en - English, es - Spanish and fr - French))
