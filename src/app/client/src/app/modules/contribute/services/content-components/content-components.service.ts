import { Injectable } from '@angular/core';
import { BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContentComponentsService {

  private content = new BehaviorSubject<any>({});
  public contentdata = this.content.asObservable();

  constructor() { }

  setContentData(data) {
    this.content.next(data);
  }
}
