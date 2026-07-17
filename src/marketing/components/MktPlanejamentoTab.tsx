import React, { useState } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Copy, 
  X, 
  Calendar, 
  CheckCircle, 
  AlertCircle, 
  User, 
  ChevronRight,
  TrendingUp,
  FileText
} from 'lucide-react';
import { MktPlanejamento } from '../types';

interface MktPlanejamentoTabProps {
  planejamentos: MktPlanejamento[];
  onAdd: (item: Omit<MktPlanejamento, 'id'>) => Promise<void>;
  onEdit: (item: MktPlanejamento) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onDuplicate: (item: MktPlanejamento) => Promise<void>;
}

export default function MktPlanejamentoTab({
  planejamentos,
  onAdd,
  onEdit,
  onDelete,
  onDuplicate
}: MktPlanejamentoTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MktPlanejamento | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [month, setMonth] = useState('Janeiro');
  const [year, setYear] = useState('2026');
  const [objective, setObjective] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [goal, setGoal] = useState('');
  const [responsible, setResponsible] = useState('');
  const [status, setStatus] = useState<'planejado' | 'em_andamento' | 'concluido' | 'cancelado'>('planejado');
  const [observations, setObservations] = useState('');

  const monthsList = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const handleOpenAdd = () => {
    setEditingItem(null);
    setName('');
    setMonth(monthsList[new Date().getMonth()]);
    setYear('2026');
    setObjective('');
    setTargetAudience('');
    setGoal('');
    setResponsible('');
    setStatus('planejado');
    setObservations('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: MktPlanejamento) => {
    setEditingItem(item);
    setName(item.name);
    setMonth(item.month);
    setYear(item.year);
    setObjective(item.objective);
    setTargetAudience(item.targetAudience);
    setGoal(item.goal);
    setResponsible(item.responsible);
    setStatus(item.status);
    setObservations(item.observations);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name,
      month,
      year,
      objective,
      targetAudience,
      goal,
      responsible,
      status,
      observations
    };

    if (editingItem) {
      await onEdit({ ...data, id: editingItem.id });
    } else {
      await onAdd(data);
    }
    setIsModalOpen(false);
  };

  const getStatusBadge = (s: MktPlanejamento['status']) => {
    const styles = {
      planejado: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
      em_andamento: 'bg-amber-500/10 text-[#f5c518] border border-[#f5c518]/20',
      concluido: 'bg-green-500/10 text-green-400 border border-green-500/20',
      cancelado: 'bg-red-500/10 text-red-400 border border-red-500/20'
    };

    const labels = {
      planejado: 'Planejado',
      em_andamento: 'Em Andamento',
      concluido: 'Concluído',
      cancelado: 'Cancelado'
    };

    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${styles[s]}`}>
        {labels[s]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Header section with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="text-[#f5c518]" size={20} />
            Planejamentos Mensais
          </h2>
          <p className="text-xs text-gray-400">Gerencie objetivos estratégicos por período escolar</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-[#f5c518] hover:bg-[#e2b516] text-black font-bold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-[#f5c518]/10 flex items-center gap-2 text-sm cursor-pointer"
        >
          <Plus size={18} />
          Criar Planejamento
        </button>
      </div>

      {/* Main List */}
      {planejamentos.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl bg-[#18181b]/50">
          <Calendar size={48} className="mx-auto text-gray-600 mb-3" />
          <h3 className="text-base font-semibold text-white">Nenhum planejamento cadastrado</h3>
          <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">Adicione um novo planejamento mensal para organizar as metas e o público do Colégio Reação.</p>
          <button
            onClick={handleOpenAdd}
            className="mt-4 bg-white/5 hover:bg-white/10 text-white font-medium text-xs px-4 py-2 rounded-lg border border-white/10 transition-colors"
          >
            Adicionar primeiro item
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {planejamentos.map((item) => (
            <div 
              key={item.id} 
              className="bg-[#18181b] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all flex flex-col justify-between shadow-lg"
            >
              <div className="space-y-4">
                {/* Upper info row */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#f5c518] tracking-widest bg-[#f5c518]/5 px-2 py-0.5 rounded border border-[#f5c518]/10">
                      {item.month} / {item.year}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-2">{item.name}</h3>
                  </div>
                  {getStatusBadge(item.status)}
                </div>

                {/* Details Section */}
                <div className="space-y-2 text-xs border-t border-white/5 pt-3">
                  <div className="flex items-start gap-1.5 text-gray-300">
                    <span className="font-semibold text-gray-400 shrink-0 w-24">Objetivo:</span>
                    <span>{item.objective}</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-gray-300">
                    <span className="font-semibold text-gray-400 shrink-0 w-24">Público-Alvo:</span>
                    <span>{item.targetAudience}</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-gray-300">
                    <span className="font-semibold text-gray-400 shrink-0 w-24">Meta/KPI:</span>
                    <span className="text-amber-400 font-medium">{item.goal}</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-gray-300">
                    <span className="font-semibold text-gray-400 shrink-0 w-24">Responsável:</span>
                    <span className="flex items-center gap-1">
                      <User size={12} className="text-gray-500" />
                      {item.responsible}
                    </span>
                  </div>
                  {item.observations && (
                    <div className="bg-black/20 p-2.5 rounded-lg text-gray-400 text-[11px] mt-2 border border-white/5">
                      <span className="font-semibold text-gray-300 block mb-0.5">Observações:</span>
                      {item.observations}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions row */}
              <div className="flex items-center justify-end gap-2 border-t border-white/5 pt-3 mt-4 shrink-0">
                <button
                  onClick={() => onDuplicate(item)}
                  className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                  title="Duplicar planejamento"
                >
                  <Copy size={16} />
                </button>
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="p-2 text-blue-400 hover:text-white hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer"
                  title="Editar"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Tem certeza de que deseja excluir este planejamento?')) {
                      onDelete(item.id);
                    }
                  }}
                  className="p-2 text-red-400 hover:text-white hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                  title="Excluir"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal - Add / Edit Form */}
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
              {editingItem ? 'Editar Planejamento' : 'Novo Planejamento'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  Nome do Planejamento
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Campanha de Matrículas do Segundo Semestre"
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
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#f5c518] transition-all"
                  >
                    {monthsList.map((m) => (
                      <option key={m} value={m} className="bg-[#141416]">
                        {m}
                      </option>
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
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#f5c518] transition-all"
                  >
                    <option value="2026" className="bg-[#141416]">2026</option>
                    <option value="2027" className="bg-[#141416]">2027</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  Objetivo
                </label>
                <textarea
                  required
                  rows={2}
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  placeholder="Ex: Captar leads qualificados e reforçar credibilidade nas matérias exatas."
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#f5c518] transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  Público-Alvo
                </label>
                <input
                  type="text"
                  required
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="Ex: Pais de alunos do 9º ano e vestibulandos locais."
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#f5c518] transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Meta Principal
                  </label>
                  <input
                    type="text"
                    required
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="Ex: 150 novos leads e +10% engajamento"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#f5c518] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Responsável
                  </label>
                  <input
                    type="text"
                    required
                    value={responsible}
                    onChange={(e) => setResponsible(e.target.value)}
                    placeholder="Ex: Arthur Ribeiro"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#f5c518] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#f5c518] transition-all"
                >
                  <option value="planejado" className="bg-[#141416]">Planejado</option>
                  <option value="em_andamento" className="bg-[#141416]">Em Andamento</option>
                  <option value="concluido" className="bg-[#141416]">Concluído</option>
                  <option value="cancelado" className="bg-[#141416]">Cancelado</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  Observações
                </label>
                <textarea
                  rows={2}
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  placeholder="Alguma nota extra para a equipe..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#f5c518] transition-all resize-none"
                />
              </div>

              <div className="flex gap-3 justify-end pt-2 border-t border-white/5 shrink-0">
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
