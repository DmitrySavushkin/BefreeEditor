import { DomService } from '../services/document.service';
import { Context } from '../services/context.service';

export interface IProcessor {
    getProcessorMethods(): ((context: Context, domService: DomService) => boolean)[];
}