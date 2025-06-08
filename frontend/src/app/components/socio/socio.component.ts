import { Component, OnInit } from '@angular/core';
import { SociosService } from '../../services/socios.service';
import { Socio, SociosListResponse } from '../../models/socio.interface';

@Component({
  selector: 'app-socio',
  templateUrl: './socio.component.html',
  styles: []
})
export class SocioComponent implements OnInit {

  socios: Socio[] = [];
  cargando = false;
  error = '';

  // Usar el servicio consolidado
  constructor(private sociosService: SociosService) { }

  ngOnInit(): void {
    this.getSocios();
  }

  async getSocios(): Promise<void> {
    this.cargando = true;
    this.error = '';

    try {
      const respuesta: SociosListResponse = await this.sociosService.obtenerSocios();
      this.socios = respuesta.socios;
    } catch (error: any) {
      this.error = error.message;
      console.error('Error cargando socios:', error);
    } finally {
      this.cargando = false;
    }
  }

  async deleteSocio(id: string): Promise<void> {
    if (confirm('¿Está seguro de que desea eliminar este socio?')) {
      try {
        await this.sociosService.eliminarSocio(id);
        await this.getSocios(); // Actualizar la lista después de eliminar
      } catch (error: any) {
        this.error = error.message;
        console.error('Error eliminando socio:', error);
      }
    }
  }
}
