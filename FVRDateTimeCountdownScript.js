/*
* Timer and Countdown script developed by Fernando VR (instagram.com/laikezando)
*
* Inputs and outputs configurations:
*
* ## FROM SCRIPT ##
* - date = Number
* - day = Number
* - month = Number
* - fullyear = Number
* - hours = Number
* - minutes = Number
* - seconds = Number
* - milliseconds = Number
* - time = Number
* - timezoneoffset = Number
* - dayofweek = Text
* - cddays = Number
* - cdhours = Number
* - cdminutes = Number
* - cdseconds = Number
* - countdownstatus = Text
* - countdownstate = Number
* - monthtext = Text
* - fulldate = Text
* - fulltime = Text
* - fullcountdown = Text
*
* ## TO SCRIPT ##
* - keepUpdate = Boolean (With this option on, you keep the script constantly updated.)
* - updateNow = Pulse (If keepUpdate is off the script will only update when it receives a pulse signal in this option.)
* - countdowndate = Text (Use dates in YYYY-MM-DD format (Year-Month-Day, ex: 2022-12-25))
* - countdowntime = Text (Use time in HH-MM-SS format (Hours-Minutes-Seconds, Ex.: 23:35:56))
* - countdownonlydays = Boolean (Activate this option if you want only the days to be counted, ignoring the time.)
* - countdownenddate = Text (Use dates in YYYY-MM-DD format (Year-Month-Day, ex: 2022-12-25))
* - countdownendtime = Text (Use time in HH-MM-SS format (Hours-Minutes-Seconds, Ex.: 23:35:56))
* - countdownenable = Boolean (Activate this option after configuring the above two steps of date and time, and want to activate the time remaining counter.)
* - langselect = Text (Select your preferred language (pt - Portuguese, en - English, es - Spanish and fr - French))
*/


const Patches = require('Patches');
const Time = require('Time');
//const Locale = require('Locale');
export const D = require('Diagnostics');

//var autolang = '';
var _keepUpdate = false;
var _countdown = false;
var _countdowndate = '9999-01-10';
var _countdowntime = '00:00:00';
var _countdowndatetime = _countdowndate + 'T' + _countdowntime;
var _countdownenddate = '9999-01-10';
var _countdownendtime = '00:00:00';
var _countdownenddatetime = _countdownenddate + 'T' + _countdownendtime;
var _countdowonlydays = false;
var dayOfWeek = [];
var monthText = [];
const calcsecond = 1000;
const calcminute = calcsecond * 60;
const calchour = calcminute * 60;
const calcday = calchour * 24;

export class FVRDateTime {
	constructor() {
		this.initializate();
	}

	initializate() {
		let self = this;

		// SPARK AR ERROR IN LOCALE MODULE: JavaScript error: Cannot read property 'language' of undefined
		// The lines below can be used again if the spark ar bug is fixed

		// Locale.language.monitor({ fireOnInitialValue: true }).subscribe(function(e) {
		// autolang = e.newValue;
		// });

		Patches.outputs.getString('langselect').then(event => {
			event.monitor({ fireOnInitialValue: true }).subscribe(function (values) {
				let selectlang = values.newValue;
				// if (selectlang == 'auto') {
				// self.getLanguage(autolang);
				// } else {
				self.getLanguage(selectlang);
				// }
			});
		});

		Patches.outputs.getBoolean('keepUpdate').then(event => {
			event.monitor({ fireOnInitialValue: true }).subscribe(function (values) {
				_keepUpdate = values.newValue;
			});
		});

		Patches.outputs.getBoolean('countdownenable').then(event => {
			event.monitor({ fireOnInitialValue: true }).subscribe(function (values) {
				_countdown = values.newValue;
				if (_countdown == false) {
					Patches.inputs.setString('countdownstatus', 'DISABLED');
					Patches.inputs.setScalar('countdownstate', 0);
				}
			});
		});
		
		Patches.outputs.getString('countdowndate').then(event => {
			event.monitor({ fireOnInitialValue: true }).subscribe(function (values) {
				_countdowndate = values.newValue;
				if (_countdowonlydays == false) {
					self.setCountDown(_countdowndate + 'T' + _countdowntime);
				} else {
					self.setCountDown(_countdowndate + 'T00:00:00');
				}
			});
		});

		Patches.outputs.getString('countdowntime').then(event => {
			event.monitor({ fireOnInitialValue: true }).subscribe(function (values) {
				_countdowntime = values.newValue;
				if (_countdowonlydays == false) {
					self.setCountDown(_countdowndate + 'T' + _countdowntime);
				}
			});
		});
		
		Patches.outputs.getBoolean('countdownonlydays').then(event => {
			event.monitor({ fireOnInitialValue: true }).subscribe(function (values) {
				_countdowonlydays = values.newValue;
				if (_countdowonlydays == true) {
					self.setCountDown(_countdowndate + 'T00:00:00');
				} else {
					self.setCountDown(_countdowndate + 'T' + _countdowntime);
				}
			});
		});
		
		Patches.outputs.getString('countdownenddate').then(event => {
			event.monitor({ fireOnInitialValue: true }).subscribe(function (values) {
				_countdownenddate = values.newValue;
				self.setCountDownEnd(_countdownenddate + 'T' + _countdownendtime);
			});
		});

		Patches.outputs.getString('countdownendtime').then(event => {
			event.monitor({ fireOnInitialValue: true }).subscribe(function (values) {
				_countdownendtime = values.newValue;
				self.setCountDownEnd(_countdownenddate + 'T' + _countdownendtime);
			});
		});

		Patches.outputs.getPulse('updateNow').then(event => {
			event.subscribe(function (values) {
				self.update();
			});
		});

		Time.ms.monitor().subscribe(() => {
			if (_keepUpdate) {
				this.update();
			}
		});
	}

	update() {
		let self = this;
		let now = new Date(Date.now());

		let nowdate = now.getDate();
		let nowday = now.getDay();
		let nowmonth = now.getMonth();
		let nowfullyear = now.getFullYear();
		let nowhours = now.getHours();
		let nowminutes = now.getMinutes();
		let nowseconds = now.getSeconds();
		let nowmilliseconds = now.getMilliseconds();
		let nowtime = now.getTime();
		let nowtimezoneoffset = now.getTimezoneOffset();

		Patches.inputs.setScalar('day', nowday);
		Patches.inputs.setString('dayofweek', dayOfWeek[nowday]);
		Patches.inputs.setScalar('date', nowdate);
		Patches.inputs.setScalar('month', nowmonth + 1);
		Patches.inputs.setString('monthtext', monthText[nowmonth]);
		Patches.inputs.setScalar('fullyear', nowfullyear);
		Patches.inputs.setScalar('hours', nowhours);
		Patches.inputs.setScalar('minutes', nowminutes);
		Patches.inputs.setScalar('seconds', nowseconds);
		Patches.inputs.setScalar('milliseconds', nowmilliseconds);
		Patches.inputs.setScalar('time', nowtime);
		Patches.inputs.setScalar('timezoneoffset', nowtimezoneoffset);

		Patches.inputs.setString('fulldate', this.zeroPad(nowdate,2)+' / '+monthText[nowmonth]+' / '+nowfullyear);
		Patches.inputs.setString('fulltime', this.zeroPad(nowhours,2)+':'+this.zeroPad(nowminutes,2)+':'+this.zeroPad(nowseconds,2));

		if (_countdown == true) {
			self.getCountDown(nowtime);
		}
	}

	setCountDown(datetime) {
		_countdowndatetime = new Date(datetime);
	}
	
	setCountDownEnd(datetime) {
		_countdownenddatetime = new Date(datetime);
	}

	getCountDown(nowTime) {
		let countdowndistance = _countdowndatetime.getTime() - nowTime;
		let countdownenddistance = _countdownenddatetime.getTime() - nowTime;
		let countdowndays = 0;
		let countdownhours = 0;
		let countdownminutes = 0;
		let countdownseconds = 0;
		let countdownfull = '000';
		
		if (countdowndistance > 0) {
			Patches.inputs.setString('countdownstatus', 'ENABLED');
			Patches.inputs.setScalar('countdownstate', 1);
			countdowndays = this.calcDays(countdowndistance, _countdowonlydays);
			countdownhours = this.calcHours(countdowndistance, _countdowonlydays);
			countdownminutes = this.calcMinutes(countdowndistance, _countdowonlydays);
			countdownseconds = this.calcSeconds(countdowndistance, _countdowonlydays);
			countdownfull = this.getCountDownFull(countdowndays, countdownhours, countdownminutes, countdownseconds, _countdowonlydays);
		} else if (countdownenddistance > 0) {
			Patches.inputs.setString('countdownstatus', 'EXPIRED');
			Patches.inputs.setScalar('countdownstate', 2);
		} else {
			Patches.inputs.setString('countdownstatus', 'FINISHED');
			Patches.inputs.setScalar('countdownstate', 3);
		}	
		
		Patches.inputs.setScalar('cddays', countdowndays);
		Patches.inputs.setScalar('cdhours', countdownhours);
		Patches.inputs.setScalar('cdminutes', countdownminutes);
		Patches.inputs.setScalar('cdseconds', countdownseconds);
		Patches.inputs.setString('fullcountdown', countdownfull);
	}
	
	calcDays(distance, onlyDaysActivated) {
		let distanceday = distance / calcday;
		return onlyDaysActivated ? Math.ceil(distanceday) : Math.floor(distanceday);
	}
	
	calcHours(distance, onlyDaysActivated) {
		return onlyDaysActivated ? 0 : Math.floor((distance % calcday) / calchour);
	}
	
	calcMinutes(distance, onlyDaysActivated) {
		return onlyDaysActivated ? 0 : Math.floor((distance % calchour) / calcminute)
	}
	
	calcSeconds(distance, onlyDaysActivated) {
		return onlyDaysActivated ? 0 : Math.floor((distance % calcminute) / calcsecond);
	}
	
	getCountDownFull(days, hours, minutes, seconds, onlyDaysActivated) {
		return onlyDaysActivated ? this.zeroPad(days, 3) : this.zeroPad(days, 3) + ' : ' + this.zeroPad(hours, 2) + ' : ' + this.zeroPad(minutes, 2) + ' : ' + this.zeroPad(seconds, 2); 
	}

	getLanguage(lang) {
		switch (lang) {
			// Portuguese
			case 'pt':
				dayOfWeek[0] = 'Domingo';
				dayOfWeek[1] = 'Segunda-feira';
				dayOfWeek[2] = 'Terça-feira';
				dayOfWeek[3] = 'Quarta-feira';
				dayOfWeek[4] = 'Quinta-feira';
				dayOfWeek[5] = 'Sexta-feira';
				dayOfWeek[6] = 'Sábado';
				monthText[0] = 'Janeiro';
				monthText[1] = 'Fevereiro';
				monthText[2] = 'Março';
				monthText[3] = 'Abril';
				monthText[4] = 'Maio';
				monthText[5] = 'Junho';
				monthText[6] = 'Julho';
				monthText[7] = 'Agosto';
				monthText[8] = 'Setembro';
				monthText[9] = 'Outubro';
				monthText[10] = 'Novembro';
				monthText[11] = 'Dezembro';
				break;
			// Spanish
			case 'es':
				dayOfWeek[0] = 'domingo';
				dayOfWeek[1] = 'lunes';
				dayOfWeek[2] = 'martes';
				dayOfWeek[3] = 'miércoles';
				dayOfWeek[4] = 'jueves';
				dayOfWeek[5] = 'viernes';
				dayOfWeek[6] = 'sábado';
				monthText[0] = 'Enero';
				monthText[1] = 'Febrero';
				monthText[2] = 'Marzo';
				monthText[3] = 'Abril';
				monthText[4] = 'Mayo';
				monthText[5] = 'Junio';
				monthText[6] = 'Julio';
				monthText[7] = 'Agosto';
				monthText[8] = 'Septiembre';
				monthText[9] = 'Octubre';
				monthText[10] = 'Noviembre';
				monthText[11] = 'Diciembre';
				break;
			// French
			case 'fr':
				dayOfWeek[0] = 'lundi';
				dayOfWeek[1] = 'mardi';
				dayOfWeek[2] = 'mercredi';
				dayOfWeek[3] = 'jeudi';
				dayOfWeek[4] = 'vendredi';
				dayOfWeek[5] = 'samedi';
				dayOfWeek[6] = 'dimanche';
				monthText[0] = 'Janvier';
				monthText[1] = 'Février';
				monthText[2] = 'Mars';
				monthText[3] = 'Avril';
				monthText[4] = 'Peut';
				monthText[5] = 'Juin';
				monthText[6] = 'Juillet';
				monthText[7] = 'Août';
				monthText[8] = 'Septembre';
				monthText[9] = 'Octobre';
				monthText[10] = 'Novembre';
				monthText[11] = 'Décembre';
				break;
			// English
			case 'en':
			default:
				dayOfWeek[0] = 'Sunday';
				dayOfWeek[1] = 'Monday';
				dayOfWeek[2] = 'Tuesday';
				dayOfWeek[3] = 'Wednesday';
				dayOfWeek[4] = 'Thursday';
				dayOfWeek[5] = 'Friday';
				dayOfWeek[6] = 'Saturday';
				monthText[0] = 'January';
				monthText[1] = 'February';
				monthText[2] = 'March';
				monthText[3] = 'April';
				monthText[4] = 'May';
				monthText[5] = 'June';
				monthText[6] = 'July';
				monthText[7] = 'August';
				monthText[8] = 'September';
				monthText[9] = 'October';
				monthText[10] = 'November';
				monthText[11] = 'December';
				break;
		}
	}

	zeroPad(num, numLength) {
		var n = Math.abs(num);
		var zeros = Math.max(0, numLength - Math.floor(n).toString().length);
		var zeroString = Math.pow(10, zeros).toString().substr(1);
		if (num < 0) {
			zeroString = '-' + zeroString;
		}
		return zeroString + n;
	}
}

export const FVRDT = new FVRDateTime();
