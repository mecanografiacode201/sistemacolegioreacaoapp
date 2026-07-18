import React, { useState } from 'react';
import { 
  Instagram, 
  Facebook, 
  ShieldCheck, 
  Info, 
  Check, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface MktOAuthSimulatePopupProps {
  profile: string;
}

export default function MktOAuthSimulatePopup({ profile }: MktOAuthSimulatePopupProps) {
  const [selected, setSelected] = useState(true);
  const [loading, setLoading] = useState(false);

  // Profile customized info map
  const getProfileDetails = (username: string) => {
    switch (username) {
      case '@reacao.esportes':
        return {
          displayName: 'Reação Esportes & Saúde',
          followers: '3.120',
          image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=150&auto=format&fit=crop&q=80',
          desc: 'Departamento de esportes, escolinha de judô, futebol, vôlei e bem-estar do Colégio Reação.'
        };
      case '@reacao.vestibulares':
        return {
          displayName: 'Reação Pré-Vestibulares',
          followers: '1.850',
          image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=150&auto=format&fit=crop&q=80',
          desc: 'Canal focado em dicas do ENEM, vestibulares UERJ, simulados gerais e aprovações do colégio.'
        };
      case '@colegioreacao':
      default:
        return {
          displayName: 'Colégio Reação Oficial',
          followers: '8.642',
          image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150&auto=format&fit=crop&q=80',
          desc: 'Perfil institucional principal do Colégio Reação contendo comunicados de matrículas, eventos e rotina letiva.'
        };
    }
  };

  const details = getProfileDetails(profile);

  const handleAuthorize = () => {
    setLoading(true);
    setTimeout(() => {
      if (window.opener) {
        // Send success message to opener (MarketingPage connection component)
        window.opener.postMessage({ 
          type: 'OAUTH_AUTH_SUCCESS', 
          code: 'mock_facebook_auth_code_' + Math.random().toString(36).substring(2, 9)
        }, '*');
        window.close();
      } else {
        alert('Janela de origem não encontrada. Certifique-se de iniciar a partir do sistema principal.');
      }
      setLoading(false);
    }, 1200);
  };

  const handleCancel = () => {
    window.close();
  };

  return (
    <div className="min-h-screen bg-[#0f0f12] text-gray-200 flex flex-col justify-between font-sans selection:bg-blue-600/30">
      
      {/* Top Header */}
      <div className="bg-[#18181c] border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Facebook className="text-[#1877f2] fill-[#1877f2]" size={22} />
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Meta Login de Negócios (Oficial)</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-mono">
          <span>Seguro (SSL/TLS)</span>
          <ShieldCheck size={14} className="text-emerald-500" />
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-md w-full mx-auto p-6 space-y-6 flex-1 flex flex-col justify-center">
        
        <div className="bg-[#18181c] border border-white/5 rounded-2xl p-6 space-y-5 shadow-2xl">
          
          {/* App Branding */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-black flex items-center justify-center text-white shadow-md font-bold text-lg">
              CR
            </div>
            <div className="space-y-0.5">
              <h1 className="text-sm font-bold text-white">SISTEMA COLÉGIO REAÇÃO</h1>
              <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Aplicativo Corporativo Verificado da Instituição
              </p>
            </div>
          </div>

          <hr className="border-white/5" />

          {/* Permissions request text */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Permissões Solicitadas pelo Sistema:</h2>
            
            <ul className="space-y-2 text-xs">
              <li className="flex items-start gap-2 text-gray-300">
                <Check size={14} className="text-emerald-400 mt-0.5 shrink-0" />
                <span>Leitura das informações de perfil e nome de usuário do Instagram.</span>
              </li>
              <li className="flex items-start gap-2 text-gray-300">
                <Check size={14} className="text-emerald-400 mt-0.5 shrink-0" />
                <span>Leitura de insights diários e semanais (alcance, impressões, cliques).</span>
              </li>
              <li className="flex items-start gap-2 text-gray-300">
                <Check size={14} className="text-emerald-400 mt-0.5 shrink-0" />
                <span>Lista de páginas comerciais do Facebook associadas à instituição.</span>
              </li>
            </ul>
          </div>

          {/* Accounts selector */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Selecione o perfil de {profile} para conectar:</h3>
            
            <div 
              onClick={() => setSelected(!selected)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                selected 
                  ? 'bg-blue-600/10 border-blue-500/30 text-white' 
                  : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full border border-pink-500/20 p-0.5 bg-[#18181b] overflow-hidden shrink-0">
                  <img 
                    src={details.image} 
                    alt="Instagram Profile" 
                    className="w-full h-full object-cover rounded-full"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="text-left space-y-0.5 max-w-[200px]">
                  <span className="text-xs font-bold block truncate">{details.displayName}</span>
                  <span className="text-[10px] text-pink-400 font-mono block">{profile}</span>
                  <span className="text-[9px] text-gray-500 block leading-normal">{details.desc}</span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded text-gray-400 font-mono">{details.followers} segs</span>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                  selected ? 'border-blue-500 bg-blue-500 text-white' : 'border-white/20 bg-transparent'
                }`}>
                  {selected && <Check size={12} />}
                </div>
              </div>
            </div>
          </div>

          {/* Warning disclaimer */}
          <div className="bg-blue-500/5 p-3 rounded-xl border border-blue-500/10 flex items-start gap-2.5">
            <Info size={14} className="text-blue-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-gray-400 leading-relaxed text-left">
              Este login utiliza o fluxo simulado de Sandbox para o domínio do colégio. Todas as permissões e escopos seguem o padrão oficial da <strong>Meta Graph API</strong>.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleCancel}
              disabled={loading}
              className="flex-1 bg-[#202024] hover:bg-white/5 text-white font-bold py-2.5 rounded-xl text-xs transition-all border border-white/10 cursor-pointer disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleAuthorize}
              disabled={!selected || loading}
              className="flex-1 bg-[#1877f2] hover:bg-blue-600 text-white font-bold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-md shadow-blue-600/10"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Autorizando...
                </>
              ) : (
                <>
                  Continuar como {profile}
                  <ChevronRight size={14} />
                </>
              )}
            </button>
          </div>

        </div>

      </div>

      {/* Footer */}
      <div className="border-t border-white/5 px-6 py-4 bg-[#18181c] flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-gray-500">
        <div className="flex items-center gap-3">
          <a href="https://developers.facebook.com/support/" target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-0.5">
            Suporte ao Desenvolvedor <ExternalLink size={8} />
          </a>
          <span className="text-white/10">|</span>
          <a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer" className="hover:underline">
            Políticas de Privacidade e Proteção de Dados
          </a>
        </div>
        <span>Meta Business © 2026. Todos os direitos reservados.</span>
      </div>

    </div>
  );
}
