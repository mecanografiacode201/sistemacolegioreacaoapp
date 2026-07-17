import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Search, 
  Star, 
  Sparkles, 
  Layers, 
  User, 
  Tag, 
  CheckCircle, 
  Flame,
  Lightbulb
} from 'lucide-react';
import { MktIdeia, MktQuadro } from '../types';

interface MktIdeiasTabProps {
  ideias: MktIdeia[];
  quadros: MktQuadro[];
  onAdd: (item: Omit<MktIdeia, 'id'>) => Promise<void>;
  onEdit: (item: MktIdeia) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onToggleFavorite: (id: string) => Promise<void>;
}

export default function MktIdeiasTab({
  ideias,
  quadros,
  onAdd,
  onEdit,
  onDelete,
  onToggleFavorite
}: MktIdeiasTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MktIdeia | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Matrículas');
  const [quadroId, setQuadroId] = useState('');
  const [priority, setPriority] = useState<'baixa' | 'media' | 'alta'>('media');
  const [responsible, setResponsible] = useState('');
  const [status, setStatus] = useState<'rascunho' | 'aprovado' | 'arquivado'>('rascunho');
  const [tagsInput, setTagsInput] = useState('');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const handleOpenAdd = () => {
    setEditingItem(null);
    setTitle('');
    setDescription('');
    setCategory('Institucional');
    setQuadroId(quadros[0]?.name || '');
    setPriority('media');
    setResponsible('');
    setStatus('rascunho');
    setTagsInput('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: MktIdeia) => {
    setEditingItem(item);
    setTitle(item.title);
    setDescription(item.description);
    setCategory(item.category);
    setQuadroId(item.quadroId);
    setPriority(item.priority);
    setResponsible(item.responsible);
    setStatus(item.status);
    setTagsInput(item.tags?.join(', ') || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArray = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const data = {
      title,
      description,
      category,
      quadroId,
      priority,
      responsible,
      status,
      tags: tagsArray,
      isFavorite: editingItem ? editingItem.isFavorite : false
    };

    if (editingItem) {
      await onEdit({ ...data, id: editingItem.id });
    } else {
      await onAdd(data);
    }
    setIsModalOpen(false);
  };

  // Memoized search & filter logic
  const filteredIdeias = useMemo(() => {
    return ideias.filter(item => {
      const matchesSearch = 
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesFavorite = !showOnlyFavorites || item.isFavorite;
      const matchesPriority = priorityFilter === 'all' || item.priority === priorityFilter;

      return matchesSearch && matchesFavorite && matchesPriority;
    });
  }, [ideias, searchQuery, showOnlyFavorites, priorityFilter]);

  const getPriorityStyles = (p: MktIdeia['priority']) => {
    switch (p) {
      case 'alta':
        return 'text-red-400 bg-red-500/10 border border-red-500/20';
      case 'media':
        return 'text-[#f5c518] bg-amber-500/10 border border-amber-500/20';
      default:
        return 'text-green-400 bg-green-500/10 border border-green-500/20';
    }
  };

  const getStatusBadge = (s: MktIdeia['status']) => {
    switch (s) {
      case 'aprovado':
        return 'bg-green-500/10 text-green-400 border border-green-500/20';
      case 'arquivado':
        return 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
      default:
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Lightbulb className="text-[#f5c518]" size={20} />
            Banco de Ideias
          </h2>
          <p className="text-xs text-gray-400">Pense à frente: colete insumos e ideias criativas para postagens futuras</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-[#f5c518] hover:bg-[#e2b516] text-black font-bold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-[#f5c518]/10 flex items-center gap-2 text-sm self-start sm:self-auto cursor-pointer"
        >
          <Plus size={18} />
          Injetar Ideia
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-[#18181b] border border-white/5 rounded-2xl p-4">
        
        {/* Search */}
        <div className="relative col-span-1 sm:col-span-2">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar por título, tag ou categoria..."
            className="w-full bg-black/40 border border-white/5 hover:border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[#f5c518] transition-all"
          />
        </div>

        {/* Priority Filter */}
        <div>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full bg-black/40 border border-white/5 rounded-xl px-3 py-2 text-xs text-gray-400 focus:outline-none focus:border-[#f5c518]"
          >
            <option value="all">Todas as Prioridades</option>
            <option value="alta">Alta Prioridade</option>
            <option value="media">Média Prioridade</option>
            <option value="baixa">Baixa Prioridade</option>
          </select>
        </div>

        {/* Favorites Switch */}
        <div>
          <button
            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
            className={`w-full text-xs font-semibold py-2 rounded-xl flex items-center justify-center gap-2 border cursor-pointer transition-all
              ${showOnlyFavorites 
                ? 'bg-amber-500/10 border-amber-500/20 text-[#f5c518]' 
                : 'bg-black/20 border-white/5 text-gray-400 hover:text-white'}`}
          >
            <Star size={14} className={showOnlyFavorites ? 'fill-[#f5c518]' : ''} />
            Apenas Favoritos
          </button>
        </div>

      </div>

      {/* Ideas list */}
      {filteredIdeias.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl bg-[#18181b]/50">
          <Lightbulb size={48} className="mx-auto text-gray-600 mb-3" />
          <h3 className="text-base font-semibold text-white">Nenhuma ideia encontrada</h3>
          <p className="text-xs text-gray-400 mt-1">Experimente mudar seus filtros ou injete uma nova ideia acima.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredIdeias.map((item) => (
            <div 
              key={item.id} 
              className="bg-[#18181b] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all flex flex-col justify-between shadow-lg relative group"
            >
              <div className="space-y-3.5">
                
                {/* Header row */}
                <div className="flex items-start justify-between gap-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getPriorityStyles(item.priority)}`}>
                    Prioridade {item.priority}
                  </span>
                  
                  {/* Star Favoriting */}
                  <button
                    onClick={() => onToggleFavorite(item.id)}
                    className="p-1 text-gray-500 hover:text-[#f5c518] transition-colors cursor-pointer"
                    title={item.isFavorite ? "Remover dos favoritos" : "Favoritar"}
                  >
                    <Star size={18} className={item.isFavorite ? 'fill-[#f5c518] text-[#f5c518]' : ''} />
                  </button>
                </div>

                {/* Main Body */}
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-[#f5c518] transition-colors">{item.title}</h3>
                  <p className="text-xs text-gray-400 mt-2 line-clamp-3 leading-relaxed">{item.description}</p>
                </div>

                {/* Sub Metadata tags */}
                <div className="space-y-1.5 text-xs text-gray-300 border-t border-white/5 pt-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-gray-500 w-16">Categoria:</span>
                    <span className="text-white">{item.category}</span>
                  </div>
                  {item.quadroId && (
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-gray-500 w-16">Quadro:</span>
                      <span className="text-amber-400 font-medium">{item.quadroId}</span>
                    </div>
                  )}
                  {item.responsible && (
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-gray-500 w-16">Sugerido por:</span>
                      <span className="text-blue-400">{item.responsible}</span>
                    </div>
                  )}
                </div>

                {/* Tag pill badges */}
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {item.tags.map((tg, idx) => (
                      <span key={idx} className="bg-white/5 border border-white/5 text-[9px] text-gray-400 px-2 py-0.5 rounded">
                        #{tg}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action operations footer */}
              <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-4 shrink-0">
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase ${getStatusBadge(item.status)}`}>
                  {item.status}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 text-blue-400 hover:text-white hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer"
                    title="Editar"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Excluir esta ideia do banco de ideias?')) {
                        onDelete(item.id);
                      }
                    }}
                    className="p-1.5 text-red-400 hover:text-white hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                    title="Excluir"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

            </div>
          ))}
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
              {editingItem ? 'Editar Ideia' : 'Nova Ideia Criativa'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  Título da Ideia
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Mostrar os laboratórios de robótica no Reels"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#f5c518] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  Descrição / Conteúdo Básico
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva a ideia em poucas linhas..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#f5c518] transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Categoria
                  </label>
                  <input
                    type="text"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Ex: Eventos, Pedagógico"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#f5c518]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Associar ao Quadro
                  </label>
                  <select
                    value={quadroId}
                    onChange={(e) => setQuadroId(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#f5c518] transition-all"
                  >
                    <option value="" className="bg-[#141416]">Nenhum</option>
                    {quadros.map((q) => (
                      <option key={q.id} value={q.name} className="bg-[#141416]">
                        {q.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Prioridade
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-[#f5c518]"
                  >
                    <option value="alta" className="bg-[#141416]">Alta</option>
                    <option value="media" className="bg-[#141416]">Média</option>
                    <option value="baixa" className="bg-[#141416]">Baixa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Sugerido por
                  </label>
                  <input
                    type="text"
                    required
                    value={responsible}
                    onChange={(e) => setResponsible(e.target.value)}
                    placeholder="Arthur"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-[#f5c518]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-[#f5c518]"
                  >
                    <option value="rascunho" className="bg-[#141416]">Rascunho</option>
                    <option value="aprovado" className="bg-[#141416]">Aprovado</option>
                    <option value="arquivado" className="bg-[#141416]">Arquivado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  Tags (Separadas por vírgula)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Ex: robotica, matricula, marketing"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#f5c518] transition-all"
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
