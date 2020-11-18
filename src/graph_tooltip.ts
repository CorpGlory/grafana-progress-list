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

export type TooltipValue = {
  value: string,
  color: string
}

export class TooltipItem {
  constructor(
    public active: boolean, 
    public name: string,
    public values: TooltipValue[]
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
    return this.values.map(v => `
      <div class="graph-tooltip-value">
        ${v.value}
      </div>
    `).join('');
  }

}

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

  show(pos: Position, items: TooltipItem[] ): void {
    this._visible = true;
    // TODO: use more vue/react approach here
    let html = items.map(i => i.toHtml()).join('');
    this._renderAndShow(html, pos);
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
}
