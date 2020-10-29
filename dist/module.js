define(["app/plugins/sdk","lodash"], function(__WEBPACK_EXTERNAL_MODULE_grafana_app_plugins_sdk__, __WEBPACK_EXTERNAL_MODULE_lodash__) { return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading wasm modules
/******/ 	var installedWasmModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// object with all compiled WebAssembly.Modules
/******/ 	__webpack_require__.w = {};
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./module.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./graph_tooltip.ts":
/*!**************************!*\
  !*** ./graph_tooltip.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var _ = __webpack_require__(/*! lodash */ "lodash");
var TooltipMode;
(function (TooltipMode) {
    TooltipMode["SINGLE"] = "single";
    TooltipMode["ALL_SERIES"] = "all series";
})(TooltipMode = exports.TooltipMode || (exports.TooltipMode = {}));
;

var GraphTooltip = function () {
    function GraphTooltip(items, tooltipMode) {
        _classCallCheck(this, GraphTooltip);

        this.items = items;
        this.tooltipMode = tooltipMode;
        this._visible = false;
        this.$tooltip = $('<div class="graph-tooltip">');
    }

    _createClass(GraphTooltip, [{
        key: "clear",
        value: function clear() {
            this._visible = false;
            this.$tooltip.detach();
        }
    }, {
        key: "show",
        value: function show() {
            var _this = this;

            this._visible = true;
            var seriesList = this.getSeriesFn();
            if (seriesList.length === 0) {
                return;
            }
            if (title !== undefined && value !== undefined) {
                var showTitle = false;
                this._renderAndShow(this._convertTitleAndValueToHtml(title, value), pos, showTitle);
                return;
            }
            var currentValues = [];
            if (this.tooltipMode === TooltipMode.ALL_SERIES) {
                currentValues = _.map(seriesList, function (serie, idx) {
                    return _this._convertSerieToHtml(serie, _this.items[idx], index === idx);
                }).filter(function (value) {
                    return value !== undefined;
                });
            } else {
                currentValues = [this._convertSerieToHtml(seriesList[index], this.items[index], true)];
            }
            this._renderAndShow(currentValues.join('\n'), pos);
        }
    }, {
        key: "destroy",
        value: function destroy() {
            this._visible = false;
            this.$tooltip.remove();
        }
    }, {
        key: "_renderAndShow",
        value: function _renderAndShow(innerHtml, pos) {
            var showTitle = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

            var title = showTitle ? "<div class=\"graph-tooltip-time\">Current value</div>" : '';
            // TODO: move this "20" to a constant
            // TODO: check how this work when `pos` is close to the page bottom edge
            this.$tooltip.html(title + innerHtml).place_tt(pos.pageX + 20, pos.pageY);
        }
    }, {
        key: "_convertSerieToHtml",
        value: function _convertSerieToHtml(serie, item, isBold) {
            return "\n      <div class=\"graph-tooltip-list-item\">\n        <div class=\"graph-tooltip-series-name\">\n          " + (isBold ? '<b>' : '') + " " + (serie.alias || serie.target) + " " + (isBold ? '</b>' : '') + "\n        </div>\n        <div class=\"graph-tooltip-value\">" + item.currentFormattedValue + "</div>\n      </div>\n    ";
        }
    }, {
        key: "_convertTitleAndValueToHtml",
        value: function _convertTitleAndValueToHtml(title, value) {
            return "\n      <div class=\"graph-tooltip-list-item\">\n        <div class=\"graph-tooltip-series-name\">\n          <b>" + title + "</b>\n        </div>\n        <div class=\"graph-tooltip-value\">" + value + "</div>\n      </div>\n    ";
        }
    }, {
        key: "visible",
        get: function get() {
            return this._visible;
        }
    }]);

    return GraphTooltip;
}();

exports.GraphTooltip = GraphTooltip;

/***/ }),

/***/ "./mapper.ts":
/*!*******************!*\
  !*** ./mapper.ts ***!
  \*******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var value_formatter_1 = __webpack_require__(/*! ./value_formatter */ "./value_formatter.ts");
var module_1 = __webpack_require__(/*! ./module */ "./module.ts");
var _ = __webpack_require__(/*! lodash */ "lodash");
var StatType;
(function (StatType) {
    StatType["CURRENT"] = "current";
    StatType["MIN"] = "min";
    StatType["MAX"] = "max";
    StatType["TOTAL"] = "total";
})(StatType = exports.StatType || (exports.StatType = {}));
;

var MultiProgressItem = function () {
    function MultiProgressItem(_panelConfig, _title, _keys, _values, _maxValue) {
        _classCallCheck(this, MultiProgressItem);

        this._panelConfig = _panelConfig;
        this._title = _title;
        this._keys = _keys;
        this._values = _values;
        this._maxValue = _maxValue;
        if (this._keys.length !== this._values.length) {
            throw new Error('keys amount should be equal to values amount');
        }
    }

    _createClass(MultiProgressItem, [{
        key: "title",
        get: function get() {
            return this._title;
        }
    }, {
        key: "keys",
        get: function get() {
            return this._keys;
        }
    }, {
        key: "values",
        get: function get() {
            return this._values;
        }
    }, {
        key: "sumOfValues",
        get: function get() {
            return _.sum(this.values);
        }
    }, {
        key: "percentValues",
        get: function get() {
            var _this = this;

            // TODO: this.sumOfValues * 1.1 is a hack to make sure bars don't wrap
            // (they are wrapped when total width > 98%)
            return this.values.map(function (value) {
                return Math.floor(value / (_this.sumOfValues * 1.1) * 100);
            });
        }
    }, {
        key: "colors",
        get: function get() {
            // TODO: customize colors
            return ['green', 'yellow', 'red'];
        }
    }, {
        key: "aggregatedProgress",
        get: function get() {
            return _.sum(this.values) / this._maxValue * 100;
        }
    }, {
        key: "formattedValue",
        get: function get() {
            return value_formatter_1.getFormattedValue(this.sumOfValues, this._panelConfig.getValue('prefix'), this._panelConfig.getValue('postfix'), this._panelConfig.getValue('decimals'));
        }
    }, {
        key: "titleParams",
        get: function get() {
            var titleType = this._panelConfig.getValue('titleViewType');
            switch (titleType) {
                case module_1.TitleViewOptions.SEPARATE_TITLE_LINE:
                    return {
                        barHeight: 8,
                        titleTopMargin: 0,
                        valueTopMargin: -12
                    };
                case module_1.TitleViewOptions.INLINE:
                    return {
                        barHeight: 20,
                        titleTopMargin: -20,
                        valueTopMargin: -18
                    };
                default:
                    throw new Error("Wrong titleType: " + titleType);
            }
        }
    }, {
        key: "opacity",
        get: function get() {
            return this._panelConfig.getValue('opacity');
        }
    }]);

    return MultiProgressItem;
}();

exports.MultiProgressItem = MultiProgressItem;

var ProgressItem = function () {
    function ProgressItem(panelConfig, key, aggregatedValue, maxAggregatedValue, currentValue, currentMaxValue) {
        _classCallCheck(this, ProgressItem);

        this._panelConfig = panelConfig;
        this._key = key;
        this._aggregatedValue = aggregatedValue;
        this._maxAggregatedValue = maxAggregatedValue;
        // TODO: currentValue and currentMaxValue is not the best idea
        this._currentValue = currentValue;
        this._currentMaxValue = currentMaxValue;
    }

    _createClass(ProgressItem, [{
        key: "title",
        get: function get() {
            return this._key;
        }
    }, {
        key: "aggregatedProgress",
        get: function get() {
            return 100 * this._aggregatedValue / this._maxAggregatedValue;
        }
    }, {
        key: "currentProgress",
        get: function get() {
            return 100 * this._currentValue / this._currentMaxValue;
        }
    }, {
        key: "maxValue",
        get: function get() {
            return this._maxAggregatedValue;
        }
    }, {
        key: "aggregatedValue",
        get: function get() {
            return this._aggregatedValue;
        }
    }, {
        key: "currentValue",
        get: function get() {
            return this._currentValue;
        }
    }, {
        key: "currentFormattedValue",
        get: function get() {
            var value = this._panelConfig.getValue('valueLabelType') === 'percentage' ? this.currentProgress : this._currentValue;
            return value_formatter_1.getFormattedValue(value, this._panelConfig.getValue('prefix'), this._panelConfig.getValue('postfix'), this._panelConfig.getValue('decimals'));
        }
    }, {
        key: "formattedValue",
        get: function get() {
            var value = this._panelConfig.getValue('valueLabelType') === 'percentage' ? this.aggregatedProgress : this._aggregatedValue;
            return value_formatter_1.getFormattedValue(value, this._panelConfig.getValue('prefix'), this._panelConfig.getValue('postfix'), this._panelConfig.getValue('decimals'));
        }
    }, {
        key: "opacity",
        get: function get() {
            return this._panelConfig.getValue('opacity');
        }
    }, {
        key: "color",
        get: function get() {
            var _this2 = this;

            var colorType = this._panelConfig.getValue('coloringType');
            if (colorType === 'auto') {
                return 'auto';
            }
            if (colorType === 'thresholds') {
                var thresholdsStr = this._panelConfig.getValue('thresholds');
                var colors = this._panelConfig.getValue('colors');
                var value = this.aggregatedProgress;
                if (thresholdsStr === undefined) {
                    return colors[0];
                }
                var thresholds = thresholdsStr.split(',').map(parseFloat);
                for (var i = thresholds.length; i > 0; i--) {
                    if (value >= thresholds[i - 1]) {
                        return colors[i];
                    }
                }
                return colors[0];
            }
            if (colorType === 'key mapping') {
                var colorKeyMappings = this._panelConfig.getValue('colorKeyMappings');
                var keyColorMapping = _.find(colorKeyMappings, function (k) {
                    return k.key === _this2._key;
                });
                if (keyColorMapping === undefined) {
                    return this._panelConfig.getValue('colorsKeyMappingDefault');
                }
                return keyColorMapping.color;
            }
            throw new Error('Unknown color type ' + colorType);
        }
    }, {
        key: "titleParams",
        get: function get() {
            var titleType = this._panelConfig.getValue('titleViewType');
            switch (titleType) {
                case module_1.TitleViewOptions.SEPARATE_TITLE_LINE:
                    return {
                        barHeight: 8,
                        titleTopMargin: 0,
                        valueTopMargin: -22
                    };
                case module_1.TitleViewOptions.INLINE:
                    return {
                        barHeight: 20,
                        titleTopMargin: -20,
                        valueTopMargin: -18
                    };
                default:
                    throw new Error("Wrong titleType: " + titleType);
            }
        }
    }]);

    return ProgressItem;
}();

exports.ProgressItem = ProgressItem;

var Mapper = function () {
    function Mapper(panelConfig, templateSrv) {
        _classCallCheck(this, Mapper);

        this._panelConfig = panelConfig;
        this._templateSrv = templateSrv;
    }

    _createClass(Mapper, [{
        key: "mapMetricData",
        value: function mapMetricData(seriesList) {
            var _this3 = this;

            var statType = this._panelConfig.getValue('statNameOptionValue');
            var mappingType = this._panelConfig.getValue('mappingType');
            var statProgressType = this._panelConfig.getValue('statProgressType');
            var statProgressMaxValue = this._panelConfig.getValue('statProgressMaxValue');
            var alias = this._panelConfig.getValue('alias');
            var nullMapping = this._panelConfig.getValue('nullMapping');
            if (seriesList === undefined || seriesList.length == 0) {
                return [];
            }
            var kstat = [];
            var currentStat = [];
            if (seriesList[0].columns !== undefined) {
                var keys = seriesList[0].columns.map(function (col) {
                    return col.text;
                });
                var keyColumn = this._panelConfig.getValue('keyColumn');
                var keyIndex = 0;
                if (keyColumn !== '') {
                    keyIndex = keys.findIndex(function (key) {
                        return key === keyColumn;
                    });
                }
                var title = keys[keyIndex];
                var skipIndexes = [keyIndex];
                var skipColumn = this._panelConfig.getValue('skipColumn');
                if (skipColumn !== '') {
                    skipIndexes.push(keys.findIndex(function (key) {
                        return key === skipColumn;
                    }));
                }
                var _maxValue2 = _.max(seriesList[0].rows.map(function (row) {
                    return _.sum(row.filter(function (value, idx) {
                        return !_.includes(skipIndexes, idx);
                    }));
                }));
                var filteredKeys = keys.filter(function (key, idx) {
                    return !_.includes(skipIndexes, idx);
                });
                return seriesList[0].rows.map(function (row) {
                    return new MultiProgressItem(_this3._panelConfig, row[keyIndex], filteredKeys, row.filter(function (value, idx) {
                        return !_.includes(skipIndexes, idx);
                    }), _maxValue2);
                });
            }
            if (mappingType === 'datapoint to datapoint') {
                if (statType === StatType.TOTAL && seriesList.length == 1) {
                    kstat = this._mapKeysTotal(seriesList);
                } else {
                    kstat = this._mapNumeric(seriesList, statType, nullMapping);
                }
                currentStat = this._mapNumeric(seriesList, StatType.CURRENT, nullMapping);
            } else {
                kstat = this._mapTargetToDatapoints(seriesList, statType);
                currentStat = this._mapTargetToDatapoints(seriesList, StatType.CURRENT);
            }
            var maxValue = this._getMaxValue(kstat, statProgressType, statProgressMaxValue);
            var currentMaxValue = this._getMaxValue(currentStat, statProgressType, statProgressMaxValue);
            if (alias !== '') {
                kstat.forEach(function (k) {
                    var scopedVars = {
                        __key: { value: k[0] }
                    };
                    k[0] = _this3._templateSrv.replace(alias, scopedVars);
                });
            }
            return _.map(kstat, function (k, idx) {
                return new ProgressItem(_this3._panelConfig, k[0], k[1], maxValue, currentStat[idx][1], currentMaxValue);
            });
        }
        // TODO: enum statProgressType

    }, {
        key: "_getMaxValue",
        value: function _getMaxValue(kstat, statProgressType, statProgressMaxValue) {
            if (statProgressType === 'shared') {
                var total = 0;
                for (var i = 0; i < kstat.length; i++) {
                    total += kstat[i][1];
                }
                return total;
            }
            if (statProgressType === 'max value') {
                var max = -Infinity;
                if (statProgressMaxValue !== null) {
                    max = statProgressMaxValue;
                } else {
                    for (var _i = 0; _i < kstat.length; _i++) {
                        max = Math.max(kstat[_i][1], max);
                    }
                }
                return max;
            }
            return -1;
        }
    }, {
        key: "_mapKeysTotal",
        value: function _mapKeysTotal(seriesList) {
            if (seriesList.length !== 1) {
                throw new Error('Expecting list of keys: got more than one timeseries');
            }
            var kv = {};
            var datapointsLength = seriesList[0].datapoints.length;
            for (var i = 0; i < datapointsLength; i++) {
                var k = seriesList[0].datapoints[i][0].toString();
                if (kv[k] === undefined) {
                    kv[k] = 0;
                }
                kv[k]++;
            }
            var res = [];
            for (var _k in kv) {
                res.push([_k, kv[_k]]);
            }
            return res;
        }
    }, {
        key: "_mapNumeric",
        value: function _mapNumeric(seriesList, statType, nullMapping) {
            if (seriesList.length != 2) {
                throw new Error('Expecting timeseries in format (key, value). You can use keys only in total mode');
            }
            if (seriesList[0].datapoints.length !== seriesList[1].datapoints.length) {
                throw new Error('Timeseries has different length');
            }
            var kv = {};
            var datapointsLength = seriesList[0].datapoints.length;
            for (var i = 0; i < datapointsLength; i++) {
                var k = seriesList[0].datapoints[i][0].toString();
                var v = seriesList[1].datapoints[i][0];
                var vn = parseFloat(v);
                if (v === null) {
                    if (nullMapping === undefined || nullMapping === null) {
                        throw new Error('Got null value. You set null value mapping in Options -> Mapping -> Null');
                    }
                    console.log('nullMapping ->' + nullMapping);
                    vn = nullMapping;
                }
                if (isNaN(vn)) {
                    throw new Error('Got non-numberic value: ' + v);
                }
                if (kv[k] === undefined) {
                    kv[k] = [];
                }
                kv[k].push(vn);
            }
            var res = [];
            for (var _k2 in kv) {
                res.push([_k2, this._flatSeries(kv[_k2], statType)]);
            }
            return res;
        }
    }, {
        key: "_mapTargetToDatapoints",
        value: function _mapTargetToDatapoints(seriesList, statType) {
            var _this4 = this;

            return seriesList.map(function (serie) {
                return [serie.target, _this4._flatSeries(serie.datapoints.map(function (datapoint) {
                    return datapoint[0];
                }), statType)];
            });
        }
    }, {
        key: "_flatSeries",
        value: function _flatSeries(values, statType) {
            if (values.length === 0) {
                return 0;
            }
            if (statType === StatType.TOTAL) {
                return _.sum(values);
            }
            if (statType === StatType.MAX) {
                return _.max(values);
            }
            if (statType === StatType.MIN) {
                return _.min(values);
            }
            if (statType === StatType.CURRENT) {
                return _.last(values);
            }
            return 0;
        }
    }]);

    return Mapper;
}();

exports.Mapper = Mapper;

/***/ }),

/***/ "./module.ts":
/*!*******************!*\
  !*** ./module.ts ***!
  \*******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
var graph_tooltip_1 = __webpack_require__(/*! ./graph_tooltip */ "./graph_tooltip.ts");
var panel_config_1 = __webpack_require__(/*! ./panel-config */ "./panel-config.ts");
var mapper_1 = __webpack_require__(/*! ./mapper */ "./mapper.ts");
var sdk_1 = __webpack_require__(/*! grafana/app/plugins/sdk */ "grafana/app/plugins/sdk");
var _ = __webpack_require__(/*! lodash */ "lodash");
var TitleViewOptions;
(function (TitleViewOptions) {
    TitleViewOptions["SEPARATE_TITLE_LINE"] = "Separate title line";
    TitleViewOptions["INLINE"] = "Inline";
})(TitleViewOptions = exports.TitleViewOptions || (exports.TitleViewOptions = {}));
;
var ERROR_MAPPING = "\n  Can't map the received metrics, \n  see <strong> <a href=\"https://github.com/CorpGlory/grafana-progress-list/wiki\">wiki</a> </strong>\n";
var ERROR_NO_DATA = "no data";
var DEFAULTS = {
    keyColumn: '',
    // TODO: skip multiple columns
    skipColumn: '',
    statNameOptionValue: mapper_1.StatType.CURRENT,
    statProgressType: 'shared',
    statProgressMaxValue: null,
    coloringType: 'auto',
    titleViewType: TitleViewOptions.SEPARATE_TITLE_LINE,
    sortingOrder: 'none',
    valueLabelType: 'percentage',
    mappingType: 'datapoint to datapoint',
    alias: '',
    prefix: '',
    postfix: '',
    thresholds: '10, 30',
    // https://github.com/grafana/grafana/blob/v4.1.1/public/app/plugins/panel/singlestat/module.ts#L57
    colors: ['rgba(245, 54, 54, 0.9)', 'rgba(237, 129, 40, 0.89)', 'rgba(50, 172, 45, 0.97)'],
    colorsKeyMappingDefault: 'rgba(245, 54, 54, 0.9)',
    colorKeyMappings: [],
    nullMapping: undefined,
    tooltipMode: graph_tooltip_1.TooltipMode.ALL_SERIES,
    opacity: 0.5
};

var Ctrl = function (_sdk_1$MetricsPanelCt) {
    _inherits(Ctrl, _sdk_1$MetricsPanelCt);

    function Ctrl($scope, $injector, templateSrv) {
        _classCallCheck(this, Ctrl);

        var _this = _possibleConstructorReturn(this, (Ctrl.__proto__ || Object.getPrototypeOf(Ctrl)).call(this, $scope, $injector));

        _this.templateSrv = templateSrv;
        _this.statNameOptions = _.values(mapper_1.StatType);
        _this.statProgressTypeOptions = ['max value', 'shared'];
        _this.coloringTypeOptions = ['auto', 'thresholds', 'key mapping'];
        _this.titleViewTypeOptions = _.values(TitleViewOptions);
        _this.sortingOrderOptions = ['none', 'increasing', 'decreasing'];
        _this.valueLabelTypeOptions = ['absolute', 'percentage'];
        // TODO: change option names or add a tip in editor
        _this.mappingTypeOptions = ['datapoint to datapoint', 'target to datapoint'];
        _this.tooltipModeOptions = _.values(graph_tooltip_1.TooltipMode);
        // used to show status messages replacing rendered graphics
        // see isPanelAlert and panelAlertMessage
        _this._panelAlert = {
            active: true,
            // message prop can be formatted with html, 
            message: '<strong>loading...</strong>' // loading will be showed only once at the beginning
            // would be nice to add `type` property with values ['info', 'warning', 'error']
            // and then move it https://github.com/chartwerk/grafana-panel-base/issues/1
        };
        _.defaults(_this.panel, DEFAULTS);
        _this._panelConfig = new panel_config_1.PanelConfig(_this.panel);
        _this._initStyles();
        _this.mapper = new mapper_1.Mapper(_this._panelConfig, _this.templateSrv);
        _this.items = [];
        _this.events.on('init-edit-mode', _this._onInitEditMode.bind(_this));
        _this.events.on('data-received', _this._onDataReceived.bind(_this));
        _this.events.on('render', _this._onRender.bind(_this));
        return _this;
    }

    _createClass(Ctrl, [{
        key: "link",
        value: function link(scope, element) {
            this._element = element;
        }
    }, {
        key: "_initStyles",
        value: function _initStyles() {
            // small hack to load base styles
            var cssPath = this._panelConfig.pluginDirName.replace('public/', '');
            sdk_1.loadPluginCss({
                light: cssPath + 'css/panel.base.css',
                dark: cssPath + 'css/panel.base.css'
            });
            sdk_1.loadPluginCss({
                light: cssPath + 'css/panel.light.css',
                dark: cssPath + 'css/panel.dark.css'
            });
        }
    }, {
        key: "_onRender",
        value: function _onRender() {
            var _this2 = this;

            // maybe we want to make a config "last value" instead of ERROR_NO_DATA
            // see https://github.com/chartwerk/grafana-panel-base/issues/3
            if (this._seriesList === undefined || this._seriesList.length === 0) {
                this._panelAlert.active = true;
                this._panelAlert.message = ERROR_NO_DATA;
                return;
            }
            try {
                // TODO: set this.items also
                var items = this.mapper.mapMetricData(this._seriesList);
            } catch (e) {
                this._panelAlert.active = true;
                this._panelAlert.message = ERROR_MAPPING;
                return;
            }
            if (this._panelConfig.getValue('sortingOrder') === 'increasing') {
                items = _.sortBy(items, function (i) {
                    return i.aggregatedProgress;
                });
            }
            if (this._panelConfig.getValue('sortingOrder') === 'decreasing') {
                items = _.sortBy(items, function (i) {
                    return -i.aggregatedProgress;
                });
            }
            this.$scope.items = items;
            if (this._tooltip !== undefined) {
                this._tooltip.destroy();
            }
            this._tooltip = new graph_tooltip_1.GraphTooltip(function () {
                return _this2._seriesList;
            }, items, this.panel.tooltipMode);
            this._panelAlert.active = false;
        }
    }, {
        key: "onHover",
        value: function onHover(event, title, value) {
            // if(title == undefined) {
            //   title = this.items[index].title;
            // }
            // if(value == undefined) {
            //   value = this.items[index].to;
            // }
            this._tooltip.show(event, 'asd', 'asda');
        }
    }, {
        key: "onMouseLeave",
        value: function onMouseLeave() {
            this._tooltip.clear();
        }
    }, {
        key: "_onDataReceived",
        value: function _onDataReceived(seriesList) {
            this._seriesList = seriesList;
            this.render();
        }
    }, {
        key: "_onInitEditMode",
        value: function _onInitEditMode() {
            var thisPartialPath = this._panelConfig.pluginDirName + 'partials/';
            this.addEditorTab('Options', thisPartialPath + 'options.html', 2);
        }
    }, {
        key: "invertColorOrder",
        value: function invertColorOrder() {
            var tmp = this.panel.colors[0];
            this.panel.colors[0] = this.panel.colors[2];
            this.panel.colors[2] = tmp;
            this.render();
        }
    }, {
        key: "addColorKeyMapping",
        value: function addColorKeyMapping() {
            this.panel.colorKeyMappings.push({
                key: 'KEY_NAME',
                color: 'rgba(50, 172, 45, 0.97)'
            });
        }
    }, {
        key: "removeColorKeyMapping",
        value: function removeColorKeyMapping(index) {
            this.panel.colorKeyMappings.splice(index, 1);
            this.render();
        }
    }, {
        key: "_dataError",
        value: function _dataError(err) {
            console.log('got data error');
            console.log(err);
            this.$scope.data = [];
            this.$scope.dataError = err;
        }
    }, {
        key: "columns",
        get: function get() {
            if (this._seriesList === undefined || this._seriesList.length === 0 || this._seriesList[0].columns === undefined) {
                return [];
            }
            return this._seriesList[0].columns.map(function (col) {
                return col.text;
            });
        }
    }, {
        key: "skipColumns",
        get: function get() {
            return [''].concat(_toConsumableArray(this.columns));
        }
    }, {
        key: "isPanelAlert",
        get: function get() {
            return this._panelAlert.active;
        }
        // the field will be rendered as html

    }, {
        key: "panelAlertMessage",
        get: function get() {
            return this._panelAlert.message;
        }
    }]);

    return Ctrl;
}(sdk_1.MetricsPanelCtrl);

Ctrl.templateUrl = 'partials/template.html';
exports.PanelCtrl = Ctrl;

/***/ }),

/***/ "./panel-config.ts":
/*!*************************!*\
  !*** ./panel-config.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });

var PanelConfig = function () {
    function PanelConfig(panel) {
        _classCallCheck(this, PanelConfig);

        this._panel = panel;
    }

    _createClass(PanelConfig, [{
        key: "getValue",
        value: function getValue(key) {
            return this._panel[key];
        }
    }, {
        key: "setValue",
        value: function setValue(key, value) {
            this._panel[key] = value;
        }
    }, {
        key: "pluginDirName",
        get: function get() {
            if (!this._pluginDirName) {
                var panels = window['grafanaBootData'].settings.panels;
                var thisPanel = panels[this._panel.type];
                // the system loader preprends publib to the url,
                // add a .. to go back one level
                this._pluginDirName = thisPanel.baseUrl + '/';
            }
            return this._pluginDirName;
        }
    }]);

    return PanelConfig;
}();

exports.PanelConfig = PanelConfig;

/***/ }),

/***/ "./value_formatter.ts":
/*!****************************!*\
  !*** ./value_formatter.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var _ = __webpack_require__(/*! lodash */ "lodash");
function getFormattedValue(value, prefix, postfix, decimals) {
    return "" + prefix + getFormattedFloat(value, decimals) + postfix;
}
exports.getFormattedValue = getFormattedValue;
function getFormattedFloat(value, decimals) {
    var dm = getDecimalsForValue(value, decimals).decimals;
    if (dm === 0) {
        return Math.round(value).toString();
    }
    var fv = value;
    for (var i = 0; i < dm; i++) {
        fv *= 10;
    }
    ;
    var fvs = Math.round(fv).toString();
    return fvs.substr(0, fvs.length - dm) + '.' + fvs.substr(fvs.length - dm);
}
function getDecimalsForValue(value, decimals) {
    // based on https://github.com/grafana/grafana/blob/v4.1.1/public/app/plugins/panel/singlestat/module.ts
    if (_.isNumber(decimals)) {
        return {
            decimals: decimals,
            scaledDecimals: null
        };
    }
    var delta = value / 2;
    var dec = -Math.floor(Math.log(delta) / Math.LN10);
    var magn = Math.pow(10, -dec),
        norm = delta / magn,
        // norm is between 1.0 and 10.0
    size = void 0;
    if (norm < 1.5) {
        size = 1;
    } else if (norm < 3) {
        size = 2;
        // special case for 2.5, requires an extra decimal
        if (norm > 2.25) {
            size = 2.5;
            ++dec;
        }
    } else if (norm < 7.5) {
        size = 5;
    } else {
        size = 10;
    }
    size *= magn;
    // reduce starting decimals if not needed
    if (Math.floor(value) === value) {
        dec = 0;
    }
    var result = {};
    result.decimals = Math.max(0, dec);
    result.scaledDecimals = result.decimals - Math.floor(Math.log(size) / Math.LN10) + 2;
    return result;
}

/***/ }),

/***/ "grafana/app/plugins/sdk":
/*!**********************************!*\
  !*** external "app/plugins/sdk" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_grafana_app_plugins_sdk__;

/***/ }),

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_lodash__;

/***/ })

/******/ })});;
//# sourceMappingURL=module.js.map