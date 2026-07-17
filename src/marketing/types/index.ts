/**
 * Types for the Marketing Module
 */

export interface MktPlanejamento {
  id: string;
  name: string;
  month: string;
  year: string;
  objective: string;
  targetAudience: string;
  goal: string;
  responsible: string;
  status: 'planejado' | 'em_andamento' | 'concluido' | 'cancelado';
  observations: string;
}

export type MktChannelType = 
  | 'instagram'
  | 'facebook'
  | 'tiktok'
  | 'youtube'
  | 'linkedin'
  | 'whatsapp'
  | 'site'
  | 'google';

export interface MktEstrategia {
  id: string;
  name: string;
  objective: string;
  channel: MktChannelType;
  frequency: string;
  startDate: string;
  endDate: string;
  observations: string;
}

export interface MktQuadro {
  id: string;
  name: string;
  description: string;
  objective: string;
  frequency: string;
  dayOfWeek: string;
  time: string;
  targetAudience: string;
  category: string;
  status: 'ativo' | 'pausado';
  postCount: number;
}

export type MktMediaType = 'post' | 'reels' | 'story' | 'carrossel' | 'live';

export interface MktCalendario {
  id: string;
  date: string; // YYYY-MM-DD
  type: MktMediaType;
  title: string;
  description: string;
  quadroId: string; // References MktQuadro.id or custom
  objective: string;
  caption: string;
  cta: string;
  hashtags: string;
  artUrl?: string;
  videoUrl?: string;
  status: 'agendado' | 'publicado' | 'cancelado';
}

export interface MktIdeia {
  id: string;
  title: string;
  description: string;
  category: string;
  quadroId: string;
  priority: 'baixa' | 'media' | 'alta';
  responsible: string;
  status: 'rascunho' | 'aprovado' | 'arquivado';
  tags: string[];
  isFavorite: boolean;
}

export interface MktRelatorio {
  id: string;
  month: string;
  year: string;
  postsCount: number;
  reelsCount: number;
  storiesCount: number;
  followersCount: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  reach: number;
  impressions: number;
  engagementRate: number;
  clicks: number;
  conversions: number;
  newStudents: number;
  observations?: string;
}

export interface MktMeta {
  id: string;
  title: string;
  month: string;
  year: string;
  responsible: string;
  status: 'nao_iniciada' | 'em_andamento' | 'atingida' | 'nao_atingida';
  targetPosts: number;
  targetReels: number;
  targetStories: number;
  targetFollowers: number;
  targetShares: number;
  targetSaves: number;
  targetEngagementRate: number;
  targetLeads: number;
  targetEnrollments: number;
}
