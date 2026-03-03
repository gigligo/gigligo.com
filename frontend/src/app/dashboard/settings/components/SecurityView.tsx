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
                <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Access Security</h2>
                <p className="text-xl font-bold italic text-white/40 leading-tight border-l-2 border-primary/20 pl-6">Establish offensive and defensive encryption protocols for your operative account.</p>
            </div>

            <div className="grid grid-cols-1 gap-12">

                {/* 2-Step Verification Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/2 border border-white/5 rounded-[4rem] p-12 md:p-16 backdrop-blur-3xl shadow-3xl shadow-black relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

                    <div className="flex justify-between items-start mb-12">
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.5em] italic">Redundancy Protocol</h3>
                            <div className="flex items-center gap-6">
                                <h4 className="text-3xl font-black text-white italic uppercase tracking-tighter">Dual-Phase Auth</h4>
                                {is2FAEnabled && <span className="px-3 py-1 bg-primary text-white text-[8px] font-black uppercase tracking-widest rounded-full animate-pulse italic">Shield Active</span>}
                            </div>
                        </div>
                        <div className="w-16 h-16 rounded-2xl bg-black border border-white/5 flex items-center justify-center text-primary shadow-2xl shadow-black group-hover:scale-110 transition-transform duration-700">
                            <Fingerprint size={28} strokeWidth={1.5} />
                        </div>
                    </div>

                    <p className="text-lg font-bold italic text-white/20 mb-12 leading-relaxed max-w-2xl">
                        Deploy secondary verification nodes via Authenticator App (RFC 6238). This cryptographic shield is mandatory for high-value transactional clearance.
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
                                className="bg-black/40 border border-white/5 rounded-[3rem] p-10 space-y-8"
                            >
                                <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] italic">Enter seed sequence to dismantle encryption.</p>
                                <div className="flex flex-col sm:flex-row gap-6">
                                    <input
                                        type="text"
                                        placeholder="SEQ-IDENTIFIER"
                                        value={twoFactorCode}
                                        onChange={(e) => setTwoFactorCode(e.target.value)}
                                        className="bg-black/40 border border-white/10 rounded-2xl px-8 py-5 text-xl font-black italic tracking-tighter text-white focus:outline-none focus:border-red-500/50 transition-all placeholder:text-white/10 font-mono flex-1"
                                        maxLength={6}
                                    />
                                    <button
                                        onClick={handleDisable2FA}
                                        disabled={is2FALoading || twoFactorCode.length < 6}
                                        className="px-10 py-5 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl hover:bg-red-500 hover:text-white transition-all italic active:scale-95 disabled:opacity-20"
                                    >
                                        {is2FALoading ? <Loader2 className="animate-spin" size={20} /> : 'DISMANTLE MFA'}
                                    </button>
                                </div>
                            </motion.div>
                        ) : setupMode && qrCodeUrl ? (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-black/40 border border-primary/20 rounded-[4rem] p-12 space-y-12"
                            >
                                <div className="flex flex-col md:flex-row items-center gap-12">
                                    <div className="bg-white p-6 rounded-[3rem] shadow-2xl shadow-primary/20 relative group overflow-hidden">
                                        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <img src={qrCodeUrl} alt="2FA QR Code" className="w-40 h-40 mix-blend-multiply transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white border-4 border-black">
                                            <QrCode size={16} />
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-8">
                                        <div className="space-y-2">
                                            <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter">Synchronization Required</h4>
                                            <p className="text-sm font-bold italic text-white/30 leading-relaxed">Scan the cryptographic seed with an authorized authenticator app and enter the generated sequence.</p>
                                        </div>
                                        <div className="space-y-6">
                                            <input
                                                type="text"
                                                placeholder="6-DIGIT GEN-KEY"
                                                value={twoFactorCode}
                                                onChange={(e) => setTwoFactorCode(e.target.value)}
                                                className="w-full bg-surface-light border border-white/10 rounded-2xl px-8 py-5 text-xl font-black italic tracking-tighter text-white focus:outline-none focus:border-primary transition-all placeholder:text-white/10 font-mono"
                                                maxLength={6}
                                            />
                                            <div className="flex gap-4">
                                                <button
                                                    onClick={handleVerify2FA}
                                                    disabled={is2FALoading || twoFactorCode.length < 6}
                                                    className="flex-1 h-16 bg-primary text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl shadow-2x shadow-primary/30 flex items-center justify-center gap-4 italic active:scale-95 disabled:opacity-20"
                                                >
                                                    {is2FALoading ? <Loader2 className="animate-spin" size={20} /> : <><ShieldCheck size={18} /> AUTHORIZE NODE</>}
                                                </button>
                                                <button
                                                    onClick={() => { setSetupMode(false); setQrCodeUrl(''); setTwoFactorCode(''); }}
                                                    className="px-10 h-16 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl hover:bg-white/10 transition-all italic"
                                                >
                                                    ABORT
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
                                className="h-20 px-12 bg-primary text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl hover:bg-primary-dark transition-all shadow-3xl shadow-primary/40 flex items-center gap-6 italic active:scale-95 disabled:opacity-20"
                            >
                                {is2FALoading ? <Loader2 className="animate-spin" size={20} /> : <><RotateCcw size={20} /> INITIALIZE MFA SEED</>}
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
                        className="bg-white/2 border border-white/5 rounded-[4rem] p-12 md:p-16 backdrop-blur-3xl shadow-3xl shadow-black relative overflow-hidden group"
                    >
                        <div className="flex justify-between items-start mb-12">
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.5em] italic">Access Key Management</h3>
                                <h4 className="text-3xl font-black text-white italic uppercase tracking-tighter">Credential Rotation</h4>
                            </div>
                            <div className="w-16 h-16 rounded-2xl bg-black border border-white/5 flex items-center justify-center text-primary shadow-2xl shadow-black group-hover:scale-110 transition-transform duration-700">
                                <Key size={28} strokeWidth={1.5} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] italic pl-4">Current Authorization Key</label>
                                    <div className="relative group">
                                        <input
                                            type={showCurrentPassword ? 'text' : 'password'}
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            placeholder="••••••••••••"
                                            className="w-full bg-black/40 border border-white/5 rounded-2xl px-8 py-5 text-xl font-black italic tracking-tighter text-white focus:outline-none focus:border-primary transition-all placeholder:text-white/10"
                                        />
                                        <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-8 top-1/2 -translate-y-1/2 text-white/20 hover:text-primary transition-colors">
                                            {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] italic pl-4">Primary New Sequence</label>
                                    <div className="relative group">
                                        <input
                                            type={showNewPassword ? 'text' : 'password'}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="NEW-IDENTIFIER"
                                            className="w-full bg-black/40 border border-white/10 rounded-2xl px-8 py-5 text-xl font-black italic tracking-tighter text-white focus:outline-none focus:border-primary transition-all placeholder:text-white/10"
                                        />
                                        <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-8 top-1/2 -translate-y-1/2 text-white/20 hover:text-primary transition-colors">
                                            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] italic pl-4">Sequence Verification</label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="RE-ENTER NEW-IDENTIFIER"
                                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-8 py-5 text-xl font-black italic tracking-tighter text-white focus:outline-none focus:border-primary transition-all placeholder:text-white/10"
                                    />
                                </div>

                                <button
                                    onClick={handleChangePassword}
                                    disabled={isChangingPassword}
                                    className="h-20 px-12 bg-primary text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl shadow-3xl shadow-primary/40 flex items-center justify-center gap-6 italic active:scale-95 disabled:opacity-20 mt-12 w-full md:w-auto"
                                >
                                    {isChangingPassword ? <Loader2 className="animate-spin" size={20} /> : <><RotateCcw size={20} /> EXECUTE KEY ROTATION</>}
                                </button>
                            </div>

                            <div className="bg-white/1 border border-white/5 rounded-[3rem] p-10 flex flex-col justify-center gap-8 border-l-primary/30 border-l-4">
                                <div className="flex items-center gap-4 text-primary">
                                    <Activity size={20} />
                                    <h5 className="text-[10px] font-black uppercase tracking-[0.4em]">Entropy Analysis</h5>
                                </div>
                                <p className="text-xl font-bold italic text-white/20 leading-relaxed">
                                    Rotating access keys every 90 days prevents static compromise. Ensure your sequence contains high entropy: alphanumeric, case-sensitive, and symbolic characters.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <div className="bg-white/2 border border-white/5 rounded-[4rem] p-12 md:p-16 backdrop-blur-3xl shadow-3xl shadow-black flex items-center gap-8 text-white/40 italic">
                        <Lock className="text-primary animate-pulse" size={40} />
                        <p className="text-xl font-bold italic leading-tight">Identity verified via External OAuth (Google). Centralized authentication node managed by secondary provider. Dynamic key rotation disabled.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
