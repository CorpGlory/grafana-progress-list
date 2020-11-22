import * as _ from 'lodash';

import { Bar, ProgressBar } from './progress_bar'
import { TooltipMode } from './panel_config';


export type Position = {
  pageX: number,
  pageY: number
};

// TODO: check if we need this
export type Serie = {
  datapoints: [number, number][],
  target: string,
  alias?: string
};

export class GraphTooltip {

  private $tooltip: JQuery<HTMLElement>;
  private _visible = false;

  constructor() {
    this.$tooltip = $('<div class="graph-tooltip">');
  }

  show(pos: Position, progressBars: ProgressBar[], mode: TooltipMode): void {
    if(mode == TooltipMode.NONE) {
      return;
    }
    this._visible = true;
    // TODO: use more vue/react approach here
    // TODO: maybe wrap this rendering logic into classes
    if(mode == TooltipMode.SINGLE) {
      let activeItem = _.find(progressBars, item => item.active);
      var html = `<div class="graph-tooltip-time">Current value</div>`;
      if(activeItem === undefined) {
        throw new Error(
          'Can`t find any active item to show current value in tooltip'
        );
      }
      html += progressBar2Html(activeItem);
    } else if (mode == TooltipMode.ALL_SERIES) {
      // TODO: build this string faster
      var html = progressBars.map(progressBar2Html).join('');
    } else {
      throw new Error('unknown tooltip type');
    }

    // TODO: move this "20" to a constant
    // TODO: check how this work when `pos` is close to the page bottom edge
    (this.$tooltip.html(html) as any).place_tt(pos.pageX + 20, pos.pageY).show();
  }

  hide(): void {
    this._visible = false;
    this.$tooltip.hide();
  }

  get visible(): boolean { return this._visible; }

}

/** VIEW **/

function progressBar2Html(progressBar: ProgressBar): string {
  return `
    <div class="graph-tooltip-list-item">
      <div class="graph-tooltip-series-name">
        ${progressBar.active ? '<b>' : ''} 
        ${progressBar.title}
        ${progressBar.active ? '</b>' : ''}
      </div>
      ${progressBarBars2Html(progressBar.bars)}
    </div>
  `;
}

function progressBarBars2Html(bars: Bar[]): string {
  return bars.map(bar => `
    <div class="graph-tooltip-value">
      ${bar.value}
    </div>
  `).join('');
}
