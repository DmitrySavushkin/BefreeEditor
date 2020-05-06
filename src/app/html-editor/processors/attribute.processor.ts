import { DomService, State } from '../services/document.service';
import { Context } from '../services/context.service';
import { IProcessor } from './processor';

export class AttributeProcessor implements IProcessor {
    getProcessorMethods(): ((context: Context, domService: DomService) => boolean)[] {
        return [
          this.processAttributesWithoutValue,
          this.processFollowUpAttributes,
          this.processFirstAttribute,
          this.processAttributeAssignment,
          this.processAttributeValue,
        ];
    }

    private processAttributesWithoutValue(context: Context, domService: DomService): boolean {
      if (context.state === State.Attribute && context.typedKey === ' ') {
        return domService.insertAfter(context, domService.createAttribute('\u00A0'));
      }

      return false;
    }

    private processFollowUpAttributes(context: Context, domService: DomService): boolean {
        if (context.state !== State.AttributeValue) {
          return false;
        }
    
        const firstCharacter = context.text.textContent.charAt(0);
        const lastCharacter = context.text.textContent.charAt(context.text.textContent.length - 1);
        
        if (firstCharacter === '"' && lastCharacter=== '"' && context.typedKey === ' ' && domService.isEndOfTheText(context)) {
          return domService.insertAfter(context, domService.createAttribute('\u00A0'));
        }
    }
    
    private processAttributeValue(context: Context, domService: DomService): boolean {
        if (context.state === State.AttributeAssignment) {
          return domService.insertAfter(context, domService.createAttributeValue(context.typedKey));
        }
    
        return false;
    }
    
    private processAttributeAssignment(context: Context, domService: DomService): boolean {
        if (context.state === State.Attribute && context.typedKey === '=') {
          return domService.insertAfter(context, domService.createAttributeAssignment('='));
        }
    
        return false;
    }
    
    private processFirstAttribute(context: Context, domService: DomService): boolean {
        if (context.state === State.Tag && context.typedKey === ' ' && domService.isEndOfTheText(context)) {
          return domService.insertAfter(context, domService.createAttribute('\u00A0'));
        }
    
        return false;
    }
}