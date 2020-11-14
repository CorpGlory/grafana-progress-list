import { ProgressItem } from './mapper';

import * as _ from 'lodash';


export enum TooltipMode {
  SINGLE = 'single',
  ALL_SERIES = 'all series'
};

export type Position = {
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

  constructor(private tooltipMode: TooltipMode) {
    this.$tooltip = $('<div class="graph-tooltip">');
  }

  clear(): void {
    this._visible = false;
    this.$tooltip.detach();
  }

  show(pos: Position): void {
    this._visible = true;
    this._renderAndShow('hey <b>hey</b>', pos);
  }

  destroy(): void {
    this._visible = false;
    this.$tooltip.remove();
  }

  get visible(): boolean { return this._visible; }

  private _renderAndShow(innerHtml: string, pos: Position, showTitle = true): void {
    const title = showTitle ? `<div class="graph-tooltip-time">Current value</div>` : '';
    // TODO: move this "20" to a constant
    // TODO: check how this work when `pos` is close to the page bottom edge
    (this.$tooltip.html(title + innerHtml) as any).place_tt(pos.pageX + 20, pos.pageY);
  }

  private _convertSerieToHtml(serie: Serie, item: ProgressItem, isBold: boolean): string {
    return `
      <div class="graph-tooltip-list-item">
        <div class="graph-tooltip-series-name">
          ${isBold ? '<b>' : ''} ${serie.alias || serie.target} ${isBold ? '</b>' : ''}
        </div>
        <div class="graph-tooltip-value">${item.currentFormattedValue}</div>
      </div>
    `;
  }

  private _convertTitleAndValueToHtml(title: string, value: number): string {
    return `
      <div class="graph-tooltip-list-item">
        <div class="graph-tooltip-series-name">
          <b>${title}</b>
        </div>
        <div class="graph-tooltip-value">${value}</div>
      </div>
    `;
  }
}
