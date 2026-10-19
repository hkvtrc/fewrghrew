import React, { Suspense } from 'react';
import PresellRedirect from '@/components/PresellRedirect';

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-[#0c0e14] text-zinc-400">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-zinc-700 border-t-emerald-400 animate-spin" />
            <span className="text-xs font-mono uppercase tracking-wider">
              Carregando verificação...
            </span>
          </div>
        </div>
      }
    >
      <PresellRedirect />
    </Suspense>
  );
}
