import { BehaviorSubject } from 'rxjs';
import { skip } from 'rxjs/operators';
import { Transaction } from '../types';

const DEFAULT = {} as Transaction;

export const pendingSubject = new BehaviorSubject<Transaction>(DEFAULT).pipe(skip(1)) as BehaviorSubject<Transaction>;
