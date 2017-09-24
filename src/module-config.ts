export class ModuleConfig {
  public static init(panel) {
    if(ModuleConfig._instance) {
      throw new Error("Error: Instantiation failed: Use ModuleConfig.getInstance() instead of new.");
    }
    ModuleConfig._instance = new ModuleConfig(panel);
  }

  public static getInstance(): ModuleConfig {
    if(!ModuleConfig._instance) {
      throw new Error("Error: ModuleConfig isn't created yet.");
    }
    return ModuleConfig._instance;
  }
  
  public getValue(key: string): any {
    return this._panel[key];
  }
  
  public setValue(key: string, value: any): void {
    this._panel[key] = value;
  }
  
  private static _instance?: ModuleConfig = undefined;

  private _panel: any;
  private constructor(panel: any) {
    this._panel = panel;
  }
  private _pluginDirName?: string;
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