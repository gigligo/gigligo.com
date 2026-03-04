'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Lock,
    ShieldCheck,
    Key,
    Smartphone,
    ChevronRight,
    CheckCircle2,
    AlertCircle,
    Eye,
    EyeOff,
    Loader2,
    Zap,
    Fingerprint,
    Activity,
    QrCode,
    RotateCcw
} from 'lucide-react';
import { toast } from 'sonner';

export function SecurityView({ userData, token, apiUrl }: { userData: any; token: string; apiUrl: string }) {
    const isGoogleAccount = userData?.isGoogleAccount || false;

    // Security Tab State
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    // 2FA State
    const [is2FAEnabled, setIs2FAEnabled] = useState<boolean | null>(null);
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [setupMode, setSetupMode] = useState(false);
    const [twoFactorCode, setTwoFactorCode] = useState('');
    const [is2FALoading, setIs2FALoading] = useState(false);

    // Status Messages
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        if (errorMsg || successMsg) {
            const timer = setTimeout(() => { setErrorMsg(''); setSuccessMsg(''); }, 5000);
            return () => clearTimeout(timer);
        }
    }, [errorMsg, successMsg]);

    useEffect(() => {
        if (token) {
            fetch(`${apiUrl}/api/auth/2fa/status`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => {
                    setIs2FAEnabled(data.enabled);
                })
                .catch(err => console.error('Failed to fetch 2FA status', err));
        }
    }, [token, apiUrl]);

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error('Identity verification required. All fields mandatory.'); return;
        }
        if (newPassword !== confirmPassword) {
            toast.error('Cryptographic mismatch. Passwords do not align.'); return;
        }
        setIsChangingPassword(true);
        try {
            const res = await fetch(`${apiUrl}/api/auth/profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ currentPassword, newPassword })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Protocol failure. Password update denied.');
            toast.success('Access keys rotated successfully.');
            setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setIsChangingPassword(false);
        }
    };

    const handleGenerate2FA = async () => {
        setIs2FALoading(true);
        try {
            const res = await fetch(`${apiUrl}/api/auth/2fa/generate`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to initialize 2FA seed.');
            setQrCodeUrl(data.qrCodeUrl); setSetupMode(true);
            toast.info("2FA Seed generated. Proceed with synchronization.");
        } catch (err: any) { toast.error(err.message); }
        finally { setIs2FALoading(false); }
    };

    const handleVerify2FA = async () => {
        setIs2FALoading(true);
        try {
            const res = await fetch(`${apiUrl}/api/auth/2fa/verify`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ code: twoFactorCode }) });
            if (!res.ok) throw new Error('Invalid sequence. Verification failed.');
            setIs2FAEnabled(true); setSetupMode(false); setQrCodeUrl(''); setTwoFactorCode('');
            toast.success('MFA Tunnel established. Authorization granted.');
        } catch (err: any) { toast.error(err.message); }
        finally { setIs2FALoading(false); }
    };

    const handleDisable2FA = async () => {
        setIs2FALoading(true);
        try {
            const res = await fetch(`${apiUrl}/api/auth/2fa/disable`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ code: twoFactorCode }) });
            if (!res.ok) throw new Error('Authorization failure. 2FA lockdown remains.');
            setIs2FAEnabled(false); setTwoFactorCode('');
            toast.success('MFA Tunnel dismantled. Security level reduced.');
        } catch (err: any) { toast.error(err.message); }
        finally { setIs2FALoading(false); }
    };

    return (
        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="space-y-4">
                <h2 className="text-3xl font-bold text-white tracking-tight">Security & Privacy</h2>
                <p className="text-lg font-medium text-white/40 leading-tight">Manage your account protection and authentication methods.</p>
            </div>

            <div className="grid grid-cols-1 gap-12">

                {/* 2-Step Verification Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/2 border border-white/5 rounded-3xl p-10 md:p-14 backdrop-blur-3xl shadow-2xl shadow-black relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

                    <div className="flex justify-between items-start mb-10">
                        <div className="space-y-2">
                            <h3 className="text-[11px] font-bold text-primary uppercase tracking-widest">Enhanced Protection</h3>
                            <div className="flex items-center gap-4">
                                <h4 className="text-2xl font-bold text-white tracking-tight">Two-Factor Auth</h4>
                                {is2FAEnabled && <span className="px-2.5 py-1 bg-primary text-white text-[8px] font-bold uppercase tracking-widest rounded-full">Active</span>}
                            </div>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-black border border-white/5 flex items-center justify-center text-primary shadow-xl shadow-black group-hover:scale-105 transition-transform duration-500">
                            <Fingerprint size={24} strokeWidth={1.5} />
                        </div>
                    </div>

                    <p className="text-sm font-medium text-white/20 mb-10 leading-relaxed max-w-xl">
                        Add an extra layer of security by requiring a verification code from your authenticator app for sensitive actions and withdrawals.
                    </p>

                    <AnimatePresence mode="wait">
                        {is2FAEnabled === null ? (
                            <div className="flex items-center gap-4 text-[10px] font-black text-white/20 uppercase tracking-[0.4em] animate-pulse italic">
                                <Activity size={14} className="animate-spin" /> SYNCHRONIZING WITH CENTRAL COMMAND...
                            </div>
                        ) : is2FAEnabled ? (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-black/40 border border-white/5 rounded-2xl p-8 space-y-6"
                            >
                                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Enter code to disable protection.</p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <input
                                        type="text"
                                        placeholder="000000"
                                        value={twoFactorCode}
                                        onChange={(e) => setTwoFactorCode(e.target.value)}
                                        className="bg-black/40 border border-white/10 rounded-xl px-6 py-4 text-xl font-bold tracking-tight text-white focus:outline-none focus:border-red-500/30 transition-all placeholder:text-white/10 font-mono flex-1"
                                        maxLength={6}
                                    />
                                    <button
                                        onClick={handleDisable2FA}
                                        disabled={is2FALoading || twoFactorCode.length < 6}
                                        className="px-8 py-4 bg-red-500/5 border border-red-500/10 text-red-500 text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-red-500 hover:text-white transition-all active:scale-95 disabled:opacity-20"
                                    >
                                        {is2FALoading ? <Loader2 className="animate-spin" size={20} /> : 'Disable 2FA'}
                                    </button>
                                </div>
                            </motion.div>
                        ) : setupMode && qrCodeUrl ? (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-black/40 border border-primary/10 rounded-3xl p-10 space-y-10"
                            >
                                <div className="flex flex-col md:flex-row items-center gap-10">
                                    <div className="bg-white p-5 rounded-2xl shadow-xl shadow-primary/10 relative group overflow-hidden">
                                        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <img src={qrCodeUrl} alt="2FA QR Code" className="w-40 h-40 mix-blend-multiply transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white border-4 border-black">
                                            <QrCode size={16} />
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-6">
                                        <div className="space-y-1">
                                            <h4 className="text-xl font-bold text-white tracking-tight">Setup Authentication</h4>
                                            <p className="text-sm font-medium text-white/30 leading-relaxed">Scan the QR code with your authenticator app and enter the 6-digit code below.</p>
                                        </div>
                                        <div className="space-y-4">
                                            <input
                                                type="text"
                                                placeholder="000 000"
                                                value={twoFactorCode}
                                                onChange={(e) => setTwoFactorCode(e.target.value)}
                                                className="w-full bg-surface-light border border-white/5 rounded-xl px-6 py-4 text-xl font-bold tracking-tight text-white focus:outline-none focus:border-primary/40 transition-all placeholder:text-white/10 font-mono"
                                                maxLength={6}
                                            />
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={handleVerify2FA}
                                                    disabled={is2FALoading || twoFactorCode.length < 6}
                                                    className="flex-1 h-14 bg-primary text-white text-[11px] font-bold uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-20"
                                                >
                                                    {is2FALoading ? <Loader2 className="animate-spin" size={18} /> : <><ShieldCheck size={16} /> Verify Node</>}
                                                </button>
                                                <button
                                                    onClick={() => { setSetupMode(false); setQrCodeUrl(''); setTwoFactorCode(''); }}
                                                    className="px-8 h-14 bg-white/5 border border-white/5 text-white/40 text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-white/10 hover:text-white transition-all"
                                                >
                                                    Abort
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <button
                                onClick={handleGenerate2FA}
                                disabled={is2FALoading}
                                className="h-16 px-10 bg-primary text-white text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-primary-dark transition-all shadow-xl shadow-primary/25 flex items-center gap-4 active:scale-95 disabled:opacity-20"
                            >
                                {is2FALoading ? <Loader2 className="animate-spin" size={20} /> : <><RotateCcw size={18} /> Enable 2FA Protection</>}
                            </button>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Key Rotation Card */}
                {!isGoogleAccount ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white/2 border border-white/5 rounded-3xl p-10 md:p-14 backdrop-blur-3xl shadow-2xl shadow-black relative overflow-hidden group"
                    >
                        <div className="flex justify-between items-start mb-10">
                            <div className="space-y-2">
                                <h3 className="text-[11px] font-bold text-primary uppercase tracking-widest">Access Credentials</h3>
                                <h4 className="text-2xl font-bold text-white tracking-tight">Security Credentials</h4>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-black border border-white/5 flex items-center justify-center text-primary shadow-xl shadow-black group-hover:scale-105 transition-transform duration-500">
                                <Key size={24} strokeWidth={1.5} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest pl-4">Current Password</label>
                                    <div className="relative group">
                                        <input
                                            type={showCurrentPassword ? 'text' : 'password'}
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            placeholder="••••••••••••"
                                            className="w-full bg-black/40 border border-white/5 rounded-xl px-6 py-4 text-xl font-bold tracking-tight text-white focus:outline-none focus:border-primary/40 transition-all placeholder:text-white/10"
                                        />
                                        <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 hover:text-primary transition-colors">
                                            {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest pl-4">New Password</label>
                                    <div className="relative group">
                                        <input
                                            type={showNewPassword ? 'text' : 'password'}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="New Password"
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-6 py-4 text-xl font-bold tracking-tight text-white focus:outline-none focus:border-primary/40 transition-all placeholder:text-white/10"
                                        />
                                        <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 hover:text-primary transition-colors">
                                            {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest pl-4">Confirm New Password</label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm Password"
                                        className="w-full bg-black/40 border border-white/5 rounded-xl px-6 py-4 text-xl font-bold tracking-tight text-white focus:outline-none focus:border-primary/40 transition-all placeholder:text-white/10"
                                    />
                                </div>

                                <button
                                    onClick={handleChangePassword}
                                    disabled={isChangingPassword}
                                    className="h-16 px-10 bg-primary text-white text-[11px] font-bold uppercase tracking-widest rounded-xl shadow-xl shadow-primary/25 flex items-center justify-center gap-4 active:scale-95 disabled:opacity-20 mt-8 w-full md:w-auto"
                                >
                                    {isChangingPassword ? <Loader2 className="animate-spin" size={18} /> : <><RotateCcw size={18} /> Update Password</>}
                                </button>
                            </div>

                            <div className="bg-white/1 border border-white/5 rounded-2xl p-8 flex flex-col justify-center gap-6 border-l-primary/40 border-l-4">
                                <div className="flex items-center gap-3 text-primary">
                                    <Activity size={18} />
                                    <h5 className="text-[10px] font-bold uppercase tracking-widest">Security Checklist</h5>
                                </div>
                                <p className="text-lg font-medium text-white/20 leading-relaxed">
                                    We recommend updating your password every 90 days. Use a combination of uppercase, lowercase, numbers, and symbols for maximum protection.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <div className="bg-white/2 border border-white/5 rounded-3xl p-10 md:p-14 backdrop-blur-3xl shadow-2xl shadow-black flex items-center gap-6 text-white/40">
                        <Lock className="text-primary/60" size={32} />
                        <p className="text-lg font-medium leading-tight">Your account is managed via Google OAuth. Password changes are handled through your Google account settings.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
