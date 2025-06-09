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

type FiltroTipo = 'todas' | 'vigentes' | 'empleado' | 'busqueda';

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

  // Búsqueda combinada
  busquedaCombinada = {
    titulo: '',
    vigente: undefined as boolean | undefined
  };

  // Vista de detalle
  publicacionSeleccionada: Publicacion | null = null;
  mostrandoDetalle = false;

  // Modal de confirmación de eliminación
  publicacionAEliminar: Publicacion | null = null;
  mostrandoConfirmacionEliminar = false;
  eliminando = false;

  // Modal de edición
  publicacionAEditar: Publicacion | null = null;
  mostrandoModalEdicion = false;
  editando = false;
  publicacionEditada: PublicacionCreateRequest = this.createEmptyPublicacion();

  // Vista previa de imagen en edición
  imagenPreviewEdicion = '';

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

  // Métodos para eliminar publicación
  mostrarConfirmacionEliminar(publicacion: Publicacion): void {
    this.publicacionAEliminar = publicacion;
    this.mostrandoConfirmacionEliminar = true;
  }

  cerrarConfirmacionEliminar(): void {
    this.publicacionAEliminar = null;
    this.mostrandoConfirmacionEliminar = false;
  }

  async confirmarEliminarPublicacion(): Promise<void> {
    if (!this.publicacionAEliminar || !this.publicacionAEliminar._id) return;

    this.eliminando = true;
    this.clearMessages();

    try {
      const respuesta = await this.publicacionesService.eliminarPublicacion(this.publicacionAEliminar._id);
      this.mensaje = `Publicación "${respuesta.publicacion.titulo}" eliminada exitosamente`;

      // Cerrar modal y recargar lista
      this.cerrarConfirmacionEliminar();
      await this.cargarPublicaciones();

    } catch (error: any) {
      this.error = error.message || 'Error al eliminar la publicación';
    } finally {
      this.eliminando = false;
    }
  }

  // Métodos para editar publicación
  mostrarModalEdicion(publicacion: Publicacion): void {
    this.publicacionAEditar = publicacion;
    this.prepararDatosEdicion(publicacion);
    this.mostrandoModalEdicion = true;
  }

  cerrarModalEdicion(): void {
    this.publicacionAEditar = null;
    this.mostrandoModalEdicion = false;
    this.publicacionEditada = this.createEmptyPublicacion();
    this.imagenPreviewEdicion = '';
    this.clearMessages();
  }

  prepararDatosEdicion(publicacion: Publicacion): void {
    // Extraer el ID del empleado si es un objeto populado
    let empleadoId = '';
    if (typeof publicacion.empleado === 'string') {
      empleadoId = publicacion.empleado;
    } else if (publicacion.empleado && typeof publicacion.empleado === 'object') {
      empleadoId = publicacion.empleado._id;
    }

    this.publicacionEditada = {
      titulo: publicacion.titulo,
      contenido: publicacion.contenido,
      imagenAsociada: publicacion.imagenAsociada,
      fechaPublicacion: publicacion.fechaPublicacion,
      empleado: empleadoId,
      vigente: publicacion.vigente
    };

    this.imagenPreviewEdicion = publicacion.imagenAsociada;
  }

  async confirmarEditarPublicacion(): Promise<void> {
    if (!this.publicacionAEditar || !this.publicacionAEditar._id) return;

    this.editando = true;
    this.clearMessages();

    try {
      const respuesta = await this.publicacionesService.actualizarPublicacion(
        this.publicacionAEditar._id,
        this.publicacionEditada
      );

      this.mensaje = `Publicación "${respuesta.publicacion.titulo}" actualizada exitosamente`;

      // Cerrar modal y recargar lista
      this.cerrarModalEdicion();
      await this.cargarPublicaciones();

    } catch (error: any) {
      this.error = error.message || 'Error al actualizar la publicación';
    } finally {
      this.editando = false;
    }
  }

  onImagenChangeEdicion(event: any): void {
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
          this.publicacionEditada.imagenAsociada = compressedImage;
          this.imagenPreviewEdicion = compressedImage;
          this.clearMessages(); // Limpiar mensajes de error previos
        });
      };
      reader.onerror = () => {
        this.error = 'Error al leer el archivo de imagen.';
      };
      reader.readAsDataURL(file);
    }
  }

  // Métodos para modal desde botones de acción
  eliminarPublicacionDesdeModal(): void {
    if (this.publicacionSeleccionada) {
      this.cerrarDetalle();
      this.mostrarConfirmacionEliminar(this.publicacionSeleccionada);
    }
  }

  editarPublicacionDesdeModal(): void {
    if (this.publicacionSeleccionada) {
      this.cerrarDetalle();
      this.mostrarModalEdicion(this.publicacionSeleccionada);
    }
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

  //-------------------------
  // BÚSQUEDA COMBINADA
  //-------------------------
  async buscarPublicacionesCombinado(): Promise<void> {
    // Validar que al menos un criterio esté especificado
    if (!this.busquedaCombinada.titulo.trim() && this.busquedaCombinada.vigente === undefined) {
      this.error = 'Por favor, especifique al menos un criterio de búsqueda (título o estado vigente)';
      return;
    }

    this.filtroActivo = 'busqueda';
    await this.executeWithLoading(async () => {
      // Preparar parámetros de búsqueda
      const parametrosBusqueda: any = {};

      if (this.busquedaCombinada.titulo.trim()) {
        parametrosBusqueda.titulo = this.busquedaCombinada.titulo.trim();
      }

      if (this.busquedaCombinada.vigente !== undefined) {
        parametrosBusqueda.vigente = this.busquedaCombinada.vigente;
      }

      // Usar método GET para la búsqueda
      const respuesta = await this.publicacionesService.buscarPublicacionesGET(parametrosBusqueda);
      this.publicaciones = respuesta.publicaciones;
    });
  }

  limpiarFiltros(): void {
    this.empleadoSeleccionadoFiltro = '';
    this.busquedaCombinada = {
      titulo: '',
      vigente: undefined
    };
    this.cargarPublicaciones();
  }

  limpiarBusquedaCombinada(): void {
    this.busquedaCombinada = {
      titulo: '',
      vigente: undefined
    };
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
      case 'busqueda': return 'Buscar';
      default: return 'Todas las Publicaciones';
    }
  }

  getTituloListado(): string {
    switch (this.filtroActivo) {
      case 'vigentes': return 'Publicaciones Vigentes';
      case 'empleado':
        const empleado = this.empleados.find(e => e._id === this.empleadoSeleccionadoFiltro);
        return `Publicaciones de ${empleado?.nombre} ${empleado?.apellido}`;
      case 'busqueda': return 'Resultados de Búsqueda';
      default: return 'Total de Publicaciones';
    }
  }

  getFiltroTexto(): string {
    switch (this.filtroActivo) {
      case 'vigentes': return 'Publicaciones Vigentes';
      case 'empleado':
        const empleado = this.empleados.find(e => e._id === this.empleadoSeleccionadoFiltro);
        return `Empleado: ${empleado?.nombre} ${empleado?.apellido}`;
      case 'busqueda':
        const criterios = [];
        if (this.busquedaCombinada.titulo) criterios.push(`Título: "${this.busquedaCombinada.titulo}"`);
        if (this.busquedaCombinada.vigente !== undefined) criterios.push(`Estado: ${this.busquedaCombinada.vigente ? 'Vigente' : 'No Vigente'}`);
        return `Búsqueda: ${criterios.join(' - ')}`;
      default: return 'Todas las publicaciones';
    }
  }

  getMensajeVacio(): string {
    switch (this.filtroActivo) {
      case 'vigentes': return 'No hay publicaciones vigentes.';
      case 'empleado': return 'Este empleado no tiene publicaciones registradas.';
      case 'busqueda': return 'No se encontraron publicaciones que coincidan con los criterios de búsqueda.';
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

  contarPalabras(texto: string): number {
    if (!texto || texto.trim() === '') return 0;
    return texto.trim().split(/\s+/).length;
  }
}
