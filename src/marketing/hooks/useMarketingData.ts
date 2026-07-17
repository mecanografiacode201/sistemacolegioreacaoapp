import { useState, useEffect, useCallback } from 'react';
import FirebaseService from '../../services/FirebaseService';
import { 
  MktPlanejamento, 
  MktEstrategia, 
  MktQuadro, 
  MktCalendario, 
  MktIdeia, 
  MktRelatorio, 
  MktMeta 
} from '../types';

const LS_PREFIX = 'colegio_reacao_mkt_';

// Default 13 Instagram Quadros
const DEFAULT_QUADROS: MktQuadro[] = [
  { id: 'QDR-001', name: '🧠 Perguntas Nível ENEM', description: 'Testes de conhecimentos gerais e específicos focados no ENEM.', objective: 'Engajar estudantes do Ensino Médio e demonstrar autoridade pedagógica.', frequency: 'Semanal', dayOfWeek: 'Segunda-feira', time: '14:00', targetAudience: 'Vestibulandos e Alunos', category: 'Pedagógico', status: 'ativo', postCount: 0 },
  { id: 'QDR-002', name: '🌍 Você Sabia?', description: 'Curiosidades históricas, geográficas e científicas interessantes.', objective: 'Gerar compartilhamentos e despertar curiosidade científica.', frequency: 'Semanal', dayOfWeek: 'Terça-feira', time: '11:00', targetAudience: 'Público Geral', category: 'Entretenimento', status: 'ativo', postCount: 0 },
  { id: 'QDR-003', name: '❤️ Família & Escola', description: 'Dicas de relacionamento, desenvolvimento infantil e participação dos pais.', objective: 'Aproximar a família da rotina escolar e fortalecer laços.', frequency: 'Quinzenal', dayOfWeek: 'Quarta-feira', time: '19:00', targetAudience: 'Pais e Responsáveis', category: 'Relacionamento', status: 'ativo', postCount: 0 },
  { id: 'QDR-004', name: '💡 Dica do Dia', description: 'Dicas rápidas de estudo, organização e produtividade para os alunos.', objective: 'Auxiliar na rotina de estudos prática diária.', frequency: 'Diário', dayOfWeek: 'Todos', time: '08:00', targetAudience: 'Alunos', category: 'Utilidade', status: 'ativo', postCount: 0 },
  { id: 'QDR-005', name: '🎯 Erro Comum', description: 'Erros frequentes cometidos em exames, redações e como evitá-los.', objective: 'Corrigir falhas comuns de forma didática e rápida.', frequency: 'Semanal', dayOfWeek: 'Quinta-feira', time: '15:30', targetAudience: 'Alunos', category: 'Pedagógico', status: 'ativo', postCount: 0 },
  { id: 'QDR-006', name: '📖 Palavra do Dia', description: 'Vocabulário enriquecido, sinônimos, antônimos e uso correto na redação.', objective: 'Enriquecer o repertório linguístico dos estudantes.', frequency: 'Semanal', dayOfWeek: 'Sexta-feira', time: '09:00', targetAudience: 'Vestibulandos', category: 'Redação', status: 'ativo', postCount: 0 },
  { id: 'QDR-007', name: '📝 Português sem Complicação', description: 'Regras gramaticais, ortografia e dúvidas comuns explicadas de forma simples.', objective: 'Sanar dúvidas de língua portuguesa para toda a comunidade.', frequency: 'Semanal', dayOfWeek: 'Sábado', time: '10:00', targetAudience: 'Público Geral', category: 'Gramática', status: 'ativo', postCount: 0 },
  { id: 'QDR-008', name: '🧮 Matemática em 1 Minuto', description: 'Macetes e fórmulas matemáticas simplificadas para resolução rápida.', objective: 'Desmistificar a matemática e facilitar cálculos cotidianos e provas.', frequency: 'Semanal', dayOfWeek: 'Segunda-feira', time: '17:00', targetAudience: 'Alunos', category: 'Ciências Exatas', status: 'ativo', postCount: 0 },
  { id: 'QDR-009', name: '🌎 Conhecendo o Mundo', description: 'Fatos geográficos, culturais e geopolíticos que ajudam nas provas de humanas.', objective: 'Ampliar a visão sociocultural e geopolítica dos discentes.', frequency: 'Semanal', dayOfWeek: 'Quarta-feira', time: '16:00', targetAudience: 'Estudantes', category: 'Geografia', status: 'ativo', postCount: 0 },
  { id: 'QDR-010', name: '🔬 Experimento da Semana', description: 'Vídeos ou fotos de atividades laboratoriais e experimentos científicos práticos.', objective: 'Valorizar as aulas práticas do colégio e engajar novos alunos.', frequency: 'Semanal', dayOfWeek: 'Quinta-feira', time: '13:00', targetAudience: 'Alunos e Prospectos', category: 'Ciências da Natureza', status: 'ativo', postCount: 0 },
  { id: 'QDR-011', name: '💭 Mito ou Verdade?', description: 'Desmistificando crendices populares, fatos históricos e curiosidades científicas.', objective: 'Educar o público e gerar altos índices de comentários nas enquetes.', frequency: 'Semanal', dayOfWeek: 'Terça-feira', time: '14:30', targetAudience: 'Público Geral', category: 'Interação', status: 'ativo', postCount: 0 },
  { id: 'QDR-012', name: '📚 Livro da Semana', description: 'Indicações de leitura, resumos rápidos e relevância para vestibulares.', objective: 'Estimular a leitura de obras clássicas e exigidas nos exames.', frequency: 'Semanal', dayOfWeek: 'Sexta-feira', time: '18:00', targetAudience: 'Alunos', category: 'Literatura', status: 'ativo', postCount: 0 },
  { id: 'QDR-013', name: '🎓 Profissões do Futuro', description: 'Visão geral sobre carreiras, mercado de trabalho e cursos universitários.', objective: 'Auxiliar na orientação profissional e vocacional dos alunos.', frequency: 'Quinzenal', dayOfWeek: 'Sábado', time: '12:00', targetAudience: 'Alunos do Ensino Médio', category: 'Orientação', status: 'ativo', postCount: 0 }
];

export function useMarketingData() {
  const [planejamentos, setPlanejamentos] = useState<MktPlanejamento[]>([]);
  const [estrategias, setEstrategias] = useState<MktEstrategia[]>([]);
  const [quadros, setQuadros] = useState<MktQuadro[]>([]);
  const [calendarios, setCalendarios] = useState<MktCalendario[]>([]);
  const [ideias, setIdeias] = useState<MktIdeia[]>([]);
  const [relatorios, setRelatorios] = useState<MktRelatorio[]>([]);
  const [metas, setMetas] = useState<MktMeta[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Helper to load from Local Storage
  const getLS = useCallback(<T>(key: string, defaultValue: T): T => {
    try {
      const stored = localStorage.getItem(LS_PREFIX + key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  }, []);

  // Helper to save to Local Storage
  const setLS = useCallback(<T>(key: string, val: T) => {
    localStorage.setItem(LS_PREFIX + key, JSON.stringify(val));
  }, []);

  // Load Initial Data
  useEffect(() => {
    const cachedPlan = getLS<MktPlanejamento[]>('planejamentos', []);
    const cachedEst = getLS<MktEstrategia[]>('estrategias', []);
    const cachedQdr = getLS<MktQuadro[]>('quadros', []);
    const cachedCal = getLS<MktCalendario[]>('calendario', []);
    const cachedIde = getLS<MktIdeia[]>('ideias', []);
    const cachedRel = getLS<MktRelatorio[]>('relatorios', []);
    const cachedMet = getLS<MktMeta[]>('metas', []);

    setPlanejamentos(cachedPlan);
    setEstrategias(cachedEst);
    setCalendarios(cachedCal);
    setIdeias(cachedIde);
    setRelatorios(cachedRel);
    setMetas(cachedMet);

    // Seed Quadros if empty
    if (cachedQdr.length === 0) {
      setQuadros(DEFAULT_QUADROS);
      setLS('quadros', DEFAULT_QUADROS);
    } else {
      setQuadros(cachedQdr);
    }

    setLoading(false);
  }, [getLS, setLS]);

  // Firestore Sync & Subscription
  useEffect(() => {
    if (!FirebaseService.isConfigured()) return;

    const unsubscribers: (() => void)[] = [];

    const syncCollection = async <T extends { id: string }>(
      key: string,
      currentLocal: T[],
      setter: (data: T[]) => void,
      firebaseServiceObj: any,
      defaultSeeding: T[] = []
    ) => {
      try {
        const remoteData = await firebaseServiceObj.list();
        let safeRemote = remoteData || [];
        
        // Custom seeding for quadros if empty in remote
        if (key === 'quadros' && safeRemote.length === 0 && defaultSeeding.length > 0) {
          console.log('[Marketing Sync] Seeding remote quadros...');
          for (const item of defaultSeeding) {
            await firebaseServiceObj.create(item, item.id);
          }
          safeRemote = [...defaultSeeding];
        }

        const remoteIds = new Set(safeRemote.map((item: any) => item.id));
        let merged = [...safeRemote];

        // Upload local items that aren't on Firebase
        if (currentLocal && currentLocal.length > 0) {
          const localOnly = currentLocal.filter((item) => !remoteIds.has(item.id));
          if (localOnly.length > 0) {
            for (const item of localOnly) {
              await firebaseServiceObj.create(item, item.id).catch(console.error);
              merged.push(item);
            }
          }
        }

        setter(merged);
        setLS(key, merged);
      } catch (err) {
        console.warn(`[Marketing Sync] Error syncing ${key}:`, err);
      }
    };

    // Run first-time collections sync
    const initialSync = async () => {
      const qdrLocal = getLS<MktQuadro[]>('quadros', []);
      await syncCollection('quadros', qdrLocal, setQuadros, FirebaseService.mkt_quadros, DEFAULT_QUADROS);
      
      const planLocal = getLS<MktPlanejamento[]>('planejamentos', []);
      await syncCollection('planejamentos', planLocal, setPlanejamentos, FirebaseService.mkt_planejamentos);

      const estLocal = getLS<MktEstrategia[]>('estrategias', []);
      await syncCollection('estrategias', estLocal, setEstrategias, FirebaseService.mkt_estrategias);

      const calLocal = getLS<MktCalendario[]>('calendario', []);
      await syncCollection('calendario', calLocal, setCalendarios, FirebaseService.mkt_calendario);

      const ideLocal = getLS<MktIdeia[]>('ideias', []);
      await syncCollection('ideias', ideLocal, setIdeias, FirebaseService.mkt_ideias);

      const relLocal = getLS<MktRelatorio[]>('relatorios', []);
      await syncCollection('relatorios', relLocal, setRelatorios, FirebaseService.mkt_relatorios);

      const metLocal = getLS<MktMeta[]>('metas', []);
      await syncCollection('metas', metLocal, setMetas, FirebaseService.mkt_metas);
    };

    initialSync().then(() => {
      // Subscriptions
      unsubscribers.push(
        FirebaseService.mkt_planejamentos.subscribe((data) => {
          if (data) { setPlanejamentos(data); setLS('planejamentos', data); }
        })
      );
      unsubscribers.push(
        FirebaseService.mkt_estrategias.subscribe((data) => {
          if (data) { setEstrategias(data); setLS('estrategias', data); }
        })
      );
      unsubscribers.push(
        FirebaseService.mkt_quadros.subscribe((data) => {
          if (data && data.length > 0) { setQuadros(data); setLS('quadros', data); }
        })
      );
      unsubscribers.push(
        FirebaseService.mkt_calendario.subscribe((data) => {
          if (data) { setCalendarios(data); setLS('calendario', data); }
        })
      );
      unsubscribers.push(
        FirebaseService.mkt_ideias.subscribe((data) => {
          if (data) { setIdeias(data); setLS('ideias', data); }
        })
      );
      unsubscribers.push(
        FirebaseService.mkt_relatorios.subscribe((data) => {
          if (data) { setRelatorios(data); setLS('relatorios', data); }
        })
      );
      unsubscribers.push(
        FirebaseService.mkt_metas.subscribe((data) => {
          if (data) { setMetas(data); setLS('metas', data); }
        })
      );
    });

    return () => {
      unsubscribers.forEach((u) => u());
    };
  }, [getLS, setLS]);

  // Recalculate Post Counts when Calendars load or update
  const getPostCountForQuadro = useCallback((quadroName: string, calItems: MktCalendario[]) => {
    return calItems.filter(
      item => (item.quadroId === quadroName || item.title?.includes(quadroName)) && item.status === 'publicado'
    ).length;
  }, []);

  const refreshPostCounts = useCallback((currentQuadros: MktQuadro[], currentCal: MktCalendario[]) => {
    let changed = false;
    const updated = currentQuadros.map(q => {
      const count = getPostCountForQuadro(q.name, currentCal);
      if (q.postCount !== count) {
        changed = true;
        return { ...q, postCount: count };
      }
      return q;
    });
    if (changed) {
      setQuadros(updated);
      setLS('quadros', updated);
      if (FirebaseService.isConfigured()) {
        updated.forEach(q => {
          FirebaseService.mkt_quadros.update(q.id, { postCount: q.postCount }).catch(console.error);
        });
      }
    }
  }, [getPostCountForQuadro, setLS]);

  // Refresh counts on load
  useEffect(() => {
    if (quadros.length > 0 && calendarios.length >= 0) {
      refreshPostCounts(quadros, calendarios);
    }
  }, [calendarios, refreshPostCounts, quadros]);

  // --- CRUD FUNCTIONS ---

  // PLANEJAMENTOS
  const addPlanejamento = async (item: Omit<MktPlanejamento, 'id'>) => {
    const newId = `PLN-${Date.now().toString().slice(-4)}`;
    const newItem: MktPlanejamento = { ...item, id: newId };
    const updated = [...planejamentos, newItem];
    setPlanejamentos(updated);
    setLS('planejamentos', updated);
    if (FirebaseService.isConfigured()) {
      await FirebaseService.mkt_planejamentos.create(newItem, newId).catch(console.error);
    }
  };

  const editPlanejamento = async (item: MktPlanejamento) => {
    const updated = planejamentos.map(p => p.id === item.id ? item : p);
    setPlanejamentos(updated);
    setLS('planejamentos', updated);
    if (FirebaseService.isConfigured()) {
      await FirebaseService.mkt_planejamentos.update(item.id, item).catch(console.error);
    }
  };

  const deletePlanejamento = async (id: string) => {
    const updated = planejamentos.filter(p => p.id !== id);
    setPlanejamentos(updated);
    setLS('planejamentos', updated);
    if (FirebaseService.isConfigured()) {
      await FirebaseService.mkt_planejamentos.delete(id).catch(console.error);
    }
  };

  const duplicatePlanejamento = async (item: MktPlanejamento) => {
    const dup: Omit<MktPlanejamento, 'id'> = {
      ...item,
      name: `${item.name} (Cópia)`,
      status: 'planejado'
    };
    await addPlanejamento(dup);
  };

  // ESTRATEGIAS
  const addEstrategia = async (item: Omit<MktEstrategia, 'id'>) => {
    const newId = `EST-${Date.now().toString().slice(-4)}`;
    const newItem: MktEstrategia = { ...item, id: newId };
    const updated = [...estrategias, newItem];
    setEstrategias(updated);
    setLS('estrategias', updated);
    if (FirebaseService.isConfigured()) {
      await FirebaseService.mkt_estrategias.create(newItem, newId).catch(console.error);
    }
  };

  const editEstrategia = async (item: MktEstrategia) => {
    const updated = estrategias.map(e => e.id === item.id ? item : e);
    setEstrategias(updated);
    setLS('estrategias', updated);
    if (FirebaseService.isConfigured()) {
      await FirebaseService.mkt_estrategias.update(item.id, item).catch(console.error);
    }
  };

  const deleteEstrategia = async (id: string) => {
    const updated = estrategias.filter(e => e.id !== id);
    setEstrategias(updated);
    setLS('estrategias', updated);
    if (FirebaseService.isConfigured()) {
      await FirebaseService.mkt_estrategias.delete(id).catch(console.error);
    }
  };

  // QUADROS INSTAGRAM
  const addQuadro = async (item: Omit<MktQuadro, 'id' | 'postCount'>) => {
    const newId = `QDR-${Date.now().toString().slice(-4)}`;
    const newItem: MktQuadro = { ...item, id: newId, postCount: 0 };
    const updated = [...quadros, newItem];
    setQuadros(updated);
    setLS('quadros', updated);
    if (FirebaseService.isConfigured()) {
      await FirebaseService.mkt_quadros.create(newItem, newId).catch(console.error);
    }
  };

  const editQuadro = async (item: MktQuadro) => {
    const updated = quadros.map(q => q.id === item.id ? item : q);
    setQuadros(updated);
    setLS('quadros', updated);
    if (FirebaseService.isConfigured()) {
      await FirebaseService.mkt_quadros.update(item.id, item).catch(console.error);
    }
  };

  const deleteQuadro = async (id: string) => {
    const updated = quadros.filter(q => q.id !== id);
    setQuadros(updated);
    setLS('quadros', updated);
    if (FirebaseService.isConfigured()) {
      await FirebaseService.mkt_quadros.delete(id).catch(console.error);
    }
  };

  const duplicateQuadro = async (item: MktQuadro) => {
    const dup: Omit<MktQuadro, 'id' | 'postCount'> = {
      ...item,
      name: `${item.name} (Cópia)`,
      status: 'ativo'
    };
    await addQuadro(dup);
  };

  // CALENDARIO EDITORIAL
  const addCalendario = async (item: Omit<MktCalendario, 'id'>) => {
    const newId = `CAL-${Date.now().toString().slice(-4)}`;
    const newItem: MktCalendario = { ...item, id: newId };
    const updated = [...calendarios, newItem];
    setCalendarios(updated);
    setLS('calendario', updated);
    if (FirebaseService.isConfigured()) {
      await FirebaseService.mkt_calendario.create(newItem, newId).catch(console.error);
    }
    refreshPostCounts(quadros, updated);
  };

  const editCalendario = async (item: MktCalendario) => {
    const updated = calendarios.map(c => c.id === item.id ? item : c);
    setCalendarios(updated);
    setLS('calendario', updated);
    if (FirebaseService.isConfigured()) {
      await FirebaseService.mkt_calendario.update(item.id, item).catch(console.error);
    }
    refreshPostCounts(quadros, updated);
  };

  const deleteCalendario = async (id: string) => {
    const updated = calendarios.filter(c => c.id !== id);
    setCalendarios(updated);
    setLS('calendario', updated);
    if (FirebaseService.isConfigured()) {
      await FirebaseService.mkt_calendario.delete(id).catch(console.error);
    }
    refreshPostCounts(quadros, updated);
  };

  // IDEIAS
  const addIdeia = async (item: Omit<MktIdeia, 'id'>) => {
    const newId = `IDE-${Date.now().toString().slice(-4)}`;
    const newItem: MktIdeia = { ...item, id: newId };
    const updated = [...ideias, newItem];
    setIdeias(updated);
    setLS('ideias', updated);
    if (FirebaseService.isConfigured()) {
      await FirebaseService.mkt_ideias.create(newItem, newId).catch(console.error);
    }
  };

  const editIdeia = async (item: MktIdeia) => {
    const updated = ideias.map(i => i.id === item.id ? item : i);
    setIdeias(updated);
    setLS('ideias', updated);
    if (FirebaseService.isConfigured()) {
      await FirebaseService.mkt_ideias.update(item.id, item).catch(console.error);
    }
  };

  const deleteIdeia = async (id: string) => {
    const updated = ideias.filter(i => i.id !== id);
    setIdeias(updated);
    setLS('ideias', updated);
    if (FirebaseService.isConfigured()) {
      await FirebaseService.mkt_ideias.delete(id).catch(console.error);
    }
  };

  const toggleFavoriteIdeia = async (id: string) => {
    const item = ideias.find(i => i.id === id);
    if (!item) return;
    const updatedItem = { ...item, isFavorite: !item.isFavorite };
    await editIdeia(updatedItem);
  };

  // RELATORIOS
  const addRelatorio = async (item: Omit<MktRelatorio, 'id'>) => {
    const newId = `REP-${item.month}-${item.year}`;
    const newItem: MktRelatorio = { ...item, id: newId };
    const updated = [...relatorios, newItem];
    setRelatorios(updated);
    setLS('relatorios', updated);
    if (FirebaseService.isConfigured()) {
      await FirebaseService.mkt_relatorios.create(newItem, newId).catch(console.error);
    }
  };

  const editRelatorio = async (item: MktRelatorio) => {
    const updated = relatorios.map(r => r.id === item.id ? item : r);
    setRelatorios(updated);
    setLS('relatorios', updated);
    if (FirebaseService.isConfigured()) {
      await FirebaseService.mkt_relatorios.update(item.id, item).catch(console.error);
    }
  };

  const deleteRelatorio = async (id: string) => {
    const updated = relatorios.filter(r => r.id !== id);
    setRelatorios(updated);
    setLS('relatorios', updated);
    if (FirebaseService.isConfigured()) {
      await FirebaseService.mkt_relatorios.delete(id).catch(console.error);
    }
  };

  // METAS
  const addMeta = async (item: Omit<MktMeta, 'id'>) => {
    const newId = `MET-${item.month}-${item.year}`;
    const newItem: MktMeta = { ...item, id: newId };
    const updated = [...metas, newItem];
    setMetas(updated);
    setLS('metas', updated);
    if (FirebaseService.isConfigured()) {
      await FirebaseService.mkt_metas.create(newItem, newId).catch(console.error);
    }
  };

  const editMeta = async (item: MktMeta) => {
    const updated = metas.map(m => m.id === item.id ? item : m);
    setMetas(updated);
    setLS('metas', updated);
    if (FirebaseService.isConfigured()) {
      await FirebaseService.mkt_metas.update(item.id, item).catch(console.error);
    }
  };

  const deleteMeta = async (id: string) => {
    const updated = metas.filter(m => m.id !== id);
    setMetas(updated);
    setLS('metas', updated);
    if (FirebaseService.isConfigured()) {
      await FirebaseService.mkt_metas.delete(id).catch(console.error);
    }
  };

  return {
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
  };
}
