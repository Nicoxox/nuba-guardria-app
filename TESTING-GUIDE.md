# NUBA Guardería Canina - Guía de Pruebas Manuales

**Fecha de Referencia:** 2026-03-25
**Servidor:** http://localhost:8000

## Instrucciones Previas

1. El servidor Node.js está ejecutándose en puerto 8000
2. La aplicación está disponible en http://localhost:8000
3. Los datos de prueba han sido actualizados para usar fechas actuales (marzo 2026)
4. Los datos se sincronizan con Firebase Firestore

---

## Pruebas a Realizar

### 1. HOSPEDAJES - Verificar Hospedajes Activos Hoy (2026-03-25)

**Vista:** Calendario (pestana activa por defecto)

**Comportamiento Esperado:**
- ✓ La aplicación debe mostrar "1 hospedajes hoy" en el badge de la cabecera
- ✓ En el calendario de marzo 2026, el día 25 debe mostrar **Luna** (1 hospedaje)
- ✓ Al hacer clic en el día 25, debe expandirse mostrando detalles de Luna:
  - Perro: Luna
  - Habitación: Suite 1
  - Desde: 2026-03-24
  - Hasta: 2026-03-27
  - Estado: activo

**Pasos:**
1. Abre http://localhost:8000 en el navegador
2. Verifica que diga "1 hospedajes hoy" en la cabecera
3. Navega al calendario de marzo 2026 (debe estar en mes actual)
4. Haz clic en el día 25 (hoy) para ver detalles

**Criterios de Éxito:**
- [ ] Badge muestra "1 hospedajes hoy"
- [ ] Calendario marca hoy (círculo o resaltado)
- [ ] Día 25 muestra Luna como hospedada
- [ ] Detalles correctos al expandir

---

### 2. HOSPEDAJES FUTUROS - Verificar Hospedajes Próximos

**Comportamiento Esperado:**
- ✓ El día 28 de marzo debe mostrar **Max** (hospedaje próximo)
- ✓ Estado debe ser "programado"
- ✓ Fechas: desde 2026-03-28 hasta 2026-04-02

**Pasos:**
1. En el calendario de marzo, navega hasta el día 28
2. Verifica que Max esté listado

---

### 3. HOSPEDAJES PASADOS - Verificar Completados

**Comportamiento Esperado:**
- ✓ Los hospedajes del 10-15 de marzo deben mostrarse con estado "completado"
- ✓ Toby debe estar marcado como completado

**Pasos:**
1. Navega al rango 10-15 de marzo en el calendario
2. Verifica que Toby esté listado con estado "completado"

---

### 4. PAGOS - Verificar Pagos Pendientes y Vencidos

**Vista:** Pestaña "Pagos"

**Comportamiento Esperado:**
- [ ] Debe mostrar **2 pagos pendientes** en el contador de la pestaña
- [ ] Debe mostrar **1 pago vencido** resaltado en color rojo
- [ ] Debe mostrar **1 pago sin vencer** (próximo a vencer mañana)

**Detalles del Pago Vencido:**
- Perro: Max
- Monto: Gs 360,000
- Vence: 2026-03-20 (5 días atrás)
- Estado: **VENCIDO** (mostrado en rojo)
- Descripción: "Pago por hospedaje 6 noches vencido"

**Detalles del Pago Próximo a Vencer:**
- Perro: Luna
- Monto: Gs 300,000
- Vence: 2026-03-26 (mañana)
- Estado: Pendiente
- Descripción: "Pago por hospedaje 5 noches"

**Pasos:**
1. Haz clic en la pestaña "Pagos"
2. Verifica que aparezcan los datos correctos
3. Nota que Max aparece con alerta de vencimiento (color rojo/naranja)

**Criterios de Éxito:**
- [ ] Contador muestra "2" pagos pendientes
- [ ] Pago vencido (Max) aparece resaltado
- [ ] Pago próximo a vencer (Luna) está visible
- [ ] Monto se muestra en formato Gs {cantidad}

---

### 5. TAREAS - Verificar Tareas del Día

**Vista:** Pestaña "Tareas"

**Comportamiento Esperado:**
- [ ] Debe mostrar **1 tarea de hoy** (pendiente)
- [ ] Debe mostrar **1 tarea futura** (mañana)

**Tarea de Hoy (2026-03-25):**
- Título: "Paseo Luna"
- Asignado a: Ana
- Estado: Pendiente
- Fecha: Hoy

**Tarea Futura (2026-03-26):**
- Título: "Baño Max"
- Asignado a: Luis
- Estado: Pendiente
- Fecha: Mañana

**Pasos:**
1. Haz clic en la pestaña "Tareas"
2. Verifica que aparezcan las tareas con las fechas correctas

**Criterios de Éxito:**
- [ ] Se muestran las tareas pertinentes a la fecha
- [ ] La tarea de hoy está marcada como tal
- [ ] Estados correctos (pendiente/completado)

---

### 6. PERROS - Verificar Información de Perros

**Vista:** Pestaña "Perros"

**Comportamiento Esperado:**
- [ ] Deben listarse los 3 perros con sus detalles
- [ ] Información completa visible (nombre, notas, cliente, tamaño, adjuntos)

**Perros Esperados:**
1. **Luna**
   - Cliente: María Pérez
   - Tamaño: Mediano
   - Notas: Dieta hipoalergénica, muy sociable
   - Adjuntos: vacunas_Luna.pdf

2. **Max**
   - Cliente: Carlos Gómez
   - Tamaño: Grande
   - Notas: Ansiedad por separación. Prefiere habitación tranquila
   - Adjuntos: Ninguno

3. **Toby**
   - Cliente: Lucía Fernández
   - Tamaño: Pequeño
   - Notas: Toma medicación por la mañana. Muy juguetón
   - Adjuntos: ficha_medica_Toby.pdf

**Criterios de Éxito:**
- [ ] Todos los perros aparecen listados
- [ ] Información correcta y completa

---

### 7. NAVEGACIÓN - Verificar Cambios de Fechas

**Comportamiento Esperado:**
- El calendario debe permitir navegar entre meses
- Las vistas deben actualizarse según la selección
- El botón "•" debe volver al mes actual (marzo 2026)

**Pasos:**
1. En la vista Calendario, haz clic en "›" para ir al próximo mes (abril)
2. Verifica que cambie a abril y Max aparezca (28 mar - 02 apr)
3. Haz clic en "•" para volver a marzo
4. Verifica que vuelva a mostrar marzo actual

**Criterios de Éxito:**
- [ ] Navegación funciona correctamente
- [ ] Los datos se actualizan según el mes

---

### 8. FIREBASE - Verificar Sincronización

**Comportamiento Esperado:**
- Los datos deben sincronizarse con Firebase Firestore
- Si abres la app en otra pestaña, los cambios deben reflejarse en ambas

**Pasos (Opcional):**
1. Abre la aplicación en dos pestañas diferentes
2. Modifica algo en una pestaña (ej: marca una tarea como completa)
3. Verifica que el cambio aparezca en la otra pestaña automáticamente

---

## Checklist Final

### Funcionalidad General
- [ ] App carga correctamente
- [ ] Todas las pestañas son accesibles
- [ ] No hay errores en la consola del navegador

### Fechas
- [ ] `today` = 2026-03-25
- [ ] Hospedajes activos hoy se muestran correctamente
- [ ] Pagos vencidos se detectan (Max vencido desde 2026-03-20)
- [ ] Tareas del día se muestran (Luna paseo hoy)

### Datos
- [ ] 3 perros cargados
- [ ] 3 hospedajes con fechas correctas
- [ ] 3 pagos con vencimientos correctos
- [ ] 3 tareas con fechas correctas

### UI/UX
- [ ] Colores diferenciados para estados (vencido/activo/completado)
- [ ] Badges con contadores correctos
- [ ] Mensajes de estado claros y precisos

---

## Registro de Problemas Encontrados

Si encuentras problemas, documenta:

| Componente | Problema | Pasos para Reproducir | Severidad |
|-----------|---------|----------------------|----------|
| Ejemplo: Pagos | Pago vencido no muestra en rojo | 1. Ir a Pagos 2. Buscar Max | Alta |

---

## Ejecución del Script de Prueba Automatizada

Para ejecutar las pruebas automatizadas que verifican la lógica sin UI:

```bash
cd "c:\Users\walte\Desktop\NUBA APP\nuba-guardria-app-main"
node test-suite.js
```

**Resultado Esperado:**
```
✓ Pruebas Pasadas: 13
✓ Pruebas Fallidas: 0
✓ Todas las pruebas pasaron correctamente
```

---

## Notas Finales

- Las fechas han sido actualizadas a 2026-03-25
- Los datos incluyen ejemplos de hospedajes activos, completados y programados
- Los pagos incluyen vencidos y pendientes para probar la lógica de alertas
- Las tareas incluyen hoy, futuras y completadas

**Próximos Pasos:**
1. Completar todas las pruebas manuales
2. Ejecutar el script automatizado
3. Documentar cualquier problema encontrado
4. Hacer commit a GitHub con los datos actualizados
