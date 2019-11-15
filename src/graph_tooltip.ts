import { PanelConfig } from './panel-config';
import { getFormattedValue } from './value_formatter';

import * as _ from 'lodash';


type Position = {
  pageX: number,
  pageY: number
}

export type Serie = {
  alias: string,
  datapoints: number[]
}

export class GraphTooltip {

  private $tooltip: JQuery<HTMLElement>;
  private _visible = false;

  constructor(
    private $elem: JQuery<HTMLElement>,
    private dashboard,
    private scope,
    private panelConfig: PanelConfig,
    private getSeriesFn: () => Serie[]
  ) {
    this.$tooltip = $('<div class="graph-tooltip">');
  }

  clear() {
    this._visible = false;
    this.$tooltip.detach();
  };

  show(pos: Position) {
    this._visible = true;
    const seriesList = this.getSeriesFn();
    if (seriesList.length === 0) {
    }

    const currentValues = seriesList.map(serie => {
      const lastPoit = _.last(serie.datapoints);
      if(lastPoit === undefined) {
        return;
      }
      const value = getFormattedValue(
        lastPoit[0],
        this.panelConfig.getValue('prefix'),
        this.panelConfig.getValue('postfix'),
        this.panelConfig.getValue('decimals')
      );
      return `
        <div class="graph-tooltip-list-item">
          <div class="graph-tooltip-series-name">
            ${serie.alias}
          </div>
          <div class="graph-tooltip-value">
            ${value}
          </div>
        </div>`;
    });


    this._renderAndShow(currentValues, pos);
  };

  destroy() {
    this._visible = false;
    this.$tooltip.remove();
  };

  get visible() { return this._visible; }
  
  private _renderAndShow(innerHtml, pos) {
    (this.$tooltip.html(innerHtml) as any).place_tt(pos.pageX + 20, pos.pageY);
  };

 
}

