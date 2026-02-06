import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react';

const UIContext = createContext();

export const useUI = () => {
    return useContext(UIContext);
};

export const UIProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const [confirmModal, setConfirmModal] = useState(null);

    const showToast = useCallback((message, type = 'success') => {
        const id = Date.now();
        const cleanMessage = message.replace(/✅|❌|⚠️|🔥/g, '').trim(); 
        
        setToasts(prev => [...prev, { id, message: cleanMessage, type }]);
        
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 4000);
    }, []);

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    const showConfirm = useCallback((message, onConfirm, onCancel) => {
        setConfirmModal({
            message,
            onConfirm: () => {
                if (onConfirm) onConfirm();
                setConfirmModal(null);
            },
            onCancel: () => {
                if (onCancel) onCancel();
                setConfirmModal(null);
            }
        });
    }, []);

    return (
        <UIContext.Provider value={{ showToast, showConfirm }}>
            {children}
            
            <div className="fixed top-24 right-6 z-[200] flex flex-col gap-4 pointer-events-none">
                {toasts.map(toast => (
                    <div 
                        key={toast.id} 
                        className={`pointer-events-auto animate-slide-in relative overflow-hidden backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] rounded-2xl p-4 flex items-start gap-4 min-w-[320px] max-w-sm ${
                            toast.type === 'success' ? 'bg-emerald-500/20 shadow-emerald-500/10' : 
                            toast.type === 'error' ? 'bg-red-500/20 shadow-red-500/10' : 'bg-blue-500/20 shadow-blue-500/10'
                        }`}
                    >
                        <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-white/10 ${
                            toast.type === 'success' ? 'bg-emerald-500/30' : 
                            toast.type === 'error' ? 'bg-red-500/30' : 'bg-blue-500/30'
                        }`}>
                            {toast.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-200" />}
                            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-red-200" />}
                            {toast.type === 'info' && <Info className="w-4 h-4 text-blue-200" />}
                        </div>
                        <div className="flex-1 pt-0.5">
                            <h3 className="font-bold text-sm text-white capitalize">{toast.type}</h3>
                            <p className="text-xs text-white/80 mt-1 leading-relaxed">{toast.message}</p>
                        </div>
                        <button onClick={() => removeToast(toast.id)} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                            <X className="w-4 h-4 text-white/40 hover:text-white" />
                        </button>
                    </div>
                ))}
            </div>

            {confirmModal && (
                <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
                    <div className="glass-panel w-full max-w-md p-8 rounded-3xl border border-white/10 shadow-2xl transform transition-all scale-100">
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-2 animate-bounce-slow">
                                <AlertCircle size={32} className="text-emerald-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Confirmation</h3>
                            <p className="text-white/70 mb-6">{confirmModal.message}</p>
                            
                            <div className="flex gap-4 w-full">
                                <button 
                                    onClick={confirmModal.onCancel}
                                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-semibold transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={confirmModal.onConfirm}
                                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20 rounded-xl font-bold transition-all"
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </UIContext.Provider>
    );
};
