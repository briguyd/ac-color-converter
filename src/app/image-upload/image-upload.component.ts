import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent implements OnInit {
  @ViewChild('image', { static: true }) image: ElementRef;
  @ViewChild('canvas', { static: true }) public canvas: ElementRef;
  // @ViewChild('colorPreview') public colorPreview: ElementRef;
  @ViewChild('colorPreviewRGB', { static: true }) public colorPreviewRGB: ElementRef;
  url: string | ArrayBuffer;

  hsvVal = null;
  acVal = null;

  constructor() { }

  ngOnInit() {
  }

  onSelectFile(event) { // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (e: any) => { // called once readAsDataURL is completed
        this.url = e.target.result;

        const ctx = this.canvas.nativeElement.getContext('2d');
        // var img = document.getElementById("scream");
        setTimeout(() => {
          ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
          this.scaleToFit(this.image.nativeElement, ctx);
          // ctx.drawImage(this.image.nativeElement, 10, 10);
        }, 200);
        // ctx.drawImage(this.image.nativeElement, 10, 10);
      };
    }
  }
  //   drawImageScaled(img, ctx) {
  //     const canvas = ctx.canvas ;
  //     const hRatio = canvas.width  / img.width    ;
  //     const vRatio =  canvas.height / img.height  ;
  //     const ratio  = 1 / Math.min ( hRatio, vRatio );
  //     const centerShiftX = ( canvas.width - img.width * ratio ) / 2;
  //     const centerShiftY = ( canvas.height - img.height * ratio ) / 2;
  //     ctx.clearRect(0, 0, canvas.width, canvas.height);
  //     ctx.drawImage(img, 0, 0, img.width, img.height,
  //                        centerShiftX, centerShiftY, img.width * ratio, img.height * ratio);
  //  }

  scaleToFit(img, ctx){
    // get the scale
    const scale = Math.min(ctx.canvas.width / img.width, ctx.canvas.height / img.height);
    // get the top left position of the image
    const x = (ctx.canvas.width / 2) - (img.width / 2) * scale;
    const y = (ctx.canvas.height / 2) - (img.height / 2) * scale;
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
}

  getColor(event: any) {
    const data = this.canvas.nativeElement.getContext('2d').getImageData(event.offsetX, event.offsetY, 1, 1).data;

    const hex = '#' + ('000000' + this.rgbToHex(data[0], data[1], data[2])).slice(-6);
    // console.log( );
    // // alert('HEX: ' + hex + ' ' + this.rgb2hsv(data[0], data[1], data[2]));
    // console.log();
    const hsv = this.rgb2hsv(data[0], data[1], data[2])

    // const ctx = this.colorPreview.nativeElement.getContext('2d');
    // ctx.fillStyle = `hsl(${hsv.h}, ${hsv.s}%,${hsv.v}%)`;
    // ctx.fillRect(0, 0, this.colorPreview.nativeElement.width, this.colorPreview.nativeElement.height);

    const ctxRGB = this.colorPreviewRGB.nativeElement.getContext('2d');
    ctxRGB.fillStyle = `rgb(${data[0]},${data[1]},${data[2]})`;
    ctxRGB.fillRect(0, 0, this.colorPreviewRGB.nativeElement.width, this.colorPreviewRGB.nativeElement.height);

    this.hsvVal = hsv;
    this.acVal = this.convertToAC(hsv);
  }


  convertToAC(hsv) {
    const oldHRange = 360;
    const newHRange = 30;
    const newHValue = ((hsv.h * newHRange) / oldHRange);

    const oldSRange = 100;
    const newSRange = 15;
    const newSValue = ((hsv.s * newSRange) / oldSRange);

    const oldVRange = 100;
    const newVRange = 15;
    const newVValue = ((hsv.v * newVRange) / oldVRange);

    return {h: Math.round(newHValue), s: Math.round(newSValue), v: Math.round(newVValue)};
  }


  rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255) {
      return;
    }
    // tslint:disable-next-line: no-bitwise
    return ((r << 16) | (g << 8) | b).toString(16);
  }

  rgb2hsv(r, g, b) {
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
}
