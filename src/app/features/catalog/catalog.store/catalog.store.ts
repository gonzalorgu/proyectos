import { Injectable, computed, signal } from '@angular/core';
import { Dress } from '../types/types.js';

export type SortKey = 'relevancia' | 'precioAlquilerAsc' | 'precioAlquilerDesc' | 'nombreAsc' | 'nombreDesc';

const DRESSES: Dress[] = [
  // Vestidos existentes...
  { id:'1', nombre:'Vestido dorado princesa', descripcion:'Falda amplia y brillo sutil.', categoria:'quinceañera',
    talla:['M','L'], color:'dorado', precioVenta:1500, precioAlquiler:320, fotos:['../../../../assets/2.jpg','../../../../assets/3.jpg','../../../../assets/3.jpg'],
    condition:'como-nuevo', disponible:true, etiquetas:['princesa'] },
  { id:'2', nombre:'Vestido negro encaje', descripcion:'Elegancia clásica para gala.', categoria:'gala',
    talla:['S','M','L'], color:'negro', precioVenta:900, precioAlquiler:300, fotos:['../../../../assets/3.jpg'],
    condition:'usado', disponible:true, etiquetas:['encaje'] },
  { id:'3', nombre:'Vestido novia minimal', descripcion:'Corte A con caída suave.', categoria:'novia',
    talla:['S','M'], color:'blanco', precioVenta:1800, precioAlquiler:280, fotos:['../../../../assets/4.jpg'],
    condition:'como-nuevo', disponible:true, etiquetas:['novia'] },
  { id:'4', nombre:'Vestido dorado princesa', descripcion:'Falda amplia y brillo sutil.', categoria:'quinceañera',
    talla:['M'], color:'dorado', precioVenta:1500, precioAlquiler:320, fotos:['../../../../assets/5.jpg'],
    condition:'como-nuevo', disponible:true },
  { id:'5', nombre:'Vestido negro encaje', descripcion:'Elegancia clásica para gala.', categoria:'gala',
    talla:['S','M'], color:'negro', precioVenta:920, precioAlquiler:290, fotos:['../../../../assets/2.jpg'],
    condition:'usado', disponible:true },
  { id:'6', nombre:'Vestido novia minimal', descripcion:'Corte A con caída suave.', categoria:'novia',
    talla:['M','L'], color:'blanco', precioVenta:1850, precioAlquiler:310, fotos:['../../../../assets/3.jpg'],
    condition:'como-nuevo', disponible:true },
  { id:'7', nombre:'Vestido dorado princesa', descripcion:'Falda amplia y brillo sutil.', categoria:'quinceañera',
    talla:['L'], color:'dorado', precioVenta:1490, precioAlquiler:315, fotos:['../../../../assets/4.jpg'],
    condition:'como-nuevo', disponible:true },
  { id:'8', nombre:'Vestido negro encaje', descripcion:'Elegancia clásica para gala.', categoria:'gala',
    talla:['S'], color:'negro', precioVenta:880, precioAlquiler:270, fotos:['../../../../assets/5.jpg'],
    condition:'usado', disponible:true },
  { id:'9', nombre:'Vestido novia minimal', descripcion:'Corte A con caída suave.', categoria:'novia',
    talla:['S','M'], color:'blanco', precioVenta:1790, precioAlquiler:285, fotos:['../../../../assets/2.jpg'],
    condition:'como-nuevo', disponible:true },
  { id:'10', nombre:'Vestido dorado princesa', descripcion:'Falda amplia y brillo sutil.', categoria:'quinceañera',
    talla:['M','L'], color:'dorado', precioVenta:1520, precioAlquiler:330, fotos:['../../../../assets/3.jpg'],
    condition:'como-nuevo', disponible:true },
  { id:'11', nombre:'Vestido negro encaje', descripcion:'Elegancia clásica para gala.', categoria:'gala',
    talla:['M','L'], color:'negro', precioVenta:940, precioAlquiler:305, fotos:['../../../../assets/4.jpg'],
    condition:'usado', disponible:true },
  { id:'12', nombre:'Vestido novia minimal', descripcion:'Corte A con caída suave.', categoria:'novia',
    talla:['S'], color:'blanco', precioVenta:1820, precioAlquiler:295, fotos:['../../../../assets/5.jpg'],
    condition:'como-nuevo', disponible:true },
  
  // ✅ AGREGA ESTOS NUEVOS VESTIDOS
  { id:'13', nombre:'Vestido rosa quinceañera', descripcion:'Diseño romántico con tul.', categoria:'quinceañera',
    talla:['S','M'], color:'rosa', precioVenta:1600, precioAlquiler:340, fotos:['../../../../assets/2.jpg'],
    condition:'como-nuevo', disponible:true },
  { id:'14', nombre:'Vestido coral quinceañera', descripcion:'Estilo princesa moderno.', categoria:'quinceañera',
    talla:['M','L'], color:'coral', precioVenta:1550, precioAlquiler:325, fotos:['../../../../assets/3.jpg'],
    condition:'como-nuevo', disponible:true },
  { id:'15', nombre:'Vestido azul quinceañera', descripcion:'Con pedrería y bordados.', categoria:'quinceañera',
    talla:['S','M','L'], color:'azul', precioVenta:1700, precioAlquiler:350, fotos:['../../../../assets/4.jpg'],
    condition:'como-nuevo', disponible:true }
];

@Injectable({ providedIn: 'root' })
export class CatalogStore {
  private all = signal<Dress[]>(DRESSES);

  // filtros
  q = signal('');
  color = signal('');
  talla = signal('');
  categoria = signal('');        // nueva
  sort = signal<SortKey>('relevancia');

  // paginación
  page = signal(1);
  pageSize = signal(9);          // 3 x 3 como tu prototipo

  // derivados
  private filtered = computed(() => {
    const term = this.q().trim().toLowerCase();
    const col = this.color().trim().toLowerCase();
    const tal = this.talla().trim().toUpperCase();
    const cat = this.categoria().trim().toLowerCase();

    return this.all().filter(d => {
      if (term && !(`${d.nombre} ${d.descripcion} ${d.color} ${d.categoria}`.toLowerCase().includes(term))) return false;
      if (col && d.color.toLowerCase() !== col) return false;
      if (tal && !d.talla.includes(tal)) return false;
      if (cat && d.categoria.toLowerCase() !== cat) return false;
      return true;
    });
  });

  private sorted = computed(() => {
    const s = this.sort();
    const arr = [...this.filtered()];
    switch (s) {
      case 'precioAlquilerAsc':  return arr.sort((a,b)=>a.precioAlquiler-b.precioAlquiler);
      case 'precioAlquilerDesc': return arr.sort((a,b)=>b.precioAlquiler-a.precioAlquiler);
      case 'nombreAsc':          return arr.sort((a,b)=>a.nombre.localeCompare(b.nombre));
      case 'nombreDesc':         return arr.sort((a,b)=>b.nombre.localeCompare(a.nombre));
      default: return arr;
    }
  });

  total = computed(() => this.sorted().length);
  paged = computed(() => {
    const p = this.page(), ps = this.pageSize();
    return this.sorted().slice((p-1)*ps, (p-1)*ps + ps);
  });
  totalPages = computed(() => Math.max(1, Math.ceil(this.total()/this.pageSize())));

  // acciones
  setQuery(v:string){ this.page.set(1); this.q.set(v); }
  setColor(v:string){ this.page.set(1); this.color.set(v); }
  setTalla(v:string){ this.page.set(1); this.talla.set(v); }
  setCategoria(v:string){ this.page.set(1); this.categoria.set(v); }
  setSort(v:SortKey){ this.page.set(1); this.sort.set(v); }
  setPage(p:number){ const max = this.totalPages(); this.page.set(Math.min(Math.max(1,p), max)); }


  byId(id: string | number) {
    const key = String(id);
    return this.all().find(d => String(d.id) === key);
  }
  
  relatedTo(id: string | number, limit = 4) {
    const current = this.byId(id);
    if (!current) return [];
    const poolCat = this.all().filter(d => d.categoria === current.categoria && String(d.id) !== String(id));
    const pool = poolCat.length ? poolCat : this.all().filter(d => d.color === current.color && String(d.id) !== String(id));
    return pool.slice(0, limit);
  }
  
}
