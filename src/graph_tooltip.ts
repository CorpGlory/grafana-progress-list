import * as _ from 'lodash';

import { Bar } from './progress_bar'
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

export class TooltipItem {
  constructor(
    public active: boolean, 
    public name: string,
    public elems: Bar[]
  ) {
  }

  toHtml(): string {
    return `
      <div class="graph-tooltip-list-item">
        <div class="graph-tooltip-series-name">
          ${this.active ? '<b>' : ''} 
          ${this.name}
          ${this.active ? '</b>' : ''}
        </div>
        ${this._valuesToHtml()}
      </div>
    `;
  }
  
  private _valuesToHtml(): string {
    return this.elems.map(barElem => `
      <div class="graph-tooltip-value">
        ${barElem.value}
      </div>
    `).join('');
  }

}

export class GraphTooltip {

  private $tooltip: JQuery<HTMLElement>;
  private _visible = false;

  constructor() {
    this.$tooltip = $('<div class="graph-tooltip">');
  }

  show(pos: Position, items: TooltipItem[], mode: TooltipMode): void {
    if(mode == TooltipMode.NONE) {
      return;
    }
    this._visible = true;
    // TODO: use more vue/react approach here
    // TODO: maybe wrap this rendering logic into classes
    if(mode == TooltipMode.SINGLE) {
      let activeItem = _.find(items, item => item.active);
      var html = `<div class="graph-tooltip-time">Current value</div>`;
      if(activeItem === undefined) {
        throw new Error(
          'Can`t find any active item to show current value in tooltip'
        );
      }
      html += activeItem.toHtml();
    } else if (mode == TooltipMode.ALL_SERIES) {
      // TODO: build this string faster
      var html = items.map(i => i.toHtml()).join('');
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
