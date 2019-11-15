import { PanelConfig } from './panel-config';

import * as _ from 'lodash';


export function getFormattedValue(
  value: number,
  prefix: string,
  postfix: string,
  decimals: number
): string {
  return `${prefix}${getFormattedFloat(value, decimals)}${postfix}`;
}

function getFormattedFloat(value: number, decimals: number): string {
  var dm = getDecimalsForValue(value, decimals).decimals;

  if(dm === 0) {
    return Math.round(value).toString();
  }

  var fv = value;
  for(var i = 0; i < dm; i++) {
    fv *= 10;
  };
  var fvs = Math.round(fv).toString();
  return fvs.substr(0, fvs.length - dm) + '.' + fvs.substr(fvs.length - dm);
}

function getDecimalsForValue(value: number, decimals?: number) {
  // based on https://github.com/grafana/grafana/blob/v4.1.1/public/app/plugins/panel/singlestat/module.ts
  if(_.isNumber(decimals)) {
    return {
      decimals,
      scaledDecimals: null
    };
  }

  var delta = value / 2;
  var dec = -Math.floor(Math.log(delta) / Math.LN10);

  var magn = Math.pow(10, -dec),
    norm = delta / magn, // norm is between 1.0 and 10.0
    size;

  if(norm < 1.5) {
    size = 1;
  } else if (norm < 3) {
    size = 2;
    // special case for 2.5, requires an extra decimal
    if (norm > 2.25) {
      size = 2.5;
      ++dec;
    }
  } else if(norm < 7.5) {
    size = 5;
  } else {
    size = 10;
  }

  size *= magn;

  // reduce starting decimals if not needed
  if(Math.floor(value) === value) {
    dec = 0;
  }

  var result: any = {};
  result.decimals = Math.max(0, dec);
  result.scaledDecimals = result.decimals - Math.floor(Math.log(size) / Math.LN10) + 2;

  return result;
}
