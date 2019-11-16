import { PanelConfig } from './panel-config';
import { getFormattedValue } from './value_formatter';

import * as _ from 'lodash';
import { ProgressItem } from './mapper';


type Position = {
  pageX: number,
  pageY: number
}

export type Serie = {
  alias: string,
  datapoints: [number, number][]
}

export class GraphTooltip {

  private $tooltip: JQuery<HTMLElement>;
  private _maxValue: number;
  private _visible = false;

  constructor(
    private panelConfig: PanelConfig,
    private getSeriesFn: () => Serie[],
    items: ProgressItem[]
  ) {
    this.$tooltip = $('<div class="graph-tooltip">');
    this._maxValue = items[0].maxValue;
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
      let value = _.first(_.last(serie.datapoints));
      if(value === undefined) {
        return;
      }

      if(this.panelConfig.getValue('valueLabelType') === 'percentage') {
        value = 100 * value / this._maxValue;
      }

      const formatedValue = getFormattedValue(
        value,
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
            ${formatedValue}
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

