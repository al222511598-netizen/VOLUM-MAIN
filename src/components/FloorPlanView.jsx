import React, { useState, useMemo } from 'react';
import {
  Utensils,
  ChefHat,
  X,
  AlertCircle,
  Bell,
  CreditCard,
  Banknote,
  CheckCircle2,
  Users,
  MapPin,
  Sparkles,
  Layers,
  Clock,
  Check,
  LogOut,
  LayoutGrid,
  Map
} from 'lucide-react';

const CANVAS_WIDTH = 920;
const CANVAS_HEIGHT = 560;

export default function FloorPlanView({
  tables = [],
  zones = [],
  requests = [],
  activeSessions = [],
  onAttendRequest,
  onCloseSession,
  onApproveOrder,
  onRejectOrder,
  onOpenCheckout = null,
  restaurantName = ''
}) {
  const [activeZone, setActiveZone] = useState('ALL');
  const [selectedTable, setSelectedTable] = useState(null);
  const [viewMode, setViewMode] = useState(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return 'cards';
    }
    return 'canvas';
  });

  // Mapear solicitudes pendientes por número de mesa
  const requestsByTable = useMemo(() => {
    const map = {};
    requests.forEach(req => {
      const tableKey = String(req.table || '').trim().toLowerCase();
      if (!map[tableKey]) {
        map[tableKey] = [];
      }
      map[tableKey].push(req);
    });
    return map;
  }, [requests]);

  // Lista de zonas detectadas
  const availableZones = useMemo(() => {
    if (zones && zones.length > 0) return zones;
    const detected = Array.from(new Set(tables.map(t => t.zone).filter(Boolean)));
    return detected.length > 0 ? detected : ['Salón Principal', 'Terraza', 'Barra'];
  }, [zones, tables]);

  // Filtrar mesas por zona
  const visibleTables = useMemo(() => {
    if (activeZone === 'ALL') return tables;
    return tables.filter(t => (t.zone || 'Salón Principal').trim().toLowerCase() === activeZone.trim().toLowerCase());
  }, [tables, activeZone]);

  // Contar alertas activas por zona
  const alertsCountByZone = useMemo(() => {
    const counts = { ALL: requests.length };
    availableZones.forEach(z => {
      counts[z] = 0;
    });
    requests.forEach(req => {
      const matchTable = tables.find(t => String(t.number).trim().toLowerCase() === String(req.table).trim().toLowerCase());
      const zoneName = matchTable?.zone || 'Salón Principal';
      if (counts[zoneName] !== undefined) {
        counts[zoneName]++;
      }
    });
    return counts;
  }, [requests, tables, availableZones]);

  // Mapear sesiones activas por número de mesa
  const sessionsByTable = useMemo(() => {
    const map = {};
    (activeSessions || []).forEach(sess => {
      const key = String(sess.tableNumber || '').trim().toLowerCase();
      map[key] = sess;
    });
    return map;
  }, [activeSessions]);

  const pendingOrdersByTable = useMemo(() => {
    const map = {};
    (activeSessions || []).forEach(sess => {
      const key = String(sess.tableNumber || '').trim().toLowerCase();
      const pendings = (sess.orders || []).filter(o => o.status === 'pending_approval');
      if (pendings.length > 0) {
        map[key] = pendings;
      }
    });
    return map;
  }, [activeSessions]);

  // Solicitudes y sesión de la mesa seleccionada
  const selectedTableRequests = useMemo(() => {
    if (!selectedTable) return [];
    const tableKey = String(selectedTable.number || '').trim().toLowerCase();
    return requestsByTable[tableKey] || [];
  }, [selectedTable, requestsByTable]);

  const selectedTableSession = useMemo(() => {
    if (!selectedTable) return null;
    const tableKey = String(selectedTable.number || '').trim().toLowerCase();
    return sessionsByTable[tableKey] || null;
  }, [selectedTable, sessionsByTable]);

  const selectedTablePendingOrders = useMemo(() => {
    if (!selectedTable) return [];
    const tableKey = String(selectedTable.number || '').trim().toLowerCase();
    return pendingOrdersByTable[tableKey] || [];
  }, [selectedTable, pendingOrdersByTable]);

  return (
    <div className="space-y-4">
      {/* Barra de Filtros de Zona y Switcher de Vista */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Filtros de Zona */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mr-1 shrink-0">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>Zona:</span>
          </span>
          <button
            type="button"
            onClick={() => {
              setActiveZone('ALL');
              setSelectedTable(null);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeZone === 'ALL'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <span>Todas</span>
            {alertsCountByZone.ALL > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white font-black text-[10px] animate-pulse">
                {alertsCountByZone.ALL}
              </span>
            )}
          </button>
          {availableZones.map(z => {
            const alertCount = alertsCountByZone[z] || 0;
            return (
              <button
                key={z}
                type="button"
                onClick={() => {
                  setActiveZone(z);
                  setSelectedTable(null);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                  activeZone === z
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <span>{z}</span>
                {alertCount > 0 ? (
                  <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white font-black text-[10px] animate-pulse">
                    {alertCount}
                  </span>
                ) : (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400">
                    {tables.filter(t => (t.zone || 'Salón Principal') === z).length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Switcher de Vista y Leyenda */}
        <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
          <div className="flex items-center bg-slate-900 p-1 rounded-2xl border border-slate-800 shadow-inner">
            <button
              type="button"
              onClick={() => setViewMode('canvas')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'canvas'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Ver croquis / plano visual"
            >
              <Map className="w-3.5 h-3.5" />
              <span>Croquis</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'cards'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Ver cuadrícula de tarjetas táctil para smartphone"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Tarjetas</span>
            </button>
          </div>

          {/* Leyenda en pantallas grandes */}
          <div className="hidden lg:flex items-center gap-3 text-[11px] font-bold text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Libre</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
              <span>Llamando</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-bounce" />
              <span>Cuenta</span>
            </span>
          </div>
        </div>
      </div>

      {viewMode === 'cards' ? (
        /* Cuadrícula de Tarjetas Táctiles para Móvil */
        <div className="space-y-4">
          {visibleTables.length === 0 ? (
            <div className="p-12 rounded-3xl bg-slate-950 border border-slate-800 text-center text-slate-500">
              <Sparkles className="w-10 h-10 text-amber-500/30 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-400">No hay mesas en esta zona</p>
              <p className="text-xs text-slate-600 mt-1">Configura las mesas desde el panel de administración.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {visibleTables.map((table) => {
                const tableKey = String(table.number || '').trim().toLowerCase();
                const tableAlerts = requestsByTable[tableKey] || [];
                const tableSession = sessionsByTable[tableKey];
                const tablePendingOrders = pendingOrdersByTable[tableKey] || [];
                const hasPendingOrders = tablePendingOrders.length > 0;
                const hasAlert = tableAlerts.length > 0;
                const hasBill = tableAlerts.some(r => r.type === 'bill');
                const billReq = tableAlerts.find(r => r.type === 'bill');
                const hasWaiterCall = tableAlerts.some(r => r.type !== 'bill');
                const waiterReq = tableAlerts.find(r => r.type !== 'bill');
                const isSelected = selectedTable?.id === table.id;

                return (
                  <div
                    key={table.id}
                    onClick={() => setSelectedTable(isSelected ? null : table)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between gap-3 text-left ${
                      hasBill
                        ? 'bg-gradient-to-br from-purple-950/80 via-slate-900 to-slate-950 border-purple-500 shadow-lg shadow-purple-900/30 ring-2 ring-purple-400 animate-pulse'
                        : hasWaiterCall
                        ? 'bg-gradient-to-br from-amber-950/80 via-slate-900 to-slate-950 border-amber-400 shadow-lg shadow-amber-900/30 ring-2 ring-amber-400'
                        : hasPendingOrders
                        ? 'bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-950 border-emerald-500 shadow-md shadow-emerald-950/40'
                        : isSelected
                        ? 'bg-slate-800 border-amber-400 ring-2 ring-amber-400/40'
                        : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      {/* Cabecera de la Tarjeta */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-base shadow-sm ${
                            hasBill
                              ? 'bg-purple-500 text-white'
                              : hasWaiterCall
                              ? 'bg-amber-400 text-slate-950'
                              : 'bg-slate-800 text-white border border-slate-700'
                          }`}
                    style={{ color: hasWaiterCall && !hasBill ? '#020617' : '#ffffff' }}>
                            {table.number}
                          </div>
                          <div>
                            <span className="text-xs font-black text-white block">
                              Mesa {table.number}
                            </span>
                            <span className="text-[10px] text-slate-400 flex items-center gap-1">
                              <Users className="w-2.5 h-2.5 text-slate-500" />
                              <span>{table.seats || 4} pers.</span>
                            </span>
                          </div>
                        </div>

                        <span className="text-[9px] px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-400 border border-slate-700/60 truncate max-w-[80px]">
                          {table.zone || 'Salón'}
                        </span>
                      </div>

                      {/* Estado / Badges de Alerta */}
                      <div className="mt-2.5 space-y-1">
                        {hasBill && (
                          <div className="px-2 py-1 rounded-lg bg-purple-500/20 border border-purple-500/50 flex items-center justify-between text-[11px] font-black text-purple-300">
                            <span className="flex items-center gap-1">
                              <CreditCard className="w-3 h-3 text-purple-400 shrink-0" />
                              <span>Pide Cuenta</span>
                            </span>
                            {billReq?.paymentMethod && (
                              <span className="text-[9px] uppercase font-mono px-1 py-0.2 rounded bg-purple-900/60 text-purple-200">
                                {billReq.paymentMethod === 'cash' ? 'Efectivo' : 'Tarjeta'}
                              </span>
                            )}
                          </div>
                        )}

                        {hasWaiterCall && (
                          <div className="px-2 py-1 rounded-lg bg-amber-500/20 border border-amber-500/50 flex items-center gap-1 text-[11px] font-black text-amber-300">
                            <Bell className="w-3 h-3 text-amber-400 shrink-0 animate-spin" />
                            <span>Llama Mesero</span>
                          </div>
                        )}

                        {hasPendingOrders && (
                          <div className="px-2 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/50 flex items-center gap-1 text-[11px] font-bold text-emerald-300">
                            <Utensils className="w-3 h-3 text-emerald-400 shrink-0" />
                            <span>{tablePendingOrders.length} {tablePendingOrders.length > 1 ? 'comandas' : 'comanda'}</span>
                          </div>
                        )}

                        {!hasBill && !hasWaiterCall && !hasPendingOrders && (
                          <div className="text-[11px] text-slate-500 font-medium py-0.5 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500/50 inline-block" />
                            <span>Tranquila</span>
                          </div>
                        )}
                      </div>

                      {/* Consumo Acumulado si hay sesión */}
                      {tableSession && tableSession.totalAmount > 0 && (
                        <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                          <span className="text-slate-400">Total:</span>
                          <span className="font-mono font-black text-amber-400 text-xs">
                            ${tableSession.totalAmount.toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Botones de Acción Rápida en la Tarjeta */}
                    <div className="pt-2 border-t border-slate-800 flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      {hasAlert ? (
                        <button
                          type="button"
                          onClick={() => {
                            const alertToAttend = billReq || waiterReq || tableAlerts[0];
                            if (alertToAttend && onAttendRequest) {
                              onAttendRequest(alertToAttend._id || alertToAttend.id);
                            }
                          }}
                          className={`w-full py-1.5 px-2 rounded-xl text-xs font-black flex items-center justify-center gap-1 shadow-md transition-all active:scale-95 ${
                            hasBill
                              ? 'bg-purple-500 hover:bg-purple-400 text-white'
                              : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                          }`}
                        >
                          <Check className="w-3 h-3" />
                          <span>Atender</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setSelectedTable(isSelected ? null : table)}
                          className="w-full py-1.5 px-2 rounded-xl text-[11px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-all"
                        >
                          <span>{isSelected ? 'Cerrar' : 'Ver Mesa'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Plano de Sala Interactivo (Croquis) */
        <div className="relative rounded-3xl bg-slate-950 border border-slate-800/80 overflow-hidden shadow-2xl select-none">
        <div
          onClick={() => setSelectedTable(null)}
          className="relative w-full overflow-hidden"
          style={{
            aspectRatio: `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}`,
            maxHeight: '620px',
            backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        >
          {visibleTables.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 p-6 text-center">
              <Sparkles className="w-10 h-10 text-amber-500/30 mb-2" />
              <p className="text-sm font-bold text-slate-400">No hay mesas en esta zona</p>
              <p className="text-xs text-slate-600 mt-1">Configura las mesas desde el panel de administración.</p>
            </div>
          ) : (
            visibleTables.map((table, idx) => {
              const tableKey = String(table.number || '').trim().toLowerCase();
              const tableAlerts = requestsByTable[tableKey] || [];
              const tableSession = sessionsByTable[tableKey];
              const tablePendingOrders = pendingOrdersByTable[tableKey] || [];
              const hasPendingOrders = tablePendingOrders.length > 0;
              const hasAlert = tableAlerts.length > 0;
              const hasBill = tableAlerts.some(r => r.type === 'bill');
              const hasWaiterCall = tableAlerts.some(r => r.type !== 'bill');
              const isSelected = selectedTable?.id === table.id;

              const isCircle = table.shape === 'circle';
              const isRect = table.shape === 'rectangle';

              // Fallback ultra-seguro de coordenadas contra NaN% o valores ausentes
              const safeX = typeof table.x === 'number' && !isNaN(table.x) ? table.x : 60 + (idx % 6) * 130;
              const safeY = typeof table.y === 'number' && !isNaN(table.y) ? table.y : 60 + Math.floor(idx / 6) * 120;
              const safeW = Number(table.width) || (isRect ? 120 : 76);
              const safeH = Number(table.height) || 76;

              const leftPercent = Math.max(0, Math.min(95, (safeX / CANVAS_WIDTH) * 100));
              const topPercent = Math.max(0, Math.min(95, (safeY / CANVAS_HEIGHT) * 100));
              const widthPercent = (safeW / CANVAS_WIDTH) * 100;
              const heightPercent = (safeH / CANVAS_HEIGHT) * 100;

              return (
                <div
                  key={table.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTable(table);
                  }}
                  style={{
                    position: 'absolute',
                    left: `${leftPercent}%`,
                    top: `${topPercent}%`,
                    width: `${widthPercent}%`,
                    height: `${heightPercent}%`
                  }}
                  className={`cursor-pointer transition-all active:scale-95 group select-none flex items-center justify-center ${
                    isSelected ? 'z-40 scale-105' : hasAlert ? 'z-30' : 'z-20 hover:z-25 hover:scale-105'
                  }`}
                >
                  {/* Tarjeta de Mesa con Alerta Dinámica */}
                  <div
                    className={`w-full h-full flex flex-col items-center justify-center relative shadow-xl transition-all ${
                      isCircle
                        ? 'rounded-full'
                        : isRect
                        ? 'rounded-2xl'
                        : 'rounded-2xl'
                    } ${
                      hasBill
                        ? 'bg-gradient-to-br from-purple-900 via-purple-950 to-slate-950 border-2 border-purple-400 text-white shadow-purple-900/50 shadow-2xl ring-4 ring-purple-500/40 animate-pulse'
                        : hasWaiterCall
                        ? 'bg-gradient-to-br from-amber-600 via-amber-700 to-amber-950 border-2 border-amber-300 text-slate-950 shadow-amber-900/50 shadow-2xl ring-4 ring-amber-400/50 animate-bounce'
                        : isSelected
                        ? 'bg-slate-800 border-2 border-amber-400 text-white ring-2 ring-amber-400/30'
                        : 'bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-700/80 hover:border-slate-500 text-white'
                    }`}
                  >
                    {/* Icono de Alerta Superior */}
                    {hasBill && (
                      <span className="absolute -top-2 px-2 py-0.5 rounded-full bg-purple-500 text-white text-[9px] font-black uppercase tracking-wider shadow-md flex items-center gap-1">
                        <CreditCard className="w-2.5 h-2.5" />
                        <span>Cuenta</span>
                      </span>
                    )}
                    {hasWaiterCall && !hasBill && (
                      <span className="absolute -top-2 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[9px] font-black uppercase tracking-wider shadow-md flex items-center gap-1">
                        <Bell className="w-2.5 h-2.5 animate-spin" />
                        <span>Mesero</span>
                      </span>
                    )}

                    {/* Número de Mesa */}
                    <span className={`text-base font-black tracking-tight leading-none ${
                      hasWaiterCall && !hasBill ? 'text-slate-950' : 'text-white keep-white'
                    }`}
                    style={{ color: hasWaiterCall && !hasBill ? '#020617' : '#ffffff' }}>
                      {table.number}
                    </span>

                    {/* Capacidad */}
                    <span className={`text-[10px] font-bold mt-0.5 flex items-center gap-0.5 ${
                      hasWaiterCall && !hasBill ? 'text-slate-950/80' : 'text-slate-400'
                    }`}
                    style={{ color: hasWaiterCall && !hasBill ? '#020617' : '#ffffff' }}>
                      <Users className="w-2.5 h-2.5" />
                      <span>{table.seats || 4}</span>
                    </span>

                    {/* Consumo Acumulado si hay sesión */}
                    {tableSession && tableSession.totalAmount > 0 && (
                      <span className="text-[10px] font-mono font-black text-amber-400 leading-tight">
                        ${tableSession.totalAmount.toFixed(0)}
                      </span>
                    )}

                    {/* Badge de Comandas Pendientes */}
                    {hasPendingOrders && (
                      <span className="absolute -bottom-2 px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[9px] font-black uppercase tracking-wider shadow-md flex items-center gap-1 animate-pulse z-10">
                        <Utensils className="w-2.5 h-2.5" />
                        <span>{tablePendingOrders.length} {tablePendingOrders.length > 1 ? 'Comandas' : 'Comanda'}</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      )}

      {/* Drawer / Tarjeta de Acción Rápida para Mesa Seleccionada */}
      {selectedTable && (
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4 animate-fadeIn">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center font-black text-xl shadow-md">
                {selectedTable.number}
              </div>
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <span>Mesa {selectedTable.number}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold border border-slate-700">
                    {selectedTable.zone || 'Salón Principal'}
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Capacidad: {selectedTable.seats || 4} personas • Forma: {selectedTable.shape || 'circle'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onOpenCheckout && selectedTableSession && (
                <button
                  type="button"
                  onClick={() => onOpenCheckout(selectedTable.number, selectedTableSession)}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all flex items-center gap-1.5 shadow-md active:scale-95"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Cobrar / Ticket</span>
                </button>
              )}
              {onCloseSession && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`¿Confirmas cerrar y liberar la Mesa ${selectedTable.number}? Esto invalidará el enlace anterior y marcará la cuenta como cobrada.`)) {
                      onCloseSession(selectedTable.number);
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-rose-950/60 text-slate-300 hover:text-rose-400 border border-slate-800 hover:border-rose-900/50 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                  title="Cerrar la cuenta de esta mesa e invalidar enlaces anteriores"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  <span>Liberar Mesa</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setSelectedTable(null)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all"
              >
                Ocultar
              </button>
            </div>
          </div>

          {/* Resumen de Sesión Activa de Mesa */}
          {selectedTableSession && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-white">Sesión Activa</span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Users className="w-3 h-3 text-amber-400" />
                    <span>{selectedTableSession.diners?.length || 1} comensales</span>
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Consumo acumulado</span>
                  <span className="text-base font-mono font-black text-amber-400">
                    ${(selectedTableSession.totalAmount || 0).toFixed(2)} {selectedTableSession.currency || 'MXN'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Comandas Pendientes de Aprobación */}
          {selectedTablePendingOrders.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <Utensils className="w-3.5 h-3.5" />
                <span>Comandas por Confirmar ({selectedTablePendingOrders.length}):</span>
              </span>

              <div className="space-y-2">
                {selectedTablePendingOrders.map(ord => (
                  <div
                    key={ord._id}
                    className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/50 shadow-lg space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-white">{ord.orderNumber}</span>
                        <span className="text-[10px] text-slate-300 px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700">
                          {ord.dinerName || 'Comensal'}
                        </span>
                      </div>
                      <span className="font-mono font-black text-amber-400 text-xs">
                        ${ord.subtotal.toFixed(2)}
                      </span>
                    </div>

                    <div className="space-y-1 pl-1">
                      {ord.items?.map((it, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs text-slate-300">
                          <span>
                            <strong>{it.quantity}x</strong> {it.name}
                            {it.notes && <em className="text-amber-400 ml-1">({it.notes})</em>}
                          </span>
                          <span className="font-mono text-slate-400 text-[11px]">
                            ${(it.price * it.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => onApproveOrder && onApproveOrder(selectedTable.number, ord._id)}
                        className="flex-1 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Aprobar para Cocina</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const reason = window.prompt('Motivo de rechazo (opcional):', 'Mesa sin comensales o solicitud cancelada');
                          if (reason !== null && onRejectOrder) {
                            onRejectOrder(selectedTable.number, ord._id, reason);
                          }
                        }}
                        className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-rose-950 hover:text-rose-300 text-slate-400 text-xs font-bold flex items-center justify-center gap-1 transition-all"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Rechazar</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Estado de Solicitudes Pendientes */}
          {selectedTableRequests.length === 0 ? (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Esta mesa no tiene llamadas de mesero ni solicitudes de cuenta pendientes.</span>
            </div>
          ) : (
            <div className="space-y-2">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5" />
                <span>Solicitudes Activas ({selectedTableRequests.length}):</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedTableRequests.map(req => {
                  const isBill = req.type === 'bill';
                  const reqId = req._id || req.id;

                  return (
                    <div
                      key={reqId}
                      className={`p-4 rounded-2xl border flex items-center justify-between gap-3 shadow-lg ${
                        isBill
                          ? 'bg-purple-950/40 border-purple-500/40'
                          : 'bg-amber-950/40 border-amber-500/40'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          {isBill ? (
                            <CreditCard className="w-4 h-4 text-purple-400" />
                          ) : (
                            <Bell className="w-4 h-4 text-amber-400" />
                          )}
                          <span className="text-xs font-black text-white">
                            {isBill ? 'Solicita la Cuenta' : 'Llamada de Mesero'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400">
                          <Clock className="w-3 h-3" />
                          <span>
                            {req.createdAt ? new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Reciente'}
                          </span>
                          {isBill && req.paymentMethod && (
                            <span className="px-1.5 py-0.2 rounded-md bg-purple-900/60 text-purple-200 font-bold uppercase text-[9px]">
                              {req.paymentMethod === 'card' ? 'Tarjeta' : req.paymentMethod === 'cash' ? 'Efectivo' : 'Cualquiera'}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (onAttendRequest) onAttendRequest(reqId);
                        }}
                        className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-md active:scale-95 ${
                          isBill
                            ? 'bg-purple-500 hover:bg-purple-400 text-white'
                            : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Atender</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
