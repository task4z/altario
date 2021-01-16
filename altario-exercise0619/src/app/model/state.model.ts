export class State {
    public code: string;
    public live: boolean;
    public grid: string[][];

    constructor() {
        this.code =  '';
        this.live =  false;
        this.grid =  [];
    }
}
