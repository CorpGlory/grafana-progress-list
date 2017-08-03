/// <reference path="./module-config.ts" />
/// <reference path="./mapper.ts" />


import { ModuleConfig } from './module-config';
import { Mapper } from './mapper';


import { MetricsPanelCtrl } from 'app/plugins/sdk';
declare var System: any; // app/headers/common can be imported 



class Ctrl extends MetricsPanelCtrl {
  static templateUrl = "partials/template.html";
  
  public mapper: Mapper;
  private _panelPath? :string;
  
  constructor($scope, $injector) {
    super($scope, $injector);
    ModuleConfig.init(this.panel);
    this._initStyles();

    this.mapper = new Mapper();
    
    this.events.on('init-edit-mode', this._onInitEditMode.bind(this));
    this.events.on('data-received', this._onDataReceived.bind(this));
  }

  link(scope, element) {
  }
  
  _initStyles() {
    System.import(this.panelPath + 'css/panel.base.css!');
    if (window['grafanaBootData'].user.lightTheme) {
      System.import(this.panelPath + 'css/panel.light.css!');
    } else {
      System.import(this.panelPath + 'css/panel.dark.css!');
    }
  }

  _onDataReceived(seriesList) {
  }
  
  _onInitEditMode() {
    var thisPartialPath = this.panelPath + 'partials/';
    this.addEditorTab(
      'Data Mapping', thisPartialPath + 'editor.mapping.html', 2
    );
  }

  _dataError(err) {
    this.$scope.data = [];
    this.$scope.dataError = err;
  }
  
  get panelPath() {
    if(!this._panelPath) {
      var panels = window['grafanaBootData'].settings.panels;
      var thisPanel = panels[this.pluginId];
      // the system loader preprends publib to the url,
      // add a .. to go back one level
      this._panelPath = '../' + thisPanel.baseUrl + '/';
    }
    return this._panelPath;
  }
}


export { Ctrl as PanelCtrl }
