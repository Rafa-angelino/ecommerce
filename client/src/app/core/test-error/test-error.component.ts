import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-test-error',
  templateUrl: './test-error.component.html',
  styleUrls: ['./test-error.component.scss']
})
export class TestErrorComponent {
  baseUrl = environment.apiUrl;
  validationErrors: string[] = [];

  constructor(private http: HttpClient){}

  get404Error(){
    this.http.get(this.baseUrl + 'products/42').subscribe({
      next: response => console.log(response),
      error : err => console.warn('An error occurred:',err) // Error handling here

    })
  }

  get500Error(){
    this.http.get(this.baseUrl + 'buggy/servererror').subscribe({
      next: response => console.log(response),
      error : err => console.warn('An error occurred:',err) // Error handling here

    })
  }

  get400Error(){
    this.http.get(this.baseUrl + 'buggy/badrequest').subscribe({
      next: response => console.log(response),
      error : err => console.warn('An error occurred:',err) // Error handling here

    })
  }

  get400ValidationError(){
    this.http.get(this.baseUrl + 'products/quatro').subscribe({
      next: response => console.log(response),
      error : err => {
        console.log(err);
        this.validationErrors = err.errors;

      }

    })
  }

}
