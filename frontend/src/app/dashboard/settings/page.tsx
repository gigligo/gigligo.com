'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Navbar } from '@/components/Navbar';
import { ShieldCheck, Activity, KeyRound, QrCode } from 'lucide-react';

export default function SettingsPage() {
    const { data: session } = useSession();

    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    // 2FA States
    const [is2FAEnabled, setIs2FAEnabled] = useState<boolean | null>(null);
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [twoFactorCode, setTwoFactorCode] = useState('');
    const [is2FALoading, setIs2FALoading] = useState(false);
    const [setupMode, setSetupMode] = useState(false); // When they click enable

    const token = (session as any)?.accessToken;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

    useEffect(() => {
        if (token) {
            fetch(`${apiUrl}/api/auth/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => {
                    setIs2FAEnabled(data.isTwoFactorEnabled || false);
                })
                .catch(err => console.error('Failed to fetch profile', err));
        }
    }, [token, apiUrl]);



    const handleGenerate2FA = async () => {
        setIs2FALoading(true);
        setErrorMsg('');
        try {
            const res = await fetch(`${apiUrl}/api/auth/2fa/generate`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to generate 2FA secret');
            const data = await res.json();
            setQrCodeUrl(data.qrCodeUrl);
            setSetupMode(true);
        } catch (err: any) {
            setErrorMsg(err.message || '2FA generation failed.');
        } finally {
            setIs2FALoading(false);
        }
    };

    const handleVerify2FA = async () => {
        setIs2FALoading(true);
        setErrorMsg('');
        setSuccessMsg('');
        try {
            const res = await fetch(`${apiUrl}/api/auth/2fa/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ code: twoFactorCode })
            });
            if (!res.ok) throw new Error('Invalid code or setup failed');

            setIs2FAEnabled(true);
            setSetupMode(false);
            setTwoFactorCode('');
            setSuccessMsg('Two-Factor Authentication has been successfully enabled!');
        } catch (err: any) {
            setErrorMsg(err.message || '2FA verification failed.');
        } finally {
            setIs2FALoading(false);
        }
    };

    const handleDisable2FA = async () => {
        if (!twoFactorCode) {
            setErrorMsg('Please enter your authenticator code to disable 2FA.');
            return;
        }
        setIs2FALoading(true);
        setErrorMsg('');
        setSuccessMsg('');
        try {
            const res = await fetch(`${apiUrl}/api/auth/2fa/disable`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ code: twoFactorCode })
            });
            if (!res.ok) throw new Error('Invalid code or disable failed');

            setIs2FAEnabled(false);
            setTwoFactorCode('');
            setSuccessMsg('Two-Factor Authentication has been disabled.');
        } catch (err: any) {
            setErrorMsg(err.message || '2FA disable failed.');
        } finally {
            setIs2FALoading(false);
        }
    };

    if (!session) return null;

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#000]">
            <Navbar />

            <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8" style={{ paddingTop: 100 }}>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-[#EFEEEA] mb-8">Account Settings</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Settings Navigation Sidebar */}
                    <div className="space-y-2">
                        <button className="w-full text-left px-4 py-3 bg-white dark:bg-[#111] border-slate-200 dark:border-[#FE7743]/50 text-slate-900 dark:text-[#FE7743] font-semibold rounded-xl flex items-center gap-3">
                            <ShieldCheck className="w-5 h-5" /> Security & Login
                        </button>
                        <button disabled className="w-full text-left px-4 py-3 bg-transparent text-slate-900 dark:text-[#EFEEEA]/50 font-semibold rounded-xl flex items-center gap-3 hover:bg-white/5 transition opacity-50 cursor-not-allowed">
                            <Activity className="w-5 h-5" /> Activity Log
                        </button>
                    </div>

                    {/* Main Settings Panel */}
                    <div className="md:col-span-2 space-y-6">

                        {errorMsg && <div className="bg-red-500/10 text-red-500 border border-red-500/20 p-4 rounded-xl text-sm mb-4">{errorMsg}</div>}
                        {successMsg && <div className="bg-green-500/10 text-green-400 border border-green-500/20 p-4 rounded-xl text-sm mb-4 font-semibold flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> {successMsg}</div>}


                        {/* Two-Factor Authentication Section */}
                        <div className="bg-white dark:bg-[#111] p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/10">
                                        <KeyRound className="w-6 h-6 text-purple-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900 dark:text-[#EFEEEA] flex items-center gap-2">
                                            Two-Factor Authentication (2FA)
                                            {is2FAEnabled && <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Enabled</span>}
                                        </h2>
                                        <p className="text-sm text-slate-900 dark:text-[#EFEEEA]/60">Secure your account with a TOTP authenticator app like Google Authenticator.</p>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-slate-200 dark:border-white/10 my-6" />

                            {is2FAEnabled === null ? (
                                <div className="text-sm text-slate-500 dark:text-white/50 animate-pulse">Checking 2FA status...</div>
                            ) : is2FAEnabled ? (
                                <div className="bg-slate-50 dark:bg-white/2 rounded-xl border border-slate-200 dark:border-white/5 p-5">
                                    <h3 className="font-semibold text-slate-900 dark:text-[#EFEEEA] mb-1">Disable 2FA</h3>
                                    <p className="text-xs text-slate-900 dark:text-[#EFEEEA]/50 mb-4 leading-relaxed tracking-wide">
                                        To disable 2FA, please enter a code from your authenticator app to verify it is you.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <input
                                            type="text"
                                            placeholder="6-digit code"
                                            value={twoFactorCode}
                                            onChange={(e) => setTwoFactorCode(e.target.value)}
                                            className="bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-purple-400"
                                            maxLength={6}
                                        />
                                        <button
                                            onClick={handleDisable2FA}
                                            disabled={is2FALoading || twoFactorCode.length < 6}
                                            className="px-6 py-2.5 bg-red-500/10 text-red-500 font-bold rounded-lg text-sm hover:bg-red-500/20 transition disabled:opacity-50 min-w-[120px]"
                                        >
                                            {is2FALoading ? 'Disabling...' : 'Disable 2FA'}
                                        </button>
                                    </div>
                                </div>
                            ) : setupMode && qrCodeUrl ? (
                                <div className="bg-slate-50 dark:bg-white/2 rounded-xl border border-slate-200 dark:border-white/5 p-5">
                                    <h3 className="font-semibold text-slate-900 dark:text-[#EFEEEA] mb-4">Complete 2FA Setup</h3>
                                    <ol className="text-sm text-slate-900 dark:text-[#EFEEEA]/70 space-y-3 mb-6 list-decimal list-inside">
                                        <li>Open your Authenticator app (e.g., Google Authenticator, Authy).</li>
                                        <li>Scan the QR code below.</li>
                                        <li>Enter the 6-digit code generated by the app.</li>
                                    </ol>
                                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
                                        <div className="bg-white p-2 rounded-xl inline-block">
                                            { }
                                            <img src={qrCodeUrl} alt="2FA QR Code" className="w-32 h-32" loading="lazy" />
                                        </div>
                                        <div className="flex-1 w-full space-y-4">
                                            <div>
                                                <label className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-1 block">Verification Code</label>
                                                <input
                                                    type="text"
                                                    placeholder="123456"
                                                    value={twoFactorCode}
                                                    onChange={(e) => setTwoFactorCode(e.target.value)}
                                                    className="w-full bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-purple-400 text-lg tracking-[0.2em] font-mono placeholder:tracking-normal"
                                                    maxLength={6}
                                                />
                                            </div>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={handleVerify2FA}
                                                    disabled={is2FALoading || twoFactorCode.length < 6}
                                                    className="flex-1 px-6 py-3 bg-purple-500 text-white font-bold rounded-lg text-sm hover:bg-purple-600 transition shadow-lg shadow-purple-500/20 disabled:opacity-50"
                                                >
                                                    {is2FALoading ? 'Verifying...' : 'Verify & Enable'}
                                                </button>
                                                <button
                                                    onClick={() => { setSetupMode(false); setQrCodeUrl(''); setTwoFactorCode(''); }}
                                                    className="px-4 py-3 bg-white/5 text-white font-semibold rounded-lg text-sm hover:bg-white/10 transition"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-slate-50 dark:bg-white/2 rounded-xl border border-slate-200 dark:border-white/5 p-5">
                                    <h3 className="font-semibold text-slate-900 dark:text-[#EFEEEA] mb-1">Protect your account</h3>
                                    <p className="text-xs text-slate-900 dark:text-[#EFEEEA]/50 mb-4 leading-relaxed tracking-wide">
                                        Enabling 2FA adds an extra layer of security to your account. You will need to provide a code from your authenticator app when making major withdrawals.
                                    </p>
                                    <button
                                        onClick={handleGenerate2FA}
                                        disabled={is2FALoading}
                                        className="px-6 py-2.5 bg-purple-500 text-white font-bold rounded-lg text-sm hover:bg-purple-600 transition shadow-lg shadow-purple-500/20 disabled:opacity-50 flex items-center justify-center min-w-[120px]"
                                    >
                                        {is2FALoading ? 'Loading...' : 'Setup 2FA'}
                                    </button>
                                </div>
                            )}

                        </div>

                        {/* Traditional Password Section Placeholder */}
                        <div className="bg-white dark:bg-[#111] p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none opacity-70">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-[#EFEEEA] mb-1">Change Password</h2>
                            <p className="text-sm text-slate-900 dark:text-[#EFEEEA]/50 mb-6">Update your conventional account password.</p>
                            <button className="px-6 py-2.5 bg-white/5 border border-white/10 text-slate-900 dark:text-[#EFEEEA] font-semibold rounded-lg text-sm">
                                Reset Password
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
// Force IDE cache refresh
