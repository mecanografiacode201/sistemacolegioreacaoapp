/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  ClipboardList, 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  DollarSign, 
  Clock, 
  AlertCircle, 
  ThumbsUp, 
  Check, 
  X, 
  Briefcase,
  Layers,
  ArrowRight,
  Info
} from 'lucide-react';
import { Necessidade, UserSession } from '../types';

interface OSNecessidadesProps {
  necessidades: Necessidade[];
  user: UserSession;
  onAddNecessidade: (nec: Omit<Necessidade, 'id' | 'openingDate'>) => void;
  onUpdateNecessidade: (nec: Necessidade) => void;
  onDeleteNecessidade: (id: string) => void;
}

export default function OSNecessidades({
  necessidades,
  user,
  onAddNecessidade,
  onUpdateNecessidade,
  onDeleteNecessidade
}: OSNecessidadesProps) {
  const isGuest = user.role === 'guest';
  const isAdminOrSuper = user.role === 'admin' || user.role === 'super_admin';

  // State Management
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedNec, setSelectedNec] = useState<Necessidade | null>(null);

  // Form States (New / Edit)
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('Escritório');
  const [quantity, setQuantity] = useState(1);
  const [priority, setPriority] = useState<'baixa' | 'media' | 'alta' | 'critica'>('media');
  const [requester, setRequester] = useState(user.name || '');
  const [department, setDepartment] = useState('');
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [observations, setObservations] = useState('');
  const [status, setStatus] = useState<Necessidade['status']>('pendente');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Open Add Modal
  const handleOpenAddModal = () => {
    setItemName('');
    setCategory('Escritório');
    setQuantity(1);
    setPriority('media');
    setRequester(user.name || '');
    setDepartment('');
    setEstimatedCost(0);
    setObservations('');
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (nec: Necessidade) => {
    setSelectedNec(nec);
    setItemName(nec.itemName);
    setCategory(nec.category);
    setQuantity(nec.quantity);
    setPriority(nec.priority);
    setRequester(nec.requester);
    setDepartment(nec.department);
    setEstimatedCost(nec.estimatedCost);
    setObservations(nec.observations || '');
    setStatus(nec.status);
    setIsEditModalOpen(true);
  };

  // Handle Submit Create
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim() || quantity <= 0) {
      alert('Por favor, preencha o nome do item e a quantidade corretamente.');
      return;
    }
    onAddNecessidade({
      itemName,
      category,
      quantity,
      priority,
      requester,
      department: department || 'Geral',
      estimatedCost,
      status: 'pendente',
      observations
    });
    setIsAddModalOpen(false);
  };

  // Handle Submit Edit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNec) return;
    if (!itemName.trim() || quantity <= 0) {
      alert('Por favor, preencha o nome do item e a quantidade corretamente.');
      return;
    }

    const updated: Necessidade = {
      ...selectedNec,
      itemName,
      category,
      quantity,
      priority,
      requester,
      department: department || 'Geral',
      estimatedCost,
      status,
      observations,
      closingDate: (status === 'comprado' || status === 'rejeitado') ? new Date().toLocaleDateString('pt-BR') : undefined
    };

    onUpdateNecessidade(updated);
    setIsEditModalOpen(false);
    setSelectedNec(null);
  };

  // Quick Action: Update Status (Direct in main dashboard for admins)
  const handleQuickStatusChange = (nec: Necessidade, newStatus: Necessidade['status']) => {
    if (isGuest) return;
    const updated: Necessidade = {
      ...nec,
      status: newStatus,
      closingDate: (newStatus === 'comprado' || newStatus === 'rejeitado') ? new Date().toLocaleDateString('pt-BR') : undefined
    };
    onUpdateNecessidade(updated);
  };

  // Filtering calculations
  const filteredNecessidades = useMemo(() => {
    return necessidades.filter(nec => {
      const matchesSearch = 
        nec.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        nec.requester.toLowerCase().includes(searchQuery.toLowerCase()) ||
        nec.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        nec.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = categoryFilter === 'all' || nec.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || nec.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || nec.priority === priorityFilter;

      return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
    });
  }, [necessidades, searchQuery, categoryFilter, statusFilter, priorityFilter]);

  // Statistics & KPI calculations
  const stats = useMemo(() => {
    const total = necessidades.length;
    const pending = necessidades.filter(n => n.status === 'pendente').length;
    const approved = necessidades.filter(n => n.status === 'aprovado' || n.status === 'comprado').length;
    
    // Sum estimated cost of all approved or purchased needs
    const totalCost = necessidades
      .filter(n => n.status !== 'rejeitado')
      .reduce((acc, curr) => acc + (curr.estimatedCost * curr.quantity), 0);

    return { total, pending, approved, totalCost };
  }, [necessidades]);

  // Category labels and colors helper
  const getCategoryBadgeColor = (cat: string) => {
    switch (cat) {
      case 'Escritório': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Manutenção': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Limpeza': return 'bg-teal-500/10 text-teal-400 border-teal-500/20';
      case 'TI': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  // Priority colors helper
  const getPriorityBadgeColor = (prio: string) => {
    switch (prio) {
      case 'critica': return 'bg-red-500/10 text-red-500 border-red-500/20 font-bold animate-pulse';
      case 'alta': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'media': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  // Status badges helper
  const getStatusBadge = (status: Necessidade['status']) => {
    switch (status) {
      case 'pendente':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">🕒 Pendente</span>;
      case 'em_cotacao':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">📊 Em Cotação</span>;
      case 'aprovado':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">✓ Aprovado</span>;
      case 'comprado':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">🛒 Comprado</span>;
      case 'rejeitado':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">✕ Rejeitado</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
      
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-[#18181b] p-5 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-[#f5c518]">
            <ClipboardList size={20} />
          </div>
          <div>
            <span className="text-[10px] text-[#a1a1aa] uppercase font-bold tracking-wider">Total de Pedidos</span>
            <h3 className="text-xl font-black text-white mt-0.5">{stats.total}</h3>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-[#18181b] p-5 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500">
            <Clock size={20} />
          </div>
          <div>
            <span className="text-[10px] text-[#a1a1aa] uppercase font-bold tracking-wider">Aguardando Aprovação</span>
            <h3 className="text-xl font-black text-white mt-0.5">{stats.pending}</h3>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-[#18181b] p-5 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ThumbsUp size={20} />
          </div>
          <div>
            <span className="text-[10px] text-[#a1a1aa] uppercase font-bold tracking-wider">Aprovados / Adquiridos</span>
            <h3 className="text-xl font-black text-white mt-0.5">{stats.approved}</h3>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-[#18181b] p-5 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#f5c518]/10 border border-[#f5c518]/20 flex items-center justify-center text-[#f5c518]">
            <DollarSign size={20} />
          </div>
          <div>
            <span className="text-[10px] text-[#a1a1aa] uppercase font-bold tracking-wider">Investimento Estimado</span>
            <h3 className="text-xl font-black text-white mt-0.5">
              R$ {stats.totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
          </div>
        </div>
      </div>

      {/* Main Panel */}
      <div className="bg-[#18181b] rounded-2xl border border-white/10 overflow-hidden">
        
        {/* Controls / Filter Bar */}
        <div className="p-5 border-b border-white/10 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                <Search size={16} />
              </span>
              <input
                type="text"
                placeholder="Buscar item, solicitante ou setor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#f5c518] focus:border-[#f5c518] transition-all"
              />
            </div>
            
            <button
              onClick={handleOpenAddModal}
              className="bg-[#f5c518] hover:bg-amber-400 text-black font-bold text-xs px-5 py-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-500/5 active:scale-95 shrink-0"
            >
              <Plus size={16} />
              Nova Necessidade
            </button>
          </div>

          {/* Quick Dropdown Filters */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="flex items-center gap-2 text-[#a1a1aa] text-xs">
              <Filter size={14} />
              <span>Filtros:</span>
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-black/30 text-xs text-gray-300 border border-white/10 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#f5c518] cursor-pointer"
            >
              <option value="all">Todas Categorias</option>
              <option value="Escritório">Escritório</option>
              <option value="Manutenção">Manutenção</option>
              <option value="Limpeza">Limpeza</option>
              <option value="TI">TI</option>
              <option value="Outros">Outros</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-black/30 text-xs text-gray-300 border border-white/10 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#f5c518] cursor-pointer"
            >
              <option value="all">Todos Status</option>
              <option value="pendente">Pendente</option>
              <option value="em_cotacao">Em Cotação</option>
              <option value="aprovado">Aprovado</option>
              <option value="comprado">Comprado</option>
              <option value="rejeitado">Rejeitado</option>
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-black/30 text-xs text-gray-300 border border-white/10 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#f5c518] cursor-pointer"
            >
              <option value="all">Todas Prioridades</option>
              <option value="critica">Crítica</option>
              <option value="alta">Alta</option>
              <option value="media">Média</option>
              <option value="baixa">Baixa</option>
            </select>

            {/* Clear Filters Button */}
            {(categoryFilter !== 'all' || statusFilter !== 'all' || priorityFilter !== 'all' || searchQuery !== '') && (
              <button
                onClick={() => {
                  setCategoryFilter('all');
                  setStatusFilter('all');
                  setPriorityFilter('all');
                  setSearchQuery('');
                }}
                className="text-[10px] text-[#f5c518] hover:underline px-2 cursor-pointer font-semibold"
              >
                Limpar Filtros
              </button>
            )}
          </div>
        </div>

        {/* List Table */}
        <div className="overflow-x-auto">
          {filteredNecessidades.length === 0 ? (
            <div className="p-12 text-center text-gray-400 space-y-3">
              <ClipboardList size={44} className="mx-auto text-gray-600" />
              <p className="text-xs font-medium">Nenhum pedido de necessidade encontrado.</p>
              <p className="text-[10px] text-[#a1a1aa]">Tente redefinir seus filtros ou cadastre um novo material necessário.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-black/30 border-b border-white/5 text-[10px] uppercase font-bold tracking-wider text-gray-400">
                  <th className="py-3.5 px-5">ID</th>
                  <th className="py-3.5 px-4">Item Necessário</th>
                  <th className="py-3.5 px-4">Categoria</th>
                  <th className="py-3.5 px-4 text-center">Quant.</th>
                  <th className="py-3.5 px-4">Setor / Solicitante</th>
                  <th className="py-3.5 px-4">Prioridade</th>
                  <th className="py-3.5 px-4">Investimento Est.</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs">
                {filteredNecessidades.map((nec) => {
                  const itemTotalCost = nec.estimatedCost * nec.quantity;
                  return (
                    <tr 
                      key={nec.id} 
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="py-4 px-5 font-mono text-[10px] font-bold text-gray-400">{nec.id}</td>
                      <td className="py-4 px-4 font-medium text-white max-w-[200px] truncate">
                        <div className="flex flex-col">
                          <span>{nec.itemName}</span>
                          {nec.observations && (
                            <span className="text-[10px] text-gray-500 font-normal truncate max-w-[180px]">
                              {nec.observations}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-block border px-2 py-0.5 rounded-md text-[10px] font-semibold ${getCategoryBadgeColor(nec.category)}`}>
                          {nec.category}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center font-bold text-white bg-black/10">{nec.quantity}</td>
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-200">{nec.department}</span>
                          <span className="text-[10px] text-[#a1a1aa]">{nec.requester}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-block border px-2 py-0.5 rounded-md text-[10px] font-semibold ${getPriorityBadgeColor(nec.priority)}`}>
                          {nec.priority.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-semibold text-gray-200">
                        R$ {itemTotalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        <div className="text-[9px] text-[#a1a1aa] font-normal">R$ {nec.estimatedCost}/un</div>
                      </td>
                      <td className="py-4 px-4">{getStatusBadge(nec.status)}</td>
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick Actions (Inline approve/reject) */}
                          {!isGuest && nec.status === 'pendente' && (
                            <>
                              <button
                                onClick={() => handleQuickStatusChange(nec, 'aprovado')}
                                className="p-1.5 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500 hover:text-black rounded-lg text-emerald-400 transition-all cursor-pointer"
                                title="Aprovar Solicitação"
                              >
                                <Check size={12} />
                              </button>
                              <button
                                onClick={() => handleQuickStatusChange(nec, 'rejeitado')}
                                className="p-1.5 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500 hover:text-black rounded-lg text-rose-400 transition-all cursor-pointer"
                                title="Recusar Solicitação"
                              >
                                <X size={12} />
                              </button>
                            </>
                          )}
                          
                          {/* Standard edit button */}
                          <button
                            onClick={() => handleOpenEditModal(nec)}
                            className="p-1.5 bg-black/40 border border-white/10 hover:border-[#f5c518] hover:text-[#f5c518] rounded-lg text-gray-300 transition-all cursor-pointer"
                            title="Editar Necessidade"
                          >
                            <Edit3 size={13} />
                          </button>

                          {/* Delete button (All authenticated users) */}
                          {!isGuest && (
                            deleteConfirmId === nec.id ? (
                              <div className="flex items-center gap-1 bg-rose-950/40 border border-rose-500/30 p-1 rounded-lg">
                                <button
                                  onClick={() => {
                                    onDeleteNecessidade(nec.id);
                                    setDeleteConfirmId(null);
                                  }}
                                  className="px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white text-[11px] font-semibold rounded transition-all cursor-pointer"
                                  title="Confirmar exclusão"
                                >
                                  Excluir
                                </button>
                                <button
                                  onClick={() => setDeleteConfirmId(null)}
                                  className="px-2 py-0.5 bg-white/10 hover:bg-white/20 text-gray-300 text-[11px] font-medium rounded transition-all cursor-pointer"
                                  title="Cancelar"
                                >
                                  Cancelar
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeleteConfirmId(nec.id)}
                                className="p-1.5 bg-rose-500/10 border border-rose-500/20 hover:bg-red-600 hover:text-white rounded-lg text-rose-400 transition-all cursor-pointer"
                                title="Excluir Registro"
                              >
                                <Trash2 size={13} />
                              </button>
                            )
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Info Section for Operations */}
      <div className="bg-amber-500/5 p-4 rounded-xl border border-amber-500/10 flex gap-3 text-xs leading-relaxed text-amber-200">
        <Info size={16} className="text-[#f5c518] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">Regras do Fluxo de Compras & Necessidades</p>
          <p className="text-[#a1a1aa] text-[11px]">
            Qualquer funcionário ou coordenador pode cadastrar uma <strong>Necessidade de Material</strong> no sistema. O status inicial será <span className="text-yellow-500 font-bold">Pendente</span>. Os Administradores analisarão o pedido para alterar para <span className="text-indigo-400 font-bold">Em Cotação</span>, <span className="text-emerald-400 font-bold">Aprovado</span> ou <span className="text-rose-400 font-bold">Rejeitado</span>. Quando a compra for finalmente efetuada e entregue na instituição, o status será marcado como <span className="text-blue-400 font-bold">Comprado</span> para o controle de almoxarifado escolar.
          </p>
        </div>
      </div>

      {/* MODAL: ADD REQUISITION */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#18181b] rounded-2xl border border-white/10 w-full max-w-lg overflow-hidden shadow-2xl text-left">
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <ClipboardList size={18} className="text-[#f5c518]" />
                <h3 className="font-bold text-white text-sm">Registrar Necessidade de Material</h3>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Item Name */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-[10px] text-gray-400 uppercase font-semibold">Nome do Item / Material *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Resmas de Papel, Lâmpadas, Switch 8 Portas"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-[#f5c518]"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 uppercase font-semibold">Categoria</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-[#f5c518] cursor-pointer"
                  >
                    <option value="Escritório">Escritório</option>
                    <option value="Manutenção">Manutenção</option>
                    <option value="Limpeza">Limpeza</option>
                    <option value="TI">TI</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>

                {/* Quantity */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 uppercase font-semibold">Quantidade Requerida *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-[#f5c518]"
                  />
                </div>

                {/* Priority */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 uppercase font-semibold">Prioridade</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-[#f5c518] cursor-pointer"
                  >
                    <option value="baixa">Baixa</option>
                    <option value="media">Média</option>
                    <option value="alta">Alta</option>
                    <option value="critica">Crítica (Urgência Máxima)</option>
                  </select>
                </div>

                {/* Estimated Unit Cost */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 uppercase font-semibold">Preço Unitário Estimado (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    min={0}
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-[#f5c518]"
                  />
                </div>

                {/* Requester */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 uppercase font-semibold">Nome do Solicitante</label>
                  <input
                    type="text"
                    value={requester}
                    onChange={(e) => setRequester(e.target.value)}
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-[#f5c518]"
                  />
                </div>

                {/* Department */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 uppercase font-semibold">Setor / Destino do Material *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Coordenação Bloco A, Secretaria Geral"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-[#f5c518]"
                  />
                </div>

                {/* Observations */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-[10px] text-gray-400 uppercase font-semibold">Justificativa / Observações</label>
                  <textarea
                    rows={3}
                    placeholder="Detalhe o motivo do pedido, especificações técnicas se houver..."
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-[#f5c518] resize-none"
                  />
                </div>
              </div>

              {/* Cost Summary Preview */}
              <div className="p-3 bg-black/50 rounded-xl border border-white/5 flex items-center justify-between">
                <span className="text-[#a1a1aa] font-semibold text-[10px]">CUSTO ESTIMADO TOTAL</span>
                <span className="text-base font-black text-[#f5c518]">
                  R$ {(estimatedCost * quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-transparent hover:bg-white/5 rounded-xl border border-white/10 text-gray-300 font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#f5c518] hover:bg-amber-400 text-black font-bold rounded-xl cursor-pointer"
                >
                  Salvar Pedido
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT / APPROVE REQUISITION */}
      {isEditModalOpen && selectedNec && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#18181b] rounded-2xl border border-white/10 w-full max-w-lg overflow-hidden shadow-2xl text-left">
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Edit3 size={18} className="text-[#f5c518]" />
                <h3 className="font-bold text-white text-sm">Atualizar Necessidade {selectedNec.id}</h3>
              </div>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Item Name */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-[10px] text-gray-400 uppercase font-semibold">Nome do Item / Material *</label>
                  <input
                    type="text"
                    required
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-[#f5c518]"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 uppercase font-semibold">Categoria</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-[#f5c518] cursor-pointer"
                  >
                    <option value="Escritório">Escritório</option>
                    <option value="Manutenção">Manutenção</option>
                    <option value="Limpeza">Limpeza</option>
                    <option value="TI">TI</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>

                {/* Quantity */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 uppercase font-semibold">Quantidade Requerida *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-[#f5c518]"
                  />
                </div>

                {/* Priority */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 uppercase font-semibold">Prioridade</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-[#f5c518] cursor-pointer"
                  >
                    <option value="baixa">Baixa</option>
                    <option value="media">Média</option>
                    <option value="alta">Alta</option>
                    <option value="critica">Crítica (Urgência Máxima)</option>
                  </select>
                </div>

                {/* Estimated Unit Cost */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 uppercase font-semibold">Preço Unitário Estimado (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    min={0}
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-[#f5c518]"
                  />
                </div>

                {/* Requester */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 uppercase font-semibold">Nome do Solicitante</label>
                  <input
                    type="text"
                    value={requester}
                    onChange={(e) => setRequester(e.target.value)}
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-[#f5c518]"
                  />
                </div>

                {/* Department */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 uppercase font-semibold">Setor / Destino do Material *</label>
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-[#f5c518]"
                  />
                </div>

                {/* Status Selection (Visible to all but only modifiable by registered users) */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-[10px] text-gray-400 uppercase font-semibold">Status de Aprovação / Compra</label>
                  <select
                    value={status}
                    disabled={isGuest}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-[#f5c518] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="pendente">🕒 Pendente</option>
                    <option value="em_cotacao">📊 Em Cotação</option>
                    <option value="aprovado">✓ Aprovado para Compra</option>
                    <option value="comprado">🛒 Comprado / Almoxarifado</option>
                    <option value="rejeitado">✕ Rejeitado / Descartado</option>
                  </select>
                  {isGuest && (
                    <span className="text-[10px] text-gray-500 leading-normal block pt-1">
                      * No modo demonstração de visitante, a alteração de status está desabilitada.
                    </span>
                  )}
                </div>

                {/* Observations */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-[10px] text-gray-400 uppercase font-semibold">Justificativa / Observações</label>
                  <textarea
                    rows={3}
                    placeholder="Detalhe o motivo do pedido..."
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-[#f5c518] resize-none"
                  />
                </div>
              </div>

              {/* Cost Summary Preview */}
              <div className="p-3 bg-black/50 rounded-xl border border-white/5 flex items-center justify-between">
                <span className="text-[#a1a1aa] font-semibold text-[10px]">CUSTO ESTIMADO TOTAL</span>
                <span className="text-base font-black text-[#f5c518]">
                  R$ {(estimatedCost * quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedNec(null);
                  }}
                  className="px-4 py-2 bg-transparent hover:bg-white/5 rounded-xl border border-white/10 text-gray-300 font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#f5c518] hover:bg-amber-400 text-black font-bold rounded-xl cursor-pointer"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
