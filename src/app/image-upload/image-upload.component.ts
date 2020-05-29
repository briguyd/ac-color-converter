import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as ColorUtilities from '../color-utilities';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent implements OnInit {
  @ViewChild('image', { static: true }) image: ElementRef<HTMLImageElement>;
  @ViewChild('canvas', { static: true }) public canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('colorPreviewRGB', { static: true }) public colorPreviewRGB: ElementRef<HTMLCanvasElement>;
  url: string | ArrayBuffer;

  hsvVal = null;
  acVal = null;

  constructor() { }

  ngOnInit() {
  }

  onSelectFile(event) { // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      const ctx = this.canvas.nativeElement.getContext('2d');
      const reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      this.image.nativeElement.onload = () => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        this.scaleToFit(this.image.nativeElement, ctx);
      }

      reader.onload = (e: any) => { // called once readAsDataURL is completed
        this.url = e.target.result;
      };
    }
  }

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

    // const hex = '#' + ('000000' + ColorUtilities.rgbToHex(data[0], data[1], data[2])).slice(-6);
    const hsv = ColorUtilities.rgb2hsv(data[0], data[1], data[2])

    const ctxRGB = this.colorPreviewRGB.nativeElement.getContext('2d');
    ctxRGB.fillStyle = `rgb(${data[0]},${data[1]},${data[2]})`;
    ctxRGB.fillRect(0, 0, this.colorPreviewRGB.nativeElement.width, this.colorPreviewRGB.nativeElement.height);

    this.hsvVal = hsv;
    this.acVal = ColorUtilities.convertToACHSV(hsv);
  }
}
