import { ProgressItem } from './mapper';

import * as _ from 'lodash';


export enum TooltipMode {
  SINGLE = 'single',
  ALL_SERIES = 'all series'
};

// TODO: move to types.ts
type Position = {
  pageX: number,
  pageY: number
};

// TODO: move to types.ts
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

  clear(): void {
    this._visible = false;
    this.$tooltip.detach();
  }

  show(pos: Position, index: number, title?: any, value?: any): void {
    this._visible = true;
    const seriesList = this.getSeriesFn();
    if (seriesList.length === 0) {
      return;
    }

    if(title !== undefined && value !== undefined) {
      const showTitle = false;
      this._renderAndShow(this._convertTitleAndValueToHtml(title, value), pos, showTitle);
      return;
    }

    let currentValues: string[] = [];
    if(this.tooltipMode === TooltipMode.ALL_SERIES) {
      currentValues = _.map(
        seriesList,
        (serie: Serie, idx: number) => this._convertSerieToHtml(serie, this.items[idx], index === idx)
      ).filter(value => value !== undefined);
    } else {
      currentValues = [this._convertSerieToHtml(seriesList[index], this.items[index], true)];
    }

    this._renderAndShow(currentValues.join('\n'), pos);
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
