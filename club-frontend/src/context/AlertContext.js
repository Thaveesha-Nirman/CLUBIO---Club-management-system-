import React, { createContext, useContext, useState } from 'react';

/**
 * * Member 09 : Settings & System
 * * Context for managing global alerts and confirmations.
 */
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const AlertContext = createContext();

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error('useAlert must be used within AlertProvider');
    }
    return context;
};

export const AlertProvider = ({ children }) => {
    const [alert, setAlert] = useState(null);
    const [confirm, setConfirm] = useState(null);

    const showAlert = (message, type = 'info', duration = 4000) => {
        setAlert({ message, type, duration });
        if (duration > 0) {
            setTimeout(() => setAlert(null), duration);
        }
    };

    const showConfirm = (message, options = {}) => {
        return new Promise((resolve) => {
            setConfirm({
                message,
                confirmText: options.confirmText || 'Confirm',
                cancelText: options.cancelText || 'Cancel',
                isDanger: options.isDanger || false,
                onConfirm: () => {
                    setConfirm(null);
                    resolve(true);
                },
                onCancel: () => {
                    setConfirm(null);
                    resolve(false);
                }
            });
        });
    };

    return (
        <AlertContext.Provider value={{ showAlert, showConfirm }}>
            {children}
            {alert && <CustomAlert {...alert} onClose={() => setAlert(null)} />}
            {confirm && <CustomConfirm {...confirm} />}
        </AlertContext.Provider>
    );
};

const CustomAlert = ({ message, type, onClose }) => {
    const icons = {
        success: <CheckCircle className="w-6 h-6" />,
        error: <XCircle className="w-6 h-6" />,
        warning: <AlertTriangle className="w-6 h-6" />,
        info: <Info className="w-6 h-6" />
    };

    const colors = {
        success: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400',
        error: 'from-red-500/20 to-rose-500/20 border-red-500/30 text-red-400',
        warning: 'from-amber-500/20 to-yellow-500/20 border-amber-500/30 text-amber-400',
        info: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400'
    };

    const iconColors = {
        success: 'text-emerald-400',
        error: 'text-red-400',
        warning: 'text-amber-400',
        info: 'text-blue-400'
    };

    return (
        <>
            <style>{`
        @keyframes slideInDown {
          from { opacity: 0; transform: translateY(-100%) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .alert-enter { animation: slideInDown 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
      `}</style>

            <div className="fixed top-0 left-0 right-0 z-[9999] flex justify-center pt-6 px-4 pointer-events-none">
                <div className={`alert-enter pointer-events-auto max-w-md w-full bg-gradient-to-r ${colors[type]} backdrop-blur-xl border rounded-2xl shadow-2xl p-4 flex items-center gap-4`}>
                    <div className={iconColors[type]}>
                        {icons[type]}
                    </div>
                    <p className="flex-1 text-white font-medium text-sm leading-relaxed">
                        {message}
                    </p>
                    <button
                        onClick={onClose}
                        className="text-white/50 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>
        </>
    );
};

const CustomConfirm = ({ message, confirmText, cancelText, isDanger, onConfirm, onCancel }) => {
    return (
        <>
            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .backdrop-enter { animation: fadeIn 0.3s ease-out; }
        .modal-enter { animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
      `}</style>

            <div className="backdrop-enter fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] flex items-center justify-center p-4">
                <div className="modal-enter w-full max-w-md bg-gradient-to-br from-emerald-900/40 via-teal-900/40 to-black/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-6 space-y-6">

                    <div className={`w-16 h-16 rounded-2xl ${isDanger ? 'bg-red-500/10 border border-red-500/20' : 'bg-emerald-500/10 border border-emerald-500/20'} flex items-center justify-center mx-auto`}>
                        {isDanger ? (
                            <AlertTriangle className="w-8 h-8 text-red-400" />
                        ) : (
                            <Info className="w-8 h-8 text-emerald-400" />
                        )}
                    </div>

                    <div className="text-center">
                        <p className="text-white text-lg font-semibold leading-relaxed">
                            {message}
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onCancel}
                            className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-semibold transition-all active:scale-95"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`flex-1 px-4 py-3 ${isDanger ? 'bg-red-600 hover:bg-red-500' : 'bg-emerald-600 hover:bg-emerald-500'} text-white rounded-xl font-semibold shadow-lg transition-all active:scale-95`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
