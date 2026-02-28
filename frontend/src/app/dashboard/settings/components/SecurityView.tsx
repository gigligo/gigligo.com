'use client';

import { useState, useEffect } from 'react';

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
            setErrorMsg('All fields are required.'); return;
        }
        if (newPassword !== confirmPassword) {
            setErrorMsg('New passwords do not match.'); return;
        }
        setErrorMsg(''); setSuccessMsg(''); setIsChangingPassword(true);
        try {
            const res = await fetch(`${apiUrl}/api/auth/profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ currentPassword, newPassword })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to update password');
            setSuccessMsg('Password successfully updated.');
            setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
        } catch (err: any) {
            setErrorMsg(err.message || 'An error occurred.');
        } finally {
            setIsChangingPassword(false);
        }
    };

    const handleGenerate2FA = async () => {
        setErrorMsg(''); setSuccessMsg(''); setIs2FALoading(true);
        try {
            const res = await fetch(`${apiUrl}/api/auth/2fa/generate`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to generate 2FA');
            setQrCodeUrl(data.qrCodeUrl); setSetupMode(true);
        } catch (err: any) { setErrorMsg(err.message || 'Could not generate 2FA.'); }
        finally { setIs2FALoading(false); }
    };

    const handleVerify2FA = async () => {
        setErrorMsg(''); setSuccessMsg(''); setIs2FALoading(true);
        try {
            const res = await fetch(`${apiUrl}/api/auth/2fa/verify`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ code: twoFactorCode }) });
            if (!res.ok) throw new Error('Invalid code or verification failed');
            setIs2FAEnabled(true); setSetupMode(false); setQrCodeUrl(''); setTwoFactorCode('');
            setSuccessMsg('Two-Factor Authentication is now enabled!');
        } catch (err: any) { setErrorMsg(err.message || '2FA verification failed.'); }
        finally { setIs2FALoading(false); }
    };

    const handleDisable2FA = async () => {
        setErrorMsg(''); setSuccessMsg(''); setIs2FALoading(true);
        try {
            const res = await fetch(`${apiUrl}/api/auth/2fa/disable`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ code: twoFactorCode }) });
            if (!res.ok) throw new Error('Invalid code or disable failed');
            setIs2FAEnabled(false); setTwoFactorCode('');
            setSuccessMsg('Two-Factor Authentication has been disabled.');
        } catch (err: any) { setErrorMsg(err.message || '2FA disable failed.'); }
        finally { setIs2FALoading(false); }
    };

    return (
        <div className="space-y-10 animate-fade-in">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-text-main">Security Settings</h2>
                <p className="text-text-muted mt-1 text-sm">Protect your executive account with our advanced 2-step verification protocols.</p>
            </div>

            {errorMsg && <div className="bg-red-50 text-red-700 border border-red-200 p-4 rounded-xl text-sm font-medium">{errorMsg}</div>}
            {successMsg && (
                <div className="bg-green-50 text-green-700 border border-green-200 p-4 rounded-xl text-sm font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">check_circle</span>
                    {successMsg}
                </div>
            )}

            <div className="space-y-8">
                {/* 2-Step Verification */}
                <div className="bg-surface-light border border-border-light rounded-xl p-8">
                    <h3 className="text-lg font-bold text-text-main mb-6 tracking-tight">2-Step Verification</h3>

                    {/* Authenticator App */}
                    <div className="border border-border-light rounded-xl p-6 mb-4 hover:border-primary/30 transition-colors">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-background-light rounded-xl border border-border-light shrink-0">
                                <span className="material-symbols-outlined text-2xl text-primary">security</span>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <h4 className="font-bold text-text-main">Authenticator App</h4>
                                    {is2FAEnabled && <span className="text-[10px] bg-green-50 text-green-700 border border-green-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-bold">Enabled</span>}
                                </div>
                                <p className="text-sm text-text-muted mb-4 leading-relaxed">
                                    Use an app like Google Authenticator or Authy to generate verification codes. Highest security standard for instant verification.
                                </p>

                                {is2FAEnabled === null ? (
                                    <div className="mt-4 text-sm text-text-muted animate-pulse">Checking status...</div>
                                ) : is2FAEnabled ? (
                                    <div className="mt-6 bg-background-light rounded-xl border border-border-light p-5">
                                        <p className="text-xs text-text-muted mb-4">Enter a code from your authenticator app to disable 2FA.</p>
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <input type="text" placeholder="6-digit code" value={twoFactorCode} onChange={(e) => setTwoFactorCode(e.target.value)}
                                                className="bg-surface-light border border-border-light rounded-lg px-4 py-2.5 text-sm text-text-main focus:outline-none focus:border-primary transition-colors font-mono tracking-widest" maxLength={6} />
                                            <button onClick={handleDisable2FA} disabled={is2FALoading || twoFactorCode.length < 6}
                                                className="px-6 py-2.5 bg-red-50 text-red-700 border border-red-200 font-bold rounded-lg text-sm hover:bg-red-100 transition disabled:opacity-50">{is2FALoading ? 'Disabling...' : 'Disable 2FA'}</button>
                                        </div>
                                    </div>
                                ) : setupMode && qrCodeUrl ? (
                                    <div className="mt-6 bg-background-light rounded-xl border border-border-light p-5">
                                        <h4 className="font-bold text-text-main mb-4">Complete 2FA Setup</h4>
                                        <ol className="text-sm text-text-muted space-y-2 mb-6 list-decimal list-inside">
                                            <li>Open your Authenticator app.</li>
                                            <li>Scan the QR code below.</li>
                                            <li>Enter the 6-digit code generated.</li>
                                        </ol>
                                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
                                            <div className="bg-white p-2 text-black rounded-xl inline-block border border-border-light">
                                                <img src={qrCodeUrl} alt="2FA QR Code" className="w-32 h-32" loading="lazy" />
                                            </div>
                                            <div className="flex-1 w-full space-y-4">
                                                <div>
                                                    <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1 block">Verification Code</label>
                                                    <input type="text" placeholder="123456" value={twoFactorCode} onChange={(e) => setTwoFactorCode(e.target.value)}
                                                        className="w-full bg-surface-light border border-border-light rounded-lg px-4 py-3 text-text-main focus:outline-none focus:border-primary text-lg tracking-[0.2em] font-mono font-bold" maxLength={6} />
                                                </div>
                                                <div className="flex gap-3">
                                                    <button onClick={handleVerify2FA} disabled={is2FALoading || twoFactorCode.length < 6}
                                                        className="flex-1 px-6 py-3 bg-primary text-white font-bold rounded-lg text-sm hover:bg-primary-dark transition shadow-lg shadow-primary/20 disabled:opacity-50">{is2FALoading ? 'Verifying...' : 'Verify'}</button>
                                                    <button onClick={() => { setSetupMode(false); setQrCodeUrl(''); setTwoFactorCode(''); }}
                                                        className="px-4 py-3 bg-background-light text-text-muted font-bold rounded-lg text-sm hover:bg-border-light transition">Cancel</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <button onClick={handleGenerate2FA} disabled={is2FALoading}
                                        className="mt-4 px-6 py-2.5 bg-primary text-white font-bold rounded-lg text-sm hover:bg-primary-dark transition shadow-lg shadow-primary/20 disabled:opacity-50">{is2FALoading ? 'Loading...' : 'Setup 2FA'}</button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Mobile Number */}
                    <div className="border border-border-light rounded-xl p-6 hover:border-primary/30 transition-colors opacity-60">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-background-light rounded-xl border border-border-light shrink-0">
                                <span className="material-symbols-outlined text-2xl text-text-muted">smartphone</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-text-main mb-1">Mobile Number Auth</h4>
                                <p className="text-sm text-text-muted mb-2 leading-relaxed">Receive a secure verification code via SMS as a reliable backup.</p>
                                <span className="inline-block mt-3 text-[10px] font-bold text-text-muted uppercase tracking-wider bg-background-light border border-border-light px-3 py-1 rounded-full">Coming Soon</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Change Password */}
                {!isGoogleAccount ? (
                    <div className="bg-surface-light border border-border-light rounded-xl p-6 sm:p-8">
                        <h3 className="text-lg font-bold text-text-main mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-xl">key</span>
                            Change Password
                        </h3>
                        <div className="space-y-4 max-w-md">
                            <div>
                                <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1 block">Current Password</label>
                                <div className="relative">
                                    <input type={showCurrentPassword ? 'text' : 'password'} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Enter current password"
                                        className="w-full bg-background-light border border-border-light rounded-lg px-4 py-3 text-sm text-text-main focus:outline-none focus:border-primary pr-10 transition-colors" />
                                    <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-3 top-3 text-text-muted hover:text-text-main transition-colors">
                                        <span className="material-symbols-outlined text-lg">{showCurrentPassword ? 'visibility_off' : 'visibility'}</span>
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1 block">New Password</label>
                                <div className="relative">
                                    <input type={showNewPassword ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Minimum 8 characters"
                                        className="w-full bg-background-light border border-border-light rounded-lg px-4 py-3 text-sm text-text-main focus:outline-none focus:border-primary pr-10 transition-colors" />
                                    <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-3 text-text-muted hover:text-text-main transition-colors">
                                        <span className="material-symbols-outlined text-lg">{showNewPassword ? 'visibility_off' : 'visibility'}</span>
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1 block">Confirm New Password</label>
                                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter new password"
                                    className="w-full bg-background-light border border-border-light rounded-lg px-4 py-3 text-sm text-text-main focus:outline-none focus:border-primary transition-colors" />
                            </div>
                            <button onClick={handleChangePassword} disabled={isChangingPassword}
                                className="px-6 py-3 bg-primary text-white font-bold rounded-lg text-sm hover:bg-primary-dark transition shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center gap-2 mt-4">
                                {isChangingPassword && <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>}
                                {isChangingPassword ? 'Updating...' : 'Update Password'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-surface-light border border-border-light rounded-xl p-8 flex items-center gap-4 text-text-muted">
                        <span className="material-symbols-outlined text-3xl">account_circle</span>
                        <p className="text-sm">You are signed in with Google. Passwords are managed by Google authentication.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
