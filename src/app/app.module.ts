import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HtmlEditorModule } from './html-editor/html-editor.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HtmlEditorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
