export class PanelConfig {

  private _panel: any;
  public constructor(panel: any) {
    this._panel = panel;
  }

  public getValue(key: string): any {
    return this._panel[key];
  }

  public setValue(key: string, value: any): void {
    this._panel[key] = value;
  }

  private _pluginDirName: string;
  public get pluginDirName(): string {
    if(!this._pluginDirName) {
      var panels = window['grafanaBootData'].settings.panels;
      var thisPanel = panels[this._panel.type];
      // the system loader preprends publib to the url,
      // add a .. to go back one level
      this._pluginDirName = '../' + thisPanel.baseUrl + '/';
    }
    return this._pluginDirName;
  }

}