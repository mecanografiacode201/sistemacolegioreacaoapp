import React, { useState } from 'react';
import { 
  BarChart2, 
  FileText, 
  Layers, 
  Sparkles, 
  Calendar, 
  Lightbulb, 
  Target, 
  PlusCircle, 
  TrendingUp, 
  Loader2,
  Instagram
} from 'lucide-react';

import { useMarketingData } from '../hooks/useMarketingData';

// Tab imports
import MktDashboard from '../components/MktDashboard';
import MktPlanejamentoTab from '../components/MktPlanejamentoTab';
import MktEstrategiasTab from '../components/MktEstrategiasTab';
import MktQuadrosTab from '../components/MktQuadrosTab';
import MktCalendarioTab from '../components/MktCalendarioTab';
import MktIdeiasTab from '../components/MktIdeiasTab';
import MktRelatoriosTab from '../components/MktRelatoriosTab';
import MktMetasTab from '../components/MktMetasTab';
import MktInstagramConnectionComponent from '../components/MktInstagramConnection';

export default function MarketingPage() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const {
    planejamentos,
    estrategias,
    quadros,
    calendarios,
    ideias,
    relatorios,
    metas,
    loading,
    addPlanejamento,
    editPlanejamento,
    deletePlanejamento,
    duplicatePlanejamento,
    addEstrategia,
    editEstrategia,
    deleteEstrategia,
    addQuadro,
    editQuadro,
    deleteQuadro,
    duplicateQuadro,
    addCalendario,
    editCalendario,
    deleteCalendario,
    addIdeia,
    editIdeia,
    deleteIdeia,
    toggleFavoriteIdeia,
    addRelatorio,
    editRelatorio,
    deleteRelatorio,
    addMeta,
    editMeta,
    deleteMeta
  } = useMarketingData();

  // Loading spinner with refined transition
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#f5c518]" />
        <p className="text-sm text-gray-400 font-medium font-mono">Sincronizando ambiente de marketing...</p>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'Painel de Controle', icon: BarChart2 },
    { id: 'planejamento', label: 'Planejamento', icon: FileText },
    { id: 'estrategias', label: 'Estratégias', icon: Layers },
    { id: 'quadros', label: 'Quadros Instagram', icon: Sparkles },
    { id: 'calendario', label: 'Calendário Editorial', icon: Calendar },
    { id: 'ideias', label: 'Banco de Ideias', icon: Lightbulb },
    { id: 'relatorios', label: 'Relatórios / Métricas', icon: PlusCircle },
    { id: 'metas', label: 'Metas (KPIs)', icon: Target },
    { id: 'instagram', label: 'Conexão Instagram (API)', icon: Instagram },
  ];

  return (
    <div className="space-y-6">
      
      {/* Tab Navigation header */}
      <div className="flex items-center overflow-x-auto pb-2 border-b border-white/5 gap-1.5 custom-scrollbar no-print">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border
                ${isActive 
                  ? 'bg-gradient-to-r from-[#f5c518] to-[#dfb212] text-black border-transparent shadow-lg shadow-amber-500/10' 
                  : 'bg-white/5 text-gray-400 border-white/5 hover:text-white hover:bg-white/10'}`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Render selected active sub-tab */}
      <div className="bg-transparent rounded-2xl min-h-[300px] transition-all">
        {activeTab === 'dashboard' && (
          <MktDashboard
            planejamentos={planejamentos}
            estrategias={estrategias}
            quadros={quadros}
            calendarios={calendarios}
            relatorios={relatorios}
            metas={metas}
          />
        )}

        {activeTab === 'planejamento' && (
          <MktPlanejamentoTab
            planejamentos={planejamentos}
            onAdd={addPlanejamento}
            onEdit={editPlanejamento}
            onDelete={deletePlanejamento}
            onDuplicate={duplicatePlanejamento}
          />
        )}

        {activeTab === 'estrategias' && (
          <MktEstrategiasTab
            estrategias={estrategias}
            onAdd={addEstrategia}
            onEdit={editEstrategia}
            onDelete={deleteEstrategia}
          />
        )}

        {activeTab === 'quadros' && (
          <MktQuadrosTab
            quadros={quadros}
            onAdd={addQuadro}
            onEdit={editQuadro}
            onDelete={deleteQuadro}
            onDuplicate={duplicateQuadro}
          />
        )}

        {activeTab === 'calendario' && (
          <MktCalendarioTab
            calendarios={calendarios}
            quadros={quadros}
            onAdd={addCalendario}
            onEdit={editCalendario}
            onDelete={deleteCalendario}
          />
        )}

        {activeTab === 'ideias' && (
          <MktIdeiasTab
            ideias={ideias}
            quadros={quadros}
            onAdd={addIdeia}
            onEdit={editIdeia}
            onDelete={deleteIdeia}
            onToggleFavorite={toggleFavoriteIdeia}
          />
        )}

        {activeTab === 'relatorios' && (
          <MktRelatoriosTab
            relatorios={relatorios}
            onAdd={addRelatorio}
            onEdit={editRelatorio}
            onDelete={deleteRelatorio}
          />
        )}

        {activeTab === 'metas' && (
          <MktMetasTab
            metas={metas}
            onAdd={addMeta}
            onEdit={editMeta}
            onDelete={deleteMeta}
          />
        )}

        {activeTab === 'instagram' && (
          <MktInstagramConnectionComponent
            onAddRelatorio={addRelatorio}
            relatorios={relatorios}
          />
        )}
      </div>

    </div>
  );
}
