import { Component, OnInit,Input ,ViewChild,ElementRef,AfterViewInit,Renderer2,RendererStyleFlags2} from '@angular/core';


@Component({
  selector: 'app-loading-specific',
  templateUrl: './loading-specific.component.html',
  styleUrls: ['./loading-specific.component.css']
})
export class LoadingSpecificComponent implements OnInit,AfterViewInit {

@Input() spinnerColor:string;
@Input() spinnerClass:string;
@Input() spinnerBlog:boolean;
 @ViewChild('spinnerNodeParent')spinnerNodeParent:ElementRef;

  constructor(private renderer2:Renderer2) { }

  ngOnInit() {


  }
  ngAfterViewInit()
  {
  		this.spinnerNodeParent.nativeElement.childNodes.forEach((node)=>{
           this.renderer2.setStyle(node,'background',this.spinnerColor||'#ccd9ff',RendererStyleFlags2.Important);
  		});
  }
  
}
