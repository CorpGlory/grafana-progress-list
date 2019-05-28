define(["app/core/core","app/plugins/sdk","lodash"], function(__WEBPACK_EXTERNAL_MODULE_grafana_app_core_core__, __WEBPACK_EXTERNAL_MODULE_grafana_app_plugins_sdk__, __WEBPACK_EXTERNAL_MODULE_lodash__) { return /******/ (function(modules) { // webpackBootstrap
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

/***/ "./directives/progress.ts":
/*!********************************!*\
  !*** ./directives/progress.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(/*! grafana/app/core/core */ "grafana/app/core/core");
var directiveInited = false;
function initProgress(panelConfig) {
    var directiveName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "progress";

    if (directiveInited) {
        return;
    }
    directiveInited = true;
    core_1.coreModule.directive(directiveName, function () {
        return {
            templateUrl: panelConfig.pluginDirName + 'directives/progress.html',
            restrict: 'E',
            scope: {
                item: "="
            }
        };
    });
}
exports.initProgress = initProgress;

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
var _ = __webpack_require__(/*! lodash */ "lodash");

var ProgressItem = function () {
    function ProgressItem(panelConfig, key, value, maxValue) {
        _classCallCheck(this, ProgressItem);

        this._panelConfig = panelConfig;
        this._key = key;
        this._value = value;
        this._maxValue = maxValue;
    }

    _createClass(ProgressItem, [{
        key: "_getFormattedFloat",
        value: function _getFormattedFloat() {
            var value = this._panelConfig.getValue('valueLabelType') === 'percentage' ? this.progress : this.value;
            var dm = this._getDecimalsForValue().decimals;
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
    }, {
        key: "_getDecimalsForValue",
        value: function _getDecimalsForValue() {
            var value = this._value;
            // based on https://github.com/grafana/grafana/blob/v4.1.1/public/app/plugins/panel/singlestat/module.ts
            if (_.isNumber(this._panelConfig.getValue('decimals'))) {
                return {
                    decimals: this._panelConfig.getValue('decimals'),
                    scaledDecimals: null
                };
            }
            var delta = value / 2;
            var dec = -Math.floor(Math.log(delta) / Math.LN10);
            var magn = Math.pow(10, -dec),
                norm = delta / magn,
                // norm is between 1.0 and 10.0
            size;
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
    }, {
        key: "title",
        get: function get() {
            return this._key;
        }
    }, {
        key: "progress",
        get: function get() {
            return 100 * this._value / this._maxValue;
        }
    }, {
        key: "value",
        get: function get() {
            return this._value;
        }
    }, {
        key: "formattedValue",
        get: function get() {
            var value = this._value;
            var res = this._panelConfig.getValue('prefix');
            res += this._getFormattedFloat();
            res += this._panelConfig.getValue('postfix');
            return res;
        }
    }, {
        key: "color",
        get: function get() {
            var _this = this;

            var colorType = this._panelConfig.getValue('coloringType');
            if (colorType === 'auto') {
                return 'auto';
            }
            if (colorType === 'thresholds') {
                var thresholdsStr = this._panelConfig.getValue('thresholds');
                var colors = this._panelConfig.getValue('colors');
                var value = this.progress;
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
                    return k.key === _this._key;
                });
                if (keyColorMapping === undefined) {
                    return this._panelConfig.getValue('colorsKeyMappingDefault');
                }
                return keyColorMapping.color;
            }
            throw new Error('Unknown color type ' + colorType);
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
            var _this2 = this;

            if (seriesList === undefined || seriesList.length == 0) {
                return [];
            }
            var kstat = [];
            if (this._panelConfig.getValue('mappingType') === 'datapoint to datapoint') {
                if (this._panelConfig.getValue('statNameOptionValue') === 'total' && seriesList.length == 1) {
                    kstat = this._mapKeysTotal(seriesList);
                } else {
                    kstat = this._mapNumeric(seriesList);
                }
            } else {
                kstat = this._mapTargetToDatapoints(seriesList);
            }
            var maxValue = -1;
            if (this._panelConfig.getValue('statProgressType') === 'shared') {
                var total = 0;
                for (var i = 0; i < kstat.length; i++) {
                    total += kstat[i][1];
                }
                maxValue = total;
            }
            if (this._panelConfig.getValue('statProgressType') === 'max value') {
                var max = -Infinity;
                if (this._panelConfig.getValue('statProgressMaxValue') !== null) {
                    max = this._panelConfig.getValue('statProgressMaxValue');
                } else {
                    for (var _i = 0; _i < kstat.length; _i++) {
                        max = Math.max(kstat[_i][1], max);
                    }
                }
                maxValue = max;
            }
            var alias = this._panelConfig.getValue('alias');
            if (alias !== '') {
                kstat.forEach(function (k) {
                    var scopedVars = {
                        '__key': { value: k[0] }
                    };
                    k[0] = _this2._templateSrv.replace(alias, scopedVars);
                });
            }
            return _.map(kstat, function (k) {
                return new ProgressItem(_this2._panelConfig, k[0], k[1], maxValue);
            });
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
        value: function _mapNumeric(seriesList) {
            if (seriesList.length != 2) {
                throw new Error('Expecting timeseries in format (key, value). You can use keys only in total mode');
            }
            if (seriesList[0].datapoints.length !== seriesList[1].datapoints.length) {
                throw new Error('Timeseries has different length');
            }
            var kv = {};
            var datapointsLength = seriesList[0].datapoints.length;
            var nullMapping = this._panelConfig.getValue('nullMapping');
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
                res.push([_k2, this._flatSeries(kv[_k2])]);
            }
            return res;
        }
    }, {
        key: "_mapTargetToDatapoints",
        value: function _mapTargetToDatapoints(seriesList) {
            var _this3 = this;

            return seriesList.map(function (serie) {
                return [serie.target, _this3._flatSeries(serie.datapoints.map(function (datapoint) {
                    return datapoint[0];
                }))];
            });
        }
    }, {
        key: "_flatSeries",
        value: function _flatSeries(values) {
            if (values.length === 0) {
                return 0;
            }
            var t = this._panelConfig.getValue('statNameOptionValue');
            if (t === 'total') {
                return _.sum(values);
            }
            if (t === 'max') {
                return _.max(values);
            }
            if (t === 'min') {
                return _.min(values);
            }
            if (t === 'current') {
                return values[values.length - 1];
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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
var panel_config_1 = __webpack_require__(/*! ./panel-config */ "./panel-config.ts");
var mapper_1 = __webpack_require__(/*! ./mapper */ "./mapper.ts");
var progress_1 = __webpack_require__(/*! ./directives/progress */ "./directives/progress.ts");
var sdk_1 = __webpack_require__(/*! grafana/app/plugins/sdk */ "grafana/app/plugins/sdk");
var _ = __webpack_require__(/*! lodash */ "lodash");
var DEFAULTS = {
    statNameOptionValue: 'current',
    statProgressType: 'shared',
    statProgressMaxValue: null,
    coloringType: 'auto',
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
    nullMapping: undefined
};

var Ctrl = function (_sdk_1$MetricsPanelCt) {
    _inherits(Ctrl, _sdk_1$MetricsPanelCt);

    function Ctrl($scope, $injector, templateSrv) {
        _classCallCheck(this, Ctrl);

        var _this = _possibleConstructorReturn(this, (Ctrl.__proto__ || Object.getPrototypeOf(Ctrl)).call(this, $scope, $injector));

        _this.templateSrv = templateSrv;
        _this.statNameOptions = ['current', 'min', 'max', 'total'];
        _this.statProgressTypeOptions = ['max value', 'shared'];
        _this.coloringTypeOptions = ['auto', 'thresholds', 'key mapping'];
        _this.sortingOrderOptions = ['none', 'increasing', 'decreasing'];
        _this.valueLabelTypeOptions = ['absolute', 'percentage'];
        // TODO: change option names or add a tip in editor
        _this.mappingTypeOptions = ['datapoint to datapoint', 'target to datapoint'];
        _.defaults(_this.panel, DEFAULTS);
        _this._panelConfig = new panel_config_1.PanelConfig(_this.panel);
        _this._initStyles();
        progress_1.initProgress(_this._panelConfig, 'progressListPluginProgress');
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
            var items = this.mapper.mapMetricData(this._seriesList);
            if (this._panelConfig.getValue('sortingOrder') === 'increasing') {
                items = _.sortBy(items, function (i) {
                    return i.progress;
                });
            }
            if (this._panelConfig.getValue('sortingOrder') === 'decreasing') {
                items = _.sortBy(items, function (i) {
                    return -i.progress;
                });
            }
            this.$scope.items = items;
            this._element.find('.table-panel-scroll').css({
                'height': this.height + "px",
                'max-height': this.height + "px"
            });
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
            this.$scope.data = [];
            this.$scope.dataError = err;
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
                console.log(thisPanel);
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

/***/ "grafana/app/core/core":
/*!********************************!*\
  !*** external "app/core/core" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_grafana_app_core_core__;

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