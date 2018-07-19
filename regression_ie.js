"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RegressionLine = function () {
	function RegressionLine() {
		_classCallCheck(this, RegressionLine);

		this.pn = 0;
		this.XMax = 0;
		this.YMax = 0;
		this.XMin = 0;
		this.YMin = 0;
		this.sumX = 0;
		this.sumY = 0;
		this.sumXX = 0;
		this.sumXY = 0;
		this.sumYY = 0;
		this.sumDeltaY = 0;
		this.sumDeltaY2 = 0;
		var sse = 0;
		this.sst = 0;
		this.E = 0;
		this.a0 = 0;
		this.a1 = 0;
		this.pn = 0;
		this.coefsValid = false;
		this.xy = new Array(2);
		this.listX = new Array();
		this.listY = new Array();
	}

	_createClass(RegressionLine, [{
		key: "addDataPoint",
		value: function addDataPoint(dataPoint) {
			this.sumX += dataPoint.x;
			this.sumY += dataPoint.y;
			this.sumXX += dataPoint.x * dataPoint.x;
			this.sumXY += dataPoint.x * dataPoint.y;
			this.sumYY += dataPoint.y * dataPoint.y;

			if (dataPoint.x > this.XMax) {
				this.XMax = dataPoint.x;
			}
			if (dataPoint.y > this.YMax) {
				this.YMax = dataPoint.y;
			}

			this.xy[0] = dataPoint.x + "";
			this.xy[1] = dataPoint.y + "";
			if (dataPoint.x != 0 && dataPoint.y != 0) {
				try {
					this.listX.push(this.xy[0]);
					this.listY.push(this.xy[1]);
				} catch (e) {
					console.log(e);
				}
			}
			++this.pn;
			this.coefsValid = false;
		}
	}, {
		key: "at",
		value: function at(x) {
			if (this.pn < 2) return NaN;

			this.validateCoefficients();
			return this.a0 + this.a1 * x;
		}
	}, {
		key: "reset",
		value: function reset() {
			this.pn = 0;
			this.sumX = this.sumY = this.sumXX = this.sumXY = 0;
			this.coefsValid = false;
		}
	}, {
		key: "validateCoefficients",
		value: function validateCoefficients() {
			if (this.coefsValid) return;

			if (this.pn >= 2) {
				var xBar = this.sumX / this.pn;
				var yBar = this.sumY / this.pn;

				this.a1 = (this.pn * this.sumXY - this.sumX * this.sumY) / (this.pn * this.sumXX - this.sumX * this.sumX);
				this.a0 = yBar - this.a1 * xBar;
			} else {
				this.a0 = this.a1 = NaN;
			}

			this.coefsValid = true;
		}
	}, {
		key: "R",
		value: function R() {
			for (var i = 0; i < this.pn - 1; i++) {
				var Yi = parseInt(this.listY[i].toString());
				var Y = this.at(parseInt(this.listX[i].toString()));
				var deltaY = Yi - Y;
				var deltaY2 = deltaY * deltaY;

				this.sumDeltaY2 += deltaY2;
			}

			this.sst = this.sumYY - this.sumY * this.sumY / this.pn;
			this.E = 1 - this.sumDeltaY2 / this.sst;

			return this.round(this.E, 4);
		}
	}, {
		key: "round",
		value: function round(number, precision) {
			var shift = function shift(number, precision, reverseShift) {
				if (reverseShift) {
					precision = -precision;
				}
				var numArray = ("" + number).split("e");
				return +(numArray[0] + "e" + (numArray[1] ? +numArray[1] + precision : precision));
			};
			return shift(Math.round(shift(number, precision, false)), precision, true);
		}
	}, {
		key: "printLine",
		value: function printLine(line) {
			console.log("決定係数：  R^2 = " + line.R());
			console.log("単回帰式:  y = " + line.a1 + " * x " + (line.a0 > 0 ? "+" : "") + line.a0);
		}
	}]);

	return RegressionLine;
}();

var DataPoint = function DataPoint(x, y) {
	_classCallCheck(this, DataPoint);

	this.x = x;
	this.y = y;
};
