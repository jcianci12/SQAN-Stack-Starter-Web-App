import { Directive,Output, EventEmitter, HostBinding, HostListener, HostBindingDecorator, Input } from '@angular/core';

@Directive({
  selector: '[appUpload]'
})

export class UploadDirective {



  @Output() onFileDropped = new EventEmitter<FileList>();
  @Input() UploadState: any
  @HostBinding('style.background-color') public background = '#fff';
  @HostBinding('style.opacity') public opacity = '1';

  constructor() { }


  //Dragover listener, when something is dragged over our host element
  @HostListener('dragover', ['$event']) onDragOver(evt:DragEvent) {
    console.log("dragover!")
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#9ecbec';
    this.opacity = '0.8'
  };

  //Dragleave listener, when something is dragged away from our host element
  @HostListener('dragleave', ['$event']) public onDragLeave(evt:DragEvent) {
    console.log("dragleave!")

    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#fff'
    this.opacity = '1'
  }

  @HostListener('drop', ['$event']) public ondrop(evt:DragEvent) {
    console.log("drop!")

    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#f5fcff'
    this.opacity = '1'
    let files = evt.dataTransfer!.files as FileList;
    console.log(files)
    if (files.length > 0) {
      this.onFileDropped.emit(files)
    }
  }


//   .css-selector {
//     background: linear-gradient(270deg, #47d6b1, #475fd6);
//     background-size: 400% 400%;

//     -webkit-animation: AnimationName 30s ease infinite;
//     -moz-animation: AnimationName 30s ease infinite;
//     animation: AnimationName 30s ease infinite;
// }

// @-webkit-keyframes AnimationName {
//     0%{background-position:0% 50%}
//     50%{background-position:100% 50%}
//     100%{background-position:0% 50%}
// }
// @-moz-keyframes AnimationName {
//     0%{background-position:0% 50%}
//     50%{background-position:100% 50%}
//     100%{background-position:0% 50%}
// }
// @keyframes AnimationName {
//     0%{background-position:0% 50%}
//     50%{background-position:100% 50%}
//     100%{background-position:0% 50%}
// }

}
