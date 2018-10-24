import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs/Observable";

@Injectable()
export class SheetResourceProvider {
    private readonly API_URL: string = 'https://sheets.googleapis.com/v4/spreadsheets';

    constructor(private httpClient: HttpClient) {
    }

    // authtoken as parameter only for demo purpose , better use a UserService to get the token
    public findById(spreadsheetId: string, authtoken: string): Observable<any> {
        return this.httpClient.get(this.API_URL + '/' + spreadsheetId, {
          headers: new HttpHeaders({
                Authorization: `Bearer ${authtoken}`
            })
        });
    }
    public saveUser(user, authToken: string, spreadsheetId: string): Observable<any> {
        let postData = {
                majorDimension: 'ROWS',
                values:[
                    [
                        user.first_name,
                        user.last_name,
                        user.email,
                        "Wissen",
                        user.email,
                        (user.gender== 'M'?'Male':'Female'),
                        user.phone
                    ]
                ]
            };
        return this.httpClient.post('https://sheets.googleapis.com/v4/spreadsheets/' + spreadsheetId +'/values/A2%3AH100000:append?includeValuesInResponse=true&insertDataOption=INSERT_ROWS&responseDateTimeRenderOption=SERIAL_NUMBER&responseValueRenderOption=FORMATTED_VALUE&valueInputOption=USER_ENTERED',postData,{
            headers: new HttpHeaders({
                  Authorization: `Bearer ${authToken}`
              })
            });
    }
    public create(authtoken: string): Observable<any> {
        return this.httpClient.post(this.API_URL,{}, {
          headers: new HttpHeaders({
                Authorization: `Bearer ${authtoken}`
            })
        });
    }
}