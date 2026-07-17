import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  X, 
  Trash2, 
  Layers, 
  Image, 
  Video, 
  Play, 
  Check, 
  Clock, 
  Heart,
  ExternalLink
} from 'lucide-react';
import { MktCalendario, MktQuadro, MktMediaType } from '../types';

interface MktCalendarioTabProps {
  calendarios: MktCalendario[];
  quadros: MktQuadro[];
  onAdd: (item: Omit<MktCalendario, 'id'>) => Promise<void>;
  onEdit: (item: MktCalendario) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function MktCalendarioTab({
  calendarios,
  quadros,
  onAdd,
  onEdit,
  onDelete
}: MktCalendarioTabProps) {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MktCalendario | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [quadroId, setQuadroId] = useState('');
  const [type, setType] = useState<MktMediaType>('post');
  const [objective, setObjective] = useState('');
  const [caption, setCaption] = useState('');
  const [cta, setCta] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [artUrl, setArtUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [status, setStatus] = useState<'agendado' | 'publicado' | 'cancelado'>('agendado');

  const monthsList = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const currentYear = currentDate.getFullYear();
  const currentMonthIndex = currentDate.getMonth();

  // Calendar calculations
  const daysInMonth = useMemo(() => {
    return new Date(currentYear, currentMonthIndex + 1, 0).getDate();
  }, [currentYear, currentMonthIndex]);

  const firstDayIndex = useMemo(() => {
    // 0 = Sunday, 1 = Monday ... 6 = Saturday
    const index = new Date(currentYear, currentMonthIndex, 1).getDay();
    // Shift index so Monday is first (optional, let's keep Sunday=0 as standard)
    return index;
  }, [currentYear, currentMonthIndex]);

  const prevMonthDays = useMemo(() => {
    return new Date(currentYear, currentMonthIndex, 0).getDate();
  }, [currentYear, currentMonthIndex]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonthIndex - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonthIndex + 1, 1));
  };

  // Format date helper: YYYY-MM-DD
  const formatDateString = (day: number) => {
    const mm = String(currentMonthIndex + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${currentYear}-${mm}-${dd}`;
  };

  // Group items by date for rapid lookup
  const itemsByDate = useMemo(() => {
    const acc: Record<string, MktCalendario[]> = {};
    calendarios.forEach(item => {
      if (!acc[item.date]) {
        acc[item.date] = [];
      }
      acc[item.date].push(item);
    });
    return acc;
  }, [calendarios]);

  const handleOpenAdd = (dayStr: string) => {
    setSelectedDay(dayStr);
    setEditingItem(null);
    setTitle('');
    setDescription('');
    // Auto-select first active show if available
    setQuadroId(quadros[0]?.name || '');
    setType('post');
    setObjective('');
    setCaption('');
    setCta('');
    setHashtags('#colegioreacao #educacao #brasilia');
    setArtUrl('');
    setVideoUrl('');
    setStatus('agendado');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: MktCalendario, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering day cell click
    setEditingItem(item);
    setSelectedDay(item.date);
    setTitle(item.title);
    setDescription(item.description);
    setQuadroId(item.quadroId);
    setType(item.type);
    setObjective(item.objective);
    setCaption(item.caption);
    setCta(item.cta);
    setHashtags(item.hashtags);
    setArtUrl(item.artUrl || '');
    setVideoUrl(item.videoUrl || '');
    setStatus(item.status);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDay) return;

    const data = {
      date: selectedDay,
      title,
      description,
      quadroId,
      type,
      objective,
      caption,
      cta,
      hashtags,
      artUrl,
      videoUrl,
      status
    };

    if (editingItem) {
      await onEdit({ ...data, id: editingItem.id });
    } else {
      await onAdd(data);
    }
    setIsModalOpen(false);
  };

  const getTypeBadgeStyles = (t: MktMediaType) => {
    switch (t) {
      case 'post':
        return 'bg-pink-500/10 text-pink-400 border border-pink-500/20';
      case 'reels':
        return 'bg-red-500/10 text-red-400 border border-red-500/20';
      case 'story':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'carrossel':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'live':
        return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
    }
  };

  // Generate calendar grid array
  const gridCells = useMemo(() => {
    const cells = [];
    
    // Previous month filler days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      cells.push({
        day: prevMonthDays - i,
        isCurrentMonth: false,
        dateStr: ''
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      cells.push({
        day: i,
        isCurrentMonth: true,
        dateStr: formatDateString(i)
      });
    }

    // Next month filler days (to complete week grid of 42 cells or 35 cells)
    const totalSlots = cells.length > 35 ? 42 : 35;
    const nextDaysFillerCount = totalSlots - cells.length;
    for (let i = 1; i <= nextDaysFillerCount; i++) {
      cells.push({
        day: i,
        isCurrentMonth: false,
        dateStr: ''
      });
    }

    return cells;
  }, [daysInMonth, firstDayIndex, prevMonthDays, currentMonthIndex, currentYear]);

  return (
    <div className="space-y-6">
      
      {/* Calendar Header Control */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CalendarIcon className="text-[#f5c518]" size={20} />
            Calendário Editorial
          </h2>
          <p className="text-xs text-gray-400">Planeje, visualize e publique sua pauta do mês</p>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center gap-2 bg-[#18181b] border border-white/5 rounded-xl p-1.5 self-start sm:self-auto shadow-md">
          <button
            onClick={handlePrevMonth}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm font-bold text-white px-3 select-none">
            {monthsList[currentMonthIndex]} de {currentYear}
          </span>
          <button
            onClick={handleNextMonth}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Week days titles */}
      <div className="grid grid-cols-7 gap-1 md:gap-2 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
        <div>Dom</div>
        <div>Seg</div>
        <div>Ter</div>
        <div>Qua</div>
        <div>Qui</div>
        <div>Sex</div>
        <div>Sáb</div>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1.5 md:gap-2.5">
        {gridCells.map((cell, idx) => {
          const dayItems = cell.isCurrentMonth ? (itemsByDate[cell.dateStr] || []) : [];
          return (
            <div
              key={idx}
              onClick={() => cell.isCurrentMonth && handleOpenAdd(cell.dateStr)}
              className={`min-h-[100px] md:min-h-[120px] rounded-2xl border p-2 flex flex-col justify-between transition-all group relative cursor-pointer
                ${cell.isCurrentMonth 
                  ? 'bg-[#18181b] border-white/5 hover:border-[#f5c518]/20' 
                  : 'bg-black/10 border-transparent text-gray-700 pointer-events-none'}`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold ${cell.isCurrentMonth ? 'text-gray-400 group-hover:text-white' : 'text-gray-700'}`}>
                  {cell.day}
                </span>
                
                {/* Plus add button visible on hover */}
                {cell.isCurrentMonth && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenAdd(cell.dateStr);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-[#f5c518] bg-[#f5c518]/10 hover:bg-[#f5c518]/20 rounded transition-all shrink-0 cursor-pointer"
                    title="Novo Post"
                  >
                    <Plus size={12} />
                  </button>
                )}
              </div>

              {/* Day Items List Container */}
              <div className="flex-1 mt-1.5 space-y-1 overflow-y-auto max-h-[80px] custom-scrollbar">
                {dayItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={(e) => handleOpenEdit(item, e)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-medium leading-normal flex items-center justify-between border transition-all hover:scale-103
                      ${getTypeBadgeStyles(item.type)} 
                      ${item.status === 'publicado' ? 'opacity-90 saturate-120' : 'opacity-80'}`}
                    title={`${item.type.toUpperCase()}: ${item.title}`}
                  >
                    <span className="truncate max-w-[80%]">
                      {item.title}
                    </span>
                    {item.status === 'publicado' && <Check size={10} className="text-green-400 shrink-0 ml-1" />}
                    {item.status === 'cancelado' && <span className="text-red-400 shrink-0 ml-1 text-[8px] font-bold">X</span>}
                  </div>
                ))}
              </div>

            </div>
          );
        })}
      </div>

      {/* Modal - Add / Edit Calendar Item */}
      {isModalOpen && selectedDay && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-[#141416] border border-white/10 rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-white bg-white/5 rounded-full"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-bold text-white mb-2">
              {editingItem ? 'Editar Postagem' : 'Agendar Postagem'}
            </h3>
            <p className="text-xs text-gray-400 mb-4 font-semibold">
              Data: {new Date(selectedDay + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Título do Post
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Curiosidade sobre a Revolução Industrial"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#f5c518] transition-all"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Formato de Mídia
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as MktMediaType)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#f5c518] transition-all"
                  >
                    <option value="post" className="bg-[#141416]">Post Estático</option>
                    <option value="reels" className="bg-[#141416]">Reels / Vídeo Curto</option>
                    <option value="story" className="bg-[#141416]">Story / Stories</option>
                    <option value="carrossel" className="bg-[#141416]">Carrossel</option>
                    <option value="live" className="bg-[#141416]">Live / Transmissão</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  Descrição / Briefing do Conteúdo
                </label>
                <textarea
                  required
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Instruções para o roteiro, estética visual ou designer..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#f5c518] transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Quadro do Instagram
                  </label>
                  <select
                    value={quadroId}
                    onChange={(e) => setQuadroId(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#f5c518] transition-all"
                  >
                    <option value="" className="bg-[#141416]">Nenhum / Customizado</option>
                    {quadros.map((q) => (
                      <option key={q.id} value={q.name} className="bg-[#141416]">
                        {q.name}
                      </option>
                    ))}
                  </select>
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
                    placeholder="Ex: Cliques no Link da Bio, Branding"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#f5c518] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  Legenda da Postagem
                </label>
                <textarea
                  rows={3}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Digite o copy final da publicação aqui..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#f5c518] transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Chamada para Ação (CTA)
                  </label>
                  <input
                    type="text"
                    value={cta}
                    onChange={(e) => setCta(e.target.value)}
                    placeholder="Ex: Clique no link da bio e matricule-se!"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#f5c518] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Hashtags
                  </label>
                  <input
                    type="text"
                    value={hashtags}
                    onChange={(e) => setHashtags(e.target.value)}
                    placeholder="#enem #educacao #colegioreacao"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#f5c518] transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Arte (URL da Imagem / Canva)
                  </label>
                  <input
                    type="text"
                    value={artUrl}
                    onChange={(e) => setArtUrl(e.target.value)}
                    placeholder="Link da imagem ou projeto no Canva"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#f5c518] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Vídeo (URL do Vídeo / Drive)
                  </label>
                  <input
                    type="text"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="Link do bruto ou editado no GDrive"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#f5c518] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  Status de Publicação
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setStatus('agendado')}
                    className={`py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer
                      ${status === 'agendado' 
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                        : 'bg-black/20 text-gray-500 border-white/5 hover:text-gray-300'}`}
                  >
                    Agendado
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('publicado')}
                    className={`py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer
                      ${status === 'publicado' 
                        ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                        : 'bg-black/20 text-gray-500 border-white/5 hover:text-gray-300'}`}
                  >
                    Publicado
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('cancelado')}
                    className={`py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer
                      ${status === 'cancelado' 
                        ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                        : 'bg-black/20 text-gray-500 border-white/5 hover:text-gray-300'}`}
                  >
                    Cancelar
                  </button>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-3 border-t border-white/5">
                {editingItem && (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Deseja excluir este agendamento?')) {
                        onDelete(editingItem.id);
                        setIsModalOpen(false);
                      }
                    }}
                    className="mr-auto bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold px-4 py-2.5 rounded-xl transition-all border border-red-500/10 cursor-pointer flex items-center gap-1.5 text-xs"
                  >
                    <Trash2 size={14} />
                    Excluir
                  </button>
                )}
                
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-white/5 hover:bg-white/10 text-gray-300 font-bold px-5 py-2.5 rounded-xl transition-all border border-white/10 cursor-pointer"
                >
                  Voltar
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
