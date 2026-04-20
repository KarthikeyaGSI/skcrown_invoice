'use client';

import React, { useRef } from 'react';
import SignaturePad from 'react-signature-canvas';
import { Trash2, Check } from 'lucide-react';

interface Props {
  onSave: (signature: string) => void;
  onClear: () => void;
}

export default function SignatureCapture({ onSave, onClear }: Props) {
  const sigPad = useRef<SignaturePad>(null);

  const clear = () => {
    sigPad.current?.clear();
    onClear();
  };

  const save = () => {
    if (sigPad.current?.isEmpty()) return;
    const data = sigPad.current?.getTrimmedCanvas().toDataURL('image/png');
    if (data) onSave(data);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-charcoal rounded-xl border-2 border-dashed border-black/5 dark:border-white/10 overflow-hidden relative group">
        <SignaturePad
          ref={sigPad}
          penColor="#C9A646"
          canvasProps={{
            className: "w-full min-h-[150px] cursor-crosshair",
          }}
        />
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={clear}
            className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
          >
            <Trash2 size={16} />
          </button>
          <button 
            onClick={save}
            className="p-1.5 bg-green-50 text-green-500 rounded-lg hover:bg-green-100 transition-colors"
          >
            <Check size={16} />
          </button>
        </div>
      </div>
      <p className="text-[10px] text-black/30 dark:text-white/20 uppercase tracking-widest font-bold text-center">
        Sign above to approve quotation
      </p>
    </div>
  );
}
