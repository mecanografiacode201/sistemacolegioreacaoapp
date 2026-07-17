import React, { useState } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Copy, 
  X, 
  Sparkles, 
  Check, 
  Clock, 
  Users, 
  Bookmark,
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';
import { MktQuadro } from '../types';

interface MktQuadrosTabProps {
  quadros: MktQuadro[];
  onAdd: (item: Omit<MktQuadro, 'id' | 'postCount'>) => Promise<void>;
  onEdit: (item: MktQuadro) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onDuplicate: (item: MktQuadro) => Promise<void>;
}

export default function MktQuadrosTab({
  quadros,
  onAdd,
  onEdit,
  onDelete,
  onDuplicate
}: MktQuadrosTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MktQuadro | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [objective, setObjective] = useState('');
  const [frequency, setFrequency] = useState('Semanal');
  const [dayOfWeek, setDayOfWeek] = useState('Segunda-feira');
  const [time, setTime] = useState('18:00');
  const [targetAudience, setTargetAudience] = useState('Alunos e Pais');
  const [category, setCategory] = useState('Educacional');
  const [status, setStatus] = useState<'ativo' | 'pausado'>('ativo');

  const daysList = [
    'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 
    'Sexta-feira', 'Sábado', 'Domingo', 'Todos', 'Flexível'
  ];

  const handleOpenAdd = () => {
    setEditingItem(null);
    setName('');
    setDescription('');
    setObjective('');
    setFrequency('Semanal');
    setDayOfWeek('Segunda-feira');
    setTime('18:00');
    setTargetAudience('Alunos e Pais');
    setCategory('Educacional');
    setStatus('ativo');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: MktQuadro) => {
    setEditingItem(item);
    setName(item.name);
    setDescription(item.description);
    setObjective(item.objective);
    setFrequency(item.frequency);
    setDayOfWeek(item.dayOfWeek);
    setTime(item.time);
    setTargetAudience(item.targetAudience);
    setCategory(item.category);
    setStatus(item.status);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name,
      description,
      objective,
      frequency,
      dayOfWeek,
      time,
      targetAudience,
      category,
      status
    };

    if (editingItem) {
      await onEdit({ ...data, id: editingItem.id, postCount: editingItem.postCount });
    } else {
      await onAdd(data);
    }
    setIsModalOpen(false);
  };

  const handleToggleStatus = async (item: MktQuadro) => {
    const nextStatus = item.status === 'ativo' ? 'pausado' : 'ativo';
    await onEdit({ ...item, status: nextStatus });
  };

  return (
    <div className="space-y-6">
      
      {/* Header and counter */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="text-[#f5c518]" size={20} />
            Quadros do Instagram (Linhas Editoriais)
          </h2>
          <p className="text-xs text-gray-400">Linha contínua de blocos temáticos pedagógicos e de engajamento</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-[#f5c518] hover:bg-[#e2b516] text-black font-bold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-[#f5c518]/10 flex items-center gap-2 text-sm cursor-pointer"
        >
          <Plus size={18} />
          Criar Quadro
        </button>
      </div>

      {/* Grid of editorial shows */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quadros.map((item) => {
          const isActive = item.status === 'ativo';
          return (
            <div 
              key={item.id} 
              className={`border rounded-2xl p-5 hover:border-white/10 transition-all flex flex-col justify-between shadow-lg relative overflow-hidden
                ${isActive ? 'bg-[#18181b] border-white/5' : 'bg-[#121214] border-white/5 opacity-65'}`}
            >
              
              {/* Colored left bar indicator */}
              <div className={`absolute top-0 left-0 w-1.5 h-full ${isActive ? 'bg-[#f5c518]' : 'bg-gray-600'}`} />

              <div className="space-y-3.5 pl-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-gray-500 uppercase">{item.id}</span>
                    <h3 className="text-lg font-bold text-white leading-tight mt-1">{item.name}</h3>
                  </div>
                  
                  {/* Status badge and simple toggle */}
                  <button 
                    onClick={() => handleToggleStatus(item)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase transition-colors shrink-0 cursor-pointer
                      ${isActive ? 'bg-[#f5c518]/10 text-[#f5c518] hover:bg-[#f5c518]/20' : 'bg-white/5 text-gray-500 hover:bg-white/10'}`}
                  >
                    {isActive ? 'Ativo' : 'Pausado'}
                  </button>
                </div>

                <p className="text-xs text-gray-400 leading-relaxed min-h-[36px] line-clamp-2">{item.description}</p>

                {/* Meta list */}
                <div className="space-y-1.5 text-xs text-gray-300 border-t border-white/5 pt-2.5">
                  <div className="flex items-start gap-1.5">
                    <span className="font-semibold text-gray-500 shrink-0 w-20">Objetivo:</span>
                    <span className="line-clamp-1">{item.objective}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-400 mt-2 bg-black/10 p-2 rounded-lg">
                    <div>
                      <span className="block text-[9px] uppercase font-bold text-gray-500">Agenda</span>
                      <span className="text-white flex items-center gap-1 mt-0.5 font-medium">
                        <Clock size={11} className="text-[#f5c518]" />
                        {item.dayOfWeek} às {item.time}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[9px] uppercase font-bold text-gray-500">Público</span>
                      <span className="text-white flex items-center gap-1 mt-0.5 font-medium">
                        <Users size={11} className="text-blue-400" />
                        {item.targetAudience}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer counter and actions */}
              <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-4 pl-2 shrink-0">
                
                {/* Real count of published items */}
                <div className="flex items-center gap-1">
                  <span className="text-[11px] text-gray-500 font-semibold uppercase">Posts Realizados:</span>
                  <span className="bg-[#f5c518]/10 text-[#f5c518] px-2 py-0.5 rounded-full text-xs font-bold font-mono">
                    {item.postCount || 0}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onDuplicate(item)}
                    className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                    title="Duplicar quadro"
                  >
                    <Copy size={14} />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 text-blue-400 hover:text-white hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer"
                    title="Editar"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Tem certeza de que deseja excluir este quadro?')) {
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

            </div>
          );
        })}
      </div>

      {/* Modal - Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-[#141416] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-white bg-white/5 rounded-full"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-bold text-white mb-4">
              {editingItem ? 'Editar Quadro' : 'Novo Quadro'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  Nome do Quadro (Ex: 🧠 Perguntas Nível ENEM)
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: 🎯 Erro Comum"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#f5c518] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  Descrição
                </label>
                <textarea
                  required
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Resumo do tipo de assunto tratado..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#f5c518] transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  Objetivo Principal
                </label>
                <input
                  type="text"
                  required
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  placeholder="Ex: Engajamento nas caixas de perguntas, retenção de leads."
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#f5c518] transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Frequência
                  </label>
                  <input
                    type="text"
                    required
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    placeholder="Ex: Semanal, Diário"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#f5c518] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Categoria
                  </label>
                  <input
                    type="text"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Ex: Pedagógico, Interativo"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#f5c518] transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Dia da Semana
                  </label>
                  <select
                    value={dayOfWeek}
                    onChange={(e) => setDayOfWeek(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-[#f5c518] transition-all"
                  >
                    {daysList.map((d) => (
                      <option key={d} value={d} className="bg-[#141416]">
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Horário
                  </label>
                  <input
                    type="text"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="18:00"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs placeholder:text-gray-600 focus:outline-none focus:border-[#f5c518] transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Público-Alvo
                  </label>
                  <input
                    type="text"
                    required
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="Alunos, Pais"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#f5c518] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Status Inicial
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#f5c518] transition-all"
                  >
                    <option value="ativo" className="bg-[#141416]">Ativo</option>
                    <option value="pausado" className="bg-[#141416]">Pausado</option>
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
