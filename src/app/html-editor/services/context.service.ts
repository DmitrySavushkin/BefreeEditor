import { Injectable } from '@angular/core';
import { DomService, State } from './document.service';

@Injectable({ providedIn: 'root' })
export class ContextService {
    refreshContext(event: KeyboardEvent, context: Context, domService: DomService)  {
        context.keyboardEvent = event;
        context.selection = document.getSelection();

        if (context.selection.anchorNode.nodeName === '#text') {
            context.text = <HTMLElement>context.selection.anchorNode;
            context.currentSpan = context.selection.anchorNode.parentElement;
        } else if (context.selection.anchorNode.nodeName === 'SPAN') {
            context.currentSpan = context.selection.anchorNode;
            context.text = <HTMLElement>context.selection.anchorNode.firstChild;
        }

        context.previousSpan = context.currentSpan ? context.currentSpan.previousSibling : null;
        context.state = domService.resolveState(<HTMLElement>context.currentSpan);
        context.previousState = domService.resolveState(<HTMLElement>context.previousSpan);
        context.typedKey = context.keyboardEvent ? context.keyboardEvent.key : null;
        context.previousKey = context.text.textContent.charAt(context.selection.anchorOffset - 1);
        context.textOffset = context.selection.anchorOffset;
        context.textLenght = context.text.textContent.length;
      }
}

/**
 * Represents context object.
 */
export class Context {
    public keyboardEvent: KeyboardEvent;
    public state = State.None;
    public previousState = State.None;
    public nextState = State.None;
    public text: HTMLElement = null;
    public currentSpan: Node = null;
    public previousSpan: Node = null;
    public selection: Selection;
    public typedKey: string;
    public previousKey: string;
    public textOffset: number;
    public textLenght: number;
}