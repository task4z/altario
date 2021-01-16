import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription, timer } from 'rxjs';
import { State } from '../model/state.model';

const size = { x: 10, y: 10 };
const percentage = 20;
const interval = 2000;
const alphabet = 'abcdefghijklmnopqrstuvwxyz';
const waitKeyPressed = 4000;

@Injectable({
  providedIn: 'root'
})
export class GeneratorService {

  constructor() { }

  private _char = '';
  private subscription: Subscription;
  private dataSource$: BehaviorSubject<State> = new BehaviorSubject<State>(new State());
  public data$: Observable<State> = this.dataSource$.asObservable();
  private disabled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isDisabled$: Observable<boolean> = this.disabled$.asObservable();

  public updatedDataSelection(): void{
    if (this.subscription){
      this.subscription.unsubscribe();
    }
    this.subscription = timer(0, interval).subscribe(() => this.dataSource$.next(this.generateState()));
  }

  public get char(): string{
      return this._char;
  }

  public set char(value: string){
      this._char = value;
  }

  public generateState(): State{
    const tmpState = new State();
    tmpState.grid = this.generateGrid();
    tmpState.live = true;
    tmpState.code = this.getCode(tmpState.grid);
    return tmpState;
  }

  public disable(): void{
    this.disabled$.next(true);
    setTimeout(() => this.disabled$.next(false), waitKeyPressed);
  }

  private generateGrid(): string[][]{
    const grid: string[][] = [];
    for (let x = 0; x < size.x; x++){
      grid.push(this.generateCells());
    }
    this.addCharacterTyped(grid);
    return grid;
  }

  private addCharacterTyped(grid: string[][]): void{
    if (!this._char){
      return;
    }
    const max = size.x * size.y * percentage * 0.01;
    for (let i = 0; i < max ; i = grid.reduce((acc, val) => acc.concat(val), []).filter(cell => cell === this._char).length ){
      grid[this.randomPosition('x')][this.randomPosition('y')] = this._char;
    }
  }

  private generateCells(): string[]{
    const tmpRow: string[] = [];
    for (let y = 0; y < size.y ; y++){
      tmpRow.push(this.randomChar());
    }
    return tmpRow;
  }

  private randomChar(): string{
    const tmpAlphabet = this._char ? alphabet.replace(this._char, '') : alphabet;
    return tmpAlphabet[Math.floor(Math.random() * tmpAlphabet.length)];
  }

  private randomPosition(prop: string): number{
    return Math.floor(Math.random() * size[prop]);
  }

  private getCode(grid: string[][]): string{
    const seconds: string[] = new Date().getSeconds().toString().split('');
    if (seconds.length === 1) {
      seconds.unshift('0');
    }

    return `${this.getIndividualNumberForCode(+seconds[0], +seconds[1], grid)}${this.getIndividualNumberForCode(+seconds[1], +seconds[0], grid)}`;
  }

  private getIndividualNumberForCode(x: number, y: number, grid: string[][]): string{
    const letter = grid[x][y];
    const res = grid.reduce((acc, val) => acc.concat(val), []).filter(cell => cell === letter).length;
    let tmpRes = res;
    for (let i = 2; tmpRes > 9; i++){
      tmpRes = res;
      tmpRes = Math.ceil(res / i);
    }
    return tmpRes.toString();
  }

}
