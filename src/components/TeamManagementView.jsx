import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ShieldCheck,
  Users,
  UserPlus,
  Key,
  Lock,
  Unlock,
  Trash2,
  Clock,
  AlertTriangle,
  CheckCircle2,
  X,
  Copy,
  Check,
  Edit,
  Sparkles,
  RefreshCw,
  Eye,
  EyeOff,
  Building2,
  Activity,
  History
} from 'lucide-react';

const ROLE_CONFIGS = {
  owner: {
    label: 'Propietario',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    ringColor: 'ring-amber-500',
    desc: 'Acceso total a la plataforma, facturación Stripe, sedes y equipo.'
  },
  manager: {
    label: 'Gerente',
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    ringColor: 'ring-blue-500',
    desc: 'Gestión de carta 2D/3D, códigos QR, mesas y meseros. Sin acceso a facturación.'
  },
  menu_editor: {
    label: 'Editor de Carta',
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    ringColor: 'ring-purple-500',
    desc: 'Edición de platillos, modelos 3D y categorías. Bloqueado de ajustes generales.'
  },
  staff: {
    label: 'Mesero / Barra',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    ringColor: 'ring-emerald-500',
    desc: 'Acceso rápido con PIN a la estación táctil de servicio (/servicio).'
  },
  kitchen: {
    label: 'Cocina / Chef (KDS)',
    badgeColor: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    ringColor: 'ring-orange-500',
    desc: 'Pantalla exclusiva de cocina (KDS). Visualiza solo comandas de platillos en preparación y pase culinario.'
  }
};

const ACTION_TRANSLATIONS = {
  ADMIN_CREATED: { label: 'Alta de Colaborador', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  ADMIN_UPDATED: { label: 'Datos Actualizados', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  ADMIN_SUSPENDED: { label: 'Cuenta Suspendida', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  ADMIN_REACTIVATED: { label: 'Cuenta Reactivada', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  ADMIN_DELETED: { label: 'Acceso Revocado', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
  PASSWORD_RESET: { label: 'Clave Restablecida', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
  ROLE_CHANGED: { label: 'Rol Modificado', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
  LOGIN_FAILED: { label: 'Intento Fallido', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
  LOGIN_SUCCESS: { label: 'Acceso Exitoso', color: 'text-slate-300 bg-slate-800 border-slate-700' }
};

export default function TeamManagementView({ restaurant, currentUser, onNavigateToBilling, token: propToken }) {
  const [subTab, setSubTab] = useState('members'); // 'members' | 'audit'
  const [members, setMembers] = useState([]);
  const [stats, setStats] = useState(null);
  const [planLimits, setPlanLimits] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [isAuditAllowed, setIsAuditAllowed] = useState(true);
  const [auditMessage, setAuditMessage] = useState('');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  // Modales
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showUpsellModal, setShowUpsellModal] = useState(false);
  const [upsellMessage, setUpsellMessage] = useState('');

  // Formulario nuevo/editar
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'staff',
    pinCode: '1234',
    assignedBranchId: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [tempPasswordResult, setTempPasswordResult] = useState(null);
  const [copiedKey, setCopiedKey] = useState(false);

  useEffect(() => {
    fetchTeamData();
  }, [propToken, restaurant?._id]);

  useEffect(() => {
    if (subTab === 'audit') {
      fetchAuditLogs();
    }
  }, [subTab]);

  const getAuthHeaders = () => {
    const activeToken = propToken || (typeof window !== 'undefined'
      ? (localStorage.getItem('volum_admin_token') || localStorage.getItem('token'))
      : null);
    return {
      headers: {
        Authorization: activeToken ? `Bearer ${activeToken}` : '',
        'x-restaurant-slug': restaurant?.slug || '',
        'x-restaurant-id': restaurant?._id || ''
      }
    };
  };

  const showToastMsg = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4500);
  };

  const fetchTeamData = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/api/v1/admin/team', getAuthHeaders());
      if (res.data?.success) {
        setMembers(res.data.data.members || []);
        setStats(res.data.data.stats || null);
        setPlanLimits(res.data.data.plan || null);
      }
    } catch (err) {
      showToastMsg('error', err.response?.data?.message || 'Error al cargar miembros del equipo.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const res = await axios.get('/api/v1/admin/team/audit-logs', getAuthHeaders());
      if (res.data?.success) {
        setIsAuditAllowed(res.data.data.isAllowed);
        setAuditLogs(res.data.data.logs || []);
        setAuditMessage(res.data.data.message || '');
      }
    } catch (err) {
      console.warn('Error al cargar auditoría:', err.message);
    }
  };

  const generateSecurePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let result = '';
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, password: result }));
  };

  const handleOpenCreateModal = () => {
    // Si alcanzó el límite de su plan, mostrar upsell
    if (planLimits && stats && stats.totalMembers >= planLimits.maxTotalMembers) {
      setUpsellMessage(`Has alcanzado el límite de ${planLimits.maxTotalMembers} colaboradores en tu ${planLimits.name}.`);
      setShowUpsellModal(true);
      return;
    }

    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'staff',
      pinCode: '1234',
      assignedBranchId: ''
    });
    setTempPasswordResult(null);
    setIsCreateModalOpen(true);
  };

  const handleCreateMember = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await axios.post('/api/v1/admin/team', formData, getAuthHeaders());
      if (res.data?.success) {
        showToastMsg('success', res.data.message);
        if (res.data.generatedPassword && formData.role !== 'staff' && formData.role !== 'kitchen') {
          setTempPasswordResult({
            name: formData.name,
            email: formData.email,
            password: res.data.generatedPassword
          });
        } else {
          setIsCreateModalOpen(false);
        }
        fetchTeamData();
      }
    } catch (err) {
      if (err.response?.data?.needsUpsell) {
        setIsCreateModalOpen(false);
        setUpsellMessage(err.response?.data?.message || 'Límite alcanzado.');
        setShowUpsellModal(true);
      } else {
        showToastMsg('error', err.response?.data?.message || 'Error al crear colaborador.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (member) => {
    try {
      const res = await axios.patch(`/api/v1/admin/team/${member._id}/status`, {}, getAuthHeaders());
      if (res.data?.success) {
        showToastMsg('success', res.data.message);
        setMembers(prev => prev.map(m => m._id === member._id ? { ...m, status: res.data.status } : m));
        if (stats) {
          setStats(prev => ({
            ...prev,
            totalActive: res.data.status === 'active' ? prev.totalActive + 1 : prev.totalActive - 1,
            totalSuspended: res.data.status === 'suspended' ? prev.totalSuspended + 1 : prev.totalSuspended - 1
          }));
        }
      }
    } catch (err) {
      showToastMsg('error', err.response?.data?.message || 'Error al cambiar estado.');
    }
  };

  const handleResetPassword = async (member) => {
    if (!window.confirm(`¿Deseas restablecer la contraseña de ${member.name}? Se generará una clave segura temporal.`)) return;
    try {
      const res = await axios.patch(`/api/v1/admin/team/${member._id}/reset-password`, {}, getAuthHeaders());
      if (res.data?.success) {
        setTempPasswordResult({
          name: member.name,
          email: member.email,
          password: res.data.tempPassword
        });
        showToastMsg('success', res.data.message);
      }
    } catch (err) {
      showToastMsg('error', err.response?.data?.message || 'Error al restablecer contraseña.');
    }
  };

  const handleDeleteMember = async (member) => {
    if (!window.confirm(`¿Confirmas eliminar definitivamente a ${member.name}? Sus accesos serán revocados de forma permanente.`)) return;
    try {
      const res = await axios.delete(`/api/v1/admin/team/${member._id}`, getAuthHeaders());
      if (res.data?.success) {
        showToastMsg('success', res.data.message);
        setMembers(prev => prev.filter(m => m._id !== member._id));
        fetchTeamData();
      }
    } catch (err) {
      showToastMsg('error', err.response?.data?.message || 'Error al eliminar colaborador.');
    }
  };

  const handleOpenEditModal = (member) => {
    setSelectedMember(member);
    setFormData({
      name: member.name || '',
      email: member.email || '',
      role: member.role || 'staff',
      pinCode: member.pinCode || '1234',
      assignedBranchId: member.assignedBranchId || ''
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateMember = async (e) => {
    e.preventDefault();
    if (!selectedMember) return;
    setIsSubmitting(true);
    try {
      const res = await axios.put(`/api/v1/admin/team/${selectedMember._id}`, formData, getAuthHeaders());
      if (res.data?.success) {
        showToastMsg('success', res.data.message);
        setIsEditModalOpen(false);
        fetchTeamData();
      }
    } catch (err) {
      showToastMsg('error', err.response?.data?.message || 'Error al actualizar colaborador.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2500);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl border text-xs font-bold transition-all ${
          toast.type === 'error'
            ? 'bg-rose-950/90 border-rose-500/40 text-rose-200'
            : 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
        }`}>
          {toast.type === 'error' ? <AlertTriangle className="w-4 h-4 text-rose-400" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Cabecera Principal */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-3xl border border-slate-800/80 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h1 className="text-xl md:text-2xl font-black text-white font-playfair tracking-tight">
              Equipo & Seguridad RBAC
            </h1>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
            Control de accesos por roles, gestión de meseros con PIN independiente y bitácora de auditoría inmutable.
          </p>
        </div>

        {/* Botón Alta */}
        {currentUser?.role === 'owner' && (
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs transition-all shadow-lg shadow-amber-500/20 active:scale-95 shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Nuevo Colaborador</span>
          </button>
        )}
      </div>

      {/* Tarjetas de Métricas y Capacidad del Plan */}
      {stats && planLimits && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Capacidad Plan */}
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-400">Capacidad del Plan</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {planLimits.name}
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-white tabular-nums">{stats.totalMembers}</span>
              <span className="text-xs text-slate-400">/ {planLimits.isUnlimited ? '∞ Ilimitado' : `${planLimits.maxTotalMembers} máx`}</span>
            </div>
            {!planLimits.isUnlimited && (
              <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2.5 overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (stats.totalMembers / planLimits.maxTotalMembers) * 100)}%` }}
                />
              </div>
            )}
          </div>

          {/* Gerentes */}
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60">
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">Gerentes Activos</span>
            <span className="text-2xl font-black text-blue-400 tabular-nums">{stats.totalManagers}</span>
            <span className="text-[11px] text-slate-400 block mt-1">Con acceso a carta y mesas</span>
          </div>

          {/* Meseros / Sala */}
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60">
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">Personal de Sala (PIN)</span>
            <span className="text-2xl font-black text-emerald-400 tabular-nums">{stats.totalStaff}</span>
            <span className="text-[11px] text-slate-400 block mt-1">Estación /servicio táctil</span>
          </div>

          {/* Estado de Seguridad */}
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60">
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">Cuentas Suspendidas</span>
            <span className={`text-2xl font-black tabular-nums ${stats.totalSuspended > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
              {stats.totalSuspended}
            </span>
            <span className="text-[11px] text-slate-400 block mt-1">Accesos revocados al instante</span>
          </div>
        </div>
      )}

      {/* Selector de Sub-Pestañas */}
      <div className="flex border-b border-slate-800 gap-2">
        <button
          type="button"
          onClick={() => setSubTab('members')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            subTab === 'members'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Colaboradores y Accesos ({members.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('audit')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            subTab === 'audit'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Bitácora de Auditoría (Security Trail)</span>
        </button>
      </div>

      {/* Contenido Sub-Pestaña 1: Miembros */}
      {subTab === 'members' && (
        <div className="space-y-4">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400">
              <RefreshCw className="w-8 h-8 animate-spin text-amber-500 mb-2" />
              <span className="text-xs">Cargando colaboradores...</span>
            </div>
          ) : members.length === 0 ? (
            <div className="p-8 text-center bg-slate-900/30 rounded-3xl border border-slate-800 text-slate-400">
              <Users className="w-12 h-12 mx-auto text-slate-600 mb-2" />
              <p className="text-sm font-bold text-white mb-1">Aún no hay colaboradores adicionales</p>
              <p className="text-xs text-slate-400">Da de alta gerentes o meseros para delegar la operación.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {members.map(member => {
                const roleConfig = ROLE_CONFIGS[member.role] || ROLE_CONFIGS.staff;
                const isOwner = member.role === 'owner';
                const isSuspended = member.status === 'suspended';
                const isSelf = String(member._id) === String(currentUser?._id || currentUser?.id);
                const isInternalStaffEmail = (member.email || '').includes('@staff.volum.internal');

                return (
                  <div
                    key={member._id}
                    className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                      isSuspended
                        ? 'bg-slate-950/60 border-amber-900/30 opacity-75'
                        : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700/80'
                    }`}
                  >
                    <div>
                      {/* Top Row: Avatar + Estado */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm text-white bg-slate-800 ring-2 ${roleConfig.ringColor} shadow-inner`}>
                            {member.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-white leading-tight flex items-center gap-1.5">
                              <span>{member.name}</span>
                              {isSelf && (
                                <span className="text-[10px] font-semibold text-slate-400 px-1.5 py-0.2 rounded bg-slate-800">Tú</span>
                              )}
                            </h3>
                            <span className="text-xs text-slate-400 font-mono">
                              {isInternalStaffEmail ? (
                                <span className="text-amber-400 font-sans font-semibold inline-flex items-center gap-1">
                                  <Key className="w-3 h-3 text-amber-500" /> Acceso con PIN: {member.pinCode || '••••'}
                                </span>
                              ) : (
                                member.email
                              )}
                            </span>
                          </div>
                        </div>

                        {/* Badge Activo/Suspendido */}
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                          isSuspended
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isSuspended ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'}`} />
                          {isSuspended ? 'Suspendido' : 'Activo'}
                        </span>
                      </div>

                      {/* Role & PIN Badges */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${roleConfig.badgeColor}`}>
                          {roleConfig.label}
                        </span>

                        {isOwner && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md border border-amber-500/30 bg-amber-500/10 text-amber-400 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-amber-400" />
                            <span>Cuenta Raíz Protegida</span>
                          </span>
                        )}

                        {(member.role === 'staff' || member.role === 'kitchen') && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                            PIN: {member.pinCode || '1234'}
                          </span>
                        )}

                        {member.assignedBranchId && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
                            <Building2 className="w-3 h-3 text-slate-400" />
                            <span>Sede Asignada</span>
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-400 mb-4 line-clamp-2">
                        {roleConfig.desc}
                      </p>
                    </div>

                    {/* Bottom: Metadatos y Botones de Acción */}
                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{member.lastLogin ? new Date(member.lastLogin).toLocaleDateString() : 'Sin conexión'}</span>
                      </div>

                      {/* Menú de acciones */}
                      {currentUser?.role === 'owner' && (
                        <div className="flex items-center gap-1">
                          {/* Botón Suspender / Reactivar (Bloqueado para cuentas Propietario o cuenta propia) */}
                          {!isOwner && !isSelf && (
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(member)}
                              title={isSuspended ? 'Reactivar cuenta' : 'Suspender accesos'}
                              className={`p-1.5 rounded-lg border transition-all ${
                                isSuspended
                                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                                  : 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
                              }`}
                            >
                              {isSuspended ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                            </button>
                          )}

                          {/* Botón Editar datos o PIN */}
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(member)}
                            title="Editar datos o PIN"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          {/* Botón Reset Password (solo para colaboradores no propietarios) */}
                          {!isOwner && (
                            <button
                              type="button"
                              onClick={() => handleResetPassword(member)}
                              title="Generar contraseña temporal"
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 transition-all"
                            >
                              <Key className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Botón Eliminar: NUNCA se permite eliminar al Propietario ni a uno mismo */}
                          {!isOwner && !isSelf && (
                            <button
                              type="button"
                              onClick={() => handleDeleteMember(member)}
                              title="Revocar acceso definitivamente"
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Contenido Sub-Pestaña 2: Bitácora de Auditoría */}
      {subTab === 'audit' && (
        <div className="space-y-4">
          {!isAuditAllowed ? (
            <div className="p-8 text-center bg-slate-900/40 rounded-3xl border border-slate-800/80 max-w-xl mx-auto">
              <ShieldCheck className="w-12 h-12 mx-auto text-amber-500 mb-3" />
              <h3 className="text-base font-bold text-white mb-2">Bitácora de Auditoría Histórica</h3>
              <p className="text-xs text-slate-400 mb-6">
                {auditMessage || 'La bitácora de eventos con trazabilidad de IP y cambios de colaboradores está disponible a partir del Plan Experiencia 3D (30 días), Cadena VIP (90 días) y Franquicias (180 días).'}
              </p>
              {onNavigateToBilling && (
                <button
                  type="button"
                  onClick={onNavigateToBilling}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 transition-all shadow-lg"
                >
                  Ver Planes & Actualizar
                </button>
              )}
            </div>
          ) : auditLogs.length === 0 ? (
            <div className="p-8 text-center bg-slate-900/30 rounded-3xl border border-slate-800 text-slate-400">
              <History className="w-10 h-10 mx-auto text-slate-600 mb-2" />
              <p className="text-sm font-bold text-white mb-1">Sin eventos recientes de auditoría</p>
              <p className="text-xs text-slate-400">Cualquier cambio de roles, accesos o suspensiones quedará registrado aquí con sello de tiempo e IP.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {auditLogs.map(log => {
                const actConfig = ACTION_TRANSLATIONS[log.action] || { label: log.action, color: 'text-slate-300 bg-slate-800 border-slate-700' };
                return (
                  <div key={log._id} className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/70 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                    <div className="flex items-start md:items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-lg border font-bold text-[10px] shrink-0 ${actConfig.color}`}>
                        {actConfig.label}
                      </span>
                      <div>
                        <div className="font-semibold text-white">
                          <span className="text-amber-400">{log.performedByName}</span>
                          {log.targetUserName && (
                            <span> sobre <strong className="text-slate-200">{log.targetUserName}</strong> ({log.targetUserEmail})</span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          IP: {log.ipAddress || 'LAN'} • {log.userAgent?.split(' ')[0] || 'Browser'}
                        </div>
                      </div>
                    </div>

                    <div className="text-right text-[11px] text-slate-400 shrink-0">
                      {new Date(log.createdAt).toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modal: Alta de Colaborador */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl p-6 relative animate-fadeIn">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60"
            >
              <X className="w-4 h-4" />
            </button>

            {tempPasswordResult ? (
              /* Vista Clave Generada */
              <div className="text-center py-4 space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">¡Colaborador Registrado!</h3>
                <p className="text-xs text-slate-400">
                  Copia la clave temporal de acceso para entregársela a <strong>{tempPasswordResult.name}</strong> ({tempPasswordResult.email}):
                </p>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-sm font-bold text-amber-400 flex items-center justify-between">
                  <span>{tempPasswordResult.password}</span>
                  <button
                    type="button"
                    onClick={() => handleCopyClipboard(tempPasswordResult.password)}
                    className="flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 text-xs hover:bg-amber-500/30 border border-amber-500/30"
                  >
                    {copiedKey ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey ? 'Copiada' : 'Copiar'}</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setTempPasswordResult(null);
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
                >
                  Cerrar
                </button>
              </div>
            ) : (
              /* Formulario Alta */
              <form onSubmit={handleCreateMember} className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <UserPlus className="w-5 h-5 text-amber-500" />
                  <h3 className="text-lg font-bold text-white font-playfair">Nuevo Colaborador</h3>
                </div>

                {/* Selector de Rol al inicio para adaptar los campos */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Rol de Acceso</label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(ROLE_CONFIGS).map(([key, config]) => {
                      const isAllowed = planLimits?.allowedRoles?.includes(key);
                      return (
                        <button
                          key={key}
                          type="button"
                          disabled={!isAllowed}
                          onClick={() => setFormData({ ...formData, role: key })}
                          className={`p-2.5 rounded-xl border text-left transition-all relative ${
                            formData.role === key
                              ? 'bg-amber-500/10 border-amber-500 text-white'
                              : isAllowed
                              ? 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                              : 'bg-slate-950/30 border-slate-800/40 text-slate-600 opacity-60 cursor-not-allowed'
                          }`}
                        >
                          <div className="text-xs font-bold mb-0.5">{config.label}</div>
                          <div className="text-[10px] text-slate-400 line-clamp-1">{config.desc}</div>
                          {!isAllowed && (
                            <span className="text-[9px] font-bold text-amber-500/80 mt-1 block">Requiere Plan Sup.</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Alerta de Modo Mesero Rápido */}
                {(formData.role === 'staff' || formData.role === 'kitchen') && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2.5 leading-relaxed">
                    <Sparkles className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                    <span>
                      <strong>Acceso Rápido para Meseros:</strong> Solo requieres ingresar su Nombre y PIN de 4 dígitos. Podrá ingresar inmediatamente a la pantalla de servicio táctil sin necesidad de correos personales.
                    </span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {formData.role === 'kitchen' ? 'Nombre de Cocina / Chef' : formData.role === 'staff' ? 'Nombre del Mesero / Colaborador' : 'Nombre Completo'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder={formData.role === 'kitchen' ? 'Ej. Cocina Caliente / Chef Mario' : formData.role === 'staff' ? 'Ej. Carlos Mesero' : 'Ej. Lic. Carlos Mendoza'}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                {(formData.role === 'staff' || formData.role === 'kitchen') ? (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">PIN de 4 Dígitos para Estación / Pantalla KDS</label>
                    <input
                      type="text"
                      required
                      maxLength={4}
                      value={formData.pinCode}
                      onChange={e => setFormData({ ...formData, pinCode: e.target.value.replace(/\D/g, '') })}
                      placeholder="1234"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono font-bold tracking-widest text-center focus:outline-none focus:border-amber-500"
                    />
                  </div>
                ) : null}

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-300">
                      {(formData.role === 'staff' || formData.role === 'kitchen') ? 'Correo Electrónico (Opcional)' : 'Correo Electrónico (Obligatorio)'}
                    </label>
                    {(formData.role === 'staff' || formData.role === 'kitchen') && (
                      <span className="text-[10px] text-slate-500">No requerido para meseros ni cocina</span>
                    )}
                  </div>
                  <input
                    type="email"
                    required={formData.role !== 'staff' && formData.role !== 'kitchen'}
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder={(formData.role === 'staff' || formData.role === 'kitchen') ? 'Opcional (dejar en blanco si no usa correo)' : 'gerente@restaurante.com'}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Contraseña para Administradores */}
                {(formData.role !== 'staff' && formData.role !== 'kitchen') && (
                  /* Contraseña para Administradores */
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-300">Contraseña de Acceso</label>
                      <button
                        type="button"
                        onClick={generateSecurePassword}
                        className="text-[10px] font-bold text-amber-400 hover:underline flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Generar Segura</span>
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Mínimo 6 caracteres"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-amber-500 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="w-1/2 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-1/2 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Guardando...' : 'Crear Colaborador'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal: Editar Rol / PIN */}
      {isEditModalOpen && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl p-6 relative animate-fadeIn">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60"
            >
              <X className="w-4 h-4" />
            </button>

            <form onSubmit={handleUpdateMember} className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Edit className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-bold text-white font-playfair">Editar Colaborador</h3>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Rol de Acceso</label>
                {selectedMember?.role === 'owner' ? (
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center justify-between">
                    <span>Propietario Principal</span>
                    <span className="text-[10px] text-amber-400 font-normal">Rol protegido no modificable</span>
                  </div>
                ) : (
                  <select
                    value={formData.role}
                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                  >
                    {Object.entries(ROLE_CONFIGS).map(([key, config]) => (
                      <option key={key} value={key} disabled={!planLimits?.allowedRoles?.includes(key) || key === 'owner'}>
                        {config.label} {!planLimits?.allowedRoles?.includes(key) ? '(Requiere Plan Sup.)' : ''}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {formData.role === 'staff' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">PIN de 4 Dígitos</label>
                  <input
                    type="text"
                    maxLength={4}
                    value={formData.pinCode}
                    onChange={e => setFormData({ ...formData, pinCode: e.target.value.replace(/\D/g, '') })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono font-bold tracking-widest text-center focus:outline-none focus:border-amber-500"
                  />
                </div>
              )}

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-1/2 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
                >
                  {isSubmitting ? 'Guardando...' : 'Actualizar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Upsell si se supera límite */}
      {showUpsellModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 rounded-3xl border border-amber-500/30 p-6 text-center space-y-4 shadow-2xl relative animate-fadeIn">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/30">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-playfair">Amplía tu Equipo en Volum</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {upsellMessage}
            </p>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left text-xs space-y-1.5 text-slate-300">
              <div className="font-bold text-amber-400 mb-1">Beneficios al actualizar de plan:</div>
              <div>• Hasta 25 colaboradores o ilimitados en Cadenas.</div>
              <div>• Multi-sucursal y asignación de colaboradores por sede (Plan Franquicias).</div>
              <div>• Bitácora de auditoría histórica con trazabilidad de seguridad.</div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setShowUpsellModal(false)}
                className="w-1/2 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Entendido
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowUpsellModal(false);
                  if (onNavigateToBilling) onNavigateToBilling();
                }}
                className="w-1/2 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/20 hover:brightness-110"
              >
                Ver Planes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
