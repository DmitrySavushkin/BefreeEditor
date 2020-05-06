import { Context } from '../services/context.service';
import { DomService, State } from '../services/document.service';
import { IProcessor } from './processor';

export class LineBreakProcessor implements IProcessor {
    getProcessorMethods(): ((context: Context, domService: DomService) => boolean)[] {
        return [
            this.processLinkBreakAfterTagEnd,
            this.processLinkBreakAfterBreakAtTheBegining,
            this.processLineBrakerInsideText,
            this.ignoreEnterIfItIsNotProcessed
        ];
    }

    processLinkBreakAfterTagEnd(context: Context, domService: DomService): boolean {
        if (context.typedKey === 'Enter' && context.state === State.Tag && context.textOffset !== 0 && context.previousKey === '>') {
            if (context.currentSpan.nextSibling && context.currentSpan.nextSibling.firstChild.nodeName === 'BR') {
                context.currentSpan.nextSibling.firstChild.remove();
            }

            const tagValue = domService.createTagValue('');
            tagValue.appendChild(document.createElement('br'));
            return domService.insertAfter(context, tagValue, 1);
        }

        return false;
    }

    processLinkBreakAfterBreakAtTheBegining(context: Context, domService: DomService): boolean {
        if (context.typedKey === 'Enter' && context.textLenght !== 0 && context.textOffset === 0) {
            if (context.text.previousSibling && context.text.previousSibling.nodeName === 'BR') {
                const breakLine = document.createElement('br');
                (<HTMLElement>context.text.previousSibling).before(breakLine);
                return true;
            }
        }

        return false;
    }

    processLineBrakerInsideText(context: Context, domService: DomService): boolean {
        if (context.typedKey === 'Enter' && context.textOffset > 0 && context.textOffset !== context.textLenght) {
            const firstText = document.createTextNode(context.text.textContent.substring(0, context.textOffset));
            const secondText = document.createTextNode(context.text.textContent.substring(context.textOffset, context.textLenght));
            const breakLine = document.createElement('br');
            context.currentSpan.replaceChild(breakLine, context.text);
            (<HTMLElement>breakLine).before(firstText);
            (<HTMLElement>breakLine).after(secondText);
            context.selection.setPosition(secondText, 0);
            return true;
        }

        return false;
    }

    ignoreEnterIfItIsNotProcessed(context: Context, domService: DomService): boolean {
        if (context.typedKey === 'Enter') {
            return true;
        }

        return false;
    }
}