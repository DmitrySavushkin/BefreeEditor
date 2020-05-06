import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  html1 = '<h1>Test</h1>';
  html = '';
  @ViewChild('preview', { static: false }) previewRef: ElementRef;

  processHtml(html: string) {
    this.html = html;
  }
}
