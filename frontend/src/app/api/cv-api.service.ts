import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cv } from '../models/cv.model';

@Injectable({ providedIn: 'root' })
export class CvApiService {
  private readonly baseUrl = 'http://localhost:8080/api';

  constructor(private readonly http: HttpClient) {}

  getCv(): Observable<Cv> {
    return this.http.get<Cv>(`${this.baseUrl}/cv`);
  }

  saveCv(cv: Cv): Observable<Cv> {
    return this.http.put<Cv>(`${this.baseUrl}/admin/cv`, cv);
  }
}

