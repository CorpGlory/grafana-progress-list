import { PanelConfig } from './panel-config';

import * as _ from 'lodash';
import { ProgressItem } from './mapper';


export enum TooltipMode {
  SINGLE = 'single',
  ALL_SERIES = 'all series'
};

type Position = {
  pageX: number,
  pageY: number
};

export type Serie = {
  datapoints: [number, number][],
  target: string,
  alias?: string
};

export class GraphTooltip {

  private $tooltip: JQuery<HTMLElement>;
  private _visible = false;

  constructor(
    private getSeriesFn: () => Serie[],
    private items: ProgressItem[],
    private tooltipMode: TooltipMode
  ) {
    this.$tooltip = $('<div class="graph-tooltip">');
  }

  clear() {
    this._visible = false;
    this.$tooltip.detach();
  };

  show(pos: Position, index: number): void {
    this._visible = true;
    const seriesList = this.getSeriesFn();
    if (seriesList.length === 0) {
      return;
    }

    let currentValues: string[] = [];
    if(this.tooltipMode === TooltipMode.ALL_SERIES) {
      currentValues = _.map(
        seriesList,
        (serie: Serie, idx: number) => this._convertSerieToHtml(serie, this.items[idx], index === idx)
      )
        .filter(value => value !== undefined);
    } else {
      currentValues = [this._convertSerieToHtml(seriesList[index], this.items[index], true)];
    }

    this._renderAndShow(currentValues.join('\n'), pos);
  };

  destroy() {
    this._visible = false;
    this.$tooltip.remove();
  };

  get visible() { return this._visible; }

  private _renderAndShow(innerHtml: string, pos: Position): void {
    const title = `<div class="graph-tooltip-time">Current value</div>`;
    (this.$tooltip.html(title + innerHtml) as any).place_tt(pos.pageX + 20, pos.pageY);
  };

  private _convertSerieToHtml(serie: Serie, item: ProgressItem, isBold: boolean): string {
    const html = `
      <div class="graph-tooltip-list-item">
        <div class="graph-tooltip-series-name">
          ${isBold ? '<b>' : ''}
          ${serie.alias || serie.target}
          ${isBold ? '</b>' : ''}
        </div>
        <div class="graph-tooltip-value">
          ${item.currentFormattedValue}
        </div>
      </div>
    `;

    return html;
  }
}

