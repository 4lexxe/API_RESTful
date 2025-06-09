import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PublicacionesService } from '../services/publicaciones.service';
import { EmpleadosService } from '../services/empleados.service';
import {
  Publicacion,
  PublicacionCreateRequest,
  PublicacionResponse,
  PublicacionesListResponse
} from '../models/publicacion.interface';
import { Empleado } from '../models/empleado.interface';

type FiltroTipo = 'todas' | 'vigentes' | 'empleado';

@Component({
  selector: 'app-publicaciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './publicaciones.component.html',
  styleUrls: ['./publicaciones.component.css']
})
export class PublicacionesComponent implements OnInit {
  // Datos del formulario
  nuevaPublicacion: PublicacionCreateRequest = this.createEmptyPublicacion();

  // Estado de la aplicación
  publicaciones: Publicacion[] = [];
  empleados: Empleado[] = [];
  cargando = false;
  mensaje = '';
  error = '';

  // Estado de filtrado
  filtroActivo: FiltroTipo = 'todas';
  empleadoSeleccionadoFiltro = '';

  // Vista de detalle
  publicacionSeleccionada: Publicacion | null = null;
  mostrandoDetalle = false;

  // Vista previa de imagen
  imagenPreview = '';

  constructor(
    private publicacionesService: PublicacionesService,
    private empleadosService: EmpleadosService
  ) {}

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  //-------------------------
  // MÉTODOS DE INICIALIZACIÓN
  //-------------------------

  async cargarDatosIniciales(): Promise<void> {
    try {
      // Cargar empleados primero, luego publicaciones
      await this.cargarEmpleados();
      await this.cargarPublicaciones();
    } catch (error) {
      console.error('Error cargando datos iniciales:', error);
    }
  }

  async cargarEmpleados(): Promise<void> {
    try {
      console.log('🔄 Cargando empleados...');
      const respuesta = await this.empleadosService.obtenerEmpleados();
      this.empleados = respuesta.empleados;
      console.log('✅ Empleados cargados:', this.empleados.length);
    } catch (error: any) {
      console.error('❌ Error cargando empleados:', error);
      this.error = 'No se pudieron cargar los empleados. Verifique que el servicio esté funcionando.';
    }
  }

  //-------------------------
  // MÉTODOS CRUD
  //-------------------------

  async crearPublicacion(): Promise<void> {
    await this.executeWithLoading(async () => {
      const respuesta = await this.publicacionesService.crearPublicacion(this.nuevaPublicacion);
      this.mensaje = `Publicación creada exitosamente: "${respuesta.publicacion.titulo}"`;
      this.limpiarFormulario();
      await this.cargarPublicaciones();
    });
  }

  async verDetallePublicacion(id: string): Promise<void> {
    await this.executeWithLoading(async () => {
      const respuesta = await this.publicacionesService.obtenerPublicacionPorId(id);
      this.publicacionSeleccionada = respuesta.publicacion;
      this.mostrandoDetalle = true;
    });
  }

  //-------------------------
  // MÉTODOS DE CARGA Y FILTRADO
  //-------------------------

  async cargarPublicaciones(): Promise<void> {
    this.filtroActivo = 'todas';
    await this.executeWithLoading(async () => {
      const respuesta = await this.publicacionesService.obtenerPublicaciones();
      this.publicaciones = respuesta.publicaciones;
    });
  }

  async cargarPublicacionesVigentes(): Promise<void> {
    this.filtroActivo = 'vigentes';
    await this.executeWithLoading(async () => {
      const respuesta = await this.publicacionesService.obtenerPublicacionesVigentes();
      this.publicaciones = respuesta.publicaciones;
    });
  }

  async filtrarPorEmpleado(): Promise<void> {
    if (!this.empleadoSeleccionadoFiltro) {
      this.error = 'Por favor, seleccione un empleado para filtrar';
      return;
    }

    this.filtroActivo = 'empleado';
    await this.executeWithLoading(async () => {
      const respuesta = await this.publicacionesService.obtenerPublicacionesPorEmpleado(this.empleadoSeleccionadoFiltro);
      this.publicaciones = respuesta.publicaciones;
    });
  }

  limpiarFiltros(): void {
    this.empleadoSeleccionadoFiltro = '';
    this.cargarPublicaciones();
  }

  //-------------------------
  // MÉTODOS DE UI Y UTILIDADES
  //-------------------------

  limpiarFormulario(): void {
    this.nuevaPublicacion = this.createEmptyPublicacion();
    this.imagenPreview = '';
    this.clearMessages();
  }

  cerrarDetalle(): void {
    this.publicacionSeleccionada = null;
    this.mostrandoDetalle = false;
  }

  onImagenChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validar tamaño del archivo (máximo 2MB para evitar errores)
      const maxSize = 2 * 1024 * 1024; // 2MB en bytes
      if (file.size > maxSize) {
        this.error = 'La imagen es demasiado grande. El tamaño máximo permitido es 2MB.';
        return;
      }

      // Validar tipo de archivo
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        this.error = 'Tipo de archivo no permitido. Use: JPEG, PNG, GIF o WebP.';
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        // Comprimir la imagen a máximo 800px de ancho para reducir tamaño
        this.compressImage(e.target.result, (compressedImage: string) => {
          this.nuevaPublicacion.imagenAsociada = compressedImage;
          this.imagenPreview = compressedImage;
          this.clearMessages(); // Limpiar mensajes de error previos
        });
      };
      reader.onerror = () => {
        this.error = 'Error al leer el archivo de imagen.';
      };
      reader.readAsDataURL(file);
    }
  }

  //-------------------------
  // MÉTODOS DE TEXTO DINÁMICO
  //-------------------------

  getSubmitButtonText(): string {
    return this.cargando ? 'Registrando...' : 'Crear Publicación';
  }

  getLoadButtonText(tipo: FiltroTipo): string {
    const esCargandoEseTipo = this.cargando && this.filtroActivo === tipo;
    if (esCargandoEseTipo) return 'Cargando...';

    switch (tipo) {
      case 'vigentes': return 'Solo Vigentes';
      case 'empleado': return 'Filtrar por Empleado';
      default: return 'Todas las Publicaciones';
    }
  }

  getTituloListado(): string {
    switch (this.filtroActivo) {
      case 'vigentes': return 'Publicaciones Vigentes';
      case 'empleado':
        const empleado = this.empleados.find(e => e._id === this.empleadoSeleccionadoFiltro);
        return `Publicaciones de ${empleado?.nombre} ${empleado?.apellido}`;
      default: return 'Total de Publicaciones';
    }
  }

  getFiltroTexto(): string {
    switch (this.filtroActivo) {
      case 'vigentes': return 'Publicaciones Vigentes';
      case 'empleado':
        const empleado = this.empleados.find(e => e._id === this.empleadoSeleccionadoFiltro);
        return `Empleado: ${empleado?.nombre} ${empleado?.apellido}`;
      default: return 'Todas las publicaciones';
    }
  }

  getMensajeVacio(): string {
    switch (this.filtroActivo) {
      case 'vigentes': return 'No hay publicaciones vigentes.';
      case 'empleado': return 'Este empleado no tiene publicaciones registradas.';
      default: return 'No hay publicaciones registradas. Cree la primera publicación usando el formulario.';
    }
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-ES');
  }

  obtenerNombreEmpleado(empleadoData: string | any): string {
    // Si empleadoData es null o undefined
    if (!empleadoData) {
      return 'Empleado no especificado';
    }

    // Si empleadoData es un objeto (populate del backend)
    if (this.esObjetoEmpleado(empleadoData)) {
      const emp = this.getEmpleadoObject(empleadoData);
      return `${emp.nombre} ${emp.apellido}`;
    }

    // Si empleadoData es un string (solo ID), buscar en la lista local
    if (typeof empleadoData === 'string') {
      const empleado = this.empleados.find(e => e._id === empleadoData);

      if (!empleado) {
        return `Empleado no encontrado`;
      }

      return `${empleado.nombre} ${empleado.apellido}`;
    }

    // Caso inesperado
    return 'Formato de empleado no válido';
  }

  //-------------------------
  // MÉTODOS AUXILIARES PARA TEMPLATE - Type Guards y Helpers
  //-------------------------

  // Type guard para verificar si es un objeto empleado
  esObjetoEmpleado(empleadoData: any): empleadoData is { _id: string; nombre: string; apellido: string } {
    return empleadoData &&
           typeof empleadoData === 'object' &&
           empleadoData._id &&
           empleadoData.nombre &&
           empleadoData.apellido;
  }

  // Obtener objeto empleado tipado
  getEmpleadoObject(empleadoData: any): { _id: string; nombre: string; apellido: string } {
    return empleadoData as { _id: string; nombre: string; apellido: string };
  }

  //-------------------------
  // MÉTODOS PRIVADOS DE UTILIDAD
  //-------------------------

  private async executeWithLoading(action: () => Promise<void>): Promise<void> {
    this.cargando = true;
    this.clearMessages();

    try {
      await action();
    } catch (error: any) {
      this.error = error.message;
    } finally {
      this.cargando = false;
    }
  }

  private createEmptyPublicacion(): PublicacionCreateRequest {
    return {
      titulo: '',
      contenido: '',
      imagenAsociada: '',
      fechaPublicacion: '',
      empleado: '',
      vigente: true
    };
  }

  private clearMessages(): void {
    this.mensaje = '';
    this.error = '';
  }

  // Método para comprimir imagen
  private compressImage(imageSrc: string, callback: (compressedImage: string) => void): void {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;

      // Calcular nuevas dimensiones manteniendo ratio
      const maxWidth = 800;
      const maxHeight = 600;
      let { width, height } = img;

      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Dibujar imagen redimensionada
      ctx.drawImage(img, 0, 0, width, height);

      // Convertir a base64 con calidad reducida
      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7); // 70% calidad
      callback(compressedDataUrl);
    };
    img.src = imageSrc;
  }
}
