import { DomService, State, TAG_CLASS_NAME } from '../services/document.service';
import { Context } from '../services/context.service';
import { IProcessor } from './processor';

export class TagProcessor implements IProcessor {
    getProcessorMethods(): ((context: Context, domService: DomService) => boolean)[] {
        return [
          this.processTagAfterBrTags,
          this.processTagStartInTagNode,
          this.removeEmptyTagValueAttribute,
          this.processAttributesOnlyTagEndAfterAttributeValue,
          this.processTagEndAfterAttrute,
          this.processAttributesOnlyTagEnd,
          this.processTagEnd,
          this.processTag,
          this.processTagInsedeTagValue,
          this.processTagValue
        ];
    }

    private processTagInsedeTagValue(context: Context, domService: DomService): boolean {
      if (context.previousKey === '<' && context.state === State.TagValue && !(context.textOffset === 0 || context.textOffset === context.textLenght)) {
        if (context.typedKey === 'Backspace') {
          return false;
        }

        (<HTMLElement>context.currentSpan).after(domService.createTagValue(context.text.textContent.substring(context.textOffset, context.textLenght)));
        context.text.textContent = context.text.textContent.substring(0, context.textOffset-1);
        return domService.insertAfter(context, domService.createTag(`<${context.typedKey}`), 1);
      }

      return false;
    }

    private processTagAfterBrTags(context: Context, domService: DomService): boolean {
      if (context.state === State.TagValue && context.typedKey === '<' && context.currentSpan.childNodes.length === 2 && context.currentSpan.nextSibling) {
        context.currentSpan.childNodes.forEach(tag => {
          if (tag.nodeName !== 'BR') {
            return false;
          }
        });

        context.currentSpan.childNodes[0].remove();

        const text = document.createTextNode('<');
        (<HTMLElement>context.currentSpan).className = TAG_CLASS_NAME;
        context.currentSpan.appendChild(text);
        context.selection.setPosition(text, 1);
        (<HTMLElement>context.currentSpan).after(domService.createTagValue(''));
        return true;
      }

      return false
    }

    private processTagStartInTagNode(context: Context, domService: DomService): boolean {
      if (context.state === State.Tag && context.textOffset === 0 && context.textLenght > 0 && context.typedKey === '<') {
        return domService.insertBefore(context, domService.createTag('<'));
      }

      return false;
    }

    private processTagEndAfterAttrute(context: Context, domService: DomService): boolean {
        if (context.state === State.AttributeValue && context.typedKey === '>') {
          return domService.insertAfter(context, domService.createTag(context.typedKey));
        }
    
        return false;
    }

    private processAttributesOnlyTagEnd(context: Context, domService: DomService): boolean {
        if (context.typedKey === '>' && context.previousKey === '/') {
          context.text.textContent = context.text.textContent.substring(0, context.selection.anchorOffset - 1);
          return domService.insertAfter(context, domService.createTag('/>'), 1);
        }
    
        return false;
    }
    
    private processAttributesOnlyTagEndAfterAttributeValue(context: Context, domService: DomService): boolean {
        if (context.typedKey === '>' && context.previousKey === '/' && context.state === State.AttributeValue) {
          context.text.textContent = context.text.textContent.substring(0, context.selection.anchorOffset - 1);
          return domService.insertAfter(context, domService.createTag('/>'), 1);
        }
    
        return false;
      }
    
    private removeEmptyTagValueAttribute(context: Context, domService: DomService): boolean {
        if (context.state === State.TagValue && context.typedKey === '<') {
            if (context.currentSpan.firstChild.nodeName === 'BR') {
                context.currentSpan.firstChild.remove();
            }
        }
    
        return false;
    }
    
    private processTagEnd(context: Context, domService: DomService): boolean {
        if (context.typedKey !== '>') {
          return false;
        }
    
        if (context.state === State.Tag) {
          return domService.insertAfter(context, domService.createTag(context.typedKey));
        }
    
        return false;
    }
    
    private processTagValue(context: Context, domService: DomService): boolean {
        if (context.state === State.Tag && context.previousKey === '>' && context.typedKey !== 'Backspace') {
            return domService.insertAfter(context, domService.createTagValue(context.typedKey));
        }
    
        return false;
    }
    
    private processTag(context: Context, domService: DomService): boolean {
        if (context.typedKey === '<' && (context.textLenght === 0 || context.textOffset === context.textLenght)) {
          return domService.insertAfter(context, domService.createTag(context.typedKey));
        }
    
        return false;
    }
}