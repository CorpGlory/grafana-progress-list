import { PanelConfig } from './panel-config';
import { getFormattedValue } from './value_formatter';

import * as _ from 'lodash';
import { ProgressItem } from './mapper';


type Position = {
  pageX: number,
  pageY: number
}

export type Serie = {
  datapoints: [number, number][],
  target: string,
  alias?: string
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

  show(pos: Position, index: number) {
    this._visible = true;
    const seriesList = this.getSeriesFn();
    if (seriesList.length === 0) {
    }

    const currentValues = _.map(seriesList, (serie: Serie, idx: number) => {
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

      const isCurrentItem = index === idx;
      const html = `
        <div class="graph-tooltip-list-item">
          <div class="graph-tooltip-series-name">
            ${isCurrentItem ? '<b>' : ''}
            ${serie.alias || serie.target}
            ${isCurrentItem ? '</b>' : ''}
          </div>
          <div class="graph-tooltip-value">
            ${formatedValue}
          </div>
        </div>
      `;

      return html;
    });

    this._renderAndShow(currentValues.join('\n'), pos);
  };

  destroy() {
    this._visible = false;
    this.$tooltip.remove();
  };

  get visible() { return this._visible; }

  private _renderAndShow(innerHtml: string, pos: Position): void {
    (this.$tooltip.html(innerHtml) as any).place_tt(pos.pageX + 20, pos.pageY);
  };


}

