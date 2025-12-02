import React from 'react';
import { Loader2 } from 'lucide-react';

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-slate-400">
      <Loader2 className="animate-spin mb-4 text-blue-500" size={48} />
      <p className="text-sm font-medium animate-pulse">Loading visualization resources...</p>
    </div>
  );
};

export default Loading;
