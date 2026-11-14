"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface UnsavedChangesContextValue {
  isDirty: boolean;
  setIsDirty: (dirty: boolean) => void;
  dirtyScope: string | null;
  setDirtyScope: (scope: string | null) => void;
  confirmNavigation: (onConfirm: () => void, customDesc?: string) => void;
  discardAndNavigate: (onConfirm?: () => void) => void;
}

const UnsavedChangesContext = createContext<UnsavedChangesContextValue>({
  isDirty: false,
  setIsDirty: () => {},
  dirtyScope: null,
  setDirtyScope: () => {},
  confirmNavigation: (onConfirm) => onConfirm(),
  discardAndNavigate: (onConfirm) => onConfirm?.(),
});

export function useUnsavedChanges() {
  return useContext(UnsavedChangesContext);
}

export function useDirtyTracker(isFormDirty: boolean, scope?: string) {
  const { setIsDirty, setDirtyScope } = useUnsavedChanges();

  useEffect(() => {
    setIsDirty(isFormDirty);
    if (isFormDirty && scope) {
      setDirtyScope(scope);
    } else if (!isFormDirty) {
      setDirtyScope(null);
    }

    return () => {
      setIsDirty(false);
      setDirtyScope(null);
    };
  }, [isFormDirty, scope, setIsDirty, setDirtyScope]);
}

export function UnsavedBadge({ className }: { className?: string }) {
  const { isDirty } = useUnsavedChanges();
  if (!isDirty) return null;

  return (
    <span
      role="status"
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold tracking-tight bg-amber-500/10 text-amber-700 border border-amber-500/25 shadow-[0_2px_8px_rgba(245,158,11,0.12)] animate-in fade-in zoom-in-95 duration-200 select-none",
        className
      )}
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
      </span>
      <span>Perubahan Belum Disimpan</span>
    </span>
  );
}

export function UnsavedChangesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDirty, setIsDirty] = useState(false);
  const [dirtyScope, setDirtyScope] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customDescription, setCustomDescription] = useState<string | null>(null);
  const pendingNavCallbackRef = useRef<(() => void) | null>(null);

  // Mencegah refresh atau menutup tab browser saat ada perubahan yang belum disimpan
  useEffect(() => {
    if (!isDirty) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

  const confirmNavigation = useCallback(
    (onConfirm: () => void, customDesc?: string) => {
      if (!isDirty) {
        onConfirm();
        return;
      }

      pendingNavCallbackRef.current = onConfirm;
      setCustomDescription(customDesc || null);
      setIsModalOpen(true);
    },
    [isDirty]
  );

  const discardAndNavigate = useCallback(
    (onConfirm?: () => void) => {
      setIsDirty(false);
      setDirtyScope(null);
      setIsModalOpen(false);
      pendingNavCallbackRef.current = null;
      if (onConfirm) {
        onConfirm();
      }
    },
    []
  );

  const handleLeave = () => {
    setIsDirty(false);
    setDirtyScope(null);
    setIsModalOpen(false);
    const cb = pendingNavCallbackRef.current;
    pendingNavCallbackRef.current = null;
    if (cb) {
      cb();
    }
  };

  const handleStay = () => {
    setIsModalOpen(false);
    setCustomDescription(null);
    pendingNavCallbackRef.current = null;
  };

  const contextValue = useMemo(
    () => ({
      isDirty,
      setIsDirty,
      dirtyScope,
      setDirtyScope,
      confirmNavigation,
      discardAndNavigate,
    }),
    [isDirty, dirtyScope, confirmNavigation, discardAndNavigate]
  );

  return (
    <UnsavedChangesContext.Provider value={contextValue}>
      {children}

      {/* Modal Dialog Konfirmasi Perubahan Belum Disimpan */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0c0f1d]/60 backdrop-blur-[3px] p-4 animate-in fade-in duration-150"
          onClick={handleStay}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md overflow-hidden rounded-[24px] border border-zinc-200/90 bg-white p-6 sm:p-7 shadow-[0_20px_50px_rgba(12,15,29,0.18)] text-left"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/80">
                <AlertTriangle className="h-5 w-5 stroke-[2.2]" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-[17px] font-semibold text-[#0c0f1d] tracking-[-0.01em]">
                  Ada Perubahan Belum Disimpan
                </h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-zinc-500">
                  {customDescription ||
                    (dirtyScope
                      ? `Anda telah mengubah data pada ${dirtyScope}. Jika berpindah halaman atau tab sekarang, editan Anda belum tersimpan dan akan hilang.`
                      : "Anda telah mengubah konten pada halaman ini. Jika berpindah halaman atau tab sekarang, editan Anda belum tersimpan dan akan hilang.")}
                </p>
              </div>

              <button
                type="button"
                onClick={handleStay}
                aria-label="Tutup dialog"
                className="text-zinc-400 hover:text-zinc-700 p-1 rounded-full cursor-pointer transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5 pt-4 border-t border-zinc-100">
              <button
                type="button"
                onClick={handleStay}
                className="w-full sm:w-auto px-4 py-2.5 rounded-full border border-zinc-200/90 bg-white hover:bg-zinc-50 text-[13px] font-medium text-[#0c0f1d] transition-colors cursor-pointer text-center"
              >
                Tetap di Sini (Simpan Dulu)
              </button>

              <button
                type="button"
                onClick={handleLeave}
                className="w-full sm:w-auto px-4 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-[13px] font-medium text-white transition-colors cursor-pointer shadow-sm text-center"
              >
                Tinggalkan Halaman
              </button>
            </div>
          </div>
        </div>
      )}
    </UnsavedChangesContext.Provider>
  );
}
