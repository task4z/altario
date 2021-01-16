export class Payment{
    public code?: string;
    public grid?: string[][];
    public name?: string;
    public amount?: number;
    public elementsToCheck?: number;

    constructor(){
        this.code = null;
        this.grid = null;
        this.name = null;
        this.amount = null;
        this.elementsToCheck = null;
    }
}
