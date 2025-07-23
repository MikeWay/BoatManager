import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Person } from '../model/Person';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:4200/api'; // Adjust the base URL as needed


  // Add the checkPerson method
  async checkPerson(familyInitial: string, month: string, day: Number, year: Number): Promise<Person[] | null> {
  
    if(familyInitial.trim() !== '' && month.trim() !== '' && day != 0){
      return await firstValueFrom(this.http.post<Person[]>(`${this.baseUrl}/check-person`, {
        familyInitial,
        month,
        day,
        year
      }))
        .catch((error) => {
          console.error('Error checking person:', error);
          return null; // Return null if there's an error
        });
    }
    return Promise.resolve(null);
  }
  
}
