import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable} from 'rxjs';
import { Configs } from '../model/configs.model';
import { Payment } from '../model/payment.model';

const defaultSize = 5;
@Injectable({
  providedIn: 'root'
})
export class PaymentsService {

  private url = '';
  private dataSource$ = new BehaviorSubject<Payment[]>(new Array(defaultSize).fill({}));
  private payments: Payment[] = new Array(defaultSize).fill({});
  public payment$ = this.dataSource$.asObservable();

  constructor(private http: HttpClient) {
    this.http.get<Configs>('../../assets/config.json').toPromise().then(urls => {
      this.url = urls.apiUrl;
    });
  }

  public updatedDataSelection(payment: Payment): void{
    this.handlePaymentsArray(payment);
    this.dataSource$.next(this.payments);
  }

  public fakeApiCall(payments: Payment[]): Observable<any>{
    return this.http.post<any>(`${this.url}/InsertPayments`, payments);
  }

  private handlePaymentsArray(payment: Payment): void {
    this.payments = this.payments.filter(({code}) => code);
    this.payments.push(payment);
    while (this.payments.length < defaultSize){
      this.payments.push({});
    }
  }
}
