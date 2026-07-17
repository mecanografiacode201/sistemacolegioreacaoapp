import React, { useState } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  BarChart2, 
  PlusCircle, 
  TrendingUp, 
  ArrowUpRight,
  BookOpen,
  Calendar,
  FileText
} from 'lucide-react';
import { MktRelatorio } from '../types';

interface MktRelatoriosTabProps {
  relatorios: MktRelatorio[];
  onAdd: (item: Omit<MktRelatorio, 'id'>) => Promise<void>;
  onEdit: (item: MktRelatorio) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function MktRelatoriosTab({
  relatorios,
  onAdd,
  onEdit,
  onDelete
}: MktRelatoriosTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MktRelatorio | null>(null);

  // Form states
  const [month, setMonth] = useState('Janeiro');
  const [year, setYear] = useState('2026');
  const [postsCount, setPostsCount] = useState(0);
  const [reelsCount, setReelsCount] = useState(0);
  const [storiesCount, setStoriesCount] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState(0);
  const [shares, setShares] = useState(0);
  const [saves, setSaves] = useState(0);
  const [reach, setReach] = useState(0);
  const [impressions, setImpressions] = useState(0);
  const [engagementRate, setEngagementRate] = useState(0);
  const [clicks, setClicks] = useState(0);
  const [conversions, setConversions] = useState(0);
  const [newStudents, setNewStudents] = useState(0);
  const [observations, setObservations] = useState('');

  const monthsList = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const handleOpenAdd = () => {
    setEditingItem(null);
    setMonth(monthsList[new Date().getMonth()]);
    setYear('2026');
    setPostsCount(0);
    setReelsCount(0);
    setStoriesCount(0);
    setFollowersCount(8000);
    setLikes(0);
    setComments(0);
    setShares(0);
    setSaves(0);
    setReach(0);
    setImpressions(0);
    setEngagementRate(4.2);
    setClicks(0);
    setConversions(0);
    setNewStudents(0);
    setObservations('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: MktRelatorio) => {
    setEditingItem(item);
    setMonth(item.month);
    setYear(item.year);
    setPostsCount(item.postsCount);
    setReelsCount(item.reelsCount);
    setStoriesCount(item.storiesCount);
    setFollowersCount(item.followersCount);
    setLikes(item.likes);
    setComments(item.comments);
    setShares(item.shares);
    setSaves(item.saves);
    setReach(item.reach);
    setImpressions(item.impressions);
    setEngagementRate(item.engagementRate);
    setClicks(item.clicks);
    setConversions(item.conversions);
    setNewStudents(item.newStudents);
    setObservations(item.observations || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      month,
      year,
      postsCount: Number(postsCount),
      reelsCount: Number(reelsCount),
      storiesCount: Number(storiesCount),
      followersCount: Number(followersCount),
      likes: Number(likes),
      comments: Number(comments),
      shares: Number(shares),
      saves: Number(saves),
      reach: Number(reach),
      impressions: Number(impressions),
      engagementRate: Number(engagementRate),
      clicks: Number(clicks),
      conversions: Number(conversions),
      newStudents: Number(newStudents),
      observations
    };

    if (editingItem) {
      await onEdit({ ...data, id: editingItem.id });
    } else {
      await onAdd(data);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart2 className="text-[#f5c518]" size={20} />
            Relatórios Mensais de Métricas
          </h2>
          <p className="text-xs text-gray-400">Consolidação manual das métricas nativas do Instagram</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-[#f5c518] hover:bg-[#e2b516] text-black font-bold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-[#f5c518]/10 flex items-center gap-2 text-sm cursor-pointer"
        >
          <PlusCircle size={18} />
          Lançar Métricas Mensais
        </button>
      </div>

      {/* History table */}
      {relatorios.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl bg-[#18181b]/50">
          <BarChart2 size={48} className="mx-auto text-gray-600 mb-3" />
          <h3 className="text-base font-semibold text-white">Nenhum relatório lançado</h3>
          <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">Lance as métricas do mês anterior para alimentar os gráficos do painel de controle e monitorar o ROI escolar.</p>
        </div>
      ) : (
        <div className="bg-[#18181b] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-black/30 text-gray-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4 font-bold">Mês/Ano</th>
                  <th className="p-4 font-bold">Seguidores</th>
                  <th className="p-4 font-bold">Formatos (P/R/S)</th>
                  <th className="p-4 font-bold">Alcance / Imp.</th>
                  <th className="p-4 font-bold">Engajamento</th>
                  <th className="p-4 font-bold">Cliques / Conv.</th>
                  <th className="p-4 font-bold text-[#f5c518]">Novos Alunos</th>
                  <th className="p-4 font-bold text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {relatorios.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors text-white">
                    <td className="p-4 font-bold flex items-center gap-1.5">
                      <Calendar size={14} className="text-[#f5c518]" />
                      {item.month} de {item.year}
                    </td>
                    <td className="p-4 font-semibold font-mono text-blue-400">
                      {item.followersCount.toLocaleString()}
                    </td>
                    <td className="p-4 text-gray-300">
                      <span className="font-bold">{item.postsCount}</span> p | <span className="font-bold">{item.reelsCount}</span> r | <span className="font-bold">{item.storiesCount}</span> s
                    </td>
                    <td className="p-4 text-gray-400">
                      {item.reach.toLocaleString()} / <span className="text-[10px]">{item.impressions.toLocaleString()}</span>
                    </td>
                    <td className="p-4 font-bold text-[#f5c518]">
                      {item.engagementRate}%
                    </td>
                    <td className="p-4 text-gray-300">
                      {item.clicks} / <span className="text-green-400 font-semibold">{item.conversions}</span>
                    </td>
                    <td className="p-4 font-bold text-lg text-emerald-400 font-mono">
                      {item.newStudents}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1 text-blue-400 hover:text-white hover:bg-blue-500/10 rounded"
                          title="Editar"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Deseja excluir este relatório?')) {
                              onDelete(item.id);
                            }
                          }}
                          className="p-1 text-red-400 hover:text-white hover:bg-red-500/10 rounded"
                          title="Excluir"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal - Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-[#141416] border border-white/10 rounded-2xl w-full max-w-xl p-6 max-h-[95vh] overflow-y-auto custom-scrollbar shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-white bg-white/5 rounded-full"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-bold text-white mb-4">
              {editingItem ? 'Editar Lançamento de Métricas' : 'Novo Lançamento de Métricas'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Period selection */}
              <div className="grid grid-cols-2 gap-4 bg-black/20 p-3.5 rounded-xl border border-white/5">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Mês do Relatório
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

              {/* Counts section */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Posts Estáticos
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={postsCount}
                    onChange={(e) => setPostsCount(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#f5c518]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Reels (Vídeos)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={reelsCount}
                    onChange={(e) => setReelsCount(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#f5c518]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Stories Lançados
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={storiesCount}
                    onChange={(e) => setStoriesCount(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#f5c518]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1 text-blue-400">
                    Total Seguidores
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={followersCount}
                    onChange={(e) => setFollowersCount(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#f5c518]"
                  />
                </div>
              </div>

              {/* Interactions */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Curtidas
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={likes}
                    onChange={(e) => setLikes(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#f5c518]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Comentários
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={comments}
                    onChange={(e) => setComments(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#f5c518]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Compartilhamentos
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={shares}
                    onChange={(e) => setShares(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#f5c518]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Salvamentos
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={saves}
                    onChange={(e) => setSaves(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#f5c518]"
                  />
                </div>
              </div>

              {/* Reach & Conversion */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Alcance (Contas)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={reach}
                    onChange={(e) => setReach(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#f5c518]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Impressões
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={impressions}
                    onChange={(e) => setImpressions(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#f5c518]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1 text-[#f5c518]">
                    Taxa Engajamento %
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    min="0"
                    value={engagementRate}
                    onChange={(e) => setEngagementRate(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-[#f5c518] focus:outline-none focus:border-[#f5c518]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Cliques na Bio
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={clicks}
                    onChange={(e) => setClicks(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#f5c518]"
                  />
                </div>
              </div>

              {/* Conversions and Students */}
              <div className="grid grid-cols-2 gap-4 bg-[#f5c518]/5 border border-[#f5c518]/10 p-4 rounded-xl">
                <div>
                  <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                    Total Mensagens / Conversões (Leads)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={conversions}
                    onChange={(e) => setConversions(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#f5c518]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
                    Novos Alunos Matriculados (Instagram)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={newStudents}
                    onChange={(e) => setNewStudents(Number(e.target.value))}
                    className="w-full bg-[#101012] border border-emerald-500/20 text-emerald-400 font-bold rounded-xl px-4 py-2.5 focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  Observações Gerais / Análise do Mês
                </label>
                <textarea
                  rows={2}
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  placeholder="Ex: Tivemos um boom no Reels do experimento de química, o que gerou mais mensagens..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#f5c518] resize-none"
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
