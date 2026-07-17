import React from 'react';
import { 
  TrendingUp, 
  Calendar, 
  Layers, 
  Image, 
  Video, 
  Play, 
  Target, 
  Users, 
  Sparkles,
  BarChart2,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Award
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  AreaChart,
  Area
} from 'recharts';
import { 
  MktPlanejamento, 
  MktEstrategia, 
  MktQuadro, 
  MktCalendario, 
  MktRelatorio, 
  MktMeta 
} from '../types';

interface MktDashboardProps {
  planejamentos: MktPlanejamento[];
  estrategias: MktEstrategia[];
  quadros: MktQuadro[];
  calendarios: MktCalendario[];
  relatorios: MktRelatorio[];
  metas: MktMeta[];
}

export default function MktDashboard({
  planejamentos,
  estrategias,
  quadros,
  calendarios,
  relatorios,
  metas
}: MktDashboardProps) {
  
  // Calculate stats
  const activePlans = planejamentos.filter(p => p.status === 'em_andamento').length;
  const totalStrategies = estrategias.length;
  const activeQuadros = quadros.filter(q => q.status === 'ativo').length;
  
  const publishedPosts = calendarios.filter(c => c.type === 'post' && c.status === 'publicado').length;
  const publishedReels = calendarios.filter(c => c.type === 'reels' && c.status === 'publicado').length;
  const publishedStories = calendarios.filter(c => c.type === 'story' && c.status === 'publicado').length;
  const publishedOthers = calendarios.filter(c => (c.type === 'carrossel' || c.type === 'live') && c.status === 'publicado').length;
  const totalPublished = calendarios.filter(c => c.status === 'publicado').length;

  // Get latest meta
  const latestMeta = metas[metas.length - 1] || {
    targetPosts: 30,
    targetReels: 20,
    targetStories: 60,
    targetFollowers: 1000,
    targetShares: 500,
    targetSaves: 500,
    targetEngagementRate: 4.5,
    targetLeads: 150,
    targetEnrollments: 25
  };

  // Get latest report
  const latestReport = relatorios[relatorios.length - 1] || {
    postsCount: publishedPosts,
    reelsCount: publishedReels,
    storiesCount: publishedStories,
    followersCount: 8420,
    likes: 1250,
    comments: 340,
    shares: 412,
    saves: 380,
    reach: 25400,
    impressions: 48900,
    engagementRate: 5.2,
    clicks: 640,
    conversions: 82,
    newStudents: 14
  };

  // Prepare chart data (fallback mock data combined with real reports)
  const reportChartData = relatorios.length > 0 
    ? relatorios.map(r => ({
        name: `${r.month}/${r.year}`,
        Seguidores: r.followersCount,
        Alcance: r.reach,
        Engajamento: r.engagementRate,
        Alunos: r.newStudents,
        Posts: r.postsCount + r.reelsCount,
        Curtidas: r.likes
      }))
    : [
        { name: 'Mar/2026', Seguidores: 6200, Alcance: 15000, Engajamento: 3.8, Alunos: 5, Posts: 18, Curtidas: 650 },
        { name: 'Abr/2026', Seguidores: 6800, Alcance: 18200, Engajamento: 4.2, Alunos: 8, Posts: 22, Curtidas: 820 },
        { name: 'Mai/2026', Seguidores: 7300, Alcance: 21000, Engajamento: 4.5, Alunos: 11, Posts: 25, Curtidas: 980 },
        { name: 'Jun/2026', Seguidores: 8000, Alcance: 24300, Engajamento: 4.9, Alunos: 12, Posts: 28, Curtidas: 1150 },
        { name: 'Jul/2026', Seguidores: latestReport.followersCount, Alcance: latestReport.reach, Engajamento: latestReport.engagementRate, Alunos: latestReport.newStudents, Posts: latestReport.postsCount + latestReport.reelsCount, Curtidas: latestReport.likes }
      ];

  return (
    <div className="space-y-6">
      
      {/* Upper Grid - KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* KPI 1: Planejamentos Ativos */}
        <div className="bg-[#18181b] border border-white/5 rounded-2xl p-4.5 flex items-center justify-between shadow-lg">
          <div className="space-y-1">
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Planejamentos</p>
            <h3 className="text-2xl font-bold text-white">{activePlans} Ativos</h3>
            <p className="text-[11px] text-gray-500">Mapeamento mensal letivo</p>
          </div>
          <div className="p-3 bg-amber-500/10 rounded-xl text-[#f5c518]">
            <Target size={24} />
          </div>
        </div>

        {/* KPI 2: Estratégias */}
        <div className="bg-[#18181b] border border-white/5 rounded-2xl p-4.5 flex items-center justify-between shadow-lg">
          <div className="space-y-1">
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Estratégias</p>
            <h3 className="text-2xl font-bold text-white">{totalStrategies} Cadastradas</h3>
            <p className="text-[11px] text-gray-500">Multicanais ativos</p>
          </div>
          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
            <Layers size={24} />
          </div>
        </div>

        {/* KPI 3: Quadros Ativos */}
        <div className="bg-[#18181b] border border-white/5 rounded-2xl p-4.5 flex items-center justify-between shadow-lg">
          <div className="space-y-1">
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Quadros Instagram</p>
            <h3 className="text-2xl font-bold text-white">{activeQuadros} Ativos</h3>
            <p className="text-[11px] text-gray-500">Linha editorial pedagógica</p>
          </div>
          <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
            <Sparkles size={24} />
          </div>
        </div>

        {/* KPI 4: Publicações Totais */}
        <div className="bg-[#18181b] border border-white/5 rounded-2xl p-4.5 flex items-center justify-between shadow-lg">
          <div className="space-y-1">
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Posts Publicados</p>
            <h3 className="text-2xl font-bold text-white">{totalPublished} itens</h3>
            <p className="text-[11px] text-gray-500">Conteúdo veiculado no mês</p>
          </div>
          <div className="p-3 bg-green-500/10 rounded-xl text-green-400">
            <TrendingUp size={24} />
          </div>
        </div>
      </div>

      {/* Content Formats Published Sub-Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#1e1e24] border border-white/5 rounded-xl p-3.5 flex items-center gap-3">
          <div className="p-2 bg-pink-500/10 text-pink-400 rounded-lg">
            <Image size={18} />
          </div>
          <div>
            <p className="text-[11px] text-gray-400">Posts Estáticos</p>
            <h4 className="text-lg font-bold text-white">{publishedPosts} <span className="text-xs font-normal text-gray-500">/ {latestMeta.targetPosts}</span></h4>
          </div>
        </div>
        
        <div className="bg-[#1e1e24] border border-white/5 rounded-xl p-3.5 flex items-center gap-3">
          <div className="p-2 bg-red-500/10 text-red-400 rounded-lg">
            <Play size={18} />
          </div>
          <div>
            <p className="text-[11px] text-gray-400">Reels Publicados</p>
            <h4 className="text-lg font-bold text-white">{publishedReels} <span className="text-xs font-normal text-gray-500">/ {latestMeta.targetReels}</span></h4>
          </div>
        </div>

        <div className="bg-[#1e1e24] border border-white/5 rounded-xl p-3.5 flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
            <Video size={18} />
          </div>
          <div>
            <p className="text-[11px] text-gray-400">Stories Publicados</p>
            <h4 className="text-lg font-bold text-white">{publishedStories} <span className="text-xs font-normal text-gray-500">/ {latestMeta.targetStories}</span></h4>
          </div>
        </div>

        <div className="bg-[#1e1e24] border border-white/5 rounded-xl p-3.5 flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
            <Calendar size={18} />
          </div>
          <div>
            <p className="text-[11px] text-gray-400">Carrosséis / Lives</p>
            <h4 className="text-lg font-bold text-white">{publishedOthers} <span className="text-xs font-normal text-gray-500">feito</span></h4>
          </div>
        </div>
      </div>

      {/* Main Indicators Panel */}
      <div className="bg-[#18181b] border border-white/5 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BarChart2 size={18} className="text-[#f5c518]" />
              Indicadores de Desempenho (Instagram)
            </h3>
            <p className="text-xs text-gray-400">Dados consolidados do último período reportado</p>
          </div>
          <span className="text-xs bg-[#f5c518]/10 text-[#f5c518] px-3 py-1 rounded-full border border-[#f5c518]/20 font-medium">
            Último Mês
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          
          <div className="bg-black/30 border border-white/5 rounded-xl p-4 text-center">
            <div className="flex justify-center text-red-400 mb-1.5"><Heart size={18} /></div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Curtidas</p>
            <h4 className="text-xl font-bold text-white mt-1">{latestReport.likes.toLocaleString()}</h4>
          </div>

          <div className="bg-black/30 border border-white/5 rounded-xl p-4 text-center">
            <div className="flex justify-center text-blue-400 mb-1.5"><MessageCircle size={18} /></div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Comentários</p>
            <h4 className="text-xl font-bold text-white mt-1">{latestReport.comments.toLocaleString()}</h4>
          </div>

          <div className="bg-black/30 border border-white/5 rounded-xl p-4 text-center">
            <div className="flex justify-center text-green-400 mb-1.5"><Share2 size={18} /></div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Compartilhamentos</p>
            <h4 className="text-xl font-bold text-white mt-1">{latestReport.shares.toLocaleString()} <span className="text-[10px] font-normal text-gray-500">/ {latestMeta.targetShares}</span></h4>
          </div>

          <div className="bg-black/30 border border-white/5 rounded-xl p-4 text-center">
            <div className="flex justify-center text-purple-400 mb-1.5"><Bookmark size={18} /></div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Salvamentos</p>
            <h4 className="text-xl font-bold text-white mt-1">{latestReport.saves.toLocaleString()} <span className="text-[10px] font-normal text-gray-500">/ {latestMeta.targetSaves}</span></h4>
          </div>

          <div className="bg-black/30 border border-white/5 rounded-xl p-4 text-center col-span-2 md:col-span-1">
            <div className="flex justify-center text-[#f5c518] mb-1.5"><Award size={18} /></div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Taxa Engajamento</p>
            <h4 className="text-xl font-bold text-[#f5c518] mt-1">{latestReport.engagementRate}% <span className="text-[10px] font-normal text-gray-500">/ {latestMeta.targetEngagementRate}%</span></h4>
          </div>

        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="bg-black/10 rounded-lg p-3">
            <p className="text-[10px] text-gray-400">Alcance de Contas</p>
            <h5 className="text-base font-bold text-white">{latestReport.reach.toLocaleString()}</h5>
          </div>
          <div className="bg-black/10 rounded-lg p-3">
            <p className="text-[10px] text-gray-400">Impressões</p>
            <h5 className="text-base font-bold text-white">{latestReport.impressions.toLocaleString()}</h5>
          </div>
          <div className="bg-black/10 rounded-lg p-3">
            <p className="text-[10px] text-gray-400">Cliques no Link (Bio)</p>
            <h5 className="text-base font-bold text-white">{latestReport.clicks.toLocaleString()}</h5>
          </div>
          <div className="bg-[#f5c518]/5 border border-[#f5c518]/10 rounded-lg p-3">
            <p className="text-[10px] text-amber-400 font-semibold">Alunos Matriculados (Origem Mkt)</p>
            <h5 className="text-base font-bold text-[#f5c518]">{latestReport.newStudents} <span className="text-xs text-gray-400">/ {latestMeta.targetEnrollments} metas</span></h5>
          </div>
        </div>
      </div>

      {/* Recharts Modern Interactive Graphs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Graph 1: Follower Growth & New Students */}
        <div className="bg-[#18181b] border border-white/5 rounded-2xl p-5 shadow-xl">
          <h3 className="text-base font-bold text-white mb-4">Crescimento de Seguidores & Novos Alunos</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reportChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="name" stroke="#71717a" fontSize={11} />
                <YAxis yAxisId="left" stroke="#a1a1aa" fontSize={11} />
                <YAxis yAxisId="right" orientation="right" stroke="#f5c518" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '12px' }}
                  labelStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                />
                <Bar yAxisId="left" dataKey="Seguidores" fill="#3b82f6" name="Seguidores" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="Alunos" fill="#f5c518" name="Novos Alunos" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graph 2: Engagement Trends vs Volume */}
        <div className="bg-[#18181b] border border-white/5 rounded-2xl p-5 shadow-xl">
          <h3 className="text-base font-bold text-white mb-4">Alcance Orgânico & Engajamento (%)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={reportChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAlcance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="name" stroke="#71717a" fontSize={11} />
                <YAxis yAxisId="left" stroke="#a1a1aa" fontSize={11} />
                <YAxis yAxisId="right" orientation="right" stroke="#f5c518" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '12px' }}
                  labelStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                />
                <Area yAxisId="left" type="monotone" dataKey="Alcance" stroke="#ec4899" fillOpacity={1} fill="url(#colorAlcance)" name="Alcance Orgânico" />
                <Line yAxisId="right" type="monotone" dataKey="Engajamento" stroke="#f5c518" strokeWidth={3} name="Taxa de Engajamento (%)" dot={{ r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
