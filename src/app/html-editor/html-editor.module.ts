import { NgModule } from '@angular/core'
import { HtmlEditorDirective } from './directives/html-editor.directive';
import { DomService } from './services/document.service';
import { ContextService } from './services/context.service';
import { SafeHtmlPipe } from './pipe/safe-html.pipe';

@NgModule({
    imports: [],
    exports: [HtmlEditorDirective, SafeHtmlPipe],
    declarations: [HtmlEditorDirective, SafeHtmlPipe],
    providers: [DomService, ContextService]
})
export class HtmlEditorModule {}