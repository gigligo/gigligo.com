'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Navbar } from '@/components/Navbar';
import { ShieldCheck, Activity, KeyRound, Mail, User, Loader2, Eye, EyeOff } from 'lucide-react';
import { authApi } from '@/lib/api';

export default function SettingsPage() {
    const { data: session } = useSession();

    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    // Account info states
    const [userEmail, setUserEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('');
    const [memberSince, setMemberSince] = useState('');
    const [isGoogleAccount, setIsGoogleAccount] = useState(false);

    // Password change states
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    // 2FA States
    const [is2FAEnabled, setIs2FAEnabled] = useState<boolean | null>(null);
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [twoFactorCode, setTwoFactorCode] = useState('');
    const [is2FALoading, setIs2FALoading] = useState(false);
    const [setupMode, setSetupMode] = useState(false);

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
                    setUserEmail(data.email || '');
                    setUserName(data.profile?.fullName || data.fullName || '');
                    setUserRole(data.role || '');
                    setIsGoogleAccount(!!data.googleId);
                    if (data.createdAt) {
                        setMemberSince(new Date(data.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }));
                    }
                })
                .catch(err => console.error('Failed to fetch profile', err));
        }
    }, [token, apiUrl]);

    // Password change handler
    const handleChangePassword = async () => {
        setErrorMsg('');
        setSuccessMsg('');

        if (!currentPassword || !newPassword || !confirmPassword) {
            setErrorMsg('Please fill in all password fields.');
            return;
        }
        if (newPassword.length < 8) {
            setErrorMsg('New password must be at least 8 characters.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setErrorMsg('New passwords do not match.');
            return;
        }

        setIsChangingPassword(true);
        try {
            await authApi.changePassword(token, currentPassword, newPassword);
            setSuccessMsg('Password changed successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            setErrorMsg(err.message || 'Failed to change password.');
        } finally {
            setIsChangingPassword(false);
        }
    };

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

    const roleLabel = userRole === 'SELLER' ? 'Freelancer' : userRole === 'STUDENT' ? 'Student Freelancer' : userRole === 'EMPLOYER' || userRole === 'BUYER' ? 'Employer' : userRole === 'ADMIN' ? 'Admin' : 'Member';

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

                        {/* ═══ Account Information Section ═══ */}
                        <div className="bg-white dark:bg-[#111] p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/10">
                                    <User className="w-6 h-6 text-[#FE7743]" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-[#EFEEEA]">Account Information</h2>
                                    <p className="text-sm text-slate-500 dark:text-[#EFEEEA]/60">Your account details are shown below.</p>
                                </div>
                            </div>

                            <hr className="border-slate-200 dark:border-white/10 mb-6" />

                            <div className="space-y-4">
                                {/* Email */}
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                    <div className="flex items-center gap-2 min-w-[140px]">
                                        <Mail className="w-4 h-4 text-slate-400" />
                                        <span className="text-xs font-semibold text-slate-500 dark:text-[#EFEEEA]/50 uppercase tracking-wider">Email</span>
                                    </div>
                                    <div className="flex-1 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5">
                                        <span className="text-sm text-slate-900 dark:text-[#EFEEEA] font-mono">{userEmail || '...'}</span>
                                    </div>
                                </div>

                                {/* Name */}
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                    <div className="flex items-center gap-2 min-w-[140px]">
                                        <User className="w-4 h-4 text-slate-400" />
                                        <span className="text-xs font-semibold text-slate-500 dark:text-[#EFEEEA]/50 uppercase tracking-wider">Full Name</span>
                                    </div>
                                    <div className="flex-1 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5">
                                        <span className="text-sm text-slate-900 dark:text-[#EFEEEA]">{userName || '...'}</span>
                                    </div>
                                </div>

                                {/* Role + Member Since */}
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2">
                                        <div className="flex items-center gap-2 min-w-[140px]">
                                            <ShieldCheck className="w-4 h-4 text-slate-400" />
                                            <span className="text-xs font-semibold text-slate-500 dark:text-[#EFEEEA]/50 uppercase tracking-wider">Role</span>
                                        </div>
                                        <div className="flex-1 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5">
                                            <span className="text-sm text-slate-900 dark:text-[#EFEEEA]">{roleLabel}</span>
                                        </div>
                                    </div>
                                    {memberSince && (
                                        <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2">
                                            <div className="flex items-center gap-2 min-w-[140px]">
                                                <Activity className="w-4 h-4 text-slate-400" />
                                                <span className="text-xs font-semibold text-slate-500 dark:text-[#EFEEEA]/50 uppercase tracking-wider">Member Since</span>
                                            </div>
                                            <div className="flex-1 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5">
                                                <span className="text-sm text-slate-900 dark:text-[#EFEEEA]">{memberSince}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {isGoogleAccount && (
                                    <div className="mt-2 text-xs text-slate-400 dark:text-[#EFEEEA]/40 flex items-center gap-1.5">
                                        <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                                        Signed in with Google
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ═══ Change Password Section ═══ */}
                        <div className="bg-white dark:bg-[#111] p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/10">
                                    <KeyRound className="w-6 h-6 text-teal-500" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-[#EFEEEA]">Change Password</h2>
                                    <p className="text-sm text-slate-500 dark:text-[#EFEEEA]/60">
                                        {isGoogleAccount
                                            ? 'Your account uses Google Sign-In. Password change is not available.'
                                            : 'Update your account password.'}
                                    </p>
                                </div>
                            </div>

                            {!isGoogleAccount && (
                                <>
                                    <hr className="border-slate-200 dark:border-white/10 mb-6" />
                                    <div className="space-y-4 max-w-md">
                                        <div>
                                            <label className="text-xs font-semibold text-slate-500 dark:text-[#EFEEEA]/50 uppercase tracking-wider mb-1 block">Current Password</label>
                                            <div className="relative">
                                                <input
                                                    type={showCurrentPassword ? 'text' : 'password'}
                                                    value={currentPassword}
                                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                                    placeholder="Enter current password"
                                                    className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 pr-10"
                                                />
                                                <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-white/70">
                                                    {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-slate-500 dark:text-[#EFEEEA]/50 uppercase tracking-wider mb-1 block">New Password</label>
                                            <div className="relative">
                                                <input
                                                    type={showNewPassword ? 'text' : 'password'}
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    placeholder="Minimum 8 characters"
                                                    className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 pr-10"
                                                />
                                                <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-white/70">
                                                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-slate-500 dark:text-[#EFEEEA]/50 uppercase tracking-wider mb-1 block">Confirm New Password</label>
                                            <input
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="Re-enter new password"
                                                className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                                            />
                                        </div>
                                        <button
                                            onClick={handleChangePassword}
                                            disabled={isChangingPassword}
                                            className="px-6 py-2.5 bg-teal-500 text-white font-bold rounded-lg text-sm hover:bg-teal-600 transition shadow-lg shadow-teal-500/20 disabled:opacity-50 flex items-center gap-2"
                                        >
                                            {isChangingPassword && <Loader2 className="w-4 h-4 animate-spin" />}
                                            {isChangingPassword ? 'Updating...' : 'Update Password'}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* ═══ Two-Factor Authentication Section ═══ */}
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
                    </div>
                </div>
            </main>
        </div>
    );
}
