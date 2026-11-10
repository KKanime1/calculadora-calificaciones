# 📊 Calculadora de Calificaciones — Universidad de Córdoba

Sistema web de gestión académica para calcular calificaciones definitivas, predecir las notas necesarias para aprobar y administrar estudiantes de forma eficiente. Funciona 100 % en el navegador: no requiere servidor ni instalación.

> **Versión:** 1.0 · **Fecha:** noviembre de 2025 · **Licencia:** MIT

<!-- Sugerencia: agrega aquí una captura de pantalla de la aplicación -->
<!-- ![Vista previa](docs/captura.png) -->

---

## ✨ Características principales

- 🎓 **Gestión de estudiantes:** agregar, editar y eliminar.
- 📊 **Definitiva automática** con porcentajes configurables por corte.
- 🎯 **Predicción de notas:** calcula la nota necesaria en los cortes pendientes para alcanzar **2.96** (mínimo que se aproxima a 3.0) y **5.0**.
- 💾 **Persistencia local** con `LocalStorage`.
- 📁 **Importación y exportación** de datos en formato CSV.
- ✅ **Validaciones en tiempo real.**
- 📚 **Múltiples materias:** cada una con sus propios porcentajes y estudiantes.
- 📈 **Resumen estadístico:** total, promedio, aprobados, reprobados y distribución visual.
- 🔎 **Búsqueda y ordenamiento** por nombre, código o definitiva.
- 📱 **Diseño responsive** para computador, tablet y móvil.
- 🎨 **Interfaz con colores institucionales.**

---

## 🚀 Instalación y uso

### Requisitos

- Navegador moderno (ver [compatibilidad](#-compatibilidad)) con JavaScript habilitado.
- Al menos 5 MB disponibles de `LocalStorage`.

### Instalación

1. Descarga o clona el repositorio.
2. Mantén todos los archivos en la misma carpeta.
3. Abre `index.html` en tu navegador. ¡Listo! No necesita servidor web.

### Uso básico

1. **Configura los porcentajes:** entra a *Configuración* y define el peso de cada corte (deben sumar 100 %).
2. **Agrega estudiantes:** con el botón *Agregar Estudiante* o cargando un archivo CSV.
3. **Consulta las predicciones:** el sistema calcula automáticamente las notas necesarias.
4. **Edita calificaciones:** haz clic sobre un estudiante para modificar sus datos.

---

## 📁 Estructura del proyecto

```text
FDA/
├── index.html   # Página principal (estructura HTML)
├── styles.css   # Estilos CSS (tema verde oscuro / blanco)
├── script.js    # Lógica de la aplicación
├── SRS.md       # Documentación técnica (especificación de requisitos)
└── README.md    # Este archivo
```

---

## 🎨 Diseño y colores

| Uso                        | Color                         |
| -------------------------- | ----------------------------- |
| Principal (institucional)  | Verde oscuro `#2d5a4b`        |
| Secundario                 | Blanco `#ffffff`              |
| Éxito                      | Verde — estudiantes aprobados |
| Peligro                    | Rojo — estudiantes reprobados |
| Neutro                     | Gris — metas inalcanzables    |

---

## 📊 Formato CSV para carga masiva

El archivo debe tener encabezado y usar coma como separador:

```csv
Nombre,Código,Corte1,Corte2,Corte3
Juan Pérez,123456,4.5,3.8,
María García,789012,3.2,4.0,3.5
Carlos López,345678,2.8,,
```

**Reglas:**

- Una celda **vacía** significa que el corte **aún no tiene nota**.
- Un **`0`** significa que el corte fue calificado con cero.
- El **código** debe ser único por estudiante.
- Usa punto como separador decimal (`4.5`, no `4,5`).

---

## ⚡ Funcionalidades avanzadas

### Fórmulas

Con los porcentajes expresados de 0 a 100:

```text
Definitiva    = (Corte1 × %1 + Corte2 × %2 + Corte3 × %3) / 100

Nota necesaria = (Objetivo − Acumulado) × 100 / PorcentajeRestante
```

Donde:

- **Acumulado:** suma ponderada de los cortes ya calificados (`Σ nota × % / 100`).
- **PorcentajeRestante:** suma de los porcentajes de los cortes sin calificar.
- **Objetivo:** 2.96 o 5.0.

**Ejemplo:** con cortes de 30 %, 30 % y 40 %, y notas de 4.0 y 3.0 en los dos primeros:

- Acumulado = (4.0 × 30 + 3.0 × 30) / 100 = 2.1
- Para alcanzar 2.96 → (2.96 − 2.1) × 100 / 40 = **2.15** en el último corte.

### Validaciones

- ❌ No admite notas negativas (se convierten a 0).
- ⚠️ Limita las notas a un máximo de 5.0.
- 🔒 Códigos únicos por estudiante.
- ✅ Los porcentajes deben sumar exactamente 100 %.
- 🚫 Identifica metas inalcanzables (nota necesaria > 5.0).

### Estados del estudiante

| Estado          | Condición                               |
| --------------- | --------------------------------------- |
| 🟢 Aprobado     | Definitiva ≥ 3.0                        |
| 🔴 Reprobado    | Definitiva < 3.0 (con todos los cortes) |
| ⚪ Inalcanzable | Nota necesaria > 5.0                    |
| 🟡 En progreso  | Cortes incompletos                      |

### Atajos de teclado

| Atajo      | Acción                  |
| ---------- | ----------------------- |
| `Ctrl + N` | Agregar nuevo estudiante |
| `Ctrl + S` | Guardar datos           |
| `Ctrl + E` | Exportar datos          |
| `Esc`      | Cerrar ventana modal    |

---

## 🔧 Tecnologías utilizadas

- **HTML5:** estructura semántica.
- **CSS3:** estilos responsive con Grid y Flexbox.
- **JavaScript (ES6+):** lógica con clases y módulos.
- **LocalStorage:** persistencia de datos en el navegador.
- **File API:** lectura y escritura de archivos CSV.

---

## 📱 Compatibilidad

| Navegador | Versión mínima | Estado          |
| --------- | -------------- | --------------- |
| Chrome    | 60+            | ✅ Soportado     |
| Firefox   | 55+            | ✅ Soportado     |
| Safari    | 12+            | ✅ Soportado     |
| Edge      | 79+            | ✅ Soportado     |
| Internet Explorer | Cualquiera | ❌ No soportado |

---

## 📖 Documentación

- **Manual de usuario:** sección *Ayuda* dentro de la aplicación.
- **Manual técnico:** [`SRS.md`](SRS.md) y la sección de ayuda de la aplicación.
- **Referencia de funciones:** comentarios en `script.js`.

---

## 🗺️ Hoja de ruta

- [ ] Sincronización con servicios en la nube
- [x] Resumen estadístico básico (gráficos avanzados pendientes)
- [x] Gestión de múltiples materias
- [ ] PWA (Progressive Web App)
- [ ] Integración con sistemas académicos
- [ ] Notificaciones automáticas

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para cambios importantes, abre primero un *issue* para discutirlos.

1. Haz un *fork* del repositorio.
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Haz commit de tus cambios: `git commit -am "Agregar nueva funcionalidad"`
4. Sube la rama: `git push origin feature/nueva-funcionalidad`
5. Abre un *Pull Request*.

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [`LICENSE`](LICENSE) para más detalles.

## 👨‍💻 Autor

Desarrollado para la **Universidad de Córdoba**.

## 💡 Soporte

¿Necesitas ayuda?

- Consulta la sección *Ayuda* de la aplicación.
- Revisa [`SRS.md`](SRS.md) para detalles técnicos.
- Abre un *issue* en este repositorio.
