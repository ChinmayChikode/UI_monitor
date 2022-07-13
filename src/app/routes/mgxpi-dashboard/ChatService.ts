import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { urls } from '@env/accessurls';
// Mock remote service

export interface ChatbotLog {
    recipient_id;
    text;
}

@Injectable()
export class ChatService {


  chatbotLog: ChatbotLog[];
  public readonly responses: Subject<string> = new Subject<string>();

  constructor(private http: HttpClient) { }

  public submit(question: string): void {
    /*const length = question.length;
    const answer = `"${question}" contains exactly ${length} symbols.`;

    setTimeout(
      () => this.responses.next(answer),
      1000
    );*/

    const tokenHeaders = new HttpHeaders(
        {
          'Content-Type': 'application/json',
           Accept: 'application/json'
        }
      );

    const body = {
        sender:"Sudeep Masare",
        message:question
    };

    this.http.post(urls.CHATBOT_URL, body, { headers: tokenHeaders })
        .subscribe(
          (tokenResponse: any) => {
            if(tokenResponse.length > 0){
              setTimeout(
                () => this.responses.next(tokenResponse[0].text),
                2000
              );
            } else {
              this.responses.next("Sorry, Please come again");
            }
          },
          (errorResponse: any) => {
            console.log(errorResponse);
          }
        );

  }
}
