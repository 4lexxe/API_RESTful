import { Component, OnInit } from '@angular/core';
import { SocioService } from 'src/app/services/socio.service';

@Component({
  selector: 'app-socio',
  templateUrl: './socio.component.html',
  styleUrls: ['./socio.component.css']
})
export class SocioComponent implements OnInit {

  socios: any[] = [];

  constructor(private socioService: SocioService) { }

  ngOnInit(): void {
    this.getSocios();
  }

  getSocios() {
    this.socioService.getSocios()
      .subscribe(
        res => {
          this.socios = res;
        },
        err => console.error(err)
      );
  }

  deleteSocio(id: string) {
    if (confirm('¿Está seguro de que desea eliminar este socio?')) {
      this.socioService.deleteSocio(id)
        .subscribe(
          res => {
            this.getSocios(); // Actualizar la lista después de eliminar
          },
          err => console.error(err)
        );
    }
  }
}
