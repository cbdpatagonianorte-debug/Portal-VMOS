---
name: article-visual-rendering
description: Guía de maquetación, formato editorial web y renderizado de tablas, gráficos y datos para el portal de noticias.
---

# Guía de Renderizado Visual y Formato Editorial Web

## 1. Prohibición de Capturas de Terminal
- **Regla Estricta:** Queda prohibido adjuntar o renderizar imágenes tomadas directamente de la terminal o salidas de consola.
- **Motivo:** Rompen la accesibilidad, no son adaptables a pantallas móviles (responsive), impiden el SEO y destruyen la línea estética del portal.

## 2. Estilo de Tablas en Noticias (Tailwind CSS)
Toda tabla dentro del cuerpo de la nota o entregada por la API debe renderizarse con las siguientes reglas de diseño web:

```html
<div class="overflow-x-auto my-6 rounded-lg border border-slate-200 shadow-sm">
  <table class="w-full text-left text-sm text-slate-700 border-collapse">
    <thead class="bg-slate-900 text-white uppercase text-xs tracking-wider">
      <tr>
        <th class="py-3 px-4">Indicador / Variable</th>
        <th class="py-3 px-4 text-right">Valor / Proyección</th>
        <th class="py-3 px-4">Estado / Ámbito</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-slate-200 bg-white">
      <tr class="hover:bg-slate-50 transition-colors">
        <td class="py-3 px-4 font-medium text-slate-900">Capacidad de Carga VMOS</td>
        <td class="py-3 px-4 text-right font-mono font-bold text-amber-700">120.000 bpd</td>
        <td class="py-3 px-4"><span class="px-2 py-1 text-xs rounded-full bg-emerald-100 text-emerald-800">En Ejecución</span></td>
      </tr>
    </tbody>
  </table>
</div>
```

## 3. Reemplazo de Gráficos de Terminal por Tarjetas de Datos (KPI Cards)
Para presentar métricas energéticas o económicas de Punta Colorada, Sierra Grande y Playas Doradas sin usar imágenes de consola, se deben usar **cajas de impacto visual**:

```html
<div class="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
  <div class="p-4 bg-slate-50 border-l-4 border-amber-600 rounded-r-lg shadow-sm">
    <span class="text-xs uppercase tracking-wider text-slate-500 font-semibold">Inversión Estimada</span>
    <p class="text-2xl font-extrabold text-slate-900 mt-1">USD 2.500 M</p>
    <span class="text-xs text-emerald-600 font-medium">↑ Régimen RIGI Aprobado</span>
  </div>
</div>
```

## 4. Elementos Editoriales Ricos
- **Destacados Periodísticos (Callouts):** Usar bloques con borde izquierdo azul marino (`border-l-4 border-slate-900 bg-slate-50 p-4 italic text-slate-800 my-6`).
- **Gráficos Dinámicos:** Utilizar librerías web de renderizado ligero (Recharts / Chart.js en React) alimentadas por datos JSON estructurados, en lugar de archivos de imagen estáticos.
