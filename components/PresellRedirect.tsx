'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

// =======================================================================
// 👉 COLOQUE O LINK DO REDIRECIONAMENTO AQUI (ENTRE AS ASPAS):
// =======================================================================
export const LINK_DE_DESTINO = 'https://google.com';
// =======================================================================

function sanitizeUrl(rawUrl: string | null): string {
  if (!rawUrl) return '';
  const trimmed = rawUrl.trim();
  if (!trimmed) return '';
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

export default function PresellRedirect() {
  const searchParams = useSearchParams();

  // Se você passar ?url=... na URL, ele usa o da URL. Se não, usa o LINK_DE_DESTINO acima.
  const targetUrl = useMemo(() => {
    const fromParam =
      searchParams.get('url') ||
      searchParams.get('to') ||
      searchParams.get('dest');
    return sanitizeUrl(fromParam) || LINK_DE_DESTINO;
  }, [searchParams]);

  const [countdown, setCountdown] = useState<number>(3);
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);

  // Contador 3 -> 2 -> 1 -> 0
  useEffect(() => {
    if (isRedirecting) return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setIsRedirecting(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, isRedirecting]);

  // Ao chegar a 0: exibe o círculo girando e redireciona
  useEffect(() => {
    if (isRedirecting) {
      const redirectTimer = setTimeout(() => {
        try {
          window.location.href = targetUrl;
        } catch {
          // caso haja bloqueio de navegação pelo navegador
        }
      }, 600);
      return () => clearTimeout(redirectTimer);
    }
  }, [isRedirecting, targetUrl]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#121316] text-[#e1e4ea] px-4 font-sans select-none">
      <div className="w-full max-w-sm bg-[#1a1b20] border border-[#272930] rounded-xl p-8 text-center shadow-lg">
        {/* Ícone de verificação ou círculo girando */}
        <div className="flex justify-center mb-6">
          {!isRedirecting ? (
            <div className="w-14 h-14 rounded-full bg-[#23252d] border border-[#30333d] flex items-center justify-center">
              <svg
                className="w-7 h-7 text-emerald-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
          ) : (
            /* Círculo girando */
            <div className="w-14 h-14 rounded-full border-4 border-[#272930] border-t-emerald-400 animate-spin" />
          )}
        </div>

        {/* Mensagem de Redirecionamento */}
        {!isRedirecting ? (
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white uppercase mb-2">
              REDIRECIONANDO EM {countdown} {countdown === 1 ? 'SEGUNDO' : 'SEGUNDOS'}.
            </h1>
            <p className="text-xs text-[#8e94a4]">
              Verificação concluída. Redirecionando...
            </p>
          </div>
        ) : (
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white uppercase mb-2">
              REDIRECIONANDO...
            </h1>
            <p className="text-xs text-[#8e94a4]">
              Aguarde um instante.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
