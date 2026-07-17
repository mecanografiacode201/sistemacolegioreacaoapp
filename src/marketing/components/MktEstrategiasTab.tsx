import React, { useState } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Layers, 
  Globe, 
  Instagram, 
  Facebook, 
  Video, 
  Linkedin, 
  MessageSquare, 
  Search,
  Calendar
} from 'lucide-react';
import { MktEstrategia, MktChannelType } from '../types';

interface MktEstrategiasTabProps {
  estrategias: MktEstrategia[];
  onAdd: (item: Omit<MktEstrategia, 'id'>) => Promise<void>;
  onEdit: (item: MktEstrategia) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function MktEstrategiasTab({
  estrategias,
  onAdd,
  onEdit,
  onDelete
}: MktEstrategiasTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MktEstrategia | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [objective, setObjective] = useState('');
  const [channel, setChannel] = useState<MktChannelType>('instagram');
  const [frequency, setFrequency] = useState('Semanal');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [observations, setObservations] = useState('');

  const [activeChannelFilter, setActiveChannelFilter] = useState<string>('all');

  const channelsList: { val: MktChannelType; label: string; color: string }[] = [
    { val: 'instagram', label: 'Instagram', color: 'bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-500 text-white' },
    { val: 'facebook', label: 'Facebook', color: 'bg-blue-600 text-white' },
    { val: 'tiktok', label: 'TikTok', color: 'bg-black text-white border border-white/20' },
    { val: 'youtube', label: 'YouTube', color: 'bg-red-600 text-white' },
    { val: 'linkedin', label: 'LinkedIn', color: 'bg-blue-700 text-white' },
    { val: 'whatsapp', label: 'WhatsApp', color: 'bg-green-600 text-white' },
    { val: 'site', label: 'Site Institucional', color: 'bg-teal-600 text-white' },
    { val: 'google', label: 'Google Ads / SEO', color: 'bg-amber-600 text-white' }
  ];

  const handleOpenAdd = () => {
    setEditingItem(null);
    setName('');
    setObjective('');
    setChannel('instagram');
    setFrequency('Semanal');
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate('');
    setObservations('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: MktEstrategia) => {
    setEditingItem(item);
    setName(item.name);
    setObjective(item.objective);
    setChannel(item.channel);
    setFrequency(item.frequency);
    setStartDate(item.startDate);
    setEndDate(item.endDate);
    setObservations(item.observations);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name,
      objective,
      channel,
      frequency,
      startDate,
      endDate,
      observations
    };

    if (editingItem) {
      await onEdit({ ...data, id: editingItem.id });
    } else {
      await onAdd(data);
    }
    setIsModalOpen(false);
  };

  const getChannelIcon = (ch: MktChannelType) => {
    switch (ch) {
      case 'instagram':
        return <Instagram size={14} />;
      case 'facebook':
        return <Facebook size={14} />;
      case 'whatsapp':
        return <MessageSquare size={14} />;
      case 'youtube':
      case 'tiktok':
        return <Video size={14} />;
      case 'linkedin':
        return <Linkedin size={14} />;
      default:
        return <Globe size={14} />;
    }
  };

  const filteredEstrategias = activeChannelFilter === 'all' 
    ? estrategias 
    : estrategias.filter(e => e.channel === activeChannelFilter);

  return (
    <div className="space-y-6">
      
      {/* Header and filter bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="text-[#f5c518]" size={20} />
            Estratégias de Divulgação
          </h2>
          <p className="text-xs text-gray-400">Ative e filtre planos de marketing integrados multicanais</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-[#f5c518] hover:bg-[#e2b516] text-black font-bold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-[#f5c518]/10 flex items-center gap-2 text-sm self-start sm:self-auto cursor-pointer"
        >
          <Plus size={18} />
          Nova Estratégia
        </button>
      </div>

      {/* Filter channel tags */}
      <div className="flex flex-wrap gap-1.5 border-b border-white/5 pb-4">
        <button
          onClick={() => setActiveChannelFilter('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${activeChannelFilter === 'all' ? 'bg-[#f5c518] text-black' : 'bg-white/5 text-gray-400 hover:text-white'}`}
        >
          Todos os Canais
        </button>
        {channelsList.map((ch) => {
          const count = estrategias.filter(e => e.channel === ch.val).length;
          return (
            <button
              key={ch.val}
              onClick={() => setActiveChannelFilter(ch.val)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${activeChannelFilter === ch.val ? 'bg-white text-black' : 'bg-white/5 text-gray-400 hover:text-white'}`}
            >
              {getChannelIcon(ch.val)}
              {ch.label}
              {count > 0 && <span className="bg-white/10 text-gray-300 text-[10px] px-1.5 py-0.5 rounded-full">{count}</span>}
            </button>
          );
        })}
      </div>

      {/* Grid of strategies */}
      {filteredEstrategias.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl bg-[#18181b]/50">
          <Layers size={48} className="mx-auto text-gray-600 mb-3" />
          <h3 className="text-base font-semibold text-white">Nenhuma estratégia encontrada</h3>
          <p className="text-xs text-gray-400 mt-1">Nenhum plano ativo para este filtro de canal de mídia.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredEstrategias.map((item) => {
            const chanInfo = channelsList.find(c => c.val === item.channel) || { label: item.channel, color: 'bg-gray-600' };
            return (
              <div 
                key={item.id} 
                className="bg-[#18181b] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all flex flex-col justify-between shadow-lg"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide flex items-center gap-1 uppercase ${chanInfo.color}`}>
                      {getChannelIcon(item.channel)}
                      {chanInfo.label}
                    </span>
                    <span className="text-gray-500 text-[10px] font-mono">{item.id}</span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-white leading-snug">{item.name}</h4>
                    <p className="text-xs text-gray-400 mt-2 line-clamp-3"><span className="text-gray-500 font-semibold">Objetivo:</span> {item.objective}</p>
                  </div>

                  <div className="space-y-1 text-[11px] bg-black/20 p-3 rounded-xl border border-white/5">
                    <div className="flex justify-between text-gray-400">
                      <span>Frequência:</span>
                      <span className="text-white font-medium">{item.frequency}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Período:</span>
                      <span className="text-white font-medium">
                        {item.startDate ? new Date(item.startDate).toLocaleDateString('pt-BR') : 'Início'} {item.endDate ? `até ${new Date(item.endDate).toLocaleDateString('pt-BR')}` : '(Contínuo)'}
                      </span>
                    </div>
                  </div>

                  {item.observations && (
                    <p className="text-[11px] text-gray-400 italic">“{item.observations}”</p>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-white/5 pt-3 mt-4">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 text-blue-400 hover:text-white hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer"
                    title="Editar"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Excluir esta estratégia?')) {
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
            );
          })}
        </div>
      )}

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
              {editingItem ? 'Editar Estratégia' : 'Nova Estratégia'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  Nome da Estratégia
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Storytelling nos Stories com ex-alunos"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#f5c518] transition-all"
                />
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
                  placeholder="Ex: Humanizar a marca e gerar identificação com potenciais leads de ensino médio."
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#f5c518] transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Canal de Divulgação
                  </label>
                  <select
                    value={channel}
                    onChange={(e) => setChannel(e.target.value as MktChannelType)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#f5c518] transition-all"
                  >
                    <option value="instagram" className="bg-[#141416]">Instagram</option>
                    <option value="facebook" className="bg-[#141416]">Facebook</option>
                    <option value="tiktok" className="bg-[#141416]">TikTok</option>
                    <option value="youtube" className="bg-[#141416]">YouTube</option>
                    <option value="linkedin" className="bg-[#141416]">LinkedIn</option>
                    <option value="whatsapp" className="bg-[#141416]">WhatsApp</option>
                    <option value="site" className="bg-[#141416]">Site Institucional</option>
                    <option value="google" className="bg-[#141416]">Google Ads</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Frequência
                  </label>
                  <input
                    type="text"
                    required
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    placeholder="Ex: 3x por semana, Quinzenal"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#f5c518] transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Data Inicial
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#f5c518] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Data Final (Opcional)
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#f5c518] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  Observações de Apoio
                </label>
                <textarea
                  rows={2}
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  placeholder="Instruções sobre tom de voz, marcas cromáticas..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#f5c518] transition-all resize-none"
                />
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
