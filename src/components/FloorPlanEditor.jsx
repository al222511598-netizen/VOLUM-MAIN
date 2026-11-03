import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Layers,
  Move,
  Plus,
  Trash2,
  Edit2,
  Check,
  RefreshCw,
  Circle,
  Square,
  RectangleHorizontal,
  Users,
  Sparkles,
  Save,
  Eye,
  MapPin,
  Hash,
  X,
  Copy,
  AlertCircle
} from 'lucide-react';

const CANVAS_WIDTH = 920;
const CANVAS_HEIGHT = 560;
const GRID_SIZE = 20;

export default function FloorPlanEditor({
  initialTables = [],
  initialFloorPlan = null,
  onSave,
  isSaving = false,
  restaurantSlug = 'la-terraza'
}) {
  const [tables, setTables] = useState(initialTables);
  const [zones, setZones] = useState(() => {
    if (initialFloorPlan?.zones && initialFloorPlan.zones.length > 0) {
      return initialFloorPlan.zones;
    }
    const detectedZones = Array.from(new Set(initialTables.map(t => t.zone).filter(Boolean)));
    return detectedZones.length > 0 ? detectedZones : ['Salón Principal', 'Terraza', 'Barra'];
  });
  const [activeZone, setActiveZone] = useState('ALL');
  const [gridSnap, setGridSnap] = useState(true);
  const [selectedTableId, setSelectedTableId] = useState(null);
  const [isNewZoneModalOpen, setIsNewZoneModalOpen] = useState(false);
  const [newZoneName, setNewZoneName] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Dragging state
  const canvasRef = useRef(null);
  const [dragState, setDragState] = useState(null);

  // Sincronizar estado si cambian las props iniciales
  useEffect(() => {
    if (initialTables && initialTables.length > 0) {
      setTables(prev => {
        // Preservar si el usuario ya movió cosas
        if (hasUnsavedChanges) return prev;
        return initialTables.map((t, idx) => ({
          id: t.id || `tbl_${idx}_${Date.now()}`,
          number: String(t.number || idx + 1),
          zone: t.zone || 'Salón Principal',
          shape: t.shape || 'circle',
          x: typeof t.x === 'number' ? t.x : 60 + (idx % 6) * 130,
          y: typeof t.y === 'number' ? t.y : 60 + Math.floor(idx / 6) * 120,
          width: t.width || (t.shape === 'rectangle' ? 120 : 76),
          height: t.height || (t.shape === 'rectangle' ? 76 : 76),
          seats: t.seats || (t.shape === 'rectangle' ? 6 : 4)
        }));
      });
    }
  }, [initialTables]);

  const selectedTable = useMemo(() => {
    return tables.find(t => t.id === selectedTableId) || null;
  }, [tables, selectedTableId]);

  // Filtrar mesas por zona seleccionada
  const visibleTables = useMemo(() => {
    if (activeZone === 'ALL') return tables;
    return tables.filter(t => (t.zone || 'Salón Principal').trim().toLowerCase() === activeZone.trim().toLowerCase());
  }, [tables, activeZone]);

  // Iniciar arrastre de mesa
  const handlePointerDown = (e, table) => {
    e.stopPropagation();
    setSelectedTableId(table.id);

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / canvasRect.width;
    const scaleY = CANVAS_HEIGHT / canvasRect.height;

    const startPointerX = (e.clientX - canvasRect.left) * scaleX;
    const startPointerY = (e.clientY - canvasRect.top) * scaleY;

    setDragState({
      tableId: table.id,
      startX: startPointerX,
      startY: startPointerY,
      originX: table.x,
      originY: table.y
    });
  };

  // Mover mesa durante arrastre
  const handlePointerMove = (e) => {
    if (!dragState) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / canvasRect.width;
    const scaleY = CANVAS_HEIGHT / canvasRect.height;

    const currentPointerX = (e.clientX - canvasRect.left) * scaleX;
    const currentPointerY = (e.clientY - canvasRect.top) * scaleY;

    const deltaX = currentPointerX - dragState.startX;
    const deltaY = currentPointerY - dragState.startY;

    let nextX = dragState.originX + deltaX;
    let nextY = dragState.originY + deltaY;

    if (gridSnap) {
      nextX = Math.round(nextX / GRID_SIZE) * GRID_SIZE;
      nextY = Math.round(nextY / GRID_SIZE) * GRID_SIZE;
    }

    const currentTable = tables.find(t => t.id === dragState.tableId);
    const tableWidth = currentTable?.width || 76;
    const tableHeight = currentTable?.height || 76;

    // Confinar dentro del canvas
    nextX = Math.max(10, Math.min(CANVAS_WIDTH - tableWidth - 10, nextX));
    nextY = Math.max(10, Math.min(CANVAS_HEIGHT - tableHeight - 10, nextY));

    setTables(prev =>
      prev.map(t => {
        if (t.id === dragState.tableId) {
          return { ...t, x: nextX, y: nextY };
        }
        return t;
      })
    );
    setHasUnsavedChanges(true);
  };

  const handlePointerUp = () => {
    setDragState(null);
  };

  // Agregar nueva mesa
  const handleAddTable = (shape = 'circle') => {
    const nextNumber = String(tables.length + 1);
    const targetZone = activeZone !== 'ALL' ? activeZone : (zones[0] || 'Salón Principal');
    const width = shape === 'rectangle' ? 120 : 76;
    const height = 76;
    const seats = shape === 'rectangle' ? 6 : shape === 'square' ? 4 : 4;

    // Buscar una posición libre
    const nextIndex = tables.length;
    let newX = 40 + (nextIndex % 6) * 130;
    let newY = 40 + Math.floor(nextIndex / 6) * 110;
    if (newX > CANVAS_WIDTH - width - 20) newX = 40;
    if (newY > CANVAS_HEIGHT - height - 20) newY = 40;

    const newTable = {
      id: `tbl_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      number: nextNumber,
      zone: targetZone,
      shape,
      x: newX,
      y: newY,
      width,
      height,
      seats
    };

    setTables(prev => [...prev, newTable]);
    setSelectedTableId(newTable.id);
    setHasUnsavedChanges(true);
  };

  // Duplicar mesa seleccionada
  const handleDuplicateSelected = () => {
    if (!selectedTable) return;
    const newTable = {
      ...selectedTable,
      id: `tbl_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      number: String(tables.length + 1),
      x: Math.min(CANVAS_WIDTH - selectedTable.width - 20, selectedTable.x + 30),
      y: Math.min(CANVAS_HEIGHT - selectedTable.height - 20, selectedTable.y + 30)
    };
    setTables(prev => [...prev, newTable]);
    setSelectedTableId(newTable.id);
    setHasUnsavedChanges(true);
  };

  // Eliminar mesa seleccionada
  const handleDeleteSelected = () => {
    if (!selectedTableId) return;
    setTables(prev => prev.filter(t => t.id !== selectedTableId));
    setSelectedTableId(null);
    setHasUnsavedChanges(true);
  };

  // Actualizar atributos de la mesa seleccionada
  const handleUpdateSelected = (field, value) => {
    if (!selectedTableId) return;
    setTables(prev =>
      prev.map(t => {
        if (t.id === selectedTableId) {
          const updated = { ...t, [field]: value };
          if (field === 'shape') {
            if (value === 'rectangle') {
              updated.width = 120;
              updated.height = 76;
              if (t.seats < 6) updated.seats = 6;
            } else {
              updated.width = 76;
              updated.height = 76;
              if (t.seats > 4) updated.seats = 4;
            }
          }
          return updated;
        }
        return t;
      })
    );
    setHasUnsavedChanges(true);
  };

  // Agregar nueva zona personalizada
  const handleCreateZone = (e) => {
    e.preventDefault();
    const clean = newZoneName.trim();
    if (!clean) return;
    if (!zones.includes(clean)) {
      setZones(prev => [...prev, clean]);
      setActiveZone(clean);
    }
    setNewZoneName('');
    setIsNewZoneModalOpen(false);
    setHasUnsavedChanges(true);
  };

  // Guardar plano en backend
  const handleSaveClick = async () => {
    if (onSave) {
      await onSave({
        tables,
        floorPlan: {
          zones,
          gridSnap
        }
      });
      setHasUnsavedChanges(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Barra Superior de Herramientas y Zonas */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Selector de Zonas */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mr-1">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>Zonas:</span>
          </span>
          <button
            type="button"
            onClick={() => setActiveZone('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeZone === 'ALL'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Todas ({tables.length})
          </button>
          {zones.map(z => {
            const count = tables.filter(t => (t.zone || 'Salón Principal') === z).length;
            return (
              <button
                key={z}
                type="button"
                onClick={() => setActiveZone(z)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeZone === z
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <span>{z}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800/80 text-slate-300">
                  {count}
                </span>
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setIsNewZoneModalOpen(true)}
            className="p-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-amber-400 hover:text-amber-300 border border-slate-800 transition-all text-xs flex items-center gap-1"
            title="Añadir nueva zona al restaurante"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="text-[11px] font-semibold pr-1">Zona</span>
          </button>
        </div>

        {/* Acciones y Paleta de Mesas */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-slate-950 p-1 rounded-2xl border border-slate-800 gap-1">
            <button
              type="button"
              onClick={() => handleAddTable('circle')}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all"
              title="Añadir Mesa Redonda"
            >
              <Circle className="w-3.5 h-3.5 fill-amber-500/20 text-amber-400" />
              <span>Redonda</span>
            </button>
            <button
              type="button"
              onClick={() => handleAddTable('square')}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all"
              title="Añadir Mesa Cuadrada"
            >
              <Square className="w-3.5 h-3.5 fill-amber-500/20 text-amber-400" />
              <span>Cuadrada</span>
            </button>
            <button
              type="button"
              onClick={() => handleAddTable('rectangle')}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all"
              title="Añadir Mesa Rectangular (6-8 personas)"
            >
              <RectangleHorizontal className="w-3.5 h-3.5 fill-amber-500/20 text-amber-400" />
              <span>Rectangular</span>
            </button>
          </div>

          {/* Toggle Ajustar a Cuadrícula */}
          <button
            type="button"
            onClick={() => setGridSnap(!gridSnap)}
            className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
              gridSnap
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-400'
            }`}
            title="Ajustar posiciones a la cuadrícula magnética"
          >
            <Hash className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Imán</span>
          </button>

          {/* Botón Guardar */}
          <button
            type="button"
            onClick={handleSaveClick}
            disabled={isSaving}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all shadow-lg ${
              hasUnsavedChanges
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:brightness-110 shadow-amber-500/20 animate-pulse'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            {isSaving ? (
              <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{hasUnsavedChanges ? 'Guardar Cambios' : 'Plano Guardado'}</span>
          </button>
        </div>
      </div>

      {/* Área del Lienzo de Croquis */}
      <div className="relative rounded-3xl bg-slate-950 border border-slate-800/80 overflow-hidden shadow-2xl select-none">
        {/* Banner Superior Flotante: Ayuda y Enlace a Servicio */}
        <div className="absolute top-3 left-4 z-10 flex items-center gap-2 pointer-events-none">
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-900/90 text-slate-400 border border-slate-800 backdrop-blur-md flex items-center gap-1.5 shadow-sm">
            <Move className="w-3 h-3 text-amber-400" />
            <span>Arrastra cualquier mesa para posicionarla en el salón</span>
          </span>
        </div>

        <div className="absolute top-3 right-4 z-10 flex items-center gap-2">
          <a
            href={`/servicio?slug=${restaurantSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-bold px-3 py-1 rounded-full bg-slate-900/90 hover:bg-slate-800 text-amber-400 border border-slate-800 backdrop-blur-md flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Eye className="w-3 h-3" />
            <span>Ver Modo Servicio en Vivo</span>
          </a>
        </div>

        {/* Lienzo SVG / Canvas Interactivo */}
        <div
          ref={canvasRef}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onClick={() => setSelectedTableId(null)}
          className="relative w-full overflow-hidden cursor-crosshair"
          style={{
            aspectRatio: `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}`,
            maxHeight: '600px',
            backgroundImage: gridSnap
              ? 'radial-gradient(circle, rgba(245, 158, 11, 0.12) 1px, transparent 1px)'
              : 'none',
            backgroundSize: `${(GRID_SIZE / CANVAS_WIDTH) * 100}% ${(GRID_SIZE / CANVAS_HEIGHT) * 100}%`
          }}
        >
          {visibleTables.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 pointer-events-none p-6 text-center">
              <Sparkles className="w-10 h-10 text-amber-500/30 mb-2" />
              <p className="text-sm font-bold text-slate-400">Esta zona aún no tiene mesas asignadas</p>
              <p className="text-xs text-slate-600 mt-1">Usa los botones superiores para añadir mesas redondas, cuadradas o rectangulares.</p>
            </div>
          ) : (
            visibleTables.map(table => {
              const isSelected = table.id === selectedTableId;
              const isCircle = table.shape === 'circle';
              const isRect = table.shape === 'rectangle';

              // Posicionamiento porcentual responsivo
              const leftPercent = (table.x / CANVAS_WIDTH) * 100;
              const topPercent = (table.y / CANVAS_HEIGHT) * 100;
              const widthPercent = (table.width / CANVAS_WIDTH) * 100;
              const heightPercent = (table.height / CANVAS_HEIGHT) * 100;

              return (
                <div
                  key={table.id}
                  onPointerDown={(e) => handlePointerDown(e, table)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTableId(table.id);
                  }}
                  style={{
                    position: 'absolute',
                    left: `${leftPercent}%`,
                    top: `${topPercent}%`,
                    width: `${widthPercent}%`,
                    height: `${heightPercent}%`,
                    touchAction: 'none'
                  }}
                  className={`cursor-move transition-transform active:scale-95 group select-none flex items-center justify-center ${
                    isSelected ? 'z-30' : 'z-20 hover:z-25'
                  }`}
                >
                  {/* Elemento de Mesa */}
                  <div
                    className={`w-full h-full flex flex-col items-center justify-center relative shadow-lg transition-all ${
                      isCircle
                        ? 'rounded-full'
                        : isRect
                        ? 'rounded-2xl'
                        : 'rounded-2xl'
                    } ${
                      isSelected
                        ? 'bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-slate-950 ring-4 ring-amber-400/50 shadow-amber-500/40 shadow-xl'
                        : 'bg-gradient-to-br from-slate-900 to-slate-950 border border-amber-500/30 hover:border-amber-400 text-white shadow-md'
                    }`}
                  >
                    {/* Indicadores de Asientos Decorativos */}
                    {isCircle && (
                      <>
                        <span className={`w-1.5 h-1.5 rounded-full absolute -top-1 ${isSelected ? 'bg-slate-950' : 'bg-amber-400/60'}`} />
                        <span className={`w-1.5 h-1.5 rounded-full absolute -bottom-1 ${isSelected ? 'bg-slate-950' : 'bg-amber-400/60'}`} />
                        <span className={`w-1.5 h-1.5 rounded-full absolute -left-1 ${isSelected ? 'bg-slate-950' : 'bg-amber-400/60'}`} />
                        <span className={`w-1.5 h-1.5 rounded-full absolute -right-1 ${isSelected ? 'bg-slate-950' : 'bg-amber-400/60'}`} />
                      </>
                    )}
                    {isRect && (
                      <>
                        <span className={`w-1.5 h-1.5 rounded-full absolute -top-1 left-1/4 ${isSelected ? 'bg-slate-950' : 'bg-amber-400/60'}`} />
                        <span className={`w-1.5 h-1.5 rounded-full absolute -top-1 right-1/4 ${isSelected ? 'bg-slate-950' : 'bg-amber-400/60'}`} />
                        <span className={`w-1.5 h-1.5 rounded-full absolute -bottom-1 left-1/4 ${isSelected ? 'bg-slate-950' : 'bg-amber-400/60'}`} />
                        <span className={`w-1.5 h-1.5 rounded-full absolute -bottom-1 right-1/4 ${isSelected ? 'bg-slate-950' : 'bg-amber-400/60'}`} />
                      </>
                    )}

                    {/* Número de Mesa */}
                    <span
                      data-floor-table-number="true"
                      className={`text-base font-black tracking-tight leading-none keep-white ${
                        isSelected ? 'text-slate-950 font-black' : 'text-white'
                      }`}
                      style={{ color: isSelected ? '#020617' : '#ffffff' }}
                    >
                      {table.number}
                    </span>

                    {/* Capacidad en personas */}
                    <span className={`text-[10px] font-bold mt-0.5 flex items-center gap-0.5 ${
                      isSelected ? 'text-slate-950 font-black' : 'text-amber-400/90'
                    }`}>
                      <Users className="w-2.5 h-2.5" />
                      <span>{table.seats || 4}</span>
                    </span>
                  </div>

                  {/* Etiqueta flotante con nombre de zona (hover) */}
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-6 pointer-events-none px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-[9px] font-bold text-slate-300 whitespace-nowrap shadow-md z-40">
                    Mesa {table.number} • {table.zone || 'Principal'}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Inspector de Mesa Seleccionada */}
      {selectedTable && (
        <div className="p-4 rounded-3xl bg-slate-900 border border-amber-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-lg shadow-md shrink-0">
              {selectedTable.number}
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Configuración de Mesa {selectedTable.number}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
                  {selectedTable.zone || 'Salón Principal'}
                </span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Capacidad: {selectedTable.seats || 4} personas • Forma: {selectedTable.shape || 'circle'}
              </p>
            </div>
          </div>

          {/* Controles de edición rápida */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Input Número */}
            <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 font-bold">N°:</span>
              <input
                type="text"
                value={selectedTable.number}
                onChange={(e) => handleUpdateSelected('number', e.target.value)}
                className="w-12 bg-transparent text-white font-bold text-xs focus:outline-none focus:text-amber-400"
              />
            </div>

            {/* Selector de Capacidad */}
            <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedTable.seats || 4}
                onChange={(e) => handleUpdateSelected('seats', Number(e.target.value))}
                className="bg-transparent text-white font-bold text-xs focus:outline-none"
              >
                {[1, 2, 3, 4, 5, 6, 8, 10, 12].map(n => (
                  <option key={n} value={n} className="bg-slate-900 text-white">
                    {n} pers.
                  </option>
                ))}
              </select>
            </div>

            {/* Selector de Forma */}
            <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
              <select
                value={selectedTable.shape || 'circle'}
                onChange={(e) => handleUpdateSelected('shape', e.target.value)}
                className="bg-transparent text-white font-bold text-xs focus:outline-none"
              >
                <option value="circle" className="bg-slate-900 text-white">Redonda</option>
                <option value="square" className="bg-slate-900 text-white">Cuadrada</option>
                <option value="rectangle" className="bg-slate-900 text-white">Rectangular</option>
              </select>
            </div>

            {/* Selector de Zona */}
            <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedTable.zone || 'Salón Principal'}
                onChange={(e) => handleUpdateSelected('zone', e.target.value)}
                className="bg-transparent text-white font-bold text-xs focus:outline-none"
              >
                {zones.map(z => (
                  <option key={z} value={z} className="bg-slate-900 text-white">
                    {z}
                  </option>
                ))}
              </select>
            </div>

            {/* Duplicar */}
            <button
              type="button"
              onClick={handleDuplicateSelected}
              className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-all"
              title="Duplicar mesa"
            >
              <Copy className="w-4 h-4" />
            </button>

            {/* Eliminar */}
            <button
              type="button"
              onClick={handleDeleteSelected}
              className="p-2 rounded-xl bg-slate-950 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-900/50 transition-all"
              title="Eliminar mesa"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modal: Crear Nueva Zona */}
      {isNewZoneModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-500" />
                <span>Nueva Zona o Salón</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsNewZoneModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Crea una zona para agrupar mesas físicas (ej. <em>Terraza Exterior, Planta Alta, Barra de Cocteles</em>).
            </p>
            <form onSubmit={handleCreateZone} className="space-y-4">
              <input
                type="text"
                value={newZoneName}
                onChange={(e) => setNewZoneName(e.target.value)}
                placeholder="Nombre de la zona (ej. Terraza)"
                autoFocus
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewZoneModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!newZoneName.trim()}
                  className="w-1/2 py-2.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-black hover:bg-amber-400 disabled:opacity-50"
                >
                  Crear Zona
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
