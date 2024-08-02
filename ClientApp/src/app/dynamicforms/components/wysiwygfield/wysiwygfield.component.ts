import { Component, OnInit, Input } from '@angular/core';
 import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { QuestionBase } from '../../fieldclasses/question-base';
import { UntypedFormGroup, FormControl, Validators } from '@angular/forms';
//import * as ClassicEditor from '@ckeditor/ckeditor5-angular';

@Component({
  selector: 'app-wysiwygfield',
  templateUrl: './wysiwygfield.component.html',
  styleUrls: ['./wysiwygfield.component.css']
})

export class WysiwygfieldComponent implements OnInit {
  @Input() question!: QuestionBase<any>;
  @Input() form!: UntypedFormGroup;
  @Input() required!: Boolean;
  formcontrol: any;
  //public Editor = new  Balooned;
  showControl: Boolean | undefined;
  editorConfig;
  config: any;
   public Editor = ClassicEditor;

  constructor() {
      this.config = function( config: { language: string; uiColor: string; } ) {
        config.language = 'gb';
        config.uiColor = '#AADC6E';
    };
      this.editorConfig = {
        "editable": true,
        //"spellcheck": true,
        "height": "auto",
        "minHeight": "200",
        "width": "auto",
        "minWidth": "0",
        "translate": "yes",
        "enableToolbar": false,
        "showToolbar": true,
        "placeholder": "Enter text here...",
        "imageEndPoint": "",
        "toolbar": [
            ["bold", "italic", "underline", "strikeThrough", "superscript", "subscript"],
            ["fontName", "fontSize", "color"],
            ["justifyLeft", "justifyCenter", "justifyRight", "justifyFull", "indent", "outdent"],
            ["cut", "copy", "delete", "removeFormat", "undo", "redo"],
            ["paragraph", "blockquote", "removeBlockquote", "horizontalLine", "orderedList", "unorderedList"],
            //["link", "unlink", "image", "video"]
        ]
    }
  }
  ngOnInit() {
    //     //this.Editor = BalloonEditor;
    //     setTimeout(function (){    this.showControl = true
    // },2000)

    //this.showControl = true

    //this.formcontrol = new FormControl(this.question.value,[Validators.required])

    //this.form.addControl(this.question.key,this.formcontrol)
  }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.

  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    //this.Editor = null;
    //this.showControl = false
    //this.Editor
  }
}
