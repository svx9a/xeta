type RouteChangeHandler = (path: string) => void;

type AppBridgeType = {
  platform: () => 'web' | 'node';
  navigate: (path: string) => void;
  openExternal: (url: string) => void;
  getStorage: (key: string) => string | null;
  setStorage: (key: string, value: string) => void;
  removeStorage: (key: string) => void;
  onRouteChange: (handler: RouteChangeHandler) => () => void;
};

const appBridge: AppBridgeType = {
  platform: () => (typeof window === 'undefined' ? 'node' : 'web'),
  navigate: (path: string) => {
    const normalized = path.startsWith('#') ? path : `#/${path.replace(/^\/+/, '')}`;
    if (typeof window !== 'undefined') {
      window.location.hash = normalized;
    }
  },
  openExternal: (url: string) => {
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  },
  getStorage: (key: string) => {
    if (typeof window === 'undefined') return null;
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setStorage: (key: string, value: string) => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      console.warn('setStorage failed:', error);
    }
  },
  removeStorage: (key: string) => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.warn('removeStorage failed:', error);
    }
  },
  onRouteChange: (handler: RouteChangeHandler) => {
    if (typeof window === 'undefined') return () => {};
    const fn = () => handler(window.location.hash || '');
    window.addEventListener('hashchange', fn);
    return () => window.removeEventListener('hashchange', fn);
  },
};

export default appBridge;
