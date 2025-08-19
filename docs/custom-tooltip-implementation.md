# Implementación de Tooltip Personalizado

## Descripción
Este documento explica cómo crear un tooltip personalizado usando posicionamiento CSS absoluto y relativo, sin depender del componente `TextSelectionTooltip` existente.

## Ventajas del Enfoque Personalizado
- **Independencia**: No depende de componentes externos
- **Control total**: Posicionamiento y estilos completamente personalizables
- **Rendimiento**: Más ligero y eficiente
- **Flexibilidad**: Fácil de adaptar a diferentes necesidades

## Estructura HTML Base

```html
<div class="tooltip-container">
  <!-- Contenido principal -->
  <div class="content">
    Texto seleccionable aquí...
  </div>
  
  <!-- Tooltip flotante -->
  <div class="tooltip" id="tooltip">
    <div class="tooltip-content">
      <!-- Botones del tooltip -->
      <button class="tooltip-btn">Botón 1</button>
      <button class="tooltip-btn">Botón 2</button>
      <button class="tooltip-btn">Botón 3</button>
    </div>
  </div>
</div>
```

## CSS Base

```css
.tooltip-container {
  position: relative;
  /* El contenedor debe ser relativo para el posicionamiento absoluto del tooltip */
}

.tooltip {
  position: absolute;
  display: none;
  z-index: 1000;
  /* El tooltip se posiciona absolutamente respecto al contenedor */
}

.tooltip.visible {
  display: block;
}

.tooltip-content {
  background: rgba(0, 0, 0, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(8px);
}

.tooltip-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  padding: 6px 12px;
  margin: 0 4px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tooltip-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}
```

## JavaScript para Funcionalidad

```javascript
class CustomTooltip {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
    this.tooltip = this.container.querySelector('.tooltip');
    this.isVisible = false;
    
    this.init();
  }
  
  init() {
    // Eventos de selección de texto
    this.container.addEventListener('mouseup', this.handleSelection.bind(this));
    this.container.addEventListener('selectionchange', this.handleSelection.bind(this));
    
    // Evento para ocultar tooltip
    document.addEventListener('click', this.handleClickOutside.bind(this));
  }
  
  handleSelection(event) {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    if (selectedText.length > 0) {
      this.showTooltip(selection, event);
    } else {
      this.hideTooltip();
    }
  }
  
  showTooltip(selection, event) {
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    // Posicionar tooltip arriba del texto seleccionado
    const tooltipRect = this.tooltip.getBoundingClientRect();
    const containerRect = this.container.getBoundingClientRect();
    
    let left = rect.left - containerRect.left;
    let top = rect.top - containerRect.top - tooltipRect.height - 8;
    
    // Ajustar si se sale de los límites
    if (left < 0) left = 0;
    if (left + tooltipRect.width > containerRect.width) {
      left = containerRect.width - tooltipRect.width;
    }
    if (top < 0) {
      // Si no hay espacio arriba, poner abajo
      top = rect.bottom - containerRect.top + 8;
    }
    
    this.tooltip.style.left = `${left}px`;
    this.tooltip.style.top = `${top}px`;
    this.tooltip.classList.add('visible');
    this.isVisible = true;
  }
  
  hideTooltip() {
    this.tooltip.classList.remove('visible');
    this.isVisible = false;
  }
  
  handleClickOutside(event) {
    if (!this.container.contains(event.target)) {
      this.hideTooltip();
    }
  }
}

// Uso
const tooltip = new CustomTooltip('.tooltip-container');
```

## Implementación con React

```tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';

interface CustomTooltipProps {
  children: React.ReactNode;
  buttons?: React.ReactNode;
}

export const CustomTooltip: React.FC<CustomTooltipProps> = ({ 
  children, 
  buttons 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleSelection = useCallback(() => {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();
    
    if (selectedText && selectedText.length > 0) {
      const range = selection?.getRangeAt(0);
      if (range) {
        const rect = range.getBoundingClientRect();
        const containerRect = containerRef.current?.getBoundingClientRect();
        
        if (containerRect) {
          setPosition({
            x: rect.left - containerRect.left,
            y: rect.top - containerRect.top - 50 // 50px arriba
          });
          setIsVisible(true);
        }
      }
    } else {
      setIsVisible(false);
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('mouseup', handleSelection);
      container.addEventListener('selectionchange', handleSelection);
      
      return () => {
        container.removeEventListener('mouseup', handleSelection);
        container.removeEventListener('selectionchange', handleSelection);
      };
    }
  }, [handleSelection]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsVisible(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="tooltip-container">
      {children}
      
      {isVisible && (
        <div
          ref={tooltipRef}
          className="tooltip visible"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`
          }}
        >
          <div className="tooltip-content">
            {buttons}
          </div>
        </div>
      )}
    </div>
  );
};
```

## Uso del Componente React

```tsx
import { CustomTooltip } from './CustomTooltip';

export const MyComponent = () => {
  return (
    <CustomTooltip
      buttons={
        <>
          <button className="tooltip-btn">🔊 Audio</button>
          <button className="tooltip-btn">📝 Agregar</button>
          <button className="tooltip-btn">⭐ Favorito</button>
        </>
      }
    >
      <div className="content">
        <p>Este es un texto que se puede seleccionar para mostrar el tooltip personalizado.</p>
      </div>
    </CustomTooltip>
  );
};
```

## Consideraciones de Posicionamiento

### 1. Contenedor Relativo
- El contenedor padre debe tener `position: relative`
- Esto permite que el tooltip se posicione absolutamente respecto a él

### 2. Cálculo de Posición
- Usar `getBoundingClientRect()` para obtener coordenadas
- Restar la posición del contenedor para obtener coordenadas relativas
- Ajustar si el tooltip se sale de los límites

### 3. Z-Index
- Usar un z-index alto para asegurar que esté por encima de otros elementos
- Considerar el contexto de apilamiento

### 4. Responsive
- Ajustar posicionamiento en diferentes tamaños de pantalla
- Usar `window.innerWidth` y `window.innerHeight` para límites

## Ventajas de este Enfoque

1. **Control Total**: Posicionamiento exacto y personalizable
2. **Independencia**: No depende de librerías externas
3. **Rendimiento**: Más ligero que componentes complejos
4. **Flexibilidad**: Fácil de adaptar y modificar
5. **Mantenibilidad**: Código más simple y directo

## Casos de Uso

- Tooltips de selección de texto
- Menús contextuales
- Información flotante
- Controles de acción rápida
- Ayuda contextual
