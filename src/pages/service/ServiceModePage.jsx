import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Bell, CreditCard, Columns, CheckCircle2, Volume2, Shield, Lock, RotateCcw, Utensils, LogOut, ArrowLeft, Home, Sparkles, Banknote, Layers, Check, Users, ChefHat, Flame, Clock, Printer, Timer, AlertTriangle, X } from 'lucide-react';
import { chime } from '../../utils/audio';
import { getMediaUrl } from '../../utils/media';
import { printThermalReceipt } from '../../utils/printReceipt';
import FloorPlanView from '../../components/FloorPlanView';
import WaiterCheckoutModal from '../../components/WaiterCheckoutModal';

export default function ServiceModePage() {
  const [searchParams] = useSearchParams();
  const urlSlug = searchParams.get('slug');

  // Slug efectivo priorizando: URL > sessionStorage > localStorage Propietario > 'la-terraza'
  const resolvedSlug = useMemo(() => {
    if (urlSlug) return urlSlug;
    const sessionSlug = sessionStorage.getItem('volum_service_slug');
    if (sessionSlug) return sessionSlug;
    try {
      const adminRest = JSON.parse(localStorage.getItem('volum_admin_restaurant') || '{}');
      if (adminRest?.slug) return adminRest.slug;
    } catch {}
    return 'la-terraza';
  }, [urlSlug]);

  const [slug, setSlug] = useState(resolvedSlug);
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [serviceInfo, setServiceInfo] = useState(null);
  const [error, setError] = useState(null);
  const [collaborators, setCollaborators] = useState([]);
  const [selectedWaiter, setSelectedWaiter] = useState('');
  const [waiterNameInput, setWaiterNameInput] = useState('');
  const [loginMethod, setLoginMethod] = useState('waiter'); // 'waiter' | 'pin'
  const [userRole, setUserRole] = useState(() => {
    return sessionStorage.getItem('volum_user_role') || (searchParams.get('role') === 'kitchen' || searchParams.get('view') === 'kitchen' ? 'kitchen' : 'staff');
  });
  const [activeWaiterName, setActiveWaiterName] = useState(() => {
    return sessionStorage.getItem('volum_waiter_name') || '';
  });

  const userRoleRef = useRef(userRole);
  useEffect(() => {
    userRoleRef.current = userRole;
  }, [userRole]);

  const isKitchenActive = () => {
    return userRoleRef.current === 'kitchen' || sessionStorage.getItem('volum_user_role') === 'kitchen';
  };

  const [requests, setRequests] = useState([]);
  const [activeSessions, setActiveSessions] = useState([]);
  const [checkoutTableData, setCheckoutTableData] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isClosingSession, setIsClosingSession] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [liveAnnouncement, setLiveAnnouncement] = useState('');
  const [serviceViewMode, setServiceViewMode] = useState('floor_plan');
  const [orderFilter, setOrderFilter] = useState('all'); // 'all' | 'pending' | 'kitchen'
  const [kdsFilter, setKdsFilter] = useState('all'); // 'all' | 'approved' | 'preparing' | 'ready'
  const [floorPlanData, setFloorPlanData] = useState(null);
  const [audioUnlocked, setAudioUnlocked] = useState(() => chime.isUnlocked);
  const eventSourceRef = useRef(null);
  const pollTimerRef = useRef(null);

  // Escuchar cualquier toque para desbloquear el audio en el navegador
  useEffect(() => {
    const handleGesture = () => {
      chime.unlock();
      setAudioUnlocked(true);
    };
    window.addEventListener('click', handleGesture, { once: true, passive: true });
    window.addEventListener('touchstart', handleGesture, { once: true, passive: true });
    return () => {
      window.removeEventListener('click', handleGesture);
      window.removeEventListener('touchstart', handleGesture);
    };
  }, []);

  // Mantener la pantalla encendida para el mesero en sala (Screen Wake Lock API)
  useEffect(() => {
    let wakeLock = null;
    const requestWakeLock = async () => {
      if ('wakeLock' in navigator && isAuthenticated) {
        try {
          wakeLock = await navigator.wakeLock.request('screen');
        } catch (err) {
          console.warn('Wake Lock no disponible o denegado:', err);
        }
      }
    };
    if (isAuthenticated) {
      requestWakeLock();
    }
    return () => {
      if (wakeLock) {
        wakeLock.release().catch(() => {});
      }
    };
  }, [isAuthenticated]);

  // Precargar detalles de identidad, fotos y colaboradores del restaurante
  useEffect(() => {
    if (slug) {
      axios.get(`/api/v1/menu/${slug}`).then((res) => {
        const rest = res.data?.data?.restaurant || res.data?.restaurant;
        if (rest) {
          setServiceInfo(rest);
        }
      }).catch((err) => {
        console.warn('No se pudo precargar info de restaurante:', err?.message);
      });

      // Cargar lista de colaboradores / meseros activos
      axios.get(`/api/v1/service/collaborators/${slug}`).then((res) => {
        if (res.data?.success && Array.isArray(res.data.collaborators)) {
          setCollaborators(res.data.collaborators);
        }
      }).catch(() => {
        setCollaborators([]);
      });
    }
  }, [slug]);

  // Intentar restaurar sesión de servicio o autenticar con sesión de Propietario
  useEffect(() => {
    // Si la URL contiene un slug explícito diferente del que estaba en sessionStorage,
    // limpiar el sessionStorage obsoleto de la otra sucursal para evitar cruce de datos
    if (urlSlug && sessionStorage.getItem('volum_service_slug') && sessionStorage.getItem('volum_service_slug') !== urlSlug) {
      sessionStorage.removeItem('volum_service_token');
      sessionStorage.removeItem('volum_service_pin');
      sessionStorage.setItem('volum_service_slug', urlSlug);
    }

    const currentSlug = urlSlug || sessionStorage.getItem('volum_service_slug') || resolvedSlug;
    setSlug(currentSlug);

    const savedToken = sessionStorage.getItem('volum_service_token');
    const savedPin = sessionStorage.getItem('volum_service_pin');
    const adminToken = localStorage.getItem('volum_admin_token') || localStorage.getItem('token');
    const effectiveToken = savedToken || adminToken;

    if (effectiveToken && currentSlug) {
      if (adminToken && !savedToken) {
        sessionStorage.setItem('volum_service_token', adminToken);
        sessionStorage.setItem('volum_service_slug', currentSlug);
      }
      if (savedPin) setPin(savedPin);
      setIsAuthenticated(true);
      fetchRequests(currentSlug, effectiveToken, savedPin || '');
      fetchFloorPlan(currentSlug, effectiveToken, savedPin || '');
      fetchActiveSessions(currentSlug, effectiveToken, savedPin || '');
      initSSE(currentSlug, effectiveToken, savedPin || '');
    }
  }, [urlSlug, resolvedSlug]);

  const buildServiceHeaders = (restaurantSlug, token, servicePin) => {
    const pinCode = servicePin || sessionStorage.getItem('volum_service_pin') || pin || '1234';
    const activeToken = token || sessionStorage.getItem('volum_service_token') || localStorage.getItem('volum_admin_token') || localStorage.getItem('token');
    const headers = {
      'x-restaurant-slug': restaurantSlug,
      'x-service-pin': pinCode
    };
    if (activeToken && activeToken !== 'undefined' && activeToken !== 'null') {
      headers.Authorization = `Bearer ${activeToken}`;
    }
    return { headers, pinCode };
  };

  // Polling resiliente cada 2.5 segundos para garantizar entrega de llamadas y actualización de mesas
  useEffect(() => {
    if (isAuthenticated && slug) {
      const token = sessionStorage.getItem('volum_service_token') || localStorage.getItem('volum_admin_token');
      const savedPin = sessionStorage.getItem('volum_service_pin') || pin;
      
      // Primera ejecución inmediata
      fetchRequests(slug, token, savedPin);
      fetchActiveSessions(slug, token, savedPin);

      pollTimerRef.current = setInterval(() => {
        fetchRequests(slug, token, savedPin);
        fetchActiveSessions(slug, token, savedPin);
        if (!floorPlanData || !floorPlanData.tables || floorPlanData.tables.length === 0) {
          fetchFloorPlan(slug, token, savedPin);
        }
      }, 2500);
    }
    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, [isAuthenticated, slug, pin, floorPlanData]);

  // Mesas efectivas con fallback en cascada para evitar pantallas vacías
  const effectiveTables = useMemo(() => {
    if (Array.isArray(floorPlanData?.tables) && floorPlanData.tables.length > 0) {
      return floorPlanData.tables;
    }
    if (Array.isArray(serviceInfo?.tables) && serviceInfo.tables.length > 0) {
      return serviceInfo.tables;
    }
    try {
      const cached = JSON.parse(localStorage.getItem('volum_admin_tables') || '[]');
      if (Array.isArray(cached) && cached.length > 0) return cached;
    } catch {}
    return [];
  }, [floorPlanData, serviceInfo]);

  // Cargar sesiones de mesa activas con comandas
  const fetchActiveSessions = async (restaurantSlug, token, servicePin) => {
    try {
      const { headers, pinCode } = buildServiceHeaders(restaurantSlug, token, servicePin);
      const res = await axios.get(`/api/v1/sessions/active/${restaurantSlug}?pin=${pinCode}`, { headers });
      if (res.data?.success && res.data.sessions) {
        setActiveSessions(res.data.sessions);
      }
    } catch (err) {
      console.warn('No se pudieron cargar sesiones activas:', err?.message);
    }
  };

  // Cargar solicitudes pendientes con detección de nuevas para campanilla
  const fetchRequests = async (restaurantSlug, token, servicePin) => {
    try {
      const { headers, pinCode } = buildServiceHeaders(restaurantSlug, token, servicePin);
      const res = await axios.get(`/api/v1/service/list/${restaurantSlug}?pin=${pinCode}`, { headers });
      const incoming = res.data.data || [];
      setRequests((prev) => {
        const existingIds = new Set(prev.map((r) => r._id || r.id));
        const newRequests = incoming.filter((r) => !existingIds.has(r._id || r.id));
        if (newRequests.length > 0 && soundEnabled && !isKitchenActive()) {
          chime.playChime(newRequests[0].type || 'waiter');
        }
        return incoming;
      });
    } catch (err) {
      console.error('Error cargando solicitudes:', err);
    }
  };

  // Cargar plano de mesas del restaurante
  const fetchFloorPlan = async (restaurantSlug, token, servicePin) => {
    try {
      const { headers, pinCode } = buildServiceHeaders(restaurantSlug, token, servicePin);
      const res = await axios.get(`/api/v1/service/floor-plan/${restaurantSlug}?pin=${pinCode}`, { headers });
      if (res.data?.success && res.data.data) {
        setFloorPlanData(res.data.data);
        if (res.data.data.restaurant?.settings) {
          setServiceInfo((prev) => ({
            ...(prev || {}),
            ...res.data.data.restaurant,
            settings: res.data.data.restaurant.settings
          }));
        }
      }
    } catch (err) {
      console.warn('No se pudo cargar el plano del restaurante:', err?.message);
    }
  };

  // Inicializar transmisión en tiempo real (SSE)
  const initSSE = (restaurantSlug, tokenOverride = null, pinOverride = null) => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    try {
      const activeToken = tokenOverride || sessionStorage.getItem('volum_service_token') || localStorage.getItem('volum_admin_token') || localStorage.getItem('token') || '';
      const activePin = pinOverride || sessionStorage.getItem('volum_service_pin') || pin || '1234';
      const queryParams = new URLSearchParams();
      if (activeToken && activeToken !== 'undefined' && activeToken !== 'null') queryParams.set('token', activeToken);
      if (activePin) queryParams.set('pin', activePin);

      const rawApi = import.meta.env.VITE_API_URL || 'https://volum-menu.onrender.com/api/v1';
      const domainUrl = rawApi.replace(/\/api\/v1\/?$/, '').replace(/\/$/, '');
      const apiBase = axios.defaults.baseURL || domainUrl || '';
      const sseUrl = `${apiBase}/api/v1/service/stream/${restaurantSlug}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const sse = new EventSource(sseUrl, { withCredentials: true });

      sse.onopen = () => {
        console.log('[SSE] Estación de meseros conectada en vivo:', restaurantSlug);
      };

      sse.onerror = (err) => {
        console.warn('[SSE] Conexión interrumpida, el polling de respaldo sigue activo.');
      };

      sse.addEventListener('new_request', (e) => {
        try {
          const data = JSON.parse(e.data);
          const reqId = data._id || data.id;

          // Sonar campana ding-dong solo para personal de sala / meseros
          // La cocina NUNCA debe sonar cuando llaman al mesero ni cuando piden cuenta
          if (soundEnabled && !isKitchenActive()) {
            chime.playChime(data.type);
          }

          setRequests((prev) => {
            const withoutCurrent = prev.filter((r) => (r._id || r.id) !== reqId);
            return [data, ...withoutCurrent];
          });
        } catch (err) {
          console.error('Error parseando SSE:', err);
        }
      });

      sse.addEventListener('new_table_order', (e) => {
        try {
          const data = JSON.parse(e.data);
          // Si es cocina: suena si entra directa para cocinar (!requireApproval o status === 'approved')
          // Si es sala/mesero: suena siempre para notificar que entró nueva comanda a aprobar
          if (soundEnabled) {
            if (!isKitchenActive()) {
              chime.playChime('order');
            } else if (!data.requireApproval || data.status === 'approved') {
              chime.playChime('order');
            }
          }
          setLiveAnnouncement(`Nueva comanda en Mesa ${data.table}`);
          fetchActiveSessions(restaurantSlug, activeToken, activePin);
        } catch (err) {
          console.error('Error parseando SSE comanda:', err);
        }
      });

      sse.addEventListener('order_approved', (e) => {
        try {
          const data = JSON.parse(e.data || '{}');
          // Al ser aprobada por el mesero, la orden ingresa oficialmente a cocina para empezar a prepararse
          if (soundEnabled) {
            chime.playChime('order');
          }
          setLiveAnnouncement(`Mesa ${data.table || ''}: ¡Comanda aprobada para cocina!`);
        } catch (_) {
          if (soundEnabled) chime.playChime('order');
        }
        fetchActiveSessions(restaurantSlug, activeToken, activePin);
      });

      sse.addEventListener('order_status_updated', (e) => {
        try {
          const data = JSON.parse(e.data);
          setActiveSessions((prev) => prev.map((s) => {
            if (String(s.tableNumber).trim() === String(data.table).trim()) {
              const orders = (s.orders || []).map((o) =>
                String(o._id) === String(data.orderId) ? { ...o, status: data.status } : o
              );
              return { ...s, orders };
            }
            return s;
          }));
          if (data.status === 'ready') {
            setLiveAnnouncement(`Mesa ${data.table}: Comanda lista en pase`);
            // Suena para el mesero/sala notificando que la comanda ya está lista en el pase
            if (soundEnabled && !isKitchenActive()) chime.playChime('order');
          }
        } catch (err) {
          fetchActiveSessions(restaurantSlug, activeToken, activePin);
        }
      });

      sse.addEventListener('order_rejected', () => {
        fetchActiveSessions(restaurantSlug, activeToken, activePin);
      });

      sse.addEventListener('session_opened', (e) => {
        try {
          const data = JSON.parse(e.data);
          setLiveAnnouncement(`Mesa ${data.table} abierta`);
          fetchActiveSessions(restaurantSlug, activeToken, activePin);
        } catch (err) {}
      });

      sse.addEventListener('request_attended', (e) => {
        try {
          const data = JSON.parse(e.data);
          const attendedId = data._id || data.id;
          setRequests((prev) => prev.filter((r) => (r._id || r.id) !== attendedId));
          setLiveAnnouncement('Solicitud de mesa atendida');
        } catch (err) {
          console.error('Error atendiendo SSE:', err);
        }
      });

      eventSourceRef.current = sse;
    } catch (sseErr) {
      console.warn('SSE no disponible en este entorno, operando con polling reactivo:', sseErr);
    }
  };

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
      }
    };
  }, []);

  // Manejar teclado numérico para PIN
  const handlePinDigit = (digit) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length === 4) {
        submitServiceLogin({ pinToSubmit: newPin, waiterNameToSubmit: selectedWaiter || waiterNameInput });
      }
    }
  };

  const handlePinClear = () => {
    setPin('');
    setError(null);
  };

  const submitServiceLogin = async ({ pinToSubmit, waiterNameToSubmit }) => {
    setError(null);
    try {
      const payload = { slug };
      if (pinToSubmit) payload.pin = pinToSubmit;
      if (waiterNameToSubmit) payload.waiterName = waiterNameToSubmit;

      const res = await axios.post('/api/v1/auth/pin-login', payload);

      const { serviceToken, restaurant, waiterName, role } = res.data;
      const effectiveRole = role || (waiterName?.toLowerCase().includes('cocin') || waiterName?.toLowerCase().includes('chef') ? 'kitchen' : 'staff');
      setUserRole(effectiveRole);
      sessionStorage.setItem('volum_user_role', effectiveRole);
      if (effectiveRole === 'kitchen') {
        setServiceViewMode('kitchen');
      }
      sessionStorage.setItem('volum_service_token', serviceToken);
      sessionStorage.setItem('volum_service_slug', slug);
      if (pinToSubmit) sessionStorage.setItem('volum_service_pin', pinToSubmit);
      if (waiterName) {
        sessionStorage.setItem('volum_waiter_name', waiterName);
        setActiveWaiterName(waiterName);
      }

      setServiceInfo(restaurant);
      setIsAuthenticated(true);
      fetchRequests(slug, serviceToken, pinToSubmit || '');
      fetchFloorPlan(slug, serviceToken, pinToSubmit || '');
      fetchActiveSessions(slug, serviceToken, pinToSubmit || '');
      initSSE(slug, serviceToken, pinToSubmit || '');

      // Desbloquear audio del navegador
      chime.playChime('waiter');
    } catch (err) {
      setError(err.response?.data?.message || 'Acceso denegado. Verifica tus datos.');
      setPin('');
    }
  };

  // Consolidar todas las comandas de todas las mesas activas
  const allOrders = useMemo(() => {
    const list = [];
    (activeSessions || []).forEach((sess) => {
      (sess.orders || []).forEach((ord) => {
        list.push({
          ...ord,
          tableNumber: sess.tableNumber,
          sessionCurrency: sess.currency || 'MXN'
        });
      });
    });
    return list.sort((a, b) => new Date(b.orderedAt) - new Date(a.orderedAt));
  }, [activeSessions]);

  // Comandas pendientes de aprobación por el mesero
  const pendingOrders = useMemo(() => {
    return allOrders.filter(o => o.status === 'pending_approval');
  }, [allOrders]);

  // Comandas en preparación o aprobadas marchadas a cocina
  const kitchenOrders = useMemo(() => {
    return allOrders.filter(o => o.status === 'approved' || o.status === 'preparing');
  }, [allOrders]);

  // Comandas según filtro seleccionado
  const displayedOrders = useMemo(() => {
    if (orderFilter === 'pending') return pendingOrders;
    if (orderFilter === 'kitchen') return kitchenOrders;
    return allOrders.filter(o => o.status !== 'rejected');
  }, [allOrders, pendingOrders, kitchenOrders, orderFilter]);

  // Comandas activas para la pantalla de cocina (KDS)
  const activeKitchenOrders = useMemo(() => {
    return allOrders.filter(o => ['approved', 'preparing', 'ready'].includes(o.status));
  }, [allOrders]);

  // Comandas para vista de cocina según filtro KDS (FIFO: las más antiguas primero)
  const displayedKitchenOrders = useMemo(() => {
    const list = [...activeKitchenOrders].sort((a, b) => new Date(a.orderedAt) - new Date(b.orderedAt));
    if (kdsFilter === 'all') return list;
    return list.filter(o => o.status === kdsFilter);
  }, [activeKitchenOrders, kdsFilter]);

  // Verifica si el restaurante tiene habilitados los pedidos digitales de mesa
  const isOrdersEnabled = Boolean(
    serviceInfo?.settings?.orderSettings?.enabled ??
    floorPlanData?.restaurant?.settings?.orderSettings?.enabled
  );

  // Redirigir a 'floor_plan' si los pedidos están deshabilitados y la vista actual requiere comandas/cocina
  useEffect(() => {
    if (!isOrdersEnabled && userRole !== 'kitchen' && ['orders', 'kitchen', 'split'].includes(serviceViewMode)) {
      setServiceViewMode('floor_plan');
    }
  }, [isOrdersEnabled, userRole, serviceViewMode]);

  // Mesero aprueba una comanda digital
  const handleApproveOrder = async (tableNumber, orderId) => {
    try {
      const token = sessionStorage.getItem('volum_service_token');
      const pinCode = sessionStorage.getItem('volum_service_pin') || pin;
      await axios.put(`/api/v1/sessions/order/${slug}/${tableNumber}/${orderId}/approve`, {}, {
        headers: {
          'x-restaurant-slug': slug,
          'x-service-pin': pinCode,
          Authorization: `Bearer ${token}`
        }
      });
      setActiveSessions((prev) => prev.map((s) => {
        if (String(s.tableNumber).trim() === String(tableNumber).trim()) {
          const orders = (s.orders || []).map((o) => String(o._id) === String(orderId) ? { ...o, status: 'approved' } : o);
          return { ...s, orders };
        }
        return s;
      }));
      setLiveAnnouncement('Comanda aprobada y enviada a cocina');
    } catch (err) {
      console.error('Error aprobando comanda:', err);
      alert(err.response?.data?.message || 'Error al aprobar comanda');
    }
  };

  // Mesero rechaza una orden errónea o de broma
  const handleRejectOrder = async (tableNumber, orderId, reason = 'Mesa sin comensales o comanda cancelada') => {
    try {
      const token = sessionStorage.getItem('volum_service_token');
      const pinCode = sessionStorage.getItem('volum_service_pin') || pin;
      await axios.put(`/api/v1/sessions/order/${slug}/${tableNumber}/${orderId}/reject`, { reason }, {
        headers: {
          'x-restaurant-slug': slug,
          'x-service-pin': pinCode,
          Authorization: `Bearer ${token}`
        }
      });
      setActiveSessions((prev) => prev.map((s) => {
        if (String(s.tableNumber).trim() === String(tableNumber).trim()) {
          const orders = (s.orders || []).map((o) => String(o._id) === String(orderId) ? { ...o, status: 'rejected' } : o);
          return { ...s, orders };
        }
        return s;
      }));
      setLiveAnnouncement('Comanda descartada');
    } catch (err) {
      console.error('Error rechazando comanda:', err);
      alert(err.response?.data?.message || 'Error al rechazar comanda');
    }
  };

  // Chef o Mesero actualiza estado de comanda en cocina ('preparing', 'ready', 'delivered')
  const handleUpdateOrderStatus = async (tableNumber, orderId, newStatus) => {
    try {
      const token = sessionStorage.getItem('volum_service_token');
      const pinCode = sessionStorage.getItem('volum_service_pin') || pin;
      await axios.put(`/api/v1/sessions/order/${slug}/${tableNumber}/${orderId}/status?pin=${pinCode}`, {
        status: newStatus
      }, {
        headers: {
          'x-restaurant-slug': slug,
          'x-service-pin': pinCode,
          Authorization: `Bearer ${token}`
        }
      });

      setActiveSessions((prev) => prev.map((s) => {
        if (String(s.tableNumber).trim() === String(tableNumber).trim()) {
          const orders = (s.orders || []).map((o) =>
            String(o._id) === String(orderId) ? { ...o, status: newStatus } : o
          );
          return { ...s, orders };
        }
        return s;
      }));

      if (newStatus === 'ready') {
        chime.playChime('order');
        setLiveAnnouncement(`Mesa ${tableNumber}: ¡Comanda lista en pase de cocina!`);
      } else if (newStatus === 'preparing') {
        setLiveAnnouncement(`Mesa ${tableNumber}: Comanda en preparación`);
      } else if (newStatus === 'delivered') {
        setLiveAnnouncement(`Mesa ${tableNumber}: Comanda servida a mesa`);
      }
    } catch (err) {
      console.error('Error actualizando comanda en cocina:', err);
      alert(err.response?.data?.message || 'Error al actualizar comanda');
    }
  };

  // Imprimir comanda física de cocina en papel térmico de 80mm
  const handlePrintKitchenTicket = (ord) => {
    const itemsRows = (ord.items || []).map(it => `
      <div style="margin-bottom:6px;">
        <div style="display:flex; justify-content:space-between; align-items:baseline; font-size:14px; font-weight:800;">
          <span><strong style="font-size:16px;">${it.quantity}x</strong> ${it.name}</span>
        </div>
        ${it.notes ? `<div style="font-size:11px; margin-top:2px; padding:2px 6px; background:#f0f0f0; border-left:3px solid #000; font-style:italic; font-weight:700; color:#000;">↳ NOTA: ${it.notes}</div>` : ''}
      </div>
    `).join('');

    const ticketHtml = `
      <div style="text-align:center; border-bottom:2px solid #000; padding-bottom:8px; margin-bottom:8px;">
        <p style="font-size:10px; font-weight:900; letter-spacing:1px; margin:0; text-transform:uppercase;">*** COMANDA DE PRODUCCIÓN COCINA ***</p>
        <div style="display:inline-block; border:2px solid #000; border-radius:6px; padding:4px 14px; margin:6px 0;">
          <h2 style="font-size:26px; font-weight:900; margin:0; line-height:1;">MESA ${ord.tableNumber}</h2>
        </div>
        <p style="font-size:11px; font-weight:700; margin:2px 0;">Orden: ${ord.orderNumber || '01'} • Hora: ${new Date(ord.orderedAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        <p style="font-size:11px; color:#333; margin:0;">Comensal: <strong>${ord.dinerName || 'Cliente'}</strong></p>
      </div>
      <div style="border-bottom:2px solid #000; padding-bottom:6px; margin-bottom:8px;">
        <div style="display:flex; justify-content:space-between; font-size:10px; font-weight:900; text-transform:uppercase; border-bottom:1px solid #000; padding-bottom:3px; margin-bottom:8px;">
          <span>CANT & PLATILLO</span>
          <span>ESTADO</span>
        </div>
        ${itemsRows}
      </div>
      <div style="text-align:center; font-size:10px; font-weight:900; letter-spacing:1px;">
        <p>MARCHADO A COCINA • FIFO EN VIVO</p>
      </div>
    `;

    printThermalReceipt(ticketHtml, {
      title: `Cocina Mesa ${ord.tableNumber}`,
      tableNumber: ord.tableNumber
    });
  };

  // Abrir caja y calculadora de cobro para mesero
  const handleOpenCheckout = (tableNumber, session = null) => {
    const sess = session || activeSessions.find(s => String(s.tableNumber).trim() === String(tableNumber).trim());
    setCheckoutTableData({ tableNumber, session: sess });
    setIsCheckoutOpen(true);
  };

  // Confirmar cobro y liberar mesa
  const handleConfirmPaymentAndLiberate = async (tableNumber, checkoutDetails) => {
    setIsClosingSession(true);
    try {
      const token = sessionStorage.getItem('volum_service_token');
      const pinCode = sessionStorage.getItem('volum_service_pin') || pin;
      await axios.put(`/api/v1/sessions/close/${slug}/${tableNumber}`, {
        paymentMethod: checkoutDetails.paymentMethod,
        tipAmount: checkoutDetails.tipAmount
      }, {
        headers: {
          'x-restaurant-slug': slug,
          'x-service-pin': pinCode,
          Authorization: `Bearer ${token}`
        }
      });

      setActiveSessions(prev => prev.filter(s => String(s.tableNumber).trim() !== String(tableNumber).trim()));
      setRequests(prev => prev.filter(r => String(r.table).trim() !== String(tableNumber).trim()));

      setIsCheckoutOpen(false);
      setCheckoutTableData(null);
      setLiveAnnouncement(`Mesa ${tableNumber} cobrada y liberada`);
    } catch (err) {
      console.error('Error cerrando mesa:', err);
      alert(err.response?.data?.message || 'Error al cerrar la mesa');
    } finally {
      setIsClosingSession(false);
    }
  };

  const handleMarkAttended = async (id) => {
    // 1. Remoción optimista inmediata de la pantalla para máxima fluidez
    setRequests((prev) => prev.filter((r) => (r._id || r.id) !== id));

    try {
      const token = sessionStorage.getItem('volum_service_token');
      const savedPin = sessionStorage.getItem('volum_service_pin') || pin;
      await axios.put(`/api/v1/service/attend/${slug}/${id}`, {}, {
        headers: {
          'x-restaurant-slug': slug,
          'x-service-pin': savedPin,
          Authorization: `Bearer ${token}`
        }
      });
    } catch (err) {
      console.error('Error marcando como atendido en servidor:', err);
      // Revertir si falló la conexión
      const token = sessionStorage.getItem('volum_service_token');
      fetchRequests(slug, token);
    }
  };

  const handleCloseTableSession = async (tableNumber) => {
    try {
      const token = sessionStorage.getItem('volum_service_token');
      const savedPin = sessionStorage.getItem('volum_service_pin') || pin;
      await axios.put(`/api/v1/sessions/close/${slug}/${tableNumber}`, {}, {
        headers: {
          'x-restaurant-slug': slug,
          'x-service-pin': savedPin,
          Authorization: `Bearer ${token}`
        }
      });
      setRequests((prev) => prev.filter((r) => String(r.table).trim() !== String(tableNumber).trim()));
      fetchFloorPlan(slug, token, savedPin);
    } catch (err) {
      console.error('Error al cerrar mesa:', err);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('volum_service_token');
    sessionStorage.removeItem('volum_service_slug');
    sessionStorage.removeItem('volum_service_pin');
    sessionStorage.removeItem('volum_waiter_name');
    sessionStorage.removeItem('volum_user_role');
    setUserRole('staff');
    if (eventSourceRef.current) eventSourceRef.current.close();
    setIsAuthenticated(false);
    setPin('');
    setActiveWaiterName('');
    setSelectedWaiter('');
    setWaiterNameInput('');
  };

  // 1. Vista de Teclado de PIN (Acceso Rápido de Servicio)
  if (!isAuthenticated) {
    const bgPhoto = serviceInfo?.venuePhotos?.[0] || serviceInfo?.bannerUrl;
    const primaryBrand = serviceInfo?.theme?.primaryColor || '#D97706';

    return (
      <div className="relative min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 overflow-hidden">
        {bgPhoto && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25 filter blur-sm scale-105 pointer-events-none"
            style={{ backgroundImage: `url(${getMediaUrl(bgPhoto)})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950 pointer-events-none" />

        <div className="relative z-10 w-full max-w-sm bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center">
          
          <Link
            to="/"
            className="self-start mb-4 inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 font-semibold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a la Página Principal</span>
          </Link>

          {serviceInfo?.logoUrl ? (
            <img
              src={getMediaUrl(serviceInfo.logoUrl)}
              alt="Logo"
              className="w-16 h-16 rounded-2xl object-contain bg-slate-950 p-1.5 border border-slate-700 shadow-md mb-3"
            />
          ) : (
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-slate-950 font-black text-2xl mb-3 shadow-lg"
              style={{ backgroundColor: primaryBrand }}
            >
              {(serviceInfo?.name || slug).charAt(0).toUpperCase()}
            </div>
          )}

          <h1 className="text-xl font-black text-white">{serviceInfo?.name || 'Estación de Meseros'}</h1>
          
          {/* Badge de restaurante vinculado directamente desde QR */}
          {urlSlug ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-[11px] text-slate-300 my-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Estación Vinculada: <strong className="text-white">{serviceInfo?.name || urlSlug}</strong></span>
            </div>
          ) : (
            <div className="w-full mb-3 text-left mt-2">
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Restaurante / Sucursal
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="Slug (ej. la-terraza)"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500 font-semibold"
              />
            </div>
          )}

          <p className="text-xs text-slate-400 mb-4">
            {loginMethod === 'waiter'
              ? 'Selecciona tu perfil o ingresa tu nombre para iniciar tu turno.'
              : 'Ingresa tu PIN de servicio para atender mesas en tiempo real.'}
          </p>

          {/* Selector de Método de Ingreso: Por Perfil / Nombre vs Con PIN */}
          <div className="flex items-center p-1 rounded-2xl bg-slate-950 border border-slate-800 w-full mb-4">
            <button
              type="button"
              onClick={() => { setLoginMethod('waiter'); setError(null); }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                loginMethod === 'waiter'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Por Nombre</span>
            </button>
            <button
              type="button"
              onClick={() => { setLoginMethod('pin'); setError(null); }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                loginMethod === 'pin'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Con PIN</span>
            </button>
          </div>

          {error && (
            <p className="text-xs text-rose-400 font-semibold mb-3 animate-shake">
              {error}
            </p>
          )}

          {loginMethod === 'waiter' ? (
            /* Modo 1: Selección directa por Nombre / Colaborador */
            <div className="w-full space-y-3">
              {collaborators.length > 0 && (
                <div className="text-left">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Colaboradores de Sala:
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
                    {collaborators.map((c) => {
                      const isSel = (selectedWaiter || waiterNameInput) === c.name;
                      return (
                        <button
                          key={c.id || c._id}
                          type="button"
                          onClick={() => {
                            setSelectedWaiter(c.name);
                            setWaiterNameInput(c.name);
                          }}
                          className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all ${
                            isSel
                              ? 'bg-amber-500/20 border-amber-500 text-white ring-1 ring-amber-500/50'
                              : 'bg-slate-800/60 border-slate-700/70 hover:bg-slate-800 text-slate-300'
                          }`}
                        >
                          <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0 border border-amber-500/30">
                            {c.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold truncate text-white leading-tight">{c.name}</p>
                            <span className="text-[9px] text-slate-400 capitalize">{c.role === 'staff' ? 'Mesero' : c.role}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="text-left">
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  {collaborators.length > 0 ? 'O escribe tu nombre si no estás en la lista:' : 'Tu Nombre:'}
                </label>
                <input
                  type="text"
                  value={waiterNameInput}
                  onChange={(e) => {
                    setWaiterNameInput(e.target.value);
                    setSelectedWaiter(e.target.value);
                  }}
                  placeholder="Ej. Carlos, Sofía, Juan..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-semibold"
                />
              </div>

              <button
                type="button"
                onClick={() => submitServiceLogin({ waiterNameToSubmit: selectedWaiter || waiterNameInput })}
                disabled={!waiterNameInput.trim()}
                className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:opacity-30 text-slate-950 font-black text-xs active:scale-95 transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2"
              >
                <Utensils className="w-4 h-4" />
                <span>Iniciar Turno de Servicio</span>
              </button>
            </div>
          ) : (
            /* Modo 2: Teclado Numérico con PIN */
            <div className="w-full">
              {/* Visualizador de PIN (círculos) */}
              <div className="flex items-center justify-center gap-3 mb-6">
                {[0, 1, 2, 3].map((idx) => (
                  <div
                    key={idx}
                    className={`w-4 h-4 rounded-full border-2 transition-all ${
                      pin.length > idx
                        ? 'bg-amber-400 border-amber-400 scale-110 shadow-lg shadow-amber-500/50'
                        : 'border-slate-700 bg-slate-950'
                    }`}
                  />
                ))}
              </div>

              {/* Teclado numérico táctil */}
              <div className="grid grid-cols-3 gap-3 w-full">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
                  <button
                    key={digit}
                    onClick={() => handlePinDigit(digit.toString())}
                    className="h-14 rounded-2xl bg-slate-800/80 hover:bg-slate-700 active:scale-95 text-xl font-extrabold text-white transition-all shadow-md border border-slate-700/50"
                  >
                    {digit}
                  </button>
                ))}
                <button
                  onClick={handlePinClear}
                  className="h-14 rounded-2xl bg-slate-800/40 hover:bg-slate-800 text-xs font-bold text-slate-400 active:scale-95 flex items-center justify-center border border-slate-800"
                >
                  Borrar
                </button>
                <button
                  onClick={() => handlePinDigit('0')}
                  className="h-14 rounded-2xl bg-slate-800/80 hover:bg-slate-700 active:scale-95 text-xl font-extrabold text-white transition-all shadow-md border border-slate-700/50"
                >
                  0
                </button>
                <button
                  onClick={() => submitServiceLogin({ pinToSubmit: pin })}
                  disabled={pin.length < 4}
                  className="h-14 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:opacity-30 disabled:hover:bg-amber-500 text-slate-950 font-black text-xs active:scale-95 flex items-center justify-center shadow-lg shadow-amber-500/20"
                >
                  Entrar
                </button>
              </div>

              {/* TEXTO DEMO SOLO EN DEMO 'la-terraza' */}
              {slug === 'la-terraza' && (
                <p className="text-xs text-slate-500 mt-6">
                  PIN por defecto en demo: <strong className="text-slate-400">1234</strong>
                </p>
              )}
            </div>
          )}

        </div>
      </div>
    );
  }

  // 2. Tablero de Alertas en Tiempo Real (Pantalla de Sala / Barra)
  const bgPhoto = serviceInfo?.venuePhotos?.[0] || serviceInfo?.bannerUrl;
  const primaryBrand = serviceInfo?.theme?.primaryColor || '#D97706';

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col overflow-x-hidden">
      {bgPhoto && (
        <div
          className="fixed inset-0 bg-cover bg-center opacity-15 filter blur-lg scale-105 pointer-events-none z-0"
          style={{ backgroundImage: `url(${getMediaUrl(bgPhoto)})` }}
        />
      )}
      <div className="fixed inset-0 bg-slate-950/90 pointer-events-none z-0" />
      
      {/* Header de Estación */}
      <header className="relative z-20 px-6 py-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between sticky top-0 backdrop-blur-md">
        <div className="flex items-center gap-3">
          {serviceInfo?.logoUrl ? (
            <img
              src={getMediaUrl(serviceInfo.logoUrl)}
              alt="Logo"
              className="w-10 h-10 rounded-xl object-contain bg-slate-950 p-1 border border-slate-700 shadow-sm"
            />
          ) : (
            <span
              className="p-2 rounded-xl text-slate-950 font-black flex items-center justify-center w-10 h-10 shadow-sm"
              style={{ backgroundColor: primaryBrand }}
            >
              {(serviceInfo?.name || slug).charAt(0).toUpperCase()}
            </span>
          )}
          <div>
            <h1 className="text-base font-extrabold text-white flex items-center gap-2">
              <span>{serviceInfo?.name || slug}</span>
              {userRole === 'kitchen' ? (
                <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 font-bold border border-orange-500/30 flex items-center gap-1">
                  <ChefHat className="w-3.5 h-3.5" />
                  KDS Cocina
                </span>
              ) : (
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  En Vivo
                </span>
              )}
            </h1>
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <span>{userRole === 'kitchen' ? 'Pantalla de Cocina (KDS en Vivo)' : 'Estación de Sala y Barra'}</span>
              {activeWaiterName && (
                <>
                  <span>•</span>
                  <span className={`${userRole === 'kitchen' ? 'text-orange-400' : 'text-amber-400'} font-bold flex items-center gap-1`}>
                    {userRole === 'kitchen' ? <ChefHat className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                    {activeWaiterName}
                  </span>
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Volver a la web */}
          <Link
            to="/"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
            title="Volver a la Página Principal"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Sitio Web</span>
          </Link>

          {/* Botón de prueba de campana */}
          <button
            onClick={() => chime.playChime(isKitchenActive() ? 'order' : 'waiter')}
            className={`p-2 rounded-xl bg-slate-800 hover:bg-slate-700 ${isKitchenActive() ? 'text-orange-400' : 'text-amber-400'} text-xs font-semibold flex items-center gap-1.5 border border-slate-700`}
            title={isKitchenActive() ? "Probar campanada de comanda culinaria" : "Probar sonido de campanilla"}
          >
            <Volume2 className="w-4 h-4" />
            <span className="hidden sm:inline">{isKitchenActive() ? 'Probar Comandero' : 'Probar Ding'}</span>
          </button>

          {/* Salir */}
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 hover:text-rose-400 text-slate-400 border border-slate-700 transition-colors"
            title="Cerrar estación"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className={`relative z-10 flex-1 w-full mx-auto p-4 md:p-6 transition-all ${serviceViewMode === 'split' ? 'max-w-[1500px]' : 'max-w-5xl'}`}>
        
        {/* Banner de desbloqueo de audio en navegadores móviles/escritorio */}
        {!audioUnlocked && (
          <button
            type="button"
            onClick={() => {
              chime.unlock();
              chime.playChime('order');
              setAudioUnlocked(true);
            }}
            className="w-full mb-4 p-3 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center justify-between gap-2 shadow-lg transition-all hover:bg-amber-500/25 active:scale-95 select-none"
          >
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
              <span>🔔 Campanilla en pausa: Toca aquí para activar el sonido de alertas y comandas</span>
            </div>
            <span className="px-2.5 py-1 rounded-xl bg-amber-500 text-slate-950 font-black text-[11px] shrink-0">
              Activar Audio
            </span>
          </button>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            {userRole === 'kitchen' ? (
              <>
                <ChefHat className="w-5 h-5 text-orange-400" />
                <span>Pase Culinario & Comandas a Preparar</span>
                {activeKitchenOrders.length > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full bg-orange-500 text-white text-xs font-black animate-pulse">
                    {activeKitchenOrders.length} {activeKitchenOrders.length === 1 ? 'orden' : 'órdenes'}
                  </span>
                )}
              </>
            ) : (
              <>
                <span>Estación de Sala y Barra</span>
                {requests.length > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-xs font-black animate-pulse">
                    {requests.length} {requests.length === 1 ? 'alerta' : 'alertas'}
                  </span>
                )}
              </>
            )}
          </h2>

          {/* Switcher de Vista: En Cocina es exclusivo KDS; en Sala ofrece Plano, Comandas, KDS, Alertas y Dividida */}
          {userRole === 'kitchen' ? (
            <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 shadow-md">
              <span className="px-3 py-1 rounded-xl bg-orange-500/20 text-orange-300 font-bold text-xs flex items-center gap-1.5 border border-orange-500/30">
                <ChefHat className="w-3.5 h-3.5" />
                Modo Cocina Exclusivo
              </span>
              {!isOrdersEnabled && (
                <span className="text-[10px] px-2.5 py-1 rounded-xl bg-slate-800 text-slate-400 font-bold border border-slate-700/60">
                  Modo Catálogo
                </span>
              )}
            </div>
          ) : (
            <div className="flex items-center bg-slate-900 p-1 rounded-2xl border border-slate-800 self-start sm:self-auto shadow-md gap-1 overflow-x-auto max-w-full scrollbar-none">
              <button
                type="button"
                onClick={() => setServiceViewMode('floor_plan')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                  serviceViewMode === 'floor_plan'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Plano</span>
              </button>

              {isOrdersEnabled && (
                <>
                  <button
                    type="button"
                    onClick={() => setServiceViewMode('orders')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                      serviceViewMode === 'orders'
                        ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Utensils className="w-3.5 h-3.5" />
                    <span>Comandas</span>
                    {pendingOrders.length > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black animate-pulse">
                        {pendingOrders.length}
                      </span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setServiceViewMode('kitchen')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                      serviceViewMode === 'kitchen'
                        ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <ChefHat className="w-3.5 h-3.5" />
                    <span>Cocina / KDS</span>
                    {activeKitchenOrders.length > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full bg-orange-500 text-white text-[10px] font-black animate-pulse">
                        {activeKitchenOrders.length}
                      </span>
                    )}
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={() => setServiceViewMode('list')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                  serviceViewMode === 'list'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Alertas ({requests.length})</span>
              </button>

              {isOrdersEnabled && (
                <button
                  type="button"
                  onClick={() => setServiceViewMode('split')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                    serviceViewMode === 'split'
                      ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Dividir pantalla: Plano de Sala a la izquierda + Comandas y Alertas a la derecha (Ideal para tablets y pantallas grandes)"
                >
                  <Columns className="w-3.5 h-3.5" />
                  <span>Dividida</span>
                </button>
              )}

              {!isOrdersEnabled && (
                <span className="text-[10px] px-2.5 py-1 rounded-xl bg-slate-800/80 text-slate-400 font-bold border border-slate-700/60 flex items-center gap-1.5 shrink-0 ml-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                  Modo Catálogo
                </span>
              )}
            </div>
          )}
        </div>

        {userRole === 'kitchen' && !isOrdersEnabled ? (
          <div className="p-8 sm:p-12 text-center rounded-3xl bg-slate-900/60 border border-slate-800 shadow-2xl max-w-xl mx-auto space-y-4 animate-fadeIn my-8">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20 shadow-inner">
              <ChefHat className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-black text-white">Pedidos Digitales Desactivados</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
                El restaurante opera actualmente en <strong>Modo Catálogo</strong> (los comensales visualizan los platillos en 3D pero no realizan pedidos digitales desde la mesa).
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-[11px] font-semibold text-slate-300">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              Para recibir comandas culinarias aquí, activa "Permitir Pedidos" en el Panel Admin
            </div>
          </div>
        ) : serviceViewMode === 'split' ? (
          /* MODO DIVIDIDO: Plano a la izquierda y Comandas/Alertas a la derecha para Tablets y Escritorio */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fadeIn">
            {/* Lado Izquierdo: Plano de Sala / Croquis (7 columnas) */}
            <div className="lg:col-span-7 bg-slate-900/60 p-4 sm:p-5 rounded-3xl border border-slate-800 shadow-xl space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs font-black uppercase text-white tracking-wider">
                    Plano de Sala en Tiempo Real
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">
                  {effectiveTables.length} mesas • {activeSessions.length} ocupadas
                </span>
              </div>
              <FloorPlanView
                tables={effectiveTables}
                zones={floorPlanData?.floorPlan?.zones || serviceInfo?.floorPlan?.zones || []}
                requests={requests}
                activeSessions={activeSessions}
                onAttendRequest={handleMarkAttended}
                onCloseSession={handleCloseTableSession}
                onApproveOrder={handleApproveOrder}
                onRejectOrder={handleRejectOrder}
                onOpenCheckout={handleOpenCheckout}
                restaurantName={serviceInfo?.name || slug}
              />
            </div>

            {/* Lado Derecho: Comandas Activas & Alertas de Servicio (5 columnas) */}
            <div className="lg:col-span-5 space-y-4">
              {/* 1. Comandas pendientes de confirmación */}
              <div className="bg-slate-900/60 p-4 sm:p-5 rounded-3xl border border-slate-800 shadow-xl space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-xs font-black uppercase text-white tracking-wider">
                      Comandas por Confirmar
                    </h3>
                  </div>
                  {pendingOrders.length > 0 ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black animate-pulse">
                      {pendingOrders.length} {pendingOrders.length === 1 ? 'pendiente' : 'pendientes'}
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-500 font-bold">Al día</span>
                  )}
                </div>

                {pendingOrders.length === 0 ? (
                  <div className="py-4 text-center text-slate-500 text-xs italic">
                    No hay comandas pendientes por aprobar a cocina.
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                    {pendingOrders.map(ord => (
                      <div
                        key={ord._id}
                        className="p-3.5 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-2 ring-1 ring-emerald-500/20"
                      >
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-xs">
                            Mesa {ord.tableNumber}
                          </span>
                          <span className="font-mono text-xs font-bold text-amber-400">
                            ${ord.subtotal.toFixed(2)} {ord.sessionCurrency}
                          </span>
                        </div>

                        <div className="text-xs text-slate-300">
                          <span className="font-semibold text-white">{ord.dinerName || 'Cliente'}</span>:
                          <div className="mt-1 space-y-1">
                            {ord.items?.map((it, i) => (
                              <div key={i} className="flex justify-between text-[11px] text-slate-200">
                                <span><strong>{it.quantity}x</strong> {it.name}</span>
                                {it.notes && <span className="text-amber-400 text-[10px] italic">({it.notes})</span>}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-2 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleApproveOrder(ord.tableNumber, ord._id)}
                            className="flex-1 py-1.5 px-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1 shadow-md transition-all active:scale-95"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Aprobar a Cocina</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const reason = window.prompt('Motivo de rechazo:', 'Mesa sin comensales o comanda cancelada');
                              if (reason !== null) handleRejectOrder(ord.tableNumber, ord._id, reason);
                            }}
                            className="py-1.5 px-2.5 rounded-xl bg-slate-800 hover:bg-rose-950 hover:text-rose-300 text-slate-400 font-bold text-xs"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. Alertas de servicio y llamadas de comensales */}
              <div className="bg-slate-900/60 p-4 sm:p-5 rounded-3xl border border-slate-800 shadow-xl space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-amber-400" />
                    <h3 className="text-xs font-black uppercase text-white tracking-wider">
                      Alertas de Servicio en Vivo
                    </h3>
                  </div>
                  {requests.length > 0 ? (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black animate-pulse">
                      {requests.length} activas
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-500 font-bold">Sin alertas</span>
                  )}
                </div>

                {requests.length === 0 ? (
                  <div className="py-4 text-center text-slate-500 text-xs italic">
                    Todas las mesas atendidas.
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                    {requests.map(req => {
                      const isBill = req.type === 'bill';
                      const reqId = req._id || req.id;
                      return (
                        <div
                          key={reqId}
                          className={`p-3 rounded-2xl border flex items-center justify-between gap-3 ${
                            isBill
                              ? 'bg-purple-950/40 border-purple-500/40 text-purple-200'
                              : 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded-md font-black text-xs ${
                                isBill ? 'bg-purple-500 text-slate-950' : 'bg-amber-500 text-slate-950'
                              }`}>
                                Mesa {req.table}
                              </span>
                              <span className="text-xs font-bold text-white truncate">
                                {isBill ? `Pide Cuenta (${req.paymentMethod === 'cash' ? 'Efectivo' : 'Tarjeta'})` : 'Llama al mesero'}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {isBill && (
                              <button
                                type="button"
                                onClick={() => handleOpenCheckout(req.table)}
                                className="py-1 px-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-black text-xs shadow-md active:scale-95"
                              >
                                Cobrar
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleMarkAttended(reqId)}
                              className="py-1 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs"
                              title="Marcar como atendido"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : serviceViewMode === 'floor_plan' ? (
          <FloorPlanView
            tables={effectiveTables}
            zones={floorPlanData?.floorPlan?.zones || serviceInfo?.floorPlan?.zones || []}
            requests={requests}
            activeSessions={activeSessions}
            onAttendRequest={handleMarkAttended}
            onCloseSession={handleCloseTableSession}
            onApproveOrder={handleApproveOrder}
            onRejectOrder={handleRejectOrder}
            onOpenCheckout={handleOpenCheckout}
            restaurantName={serviceInfo?.name || slug}
          />
        ) : serviceViewMode === 'orders' ? (
          <div className="space-y-4">
            {/* Filtros de la sección de Comandas */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => setOrderFilter('all')}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
                  orderFilter === 'all'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                Todas ({allOrders.filter(o => o.status !== 'rejected').length})
              </button>
              <button
                type="button"
                onClick={() => setOrderFilter('pending')}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  orderFilter === 'pending'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <span>Por Confirmar</span>
                {pendingOrders.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px]">
                    {pendingOrders.length}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setOrderFilter('kitchen')}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
                  orderFilter === 'kitchen'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                En Cocina ({kitchenOrders.length})
              </button>
            </div>

            {displayedOrders.length === 0 ? (
              <div className="p-12 text-center bg-slate-900/40 rounded-3xl border border-slate-800/80 flex flex-col items-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-400/60 mb-3" />
                <h3 className="text-base font-bold text-white">
                  {orderFilter === 'pending' ? 'No hay comandas pendientes de aprobación' : 'Sin comandas en esta sección'}
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mt-1">
                  Cuando un comensal envíe un pedido desde su mesa, sonará aquí y podrás revisarlo antes de enviarlo a cocina.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedOrders.map((ord) => {
                  const isPending = ord.status === 'pending_approval';
                  return (
                    <div
                      key={ord._id}
                      className={`rounded-3xl p-5 border shadow-2xl flex flex-col justify-between transition-all ${
                        isPending
                          ? 'border-emerald-500/50 bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-900 ring-2 ring-emerald-500/20'
                          : 'border-slate-800 bg-slate-900/80'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className={`px-3 py-1 rounded-full font-black text-xs ${
                            isPending ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-200'
                          }`}>
                            Mesa {ord.tableNumber}
                          </span>
                          <span className="font-mono text-xs font-bold text-slate-400">
                            {ord.orderNumber}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-300">
                          <span>Comensal: <strong className="text-white">{ord.dinerName || 'Cliente'}</strong></span>
                          <span className="font-mono text-base font-black text-amber-400">
                            ${ord.subtotal.toFixed(2)} {ord.sessionCurrency}
                          </span>
                        </div>

                        <div className="space-y-1.5 p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
                          {ord.items?.map((it, idx) => (
                            <div key={idx} className="flex items-start justify-between text-xs gap-2">
                              <span className="text-slate-200">
                                <strong className="text-white">{it.quantity}x</strong> {it.name}
                                {it.notes && (
                                  <span className="block text-[11px] text-amber-400 italic font-medium">
                                    Nota: {it.notes}
                                  </span>
                                )}
                              </span>
                              <span className="font-mono text-slate-400 text-xs shrink-0">
                                ${(it.price * it.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 flex items-center gap-2">
                        {isPending ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleApproveOrder(ord.tableNumber, ord._id)}
                              className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
                            >
                              <Check className="w-4 h-4" />
                              <span>Aprobar a Cocina</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const reason = window.prompt('Motivo de rechazo (opcional):', 'Mesa sin comensales o comanda cancelada');
                                if (reason !== null) {
                                  handleRejectOrder(ord.tableNumber, ord._id, reason);
                                }
                              }}
                              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-rose-950 hover:text-rose-300 text-slate-400 font-bold text-xs flex items-center justify-center gap-1 transition-all"
                            >
                              <X className="w-4 h-4" />
                              <span>Rechazar</span>
                            </button>
                          </>
                        ) : (
                          <div className="w-full py-2 px-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>Marchada a cocina</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : serviceViewMode === 'kitchen' ? (
          /* PANTALLA DE COCINA (KDS) PARA EL CHEF */
          <div className="space-y-4">
            {/* Cabecera y Filtros KDS */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/30 shrink-0">
                  <ChefHat className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <span>Pantalla de Cocina (KDS en Tiempo Real)</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/40 font-bold uppercase">
                      Pase Culinario
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    {activeKitchenOrders.length} {activeKitchenOrders.length === 1 ? 'orden activa' : 'órdenes activas'} en cocina • Turno de entrada (FIFO)
                  </p>
                </div>
              </div>

              {/* Filtros KDS */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                <button
                  type="button"
                  onClick={() => setKdsFilter('all')}
                  className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    kdsFilter === 'all'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  Todas ({activeKitchenOrders.length})
                </button>
                <button
                  type="button"
                  onClick={() => setKdsFilter('approved')}
                  className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
                    kdsFilter === 'approved'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <span>Por Iniciar</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300">
                    {activeKitchenOrders.filter(o => o.status === 'approved').length}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setKdsFilter('preparing')}
                  className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
                    kdsFilter === 'preparing'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <Flame className="w-3 h-3 text-orange-400" />
                  <span>En Fuego</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-orange-950 text-orange-300">
                    {activeKitchenOrders.filter(o => o.status === 'preparing').length}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setKdsFilter('ready')}
                  className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
                    kdsFilter === 'ready'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>En Pase</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-950 text-emerald-300">
                    {activeKitchenOrders.filter(o => o.status === 'ready').length}
                  </span>
                </button>
              </div>
            </div>

            {/* Listado de Tarjetas de Cocina */}
            {displayedKitchenOrders.length === 0 ? (
              <div className="p-16 text-center bg-slate-900/40 rounded-3xl border border-slate-800/80 flex flex-col items-center">
                <ChefHat className="w-16 h-16 text-slate-700 mb-3" />
                <h3 className="text-base font-bold text-white">Cocina al día</h3>
                <p className="text-xs text-slate-400 max-w-sm mt-1">
                  No hay órdenes pendientes de preparación en este momento. Las nuevas comandas aprobadas por los meseros aparecerán aquí automáticamente.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedKitchenOrders.map((ord) => {
                  const elapsedMinutes = Math.max(0, Math.floor((Date.now() - new Date(ord.orderedAt || Date.now()).getTime()) / 60000));
                  const isUrgent = elapsedMinutes >= 20;
                  const isWarning = elapsedMinutes >= 10 && elapsedMinutes < 20;

                  const isApproved = ord.status === 'approved';
                  const isPreparing = ord.status === 'preparing';
                  const isReady = ord.status === 'ready';

                  return (
                    <div
                      key={ord._id}
                      className={`rounded-3xl p-5 border flex flex-col justify-between transition-all shadow-2xl relative ${
                        isReady
                          ? 'bg-gradient-to-br from-emerald-950/80 via-slate-900 to-slate-950 border-emerald-500 ring-2 ring-emerald-500/40'
                          : isPreparing
                          ? 'bg-gradient-to-br from-orange-950/70 via-slate-900 to-slate-950 border-orange-500 ring-2 ring-orange-500/40'
                          : isUrgent
                          ? 'bg-gradient-to-br from-rose-950/70 via-slate-900 to-slate-950 border-rose-500 ring-2 ring-rose-500/40'
                          : 'bg-slate-900/95 border-slate-800'
                      }`}
                    >
                      <div className="space-y-3">
                        {/* Cabecera de la Comanda de Cocina */}
                        <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-3">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-md ${
                              isReady
                                ? 'bg-emerald-500 text-slate-950'
                                : isPreparing
                                ? 'bg-orange-500 text-white'
                                : 'bg-slate-800 text-white border border-slate-700'
                            }`}>
                              {ord.tableNumber}
                            </div>
                            <div>
                              <h4 className="text-base font-black text-white">
                                Mesa {ord.tableNumber}
                              </h4>
                              <span className="font-mono text-[11px] text-slate-400 block">
                                {ord.orderNumber}
                              </span>
                            </div>
                          </div>

                          {/* Temporizador de Espera */}
                          <div className={`px-2.5 py-1 rounded-xl text-xs font-black flex items-center gap-1 shadow-sm ${
                            isUrgent
                              ? 'bg-rose-500 text-white animate-pulse'
                              : isWarning
                              ? 'bg-amber-500 text-slate-950'
                              : 'bg-slate-800 text-emerald-400 border border-slate-700'
                          }`}>
                            <Clock className="w-3 h-3" />
                            <span>{elapsedMinutes} min</span>
                          </div>
                        </div>

                        {/* Estado Culinario */}
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">
                            Comensal: <strong className="text-slate-200">{ord.dinerName || 'Cliente'}</strong>
                          </span>
                          {isReady ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[11px] border border-emerald-500/40 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>¡En Pase!</span>
                            </span>
                          ) : isPreparing ? (
                            <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 font-bold text-[11px] border border-orange-500/40 flex items-center gap-1">
                              <Flame className="w-3 h-3 animate-bounce" />
                              <span>En Fuego</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-bold text-[11px] border border-slate-700">
                              En Espera
                            </span>
                          )}
                        </div>

                        {/* Lista de Platillos para el Cocinero */}
                        <div className="space-y-2 p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800/90 max-h-60 overflow-y-auto">
                          {ord.items?.map((it, idx) => (
                            <div key={idx} className="border-b border-slate-900 pb-2 last:border-0 last:pb-0">
                              <div className="flex items-center gap-2">
                                <span className="w-7 h-7 rounded-lg bg-slate-800 text-amber-400 font-black text-xs flex items-center justify-center shrink-0 border border-slate-700">
                                  {it.quantity}x
                                </span>
                                <span className="text-sm font-bold text-white leading-tight">
                                  {it.name}
                                </span>
                              </div>
                              {it.notes && (
                                <div className="mt-1.5 ml-9 p-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-start gap-1">
                                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
                                  <span>{it.notes}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Botones de Acción del Chef */}
                      <div className="pt-4 border-t border-slate-800 space-y-2">
                        {isApproved && (
                          <button
                            type="button"
                            onClick={() => handleUpdateOrderStatus(ord.tableNumber, ord._id, 'preparing')}
                            className="w-full py-3 px-3 rounded-2xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
                          >
                            <Flame className="w-4 h-4 text-slate-950" />
                            <span>Empezar Preparación</span>
                          </button>
                        )}

                        {isPreparing && (
                          <button
                            type="button"
                            onClick={() => handleUpdateOrderStatus(ord.tableNumber, ord._id, 'ready')}
                            className="w-full py-3 px-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 animate-pulse"
                          >
                            <CheckCircle2 className="w-4 h-4 text-slate-950" />
                            <span>¡Listo en Pase de Cocina!</span>
                          </button>
                        )}

                        {isReady && (
                          <button
                            type="button"
                            onClick={() => handleUpdateOrderStatus(ord.tableNumber, ord._id, 'delivered')}
                            className="w-full py-3 px-3 rounded-2xl bg-slate-800 hover:bg-emerald-950 hover:text-emerald-300 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-all border border-slate-700 active:scale-95"
                          >
                            <Check className="w-4 h-4 text-emerald-400" />
                            <span>Marcar Servido a Mesa</span>
                          </button>
                        )}

                        {/* Imprimir Ticket Físico de Cocina */}
                        <button
                          type="button"
                          onClick={() => handlePrintKitchenTicket(ord)}
                          className="w-full py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border border-slate-800"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Imprimir Comanda Física (80mm)</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : requests.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/40 rounded-3xl border border-slate-800/80 flex flex-col items-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-400/60 mb-3" />
            <h3 className="text-base font-bold text-white">Todas las mesas están atendidas</h3>
            <p className="text-xs text-slate-400 max-w-sm mt-1">
              Las nuevas llamadas de mesero o solicitudes de cuenta sonarán automáticamente aquí con sonido de campanilla.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {requests.map((req) => {
              const id = req._id || req.id;
              const isBill = req.type === 'bill';

              return (
                <div
                  key={id}
                  className={`relative rounded-3xl p-5 border shadow-xl flex flex-col justify-between transition-all animate-scaleUp ${
                    isBill
                      ? 'bg-gradient-to-br from-emerald-950/70 via-slate-900 to-slate-900 border-emerald-500/50 shadow-emerald-950/20'
                      : 'bg-gradient-to-br from-amber-950/70 via-slate-900 to-slate-900 border-amber-500/50 shadow-amber-950/20'
                  }`}
                >
                  <div>
                    {/* Encabezado de la tarjeta */}
                    <div className="flex items-start justify-between">
                      <span className={`px-3 py-1 rounded-full text-xs font-black tracking-wide uppercase flex items-center gap-1.5 ${
                        isBill
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {isBill ? (
                          <>
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Pedir Cuenta</span>
                          </>
                        ) : (
                          <>
                            <Bell className="w-3.5 h-3.5 animate-bounce" />
                            <span>Llamar Mesero</span>
                          </>
                        )}
                      </span>

                      <span className="text-xs text-slate-400 font-mono tabular-nums">
                        {req.createdAt ? new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Reciente'}
                      </span>
                    </div>

                    {/* Mesa y Zona */}
                    <div className="mt-4 mb-2">
                      <span className="text-3xl font-black text-white tracking-tight tabular-nums">
                        Mesa {req.table}
                      </span>
                      <p className="text-xs font-bold text-slate-400 mt-0.5">
                        Zona: <span className="text-slate-200">{req.zone || 'Principal'}</span>
                      </p>
                    </div>

                    {/* Detalles si es cuenta */}
                    {isBill && (
                      <div className="mt-2 p-2 rounded-xl bg-slate-950/60 border border-emerald-900/40 text-xs text-emerald-200 font-semibold flex items-center gap-2">
                        <span>Pago:</span>
                        <strong className="text-white uppercase flex items-center gap-1.5">
                          {req.paymentMethod === 'card' ? (
                            <>
                              <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Tarjeta</span>
                            </>
                          ) : req.paymentMethod === 'cash' ? (
                            <>
                              <Banknote className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Efectivo</span>
                            </>
                          ) : (
                            'Cualquiera'
                          )}
                        </strong>
                      </div>
                    )}
                  </div>

                  {/* Botón de Atendido */}
                  <div className="mt-5 pt-3 border-t border-slate-800">
                    <button
                      onClick={() => handleMarkAttended(id)}
                      className={`w-full py-2.5 px-4 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 ${
                        isBill
                          ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                          : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Marcar como Atendido</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      {/* Modal de Cobro y Calculadora de Cambio para Mesero */}
      {isCheckoutOpen && checkoutTableData && (
        <WaiterCheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => {
            setIsCheckoutOpen(false);
            setCheckoutTableData(null);
          }}
          tableNumber={checkoutTableData.tableNumber}
          tableSession={checkoutTableData.session}
          restaurantName={serviceInfo?.name || slug}
          restaurantLogo={serviceInfo?.logoUrl ? getMediaUrl(serviceInfo.logoUrl) : ''}
          currency={serviceInfo?.currency || 'MXN'}
          onConfirmPaymentAndLiberate={handleConfirmPaymentAndLiberate}
          isClosing={isClosingSession}
        />
      )}

    </main>

      {/* Región de accesibilidad para lectores de pantalla (WCAG 2.2 AA) */}
      <div className="sr-only" aria-live="assertive" aria-atomic="true">
        {liveAnnouncement}
      </div>
    </div>
  );
}
