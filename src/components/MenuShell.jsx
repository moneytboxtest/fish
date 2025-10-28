import { InfoBar } from './InfoBar.jsx';
import { useMemo } from 'react';

export function MenuShell({
  children,
  backgroundImage = '/background/mb.jpg',
  showInfoBar = true,
  overlayClassName = 'bg-slate-950/35 backdrop-blur-sm',
  contentClassName = 'relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:py-12',
}) {
  const backgroundStyle = useMemo(
    () => ({ backgroundImage: `url('${backgroundImage}')` }),
    [backgroundImage],
  );

  return (
    <div className="relative min-h-screen overflow-hidden">
      {showInfoBar && <InfoBar />}
      <div
        className="absolute inset-0 -z-30 bg-cover bg-center"
        style={backgroundStyle}
        aria-hidden
      />
      <div className={`absolute inset-0 -z-20 ${overlayClassName}`} aria-hidden />
      <div className={contentClassName}>{children}</div>
    </div>
  );
}
