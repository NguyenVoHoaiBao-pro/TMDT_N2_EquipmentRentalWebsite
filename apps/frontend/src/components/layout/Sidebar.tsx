import { type PropsWithChildren } from 'react';

export default function Sidebar({ children }: PropsWithChildren) {
  return (
    <aside className="w-full lg:w-72 border-b lg:border-b-0 lg:border-r border-white/5 bg-cine-surface/50 p-6 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:overflow-y-auto">
      {children}
    </aside>
  );
}
