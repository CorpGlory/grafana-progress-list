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
eval("\n\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar core_1 = __webpack_require__(/*! grafana/app/core/core */ \"grafana/app/core/core\");\nvar directiveInited = false;\nfunction initProgress(panelConfig) {\n    var directiveName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'progress';\n\n    if (directiveInited) {\n        return;\n    }\n    directiveInited = true;\n    core_1.coreModule.directive(directiveName, function () {\n        return {\n            templateUrl: panelConfig.pluginDirName + 'directives/progress.html',\n            restrict: 'E',\n            scope: {\n                item: '=',\n                onHover: '&',\n                onMouseLeave: '&'\n            }\n        };\n    });\n}\nexports.initProgress = initProgress;\n\n//# sourceURL=webpack:///./directives/progress.ts?");

/***/ }),

/***/ "./graph_tooltip.ts":
/*!**************************!*\
  !*** ./graph_tooltip.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar _ = __webpack_require__(/*! lodash */ \"lodash\");\nvar TooltipMode;\n(function (TooltipMode) {\n    TooltipMode[\"SINGLE\"] = \"single\";\n    TooltipMode[\"ALL_SERIES\"] = \"all series\";\n})(TooltipMode = exports.TooltipMode || (exports.TooltipMode = {}));\n;\n\nvar GraphTooltip = function () {\n    function GraphTooltip(getSeriesFn, items, tooltipMode) {\n        _classCallCheck(this, GraphTooltip);\n\n        this.getSeriesFn = getSeriesFn;\n        this.items = items;\n        this.tooltipMode = tooltipMode;\n        this._visible = false;\n        this.$tooltip = $('<div class=\"graph-tooltip\">');\n    }\n\n    _createClass(GraphTooltip, [{\n        key: \"clear\",\n        value: function clear() {\n            this._visible = false;\n            this.$tooltip.detach();\n        }\n    }, {\n        key: \"show\",\n        value: function show(pos, index) {\n            var _this = this;\n\n            this._visible = true;\n            var seriesList = this.getSeriesFn();\n            if (seriesList.length === 0) {\n                return;\n            }\n            var currentValues = [];\n            if (this.tooltipMode === TooltipMode.ALL_SERIES) {\n                currentValues = _.map(seriesList, function (serie, idx) {\n                    return _this._convertSerieToHtml(serie, _this.items[idx], index === idx);\n                }).filter(function (value) {\n                    return value !== undefined;\n                });\n            } else {\n                currentValues = [this._convertSerieToHtml(seriesList[index], this.items[index], true)];\n            }\n            this._renderAndShow(currentValues.join('\\n'), pos);\n        }\n    }, {\n        key: \"destroy\",\n        value: function destroy() {\n            this._visible = false;\n            this.$tooltip.remove();\n        }\n    }, {\n        key: \"_renderAndShow\",\n        value: function _renderAndShow(innerHtml, pos) {\n            var title = \"<div class=\\\"graph-tooltip-time\\\">Current value</div>\";\n            this.$tooltip.html(title + innerHtml).place_tt(pos.pageX + 20, pos.pageY);\n        }\n    }, {\n        key: \"_convertSerieToHtml\",\n        value: function _convertSerieToHtml(serie, item, isBold) {\n            var html = \"\\n      <div class=\\\"graph-tooltip-list-item\\\">\\n        <div class=\\\"graph-tooltip-series-name\\\">\\n          \" + (isBold ? '<b>' : '') + \"\\n          \" + (serie.alias || serie.target) + \"\\n          \" + (isBold ? '</b>' : '') + \"\\n        </div>\\n        <div class=\\\"graph-tooltip-value\\\">\\n          \" + item.currentFormattedValue + \"\\n        </div>\\n      </div>\\n    \";\n            return html;\n        }\n    }, {\n        key: \"visible\",\n        get: function get() {\n            return this._visible;\n        }\n    }]);\n\n    return GraphTooltip;\n}();\n\nexports.GraphTooltip = GraphTooltip;\n\n//# sourceURL=webpack:///./graph_tooltip.ts?");

/***/ }),

/***/ "./mapper.ts":
/*!*******************!*\
  !*** ./mapper.ts ***!
  \*******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar value_formatter_1 = __webpack_require__(/*! ./value_formatter */ \"./value_formatter.ts\");\nvar module_1 = __webpack_require__(/*! ./module */ \"./module.ts\");\nvar _ = __webpack_require__(/*! lodash */ \"lodash\");\nvar StatType;\n(function (StatType) {\n    StatType[\"CURRENT\"] = \"current\";\n    StatType[\"MIN\"] = \"min\";\n    StatType[\"MAX\"] = \"max\";\n    StatType[\"TOTAL\"] = \"total\";\n})(StatType = exports.StatType || (exports.StatType = {}));\n;\n\nvar ProgressItem = function () {\n    function ProgressItem(panelConfig, key, aggregatedValue, maxAggregatedValue, currentValue, currentMaxValue) {\n        _classCallCheck(this, ProgressItem);\n\n        this._panelConfig = panelConfig;\n        this._key = key;\n        this._aggregatedValue = aggregatedValue;\n        this._maxAggregatedValue = maxAggregatedValue;\n        // TODO: currentValue and currentMaxValue is not the best idea\n        this._currentValue = currentValue;\n        this._currentMaxValue = currentMaxValue;\n    }\n\n    _createClass(ProgressItem, [{\n        key: \"title\",\n        get: function get() {\n            return this._key;\n        }\n    }, {\n        key: \"aggregatedProgress\",\n        get: function get() {\n            return 100 * this._aggregatedValue / this._maxAggregatedValue;\n        }\n    }, {\n        key: \"currentProgress\",\n        get: function get() {\n            return 100 * this._currentValue / this._currentMaxValue;\n        }\n    }, {\n        key: \"maxValue\",\n        get: function get() {\n            return this._maxAggregatedValue;\n        }\n    }, {\n        key: \"aggregatedValue\",\n        get: function get() {\n            return this._aggregatedValue;\n        }\n    }, {\n        key: \"currentValue\",\n        get: function get() {\n            return this._currentValue;\n        }\n    }, {\n        key: \"currentFormattedValue\",\n        get: function get() {\n            var value = this._panelConfig.getValue('valueLabelType') === 'percentage' ? this.currentProgress : this._currentValue;\n            return value_formatter_1.getFormattedValue(value, this._panelConfig.getValue('prefix'), this._panelConfig.getValue('postfix'), this._panelConfig.getValue('decimals'));\n        }\n    }, {\n        key: \"formattedValue\",\n        get: function get() {\n            var value = this._panelConfig.getValue('valueLabelType') === 'percentage' ? this.aggregatedProgress : this._aggregatedValue;\n            return value_formatter_1.getFormattedValue(value, this._panelConfig.getValue('prefix'), this._panelConfig.getValue('postfix'), this._panelConfig.getValue('decimals'));\n        }\n    }, {\n        key: \"opacity\",\n        get: function get() {\n            return this._panelConfig.getValue('opacity');\n        }\n    }, {\n        key: \"color\",\n        get: function get() {\n            var _this = this;\n\n            var colorType = this._panelConfig.getValue('coloringType');\n            if (colorType === 'auto') {\n                return 'auto';\n            }\n            if (colorType === 'thresholds') {\n                var thresholdsStr = this._panelConfig.getValue('thresholds');\n                var colors = this._panelConfig.getValue('colors');\n                var value = this.aggregatedProgress;\n                if (thresholdsStr === undefined) {\n                    return colors[0];\n                }\n                var thresholds = thresholdsStr.split(',').map(parseFloat);\n                for (var i = thresholds.length; i > 0; i--) {\n                    if (value >= thresholds[i - 1]) {\n                        return colors[i];\n                    }\n                }\n                return colors[0];\n            }\n            if (colorType === 'key mapping') {\n                var colorKeyMappings = this._panelConfig.getValue('colorKeyMappings');\n                var keyColorMapping = _.find(colorKeyMappings, function (k) {\n                    return k.key === _this._key;\n                });\n                if (keyColorMapping === undefined) {\n                    return this._panelConfig.getValue('colorsKeyMappingDefault');\n                }\n                return keyColorMapping.color;\n            }\n            throw new Error('Unknown color type ' + colorType);\n        }\n    }, {\n        key: \"titleParams\",\n        get: function get() {\n            var titleType = this._panelConfig.getValue('titleViewType');\n            switch (titleType) {\n                case module_1.TitleViewOptions.SEPARATE_TITLE_LINE:\n                    return {\n                        barHeight: 8,\n                        titleTopMargin: 0,\n                        valueTopMargin: -22\n                    };\n                case module_1.TitleViewOptions.INLINE:\n                    return {\n                        barHeight: 20,\n                        titleTopMargin: -20,\n                        valueTopMargin: -18\n                    };\n                default:\n                    throw new Error(\"Wrong titleType: \" + titleType);\n            }\n        }\n    }]);\n\n    return ProgressItem;\n}();\n\nexports.ProgressItem = ProgressItem;\n\nvar Mapper = function () {\n    function Mapper(panelConfig, templateSrv) {\n        _classCallCheck(this, Mapper);\n\n        this._panelConfig = panelConfig;\n        this._templateSrv = templateSrv;\n    }\n\n    _createClass(Mapper, [{\n        key: \"mapMetricData\",\n        value: function mapMetricData(seriesList) {\n            var _this2 = this;\n\n            var statType = this._panelConfig.getValue('statNameOptionValue');\n            var mappingType = this._panelConfig.getValue('mappingType');\n            var statProgressType = this._panelConfig.getValue('statProgressType');\n            var statProgressMaxValue = this._panelConfig.getValue('statProgressMaxValue');\n            var alias = this._panelConfig.getValue('alias');\n            var nullMapping = this._panelConfig.getValue('nullMapping');\n            if (seriesList === undefined || seriesList.length == 0) {\n                return [];\n            }\n            var kstat = [];\n            var currentStat = [];\n            if (mappingType === 'datapoint to datapoint') {\n                if (statType === StatType.TOTAL && seriesList.length == 1) {\n                    kstat = this._mapKeysTotal(seriesList);\n                } else {\n                    kstat = this._mapNumeric(seriesList, statType, nullMapping);\n                }\n                currentStat = this._mapNumeric(seriesList, StatType.CURRENT, nullMapping);\n            } else {\n                kstat = this._mapTargetToDatapoints(seriesList, statType);\n                currentStat = this._mapTargetToDatapoints(seriesList, StatType.CURRENT);\n            }\n            var maxValue = this._getMaxValue(kstat, statProgressType, statProgressMaxValue);\n            var currentMaxValue = this._getMaxValue(currentStat, statProgressType, statProgressMaxValue);\n            if (alias !== '') {\n                kstat.forEach(function (k) {\n                    var scopedVars = {\n                        __key: { value: k[0] }\n                    };\n                    k[0] = _this2._templateSrv.replace(alias, scopedVars);\n                });\n            }\n            return _.map(kstat, function (k, idx) {\n                return new ProgressItem(_this2._panelConfig, k[0], k[1], maxValue, currentStat[idx][1], currentMaxValue);\n            });\n        }\n        // TODO: enum statProgressType\n\n    }, {\n        key: \"_getMaxValue\",\n        value: function _getMaxValue(kstat, statProgressType, statProgressMaxValue) {\n            if (statProgressType === 'shared') {\n                var total = 0;\n                for (var i = 0; i < kstat.length; i++) {\n                    total += kstat[i][1];\n                }\n                return total;\n            }\n            if (statProgressType === 'max value') {\n                var max = -Infinity;\n                if (statProgressMaxValue !== null) {\n                    max = statProgressMaxValue;\n                } else {\n                    for (var _i = 0; _i < kstat.length; _i++) {\n                        max = Math.max(kstat[_i][1], max);\n                    }\n                }\n                return max;\n            }\n            return -1;\n        }\n    }, {\n        key: \"_mapKeysTotal\",\n        value: function _mapKeysTotal(seriesList) {\n            if (seriesList.length !== 1) {\n                throw new Error('Expecting list of keys: got more than one timeseries');\n            }\n            var kv = {};\n            var datapointsLength = seriesList[0].datapoints.length;\n            for (var i = 0; i < datapointsLength; i++) {\n                var k = seriesList[0].datapoints[i][0].toString();\n                if (kv[k] === undefined) {\n                    kv[k] = 0;\n                }\n                kv[k]++;\n            }\n            var res = [];\n            for (var _k in kv) {\n                res.push([_k, kv[_k]]);\n            }\n            return res;\n        }\n    }, {\n        key: \"_mapNumeric\",\n        value: function _mapNumeric(seriesList, statType, nullMapping) {\n            if (seriesList.length != 2) {\n                throw new Error('Expecting timeseries in format (key, value). You can use keys only in total mode');\n            }\n            if (seriesList[0].datapoints.length !== seriesList[1].datapoints.length) {\n                throw new Error('Timeseries has different length');\n            }\n            var kv = {};\n            var datapointsLength = seriesList[0].datapoints.length;\n            for (var i = 0; i < datapointsLength; i++) {\n                var k = seriesList[0].datapoints[i][0].toString();\n                var v = seriesList[1].datapoints[i][0];\n                var vn = parseFloat(v);\n                if (v === null) {\n                    if (nullMapping === undefined || nullMapping === null) {\n                        throw new Error('Got null value. You set null value mapping in Options -> Mapping -> Null');\n                    }\n                    console.log('nullMapping ->' + nullMapping);\n                    vn = nullMapping;\n                }\n                if (isNaN(vn)) {\n                    throw new Error('Got non-numberic value: ' + v);\n                }\n                if (kv[k] === undefined) {\n                    kv[k] = [];\n                }\n                kv[k].push(vn);\n            }\n            var res = [];\n            for (var _k2 in kv) {\n                res.push([_k2, this._flatSeries(kv[_k2], statType)]);\n            }\n            return res;\n        }\n    }, {\n        key: \"_mapTargetToDatapoints\",\n        value: function _mapTargetToDatapoints(seriesList, statType) {\n            var _this3 = this;\n\n            return seriesList.map(function (serie) {\n                return [serie.target, _this3._flatSeries(serie.datapoints.map(function (datapoint) {\n                    return datapoint[0];\n                }), statType)];\n            });\n        }\n    }, {\n        key: \"_flatSeries\",\n        value: function _flatSeries(values, statType) {\n            if (values.length === 0) {\n                return 0;\n            }\n            if (statType === StatType.TOTAL) {\n                return _.sum(values);\n            }\n            if (statType === StatType.MAX) {\n                return _.max(values);\n            }\n            if (statType === StatType.MIN) {\n                return _.min(values);\n            }\n            if (statType === StatType.CURRENT) {\n                return _.last(values);\n            }\n            return 0;\n        }\n    }]);\n\n    return Mapper;\n}();\n\nexports.Mapper = Mapper;\n\n//# sourceURL=webpack:///./mapper.ts?");

/***/ }),

/***/ "./module.ts":
/*!*******************!*\
  !*** ./module.ts ***!
  \*******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return call && (typeof call === \"object\" || typeof call === \"function\") ? call : self; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function, not \" + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }\n\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar graph_tooltip_1 = __webpack_require__(/*! ./graph_tooltip */ \"./graph_tooltip.ts\");\nvar panel_config_1 = __webpack_require__(/*! ./panel-config */ \"./panel-config.ts\");\nvar mapper_1 = __webpack_require__(/*! ./mapper */ \"./mapper.ts\");\nvar progress_1 = __webpack_require__(/*! ./directives/progress */ \"./directives/progress.ts\");\nvar sdk_1 = __webpack_require__(/*! grafana/app/plugins/sdk */ \"grafana/app/plugins/sdk\");\nvar _ = __webpack_require__(/*! lodash */ \"lodash\");\nvar TitleViewOptions;\n(function (TitleViewOptions) {\n    TitleViewOptions[\"SEPARATE_TITLE_LINE\"] = \"Separate title line\";\n    TitleViewOptions[\"INLINE\"] = \"Inline\";\n})(TitleViewOptions = exports.TitleViewOptions || (exports.TitleViewOptions = {}));\n;\nvar DEFAULTS = {\n    statNameOptionValue: mapper_1.StatType.CURRENT,\n    statProgressType: 'shared',\n    statProgressMaxValue: null,\n    coloringType: 'auto',\n    titleViewType: TitleViewOptions.SEPARATE_TITLE_LINE,\n    sortingOrder: 'none',\n    valueLabelType: 'percentage',\n    mappingType: 'datapoint to datapoint',\n    alias: '',\n    prefix: '',\n    postfix: '',\n    thresholds: '10, 30',\n    // https://github.com/grafana/grafana/blob/v4.1.1/public/app/plugins/panel/singlestat/module.ts#L57\n    colors: ['rgba(245, 54, 54, 0.9)', 'rgba(237, 129, 40, 0.89)', 'rgba(50, 172, 45, 0.97)'],\n    colorsKeyMappingDefault: 'rgba(245, 54, 54, 0.9)',\n    colorKeyMappings: [],\n    nullMapping: undefined,\n    tooltipMode: graph_tooltip_1.TooltipMode.ALL_SERIES,\n    opacity: 0.5\n};\n\nvar Ctrl = function (_sdk_1$MetricsPanelCt) {\n    _inherits(Ctrl, _sdk_1$MetricsPanelCt);\n\n    function Ctrl($scope, $injector, templateSrv) {\n        _classCallCheck(this, Ctrl);\n\n        var _this = _possibleConstructorReturn(this, (Ctrl.__proto__ || Object.getPrototypeOf(Ctrl)).call(this, $scope, $injector));\n\n        _this.templateSrv = templateSrv;\n        _this.statNameOptions = _.values(mapper_1.StatType);\n        _this.statProgressTypeOptions = ['max value', 'shared'];\n        _this.coloringTypeOptions = ['auto', 'thresholds', 'key mapping'];\n        _this.titleViewTypeOptions = _.values(TitleViewOptions);\n        _this.sortingOrderOptions = ['none', 'increasing', 'decreasing'];\n        _this.valueLabelTypeOptions = ['absolute', 'percentage'];\n        // TODO: change option names or add a tip in editor\n        _this.mappingTypeOptions = ['datapoint to datapoint', 'target to datapoint'];\n        _this.tooltipModeOptions = _.values(graph_tooltip_1.TooltipMode);\n        _.defaults(_this.panel, DEFAULTS);\n        _this._panelConfig = new panel_config_1.PanelConfig(_this.panel);\n        _this._initStyles();\n        progress_1.initProgress(_this._panelConfig, 'progressListPluginProgress');\n        _this.mapper = new mapper_1.Mapper(_this._panelConfig, _this.templateSrv);\n        _this.items = [];\n        _this.events.on('init-edit-mode', _this._onInitEditMode.bind(_this));\n        _this.events.on('data-received', _this._onDataReceived.bind(_this));\n        _this.events.on('render', _this._onRender.bind(_this));\n        return _this;\n    }\n\n    _createClass(Ctrl, [{\n        key: \"link\",\n        value: function link(scope, element) {\n            this._element = element;\n        }\n    }, {\n        key: \"_initStyles\",\n        value: function _initStyles() {\n            // small hack to load base styles\n            var cssPath = this._panelConfig.pluginDirName.replace('public/', '');\n            sdk_1.loadPluginCss({\n                light: cssPath + 'css/panel.base.css',\n                dark: cssPath + 'css/panel.base.css'\n            });\n            sdk_1.loadPluginCss({\n                light: cssPath + 'css/panel.light.css',\n                dark: cssPath + 'css/panel.dark.css'\n            });\n        }\n    }, {\n        key: \"_onRender\",\n        value: function _onRender() {\n            var _this2 = this;\n\n            var items = this.mapper.mapMetricData(this._seriesList);\n            if (this._panelConfig.getValue('sortingOrder') === 'increasing') {\n                items = _.sortBy(items, function (i) {\n                    return i.aggregatedProgress;\n                });\n            }\n            if (this._panelConfig.getValue('sortingOrder') === 'decreasing') {\n                items = _.sortBy(items, function (i) {\n                    return -i.aggregatedProgress;\n                });\n            }\n            this.$scope.items = items;\n            this._element.find('.table-panel-scroll').css({\n                'height': this.height + \"px\",\n                'max-height': this.height + \"px\"\n            });\n            if (this._tooltip !== undefined) {\n                this._tooltip.destroy();\n            }\n            this._tooltip = new graph_tooltip_1.GraphTooltip(function () {\n                return _this2._seriesList;\n            }, items, this.panel.tooltipMode);\n        }\n    }, {\n        key: \"onHover\",\n        value: function onHover(index, event) {\n            this._tooltip.show(event.originalEvent, index);\n        }\n    }, {\n        key: \"onMouseLeave\",\n        value: function onMouseLeave() {\n            this._tooltip.clear();\n        }\n    }, {\n        key: \"_onDataReceived\",\n        value: function _onDataReceived(seriesList) {\n            this._seriesList = seriesList;\n            this.render();\n        }\n    }, {\n        key: \"_onInitEditMode\",\n        value: function _onInitEditMode() {\n            var thisPartialPath = this._panelConfig.pluginDirName + 'partials/';\n            this.addEditorTab('Options', thisPartialPath + 'options.html', 2);\n        }\n    }, {\n        key: \"invertColorOrder\",\n        value: function invertColorOrder() {\n            var tmp = this.panel.colors[0];\n            this.panel.colors[0] = this.panel.colors[2];\n            this.panel.colors[2] = tmp;\n            this.render();\n        }\n    }, {\n        key: \"addColorKeyMapping\",\n        value: function addColorKeyMapping() {\n            this.panel.colorKeyMappings.push({\n                key: 'KEY_NAME',\n                color: 'rgba(50, 172, 45, 0.97)'\n            });\n        }\n    }, {\n        key: \"removeColorKeyMapping\",\n        value: function removeColorKeyMapping(index) {\n            this.panel.colorKeyMappings.splice(index, 1);\n            this.render();\n        }\n    }, {\n        key: \"_dataError\",\n        value: function _dataError(err) {\n            this.$scope.data = [];\n            this.$scope.dataError = err;\n        }\n    }]);\n\n    return Ctrl;\n}(sdk_1.MetricsPanelCtrl);\n\nCtrl.templateUrl = 'partials/template.html';\nexports.PanelCtrl = Ctrl;\n\n//# sourceURL=webpack:///./module.ts?");

/***/ }),

/***/ "./panel-config.ts":
/*!*************************!*\
  !*** ./panel-config.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nObject.defineProperty(exports, \"__esModule\", { value: true });\n\nvar PanelConfig = function () {\n    function PanelConfig(panel) {\n        _classCallCheck(this, PanelConfig);\n\n        this._panel = panel;\n    }\n\n    _createClass(PanelConfig, [{\n        key: \"getValue\",\n        value: function getValue(key) {\n            return this._panel[key];\n        }\n    }, {\n        key: \"setValue\",\n        value: function setValue(key, value) {\n            this._panel[key] = value;\n        }\n    }, {\n        key: \"pluginDirName\",\n        get: function get() {\n            if (!this._pluginDirName) {\n                var panels = window['grafanaBootData'].settings.panels;\n                var thisPanel = panels[this._panel.type];\n                // the system loader preprends publib to the url,\n                // add a .. to go back one level\n                this._pluginDirName = thisPanel.baseUrl + '/';\n            }\n            return this._pluginDirName;\n        }\n    }]);\n\n    return PanelConfig;\n}();\n\nexports.PanelConfig = PanelConfig;\n\n//# sourceURL=webpack:///./panel-config.ts?");

/***/ }),

/***/ "./value_formatter.ts":
/*!****************************!*\
  !*** ./value_formatter.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar _ = __webpack_require__(/*! lodash */ \"lodash\");\nfunction getFormattedValue(value, prefix, postfix, decimals) {\n    return \"\" + prefix + getFormattedFloat(value, decimals) + postfix;\n}\nexports.getFormattedValue = getFormattedValue;\nfunction getFormattedFloat(value, decimals) {\n    var dm = getDecimalsForValue(value, decimals).decimals;\n    if (dm === 0) {\n        return Math.round(value).toString();\n    }\n    var fv = value;\n    for (var i = 0; i < dm; i++) {\n        fv *= 10;\n    }\n    ;\n    var fvs = Math.round(fv).toString();\n    return fvs.substr(0, fvs.length - dm) + '.' + fvs.substr(fvs.length - dm);\n}\nfunction getDecimalsForValue(value, decimals) {\n    // based on https://github.com/grafana/grafana/blob/v4.1.1/public/app/plugins/panel/singlestat/module.ts\n    if (_.isNumber(decimals)) {\n        return {\n            decimals: decimals,\n            scaledDecimals: null\n        };\n    }\n    var delta = value / 2;\n    var dec = -Math.floor(Math.log(delta) / Math.LN10);\n    var magn = Math.pow(10, -dec),\n        norm = delta / magn,\n        // norm is between 1.0 and 10.0\n    size = void 0;\n    if (norm < 1.5) {\n        size = 1;\n    } else if (norm < 3) {\n        size = 2;\n        // special case for 2.5, requires an extra decimal\n        if (norm > 2.25) {\n            size = 2.5;\n            ++dec;\n        }\n    } else if (norm < 7.5) {\n        size = 5;\n    } else {\n        size = 10;\n    }\n    size *= magn;\n    // reduce starting decimals if not needed\n    if (Math.floor(value) === value) {\n        dec = 0;\n    }\n    var result = {};\n    result.decimals = Math.max(0, dec);\n    result.scaledDecimals = result.decimals - Math.floor(Math.log(size) / Math.LN10) + 2;\n    return result;\n}\n\n//# sourceURL=webpack:///./value_formatter.ts?");

/***/ }),

/***/ "grafana/app/core/core":
/*!********************************!*\
  !*** external "app/core/core" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = __WEBPACK_EXTERNAL_MODULE_grafana_app_core_core__;\n\n//# sourceURL=webpack:///external_%22app/core/core%22?");

/***/ }),

/***/ "grafana/app/plugins/sdk":
/*!**********************************!*\
  !*** external "app/plugins/sdk" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = __WEBPACK_EXTERNAL_MODULE_grafana_app_plugins_sdk__;\n\n//# sourceURL=webpack:///external_%22app/plugins/sdk%22?");

/***/ }),

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = __WEBPACK_EXTERNAL_MODULE_lodash__;\n\n//# sourceURL=webpack:///external_%22lodash%22?");

/***/ })

/******/ })});;