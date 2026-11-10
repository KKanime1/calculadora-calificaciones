class App {
  constructor() {
    this.KEY = 'calc-notas-v1';
    this.$ = id => document.getElementById(id);
    this.orden = { k: 'nombre', d: 1 };
    this.editando = null;
    this.cargar();
    this.bind();
    this.pintarMaterias();
    this.pintarConfig();
    this.render();
  }
  cargar() {
    const d = JSON.parse(localStorage.getItem(this.KEY) || 'null') || {};
    if (d.materias && d.materias.length) { this.materias = d.materias; this.activa = d.activa || 0; }
    else { this.materias = [{ nombre: 'Materia 1', pct: d.pct || [30, 30, 40], est: d.est || [] }]; this.activa = 0; }
    if (!this.materias[this.activa]) this.activa = 0;
  }
  get m() { return this.materias[this.activa]; }
  get pct() { return this.m.pct; }
  get est() { return this.m.est; }
  guardar(msg) {
    localStorage.setItem(this.KEY, JSON.stringify({ materias: this.materias, activa: this.activa }));
    if (msg) this.aviso(msg);
  }
  aviso(t) {
    const el = this.$('toast'); el.textContent = t; el.classList.add('show');
    clearTimeout(this.tt); this.tt = setTimeout(() => el.classList.remove('show'), 2200);
  }
  esc(s) { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  nota(v) {
    if (v === '' || v === null || v === undefined || isNaN(Number(v))) return null;
    return Math.min(5, Math.max(0, Number(v)));
  }
  calc(e) {
    let acum = 0, resto = 0;
    e.notas.forEach((n, i) => { if (n === null) resto += this.pct[i]; else acum += n * this.pct[i] / 100; });
    const nec = obj => resto > 0 ? (obj - acum) * 100 / resto : null;
    const n296 = nec(2.96), n5 = nec(5);
    let estado, clase;
    if (resto === 0) { const ok = acum >= 3; estado = ok ? 'Aprobado' : 'Reprobado'; clase = ok ? 'ok' : 'mal'; }
    else if (n296 > 5) { estado = 'Inalcanzable'; clase = 'gris'; }
    else { estado = 'En progreso'; clase = 'prog'; }
    return { acum, resto, n296, n5, estado, clase };
  }
  fmtNec(v) {
    if (v === null) return '—';
    if (v <= 0) return 'Ya alcanzado';
    if (v > 5) return 'Inalcanzable';
    return v.toFixed(2);
  }
  render() {
    const q = this.$('buscar').value.trim().toLowerCase();
    const filas = this.est.map((e, i) => ({ e, i, c: this.calc(e) }))
      .filter(({ e }) => !q || e.nombre.toLowerCase().includes(q) || e.codigo.toLowerCase().includes(q));
    const { k, d } = this.orden;
    filas.sort((a, b) => {
      if (k === 'def') return (a.c.acum - b.c.acum) * d;
      return a.e[k].localeCompare(b.e[k], 'es', { numeric: true }) * d;
    });
    document.querySelectorAll('th[data-k]').forEach(th =>
      th.setAttribute('aria-sort', th.dataset.k === k ? (d === 1 ? 'ascending' : 'descending') : 'none'));
    const cel = n => n === null ? '—' : n.toFixed(1);
    this.$('tbody').innerHTML = filas.map(({ e, i, c }) => `<tr><td>${this.esc(e.nombre)}</td><td>${this.esc(e.codigo)}</td>
      <td>${cel(e.notas[0])}</td><td>${cel(e.notas[1])}</td><td>${cel(e.notas[2])}</td>
      <td>${c.acum.toFixed(2)}${c.resto > 0 ? ' (parcial)' : ''}</td>
      <td>${this.fmtNec(c.n296)}</td><td>${this.fmtNec(c.n5)}</td>
      <td class="st ${c.clase}">${c.estado}</td>
      <td><button class="mini sec" data-edit="${i}">Editar</button>
          <button class="mini sec del" data-del="${i}">Eliminar</button></td></tr>`).join('');
    const v = this.$('vacio');
    v.hidden = filas.length > 0;
    v.textContent = this.est.length ? 'Ningún estudiante coincide con la búsqueda.' : 'Aún no hay estudiantes. Agrega uno o importa un archivo CSV.';
    this.stats();
  }
  stats() {
    const todos = this.est.map(e => this.calc(e));
    const cuenta = c => todos.filter(x => x.clase === c).length;
    const prom = todos.length ? (todos.reduce((a, x) => a + x.acum, 0) / todos.length).toFixed(2) : '—';
    const items = [['Estudiantes', todos.length], ['Promedio actual', prom], ['Aprobados', cuenta('ok')],
      ['Reprobados', cuenta('mal')], ['En progreso', cuenta('prog')], ['Inalcanzables', cuenta('gris')]];
    this.$('stats').innerHTML = items.map(([t, n]) => `<div class="stat"><b>${n}</b><span>${t}</span></div>`).join('');
    this.$('dist').innerHTML = ['ok', 'prog', 'gris', 'mal'].map(c =>
      `<i class="${c}" style="width:${todos.length ? cuenta(c) / todos.length * 100 : 0}%"></i>`).join('');
  }
  pintarMaterias() {
    this.$('materia').innerHTML = this.materias.map((m, i) =>
      `<option value="${i}" ${i === this.activa ? 'selected' : ''}>${this.esc(m.nombre)}</option>`).join('');
  }
  cambiarMateria(i) {
    this.activa = i; this.guardar(); this.pintarConfig(); this.render();
  }
  nuevaMateria() {
    const n = (prompt('Nombre de la nueva materia:') || '').trim();
    if (!n) return;
    this.materias.push({ nombre: n, pct: [30, 30, 40], est: [] });
    this.activa = this.materias.length - 1;
    this.guardar('Materia creada'); this.pintarMaterias(); this.pintarConfig(); this.render();
  }
  borrarMateria() {
    if (this.materias.length === 1) return this.aviso('Debe existir al menos una materia');
    if (!confirm(`¿Eliminar "${this.m.nombre}" y todos sus estudiantes?`)) return;
    this.materias.splice(this.activa, 1); this.activa = 0;
    this.guardar('Materia eliminada'); this.pintarMaterias(); this.pintarConfig(); this.render();
  }
  pintarConfig() {
    this.pct.forEach((p, i) => this.$('p' + (i + 1)).value = p);
    this.sumaMsg();
  }
  sumaMsg() {
    const s = [1, 2, 3].reduce((a, i) => a + (Number(this.$('p' + i).value) || 0), 0);
    const m = this.$('sumaMsg');
    m.textContent = s === 100 ? 'Los porcentajes suman 100 %.' : `Los porcentajes suman ${s} %. Deben sumar exactamente 100 %.`;
    m.className = 'hint ' + (s === 100 ? '' : 'error');
    return s === 100;
  }
  guardarConfig() {
    if (!this.sumaMsg()) return this.aviso('Los porcentajes deben sumar 100 %');
    this.m.pct = [1, 2, 3].map(i => Number(this.$('p' + i).value));
    this.guardar('Porcentajes guardados'); this.render();
  }
  abrir(i = null) {
    this.editando = i;
    const e = i === null ? { nombre: '', codigo: '', notas: [null, null, null] } : this.est[i];
    this.$('mTitulo').textContent = i === null ? 'Agregar estudiante' : 'Editar estudiante';
    this.$('fNombre').value = e.nombre; this.$('fCodigo').value = e.codigo;
    e.notas.forEach((n, k) => this.$('fN' + (k + 1)).value = n === null ? '' : n);
    this.$('fError').textContent = '';
    this.$('modal').showModal(); this.$('fNombre').focus();
  }
  enviar(ev) {
    ev.preventDefault();
    const nombre = this.$('fNombre').value.trim(), codigo = this.$('fCodigo').value.trim();
    if (!nombre || !codigo) return this.$('fError').textContent = 'Nombre y código son obligatorios.';
    if (this.est.some((e, i) => e.codigo === codigo && i !== this.editando))
      return this.$('fError').textContent = 'Ya existe un estudiante con ese código.';
    const reg = { nombre, codigo, notas: [1, 2, 3].map(k => this.nota(this.$('fN' + k).value)) };
    if (this.editando === null) this.est.push(reg); else this.est[this.editando] = reg;
    this.guardar('Estudiante guardado'); this.render(); this.$('modal').close();
  }
  eliminar(i) {
    if (!confirm(`¿Eliminar a ${this.est[i].nombre}?`)) return;
    this.est.splice(i, 1); this.guardar('Estudiante eliminado'); this.render();
  }
  exportar() {
    const q = s => /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    const lineas = ['Nombre,Código,Corte1,Corte2,Corte3',
      ...this.est.map(e => [q(e.nombre), q(e.codigo), ...e.notas.map(n => n === null ? '' : n)].join(','))];
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob(['\ufeff' + lineas.join('\n')], { type: 'text/csv;charset=utf-8' }));
    a.download = this.m.nombre.replace(/[^\w-]+/g, '_') + '.csv'; a.click(); URL.revokeObjectURL(a.href);
    this.aviso('Datos exportados');
  }
  importar(file) {
    if (!file) return;
    const r = new FileReader();
    r.onload = () => {
      const filas = r.result.replace(/^\ufeff/, '').split(/\r?\n/).filter(l => l.trim());
      let nuevos = 0, omitidos = 0;
      filas.slice(1).forEach(l => {
        const c = l.split(',').map(x => x.trim().replace(/^"|"$/g, ''));
        if (!c[0] || !c[1] || this.est.some(e => e.codigo === c[1])) { omitidos++; return; }
        this.est.push({ nombre: c[0], codigo: c[1], notas: [2, 3, 4].map(k => this.nota(c[k] ?? '')) });
        nuevos++;
      });
      this.guardar(); this.render();
      this.aviso(`Importados: ${nuevos}. Omitidos: ${omitidos}.`);
      this.$('fileCsv').value = '';
    };
    r.readAsText(file);
  }
  ordenar(k) {
    this.orden = { k, d: this.orden.k === k ? -this.orden.d : 1 }; this.render();
  }
  bind() {
    this.$('btnConf').onclick = () => this.guardarConfig();
    [1, 2, 3].forEach(i => this.$('p' + i).oninput = () => this.sumaMsg());
    this.$('btnNuevo').onclick = () => this.abrir();
    this.$('btnCancel').onclick = () => this.$('modal').close();
    this.$('form').onsubmit = ev => this.enviar(ev);
    this.$('btnExp').onclick = () => this.exportar();
    this.$('fileCsv').onchange = ev => this.importar(ev.target.files[0]);
    this.$('buscar').oninput = () => this.render();
    this.$('materia').onchange = ev => this.cambiarMateria(Number(ev.target.value));
    this.$('btnMat').onclick = () => this.nuevaMateria();
    this.$('btnDelMat').onclick = () => this.borrarMateria();
    document.querySelectorAll('th[data-k]').forEach(th => {
      th.onclick = () => this.ordenar(th.dataset.k);
      th.onkeydown = ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); this.ordenar(th.dataset.k); } };
    });
    this.$('tbody').onclick = ev => {
      const b = ev.target.closest('button'); if (!b) return;
      if (b.dataset.edit !== undefined) this.abrir(Number(b.dataset.edit));
      if (b.dataset.del !== undefined) this.eliminar(Number(b.dataset.del));
    };
    document.addEventListener('keydown', ev => {
      if (!ev.ctrlKey) return;
      const k = ev.key.toLowerCase();
      if (k === 'n') { ev.preventDefault(); this.abrir(); }
      if (k === 's') { ev.preventDefault(); this.guardar('Datos guardados'); }
      if (k === 'e') { ev.preventDefault(); this.exportar(); }
    });
  }
}
document.addEventListener('DOMContentLoaded', () => new App());
