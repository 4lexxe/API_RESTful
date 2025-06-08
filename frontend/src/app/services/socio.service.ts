import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SocioService {
  private URL = 'http://localhost:3000/socios';

  constructor(private http: HttpClient) { }

  getSocios() {
    return this.http.get(this.URL);
  }

  addSocio(socio: any) {
    return this.http.post(this.URL, socio);
  }

  updateSocio(id: string, socio: any) {
    return this.http.put(`${this.URL}/${id}`, socio);
  }

  deleteSocio(id: string) {
    return this.http.delete(`${this.URL}/${id}`);
  }
}
