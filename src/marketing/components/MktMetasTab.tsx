import React, { useState } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Target, 
  User, 
  Calendar, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle 
} from 'lucide-react';
import { MktMeta } from '../types';

interface MktMetasTabProps {
  metas: MktMeta[];
  onAdd: (item: Omit<MktMeta, 'id'>) => Promise<void>;
  onEdit: (item: MktMeta) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function MktMetasTab({
  metas,
  onAdd,
  onEdit,
  onDelete
}: MktMetasTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MktMeta | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [month, setMonth] = useState('Janeiro');
  const [year, setYear] = useState('2026');
  const [responsible, setResponsible] = useState('');
  const [status, setStatus] = useState<'nao_iniciada' | 'em_andamento' | 'atingida' | 'nao_atingida'>('em_andamento');

  // Specific targets
  const [targetPosts, setTargetPosts] = useState(30);
  const [targetReels, setTargetReels] = useState(20);
  const [targetStories, setTargetStories] = useState(60);
  const [targetFollowers, setTargetFollowers] = useState(500);
  const [targetShares, setTargetShares] = useState(200);
  const [targetSaves, setTargetSaves] = useState(200);
  const [targetEngagementRate, setTargetEngagementRate] = useState(4.5);
  const [targetLeads, setTargetLeads] = useState(100);
  const [targetEnrollments, setTargetEnrollments] = useState(15);

  const monthsList = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const handleOpenAdd = () => {
    setEditingItem(null);
    setTitle('');
    setMonth(monthsList[new Date().getMonth()]);
    setYear('2026');
    setResponsible('');
    setStatus('em_andamento');
    setTargetPosts(30);
    setTargetReels(20);
    setTargetStories(60);
    setTargetFollowers(500);
    setTargetShares(200);
    setTargetSaves(200);
    setTargetEngagementRate(4.5);
    setTargetLeads(100);
    setTargetEnrollments(15);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: MktMeta) => {
    setEditingItem(item);
    setTitle(item.title);
    setMonth(item.month);
    setYear(item.year);
    setResponsible(item.responsible);
    setStatus(item.status);
    setTargetPosts(item.targetPosts);
    setTargetReels(item.targetReels);
    setTargetStories(item.targetStories);
    setTargetFollowers(item.targetFollowers);
    setTargetShares(item.targetShares);
    setTargetSaves(item.targetSaves);
    setTargetEngagementRate(item.targetEngagementRate);
    setTargetLeads(item.targetLeads);
    setTargetEnrollments(item.targetEnrollments);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      title,
      month,
      year,
      responsible,
      status,
      targetPosts: Number(targetPosts),
      targetReels: Number(targetReels),
      targetStories: Number(targetStories),
      targetFollowers: Number(targetFollowers),
      targetShares: Number(targetShares),
      targetSaves: Number(targetSaves),
      targetEngagementRate: Number(targetEngagementRate),
      targetLeads: Number(targetLeads),
      targetEnrollments: Number(targetEnrollments)
    };

    if (editingItem) {
      await onEdit({ ...data, id: editingItem.id });
    } else {
      await onAdd(data);
    }
    setIsModalOpen(false);
  };

  const getStatusBadge = (s: MktMeta['status']) => {
    const styles = {
      nao_iniciada: 'bg-gray-500/10 text-gray-400 border border-gray-500/20',
      em_andamento: 'bg-amber-500/10 text-[#f5c518] border border-[#f5c518]/20',
      atingida: 'bg-green-500/10 text-green-400 border border-green-500/20',
      nao_atingida: 'bg-red-500/10 text-red-400 border border-red-500/20'
    };

    const labels = {
      nao_iniciada: 'Não Iniciada',
      em_andamento: 'Em Progresso',
      atingida: 'Alcançada',
      nao_atingida: 'Não Atingida'
    };

    return (
      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles[s]}`}>
        {labels[s]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Target className="text-[#f5c518]" size={20} />
            Metas do Período (KPIs)
          </h2>
          <p className="text-xs text-gray-400">Defina os objetivos numéricos e acompanhe a equipe</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-[#f5c518] hover:bg-[#e2b516] text-black font-bold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-[#f5c518]/10 flex items-center gap-2 text-sm cursor-pointer"
        >
          <Plus size={18} />
          Criar Meta Mensal
        </button>
      </div>

      {/* Grid */}
      {metas.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl bg-[#18181b]/50">
          <Target size={48} className="mx-auto text-gray-600 mb-3" />
          <h3 className="text-base font-semibold text-white">Nenhuma meta cadastrada</h3>
          <p className="text-xs text-gray-400 mt-1">Crie as metas de performance para orientar o ritmo de postagens.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {metas.map((item) => (
            <div 
              key={item.id} 
              className="bg-[#18181b] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all flex flex-col justify-between shadow-lg"
            >
              <div className="space-y-4">
                
                {/* Upper bar */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-[#f5c518] tracking-widest bg-[#f5c518]/5 px-2.5 py-0.5 rounded border border-[#f5c518]/10">
                      {item.month} / {item.year}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-2 leading-tight">{item.title}</h3>
                  </div>
                  {getStatusBadge(item.status)}
                </div>

                {/* Sub-Target indicators with micro-progress look */}
                <div className="grid grid-cols-3 gap-3 border-t border-white/5 pt-4">
                  
                  <div className="bg-black/20 p-2.5 rounded-xl border border-white/5 text-center">
                    <span className="block text-[9px] uppercase font-bold text-gray-500">Mídias (P/R/S)</span>
                    <span className="text-sm font-extrabold text-white mt-0.5 block font-mono">
                      {item.targetPosts} / {item.targetReels} / {item.targetStories}
                    </span>
                  </div>

                  <div className="bg-black/20 p-2.5 rounded-xl border border-white/5 text-center">
                    <span className="block text-[9px] uppercase font-bold text-gray-500">Engajamento</span>
                    <span className="text-sm font-extrabold text-[#f5c518] mt-0.5 block font-mono">
                      {item.targetEngagementRate}%
                    </span>
                  </div>

                  <div className="bg-[#101012] p-2.5 rounded-xl border border-emerald-500/10 text-center">
                    <span className="block text-[9px] uppercase font-bold text-emerald-500">Matrículas</span>
                    <span className="text-sm font-extrabold text-emerald-400 mt-0.5 block font-mono">
                      {item.targetEnrollments}
                    </span>
                  </div>

                </div>

                {/* Extended Details */}
                <div className="space-y-1 text-xs text-gray-400 bg-black/10 p-3 rounded-xl">
                  <div className="flex justify-between">
                    <span>Meta de Leads (Mensagens):</span>
                    <span className="text-white font-medium">{item.targetLeads} novos leads</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Alvo de Crescimento (Seguidores):</span>
                    <span className="text-blue-400 font-medium">+{item.targetFollowers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Interações (Compart. / Salvos):</span>
                    <span className="text-purple-400 font-medium">{item.targetShares} / {item.targetSaves}</span>
                  </div>
                  <div className="flex justify-between border-t border-white/5 pt-1.5 mt-1.5">
                    <span>Responsável:</span>
                    <span className="text-white flex items-center gap-1">
                      <User size={11} className="text-gray-500" />
                      {item.responsible}
                    </span>
                  </div>
                </div>

              </div>

              {/* Action Operations */}
              <div className="flex items-center justify-end gap-2 border-t border-white/5 pt-3 mt-4 shrink-0">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="p-1.5 text-blue-400 hover:text-white hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer"
                  title="Editar"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Deseja excluir esta meta?')) {
                      onDelete(item.id);
                    }
                  }}
                  className="p-1.5 text-red-400 hover:text-white hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                  title="Excluir"
                >
                  <Trash2 size={14} />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Modal - Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-[#141416] border border-white/10 rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-white bg-white/5 rounded-full"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-bold text-white mb-4">
              {editingItem ? 'Editar Meta Mensal' : 'Nova Meta Mensal'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  Título da Meta
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Meta de Captação e Conversão de Inverno"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#f5c518] transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Mês
                  </label>
                  <select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#f5c518]"
                  >
                    {monthsList.map((m) => (
                      <option key={m} value={m} className="bg-[#141416]">{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Ano
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#f5c518]"
                  >
                    <option value="2026" className="bg-[#141416]">2026</option>
                    <option value="2027" className="bg-[#141416]">2027</option>
                  </select>
                </div>
              </div>

              {/* Target items counts */}
              <div className="grid grid-cols-3 gap-4 bg-black/10 p-3.5 rounded-xl border border-white/5">
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Meta Posts Estáticos
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={targetPosts}
                    onChange={(e) => setTargetPosts(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Meta Reels
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={targetReels}
                    onChange={(e) => setTargetReels(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Meta Stories
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={targetStories}
                    onChange={(e) => setTargetStories(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* Conversion targets */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1 text-blue-400">
                    Novos Seguidores
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={targetFollowers}
                    onChange={(e) => setTargetFollowers(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Compartilhamentos
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={targetShares}
                    onChange={(e) => setTargetShares(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Salvamentos
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={targetSaves}
                    onChange={(e) => setTargetSaves(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1 text-[#f5c518]">
                    Engajamento Alvo %
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    min="0"
                    value={targetEngagementRate}
                    onChange={(e) => setTargetEngagementRate(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-[#f5c518] text-xs focus:outline-none focus:border-[#f5c518]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1 text-purple-400">
                    Mensagens / Leads
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={targetLeads}
                    onChange={(e) => setTargetLeads(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1 text-emerald-400">
                    Novas Matrículas
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={targetEnrollments}
                    onChange={(e) => setTargetEnrollments(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-emerald-400 text-xs focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Responsável Geral
                  </label>
                  <input
                    type="text"
                    required
                    value={responsible}
                    onChange={(e) => setResponsible(e.target.value)}
                    placeholder="Ex: Arthur Ribeiro"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#f5c518]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Status Inicial
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#f5c518]"
                  >
                    <option value="nao_iniciada" className="bg-[#141416]">Não Iniciada</option>
                    <option value="em_andamento" className="bg-[#141416]">Em Progresso</option>
                    <option value="atingida" className="bg-[#141416]">Alcançada</option>
                    <option value="nao_atingida" className="bg-[#141416]">Não Atingida</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-2 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-white/5 hover:bg-white/10 text-gray-300 font-bold px-5 py-2.5 rounded-xl transition-all border border-white/10 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#f5c518] hover:bg-[#e2b516] text-black font-bold px-6 py-2.5 rounded-xl transition-all shadow-lg cursor-pointer"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
