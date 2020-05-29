import { HSV } from './hsv';

export function convertToACHSV(hsv: HSV): HSV {
  const oldHRange = 360;
  const newHRange = 29;
  const newHValue = ((hsv.h * newHRange) / oldHRange) + 1;

  const oldSRange = 100;
  const newSRange = 14;
  const newSValue = ((hsv.s * newSRange) / oldSRange) + 1;

  const oldVRange = 100;
  const newVRange = 14;
  const newVValue = ((hsv.v * newVRange) / oldVRange) + 1;

  return {h: Math.round(newHValue), s: Math.round(newSValue), v: Math.round(newVValue)};
}

export function rgbToHex(r: number, g: number, b: number) {
  if (r > 255 || g > 255 || b > 255) {
    return;
  }
  // tslint:disable-next-line: no-bitwise
  return ((r << 16) | (g << 8) | b).toString(16);
}

export function rgb2hsv(r: number, g: number, b: number) {
  let rabs, gabs, babs, rr, gg, bb, h, s, v, diff, diffc, percentRoundFn;
  rabs = r / 255;
  gabs = g / 255;
  babs = b / 255;
  v = Math.max(rabs, gabs, babs),
    diff = v - Math.min(rabs, gabs, babs);
  diffc = c => (v - c) / 6 / diff + 1 / 2;
  percentRoundFn = num => Math.round(num * 100) / 100;
  if (diff == 0) {
    h = s = 0;
  } else {
    s = diff / v;
    rr = diffc(rabs);
    gg = diffc(gabs);
    bb = diffc(babs);

    if (rabs === v) {
      h = bb - gg;
    } else if (gabs === v) {
      h = (1 / 3) + rr - bb;
    } else if (babs === v) {
      h = (2 / 3) + gg - rr;
    }
    if (h < 0) {
      h += 1;
    } else if (h > 1) {
      h -= 1;
    }
  }
  return {
    h: Math.round(h * 360),
    s: percentRoundFn(s * 100),
    v: percentRoundFn(v * 100)
  };
}
