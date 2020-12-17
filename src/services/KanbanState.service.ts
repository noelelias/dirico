import { BehaviorSubject } from "rxjs";

enum FieldTypes {title, subheader, image, paragraph};
enum DisplayStates {data, edit}

export type Column = {title: string; position: number};
export type Card = {column: Column, fields: Array<{field: Field, value: any}>, states: Record<string, any>};
export type Field = {name: string, type: FieldTypes};

class KanbanState {
    private static KanbanState:KanbanState;

    public columns = new BehaviorSubject(new Array<Column>());
    public cards = new BehaviorSubject(new Array<Card>());
    public fields = new BehaviorSubject(new Array<Field>());

    private constructor() {}

    public static _() {
        if (KanbanState.KanbanState) {
            return KanbanState.KanbanState;
        } else {
            KanbanState.KanbanState = new KanbanState();
            return KanbanState.KanbanState;
        }
    }

    setCardDisplayStateByCard(card: Card, displayState: DisplayStates) {
        card.states['display'] = displayState;
        const cards = this.cards.getValue();
        cards[cards.indexOf(card)] = card;
        this.cards.next(cards);
    }

    getCardsByColumn(column: Column) {
        return this.cards.getValue().filter(card => card.column.position === column.position);
    }

    getFieldByType(card: Card, fieldType: FieldTypes) {
        card.fields.filter(field => {if (!field) debugger;});
        return card.fields.filter(field => field.field.type === fieldType);
    }

    replaceFieldByType(card: Card, fieldType: FieldTypes, newValue: any, index?: number) {
        let indexCount = 0;
        card.fields = card.fields.map(field => {
            if (field.field.type === fieldType) {
                if (index && indexCount !== index) {
                    indexCount++;
                } else {
                    field.value = newValue;
                }
            }
            return field;
        });
        this.cards.next(this.cards.getValue());
    }
}

export default KanbanState;
export {FieldTypes, DisplayStates};