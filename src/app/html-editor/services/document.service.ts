import { Injectable } from '@angular/core';
import { Context } from './context.service';

export const TAG_CLASS_NAME = 'html-tag';
export const TAG_VALUE_CLASS_NAME = 'html-tag-value';
export const TAG_ATTRIBUTE_CLASS_NAME = 'html-tag-attribute';
export const TAG_ATTRIBUTE_VALUE_CLASS_NAME = 'html-tag-attribute-value';
export const TAG_ATTRIBUTE_ASSIGNMENT = 'html-tag-attribute-assignment';

export enum State {
    Tag,
    TagValue,
    Attribute,
    AttributeValue,
    AttributeAssignment,
    Text,
    None
  }

@Injectable({ providedIn: 'root'})
export class DomService {
    createAttributeAssignment(textValue: string): HTMLElement {
        return this.createSpan(TAG_ATTRIBUTE_ASSIGNMENT, textValue);
    }

    createAttributeValue(textValue: string): HTMLElement {
        return this.createSpan(TAG_ATTRIBUTE_VALUE_CLASS_NAME, textValue);
    }

    createAttribute(textValue: string): HTMLElement {
        return this.createSpan(TAG_ATTRIBUTE_CLASS_NAME, textValue);
    }

    createTagValue(textValue: string): HTMLElement {
        return this.createSpan(TAG_VALUE_CLASS_NAME, textValue);
    }

    createTag(textValue: string): HTMLElement {
        return this.createSpan(TAG_CLASS_NAME, textValue);
    }

    insertAfter(context: Context, node: Node, positionIndex = 1): boolean {
        context.selection.anchorNode.nodeName === 'DIV' ? 
            context.selection.anchorNode.appendChild(node) : 
            (<HTMLElement>context.currentSpan).after(node);

        context.selection.setPosition(node, positionIndex);

        return true;
    }

    insertBefore(context: Context, node: Node, positionIndex = 1): boolean {
        context.selection.anchorNode.nodeName === 'DIV' ? 
            context.selection.anchorNode.appendChild(node) : 
            (<HTMLElement>context.currentSpan).before(node);

        context.selection.setPosition(node, positionIndex);

        return true
    }

    resolveState(node: HTMLElement): State {
        if (!node || node.nodeName === '#text') {
            return State.None;
        }

        switch(node.className) {
            case TAG_CLASS_NAME:
                return State.Tag;
            case TAG_VALUE_CLASS_NAME:
                return State.TagValue;
            case TAG_ATTRIBUTE_CLASS_NAME:
                return State.Attribute;
            case TAG_ATTRIBUTE_VALUE_CLASS_NAME:
                return State.AttributeValue;
            case TAG_ATTRIBUTE_ASSIGNMENT:
                return State.AttributeAssignment;
            default:
                return State.None;
        }
    }

    isEndOfTheText(context: Context) {
        return context.text.textContent.length === context.selection.anchorOffset
    }

    private createSpan(className: string, textvalue: string) : HTMLElement {
        const span = document.createElement('span')
        span.className = className;
        span.appendChild(textvalue.length === 0 ? document.createElement('br') : document.createTextNode(textvalue));
        return span;
    }
}