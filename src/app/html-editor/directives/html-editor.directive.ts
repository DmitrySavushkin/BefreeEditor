import { Directive, HostListener, Input, OnInit, Output, EventEmitter, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Context, ContextService } from '../services/context.service';
import { DomService } from '../services/document.service';
import { TagProcessor } from '../processors/tag.processor';
import { AttributeProcessor } from '../processors/attribute.processor';
import { LIST_OF_KEYS_TO_IGNORE } from '../processors/ignore-list';
import { LineBreakProcessor } from '../processors/line-break.processor';
import { element } from 'protractor';

@Directive({
  selector: '[befreeHtmlEditor]'
})
export class HtmlEditorDirective implements OnInit {
  private context: Context = new Context();

  @Input() befreeHtmlEditor: string = '';

  @Input() processMethods: ((context: Context, domService: DomService) => boolean)[] = [];

  @Output() getHtml = new EventEmitter<string>();

  constructor(private contextService: ContextService, private domService: DomService, private el: ElementRef) {}

  ngOnInit() {
    /* Collects all processors. */
    this.processMethods.push(...(new LineBreakProcessor().getProcessorMethods()));
    this.processMethods.push(...(new TagProcessor().getProcessorMethods()));
    this.processMethods.push(...(new AttributeProcessor().getProcessorMethods()));

    /* Highlight html text. */
    this.highlightHtml();
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (LIST_OF_KEYS_TO_IGNORE.includes(event.key)) {
      return;
    }

    this.contextService.refreshContext(event, this.context, this.domService);
    this.processActions(this.processMethods);
    this.context.currentSpan.normalize();
  }

  @HostListener('keyup', ['$event'])
  onKeyUp() {
    this.getHtml.next(this.processHtmlOutput(this.el.nativeElement));
  }
  
  @HostListener('blur', ['$event'])
  onFocusOut(event) {
    const divElem = (<Node>event.srcElement);
    if(divElem.textContent.length === 0) {
      divElem.childNodes.forEach(node => node.remove());
    }
  }

  @HostListener('focus', ['$event'])
  onFocus(event: FocusEvent) {
    if((<Node>event.srcElement).childNodes.length === 0) {
      const tag = this.domService.createTagValue('');
      (<Node>event.srcElement).appendChild(tag);
      document.getSelection().setPosition(tag);
      this.contextService.refreshContext(null, this.context, this.domService);
    }
  }

  private processActions(actionsList: ((context, domService) => boolean)[]) {
    for (let i = 0; i < actionsList.length; i++) {
      if (actionsList[i](this.context, this.domService)) {
        event.preventDefault();
        break;
      }
    }
  }

  private processHtmlOutput(element: HTMLElement): string {
    const div = document.createElement('div');
    div.innerHTML = element.outerHTML.replace(/(&nbsp;)/g, ' ');
    return div.textContent;
  }

  private highlightHtml() {
    /* Emitts the "focus" event on the editor to create initial span tag. */
    const focusEvent = new FocusEvent('focus', { cancelable: true, relatedTarget: this.el.nativeElement });
    (<HTMLElement>this.el.nativeElement).dispatchEvent(focusEvent);

    /* Highlights the provided html text using the "keydown" event.  */
    for (var i = 0; i < this.befreeHtmlEditor.length; i++) {
      var keydownEvent = new KeyboardEvent('keydown', { key: this.befreeHtmlEditor.charAt(i), cancelable: true });
      (<HTMLElement>this.el.nativeElement).dispatchEvent(keydownEvent);
      
      if (!keydownEvent.defaultPrevented) {
        this.context.text.textContent += this.befreeHtmlEditor.charAt(i);
        document.getSelection().setPosition(this.context.text, ++this.context.textOffset);
      }
    }

    /* Emitts the "keyup" event on the editor to release focus and update the visual editor if it was assigned. */
    var keyupEvent = new KeyboardEvent('keyup', { cancelable: true });
    (<HTMLElement>this.el.nativeElement).dispatchEvent(keyupEvent);
  }
}