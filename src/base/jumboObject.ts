import { Jumbo } from '../jumbo';

export class JumboObject {
    constructor(protected readonly jumbo: Jumbo, protected readonly authRequired: boolean) {}
}
