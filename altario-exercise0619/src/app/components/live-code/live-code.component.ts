import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { State } from 'src/app/model/state.model';
import { GeneratorService } from 'src/app/services/generator.service';

@Component({
  selector: 'app-live-code',
  templateUrl: './live-code.component.html',
  styleUrls: ['./live-code.component.css']
})
export class LiveCodeComponent implements OnInit, OnDestroy{

  public state: State = new State();
  public state$: Observable<State> = new Observable<State>();
  private onDestroy$: Subject<void> = new Subject();

  constructor(private generatorService: GeneratorService) {
    this.getState();
   }

  public ngOnInit(): void {
  }

  public ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  private getState(): void{
    this.generatorService.data$.pipe(takeUntil(this.onDestroy$)).subscribe((state) => {
      if (state){
        this.state = state;
      }
    });
  }
}
