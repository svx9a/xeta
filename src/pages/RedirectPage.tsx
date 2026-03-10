import React, { useEffect } from 'react';
import appBridge from '../services/appBridge';
import { Page } from '../types';

const parseHash = () => {
  const hash = typeof window !== 'undefined' ? window.location.hash : '';
  const [path, query = ''] = hash.replace(/^#\/?/, '').split('?');
  const params = new URLSearchParams(query);
  return { path, params };
};

const normalizePage = (p: string): Page | null => {
  const pages: Page[] = ['home', 'payments', 'payouts', 'plugins', 'integrations', 'developer', 'reports', 'settings', 'account', 'redirect'];
  return (pages.includes(p as Page) ? (p as Page) : null);
};

const RedirectPage: React.FC = () => {
  useEffect(() => {
    const { params } = parseHash();
    const to = params.get('to') || params.get('page') || '';
    const url = params.get('url') || '';
    const external = params.get('external') || '';

    if (external) {
      appBridge.openExternal(external);
      return;
    }
    if (url) {
      appBridge.navigate(url);
      return;
    }
    const page = normalizePage(to);
    if (page) {
      appBridge.navigate(page);
      return;
    }
    appBridge.navigate('home');
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-12 animate-fadeIn relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative group">
        <div className="w-32 h-32 bg-blue-600/10 rounded-[2.5rem] blur-3xl animate-pulse group-hover:scale-150 transition-transform duration-1000" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="w-8 h-8 bg-blue-600 rounded-xl shadow-[0_0_40px_#4F8FC9] animate-spin duration-[3000ms] border-2 border-slate-300" />
            <div className="absolute inset-0 w-8 h-8 bg-blue-600 rounded-xl shadow-[0_0_60px_#4F8FC9] animate-ping opacity-20" />
          </div>
        </div>
      </div>

      <div className="space-y-6 text-center relative z-10">
        <div className="text-[12px] font-black text-blue-600/60 uppercase tracking-[1em] opacity-80 pl-[1em]">Protocol Exchange // v9.0</div>
        <div className="text-4xl font-black text-slate-800 uppercase tracking-[0.2em] animate-pulse leading-none">Establishing Bridge...</div>
        <div className="flex items-center justify-center gap-4 mt-8">
          <div className="h-[2px] w-12 bg-gradient-to-r from-transparent to-[#4F8FC9]/40" />
          <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" />
          <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce delay-100" />
          <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce delay-200" />
          <div className="h-[2px] w-12 bg-gradient-to-l from-transparent to-[#4F8FC9]/40" />
        </div>
      </div>
    </div>
  );
};

export default RedirectPage;
