import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Payment } from 'src/app/model/payment.model';
import { State } from 'src/app/model/state.model';
import { GeneratorService } from 'src/app/services/generator.service';
import { PaymentsService } from 'src/app/services/payments.service';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit, OnDestroy {

  public onDestroy$: Subject<void> = new Subject();
  public payments: Payment[];
  public paymentForm: FormGroup;
  public state: State;

  constructor(private generatorService: GeneratorService,
              private paymentService: PaymentsService,
              private fb: FormBuilder) {
      this.createForm();
    }

  public ngOnInit(): void{
    this.getState();
    this.getPayments();
  }

  public ngOnDestroy(): void{
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  public onSubmit(): void{
    const payment: Payment = {
      code : this.state?.code ? this.state?.code : null,
      grid : this.state?.grid ? this.state?.grid : null,
      name : this.paymentForm.controls.description.value,
      amount : this.paymentForm.controls.amount.value,
      elementsToCheck: this.state?.grid ? this.state?.grid.reduce((e, arr) => e.concat(arr), []).length : null
    };
    this.paymentService.updatedDataSelection(payment);
  }

  private createForm(): void{
    this.paymentForm = this.fb.group({
      description: ['', Validators.required],
      amount: ['', Validators.required],
    });
  }

  private getState(): void{
    this.generatorService.data$.pipe(takeUntil(this.onDestroy$)).subscribe((state) => {
      if (state){
        this.state = state;
      }
    });
  }

  private getPayments(): void{
    this.paymentService.payment$.pipe(takeUntil(this.onDestroy$)).subscribe((payments) => {
      if (payments){
        this.payments = payments;
      }
    });
  }

  public callFakeApi(): void{
    this.paymentService.fakeApiCall(this.payments).pipe(takeUntil(this.onDestroy$)).subscribe({
      next: () => alert('Successfully added payments!'),
      error: err => alert(`Error: ${err}`),
      complete: () => {}
    });
  }
}
