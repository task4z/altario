import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { State } from 'src/app/model/state.model';
import { GeneratorService } from 'src/app/services/generator.service';

@Component({
  selector: 'app-generator',
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.css']
})
export class GeneratorComponent implements OnInit, OnDestroy{

  public state: State = new State();
  private onDestroy$: Subject<void> = new Subject();
  public character: FormControl = new FormControl('', Validators.maxLength(1));

  constructor(private generatorService: GeneratorService) { }

  public ngOnInit(): void{
    this.character.setValue(this.generatorService.char);
    this.getState();
    this.getDisabled();
  }

  public ngOnDestroy(): void{
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  public keyPressAlphaNumeric(e: KeyboardEvent): boolean{
    const tmpLetter = String.fromCharCode(e.keyCode);
    if (/[a-z]/.test(tmpLetter)) {
      return true;
    } else {
      e.preventDefault();
      return false;
    }
  }

  public enterPressed(): void{
    if (this.character.value !== this.generatorService.char){
      this.generatorService.char = this.character.value;
      this.generatorService.disable();
    }
    this.generateGrid();
  }

  public cssWidthClass(): string{
    return `${100 / this.state.grid.length}%`;
  }

  private generateGrid(): void{
    this.generatorService.updatedDataSelection();
  }

  private getState(): void{
    this.generatorService.data$.pipe(takeUntil(this.onDestroy$)).subscribe((state) => {
      if (state){
        this.state = state;
      }
    });
  }

  private getDisabled(): void {
    this.character.disable();
    this.generatorService.isDisabled$.pipe(takeUntil(this.onDestroy$)).subscribe((disabled) => {
      if (disabled){
        return this.character.disable();
      }
      this.character.enable();
    });
  }
}
