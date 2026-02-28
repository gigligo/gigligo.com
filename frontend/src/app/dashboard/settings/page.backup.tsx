'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Navbar } from '@/components/Navbar';
import { authApi } from '@/lib/api';

export default function SettingsPage() {
    const { data: session } = useSession();

    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [activeTab, setActiveTab] = useState('security');

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

    const handleChangePassword = async () => {
        setErrorMsg(''); setSuccessMsg('');
        if (!currentPassword || !newPassword || !confirmPassword) { setErrorMsg('Please fill in all password fields.'); return; }
        if (newPassword.length < 8) { setErrorMsg('New password must be at least 8 characters.'); return; }
        if (newPassword !== confirmPassword) { setErrorMsg('New passwords do not match.'); return; }
        setIsChangingPassword(true);
        try {
            await authApi.changePassword(token, currentPassword, newPassword);
            setSuccessMsg('Password changed successfully!');
            setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
        } catch (err: any) { setErrorMsg(err.message || 'Failed to change password.'); }
        finally { setIsChangingPassword(false); }
    };

    const handleGenerate2FA = async () => {
        setIs2FALoading(true); setErrorMsg('');
        try {
            const res = await fetch(`${apiUrl}/api/auth/2fa/generate`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
            if (!res.ok) throw new Error('Failed to generate 2FA secret');
            const data = await res.json();
            setQrCodeUrl(data.qrCodeUrl);
            setSetupMode(true);
        } catch (err: any) { setErrorMsg(err.message || '2FA generation failed.'); }
        finally { setIs2FALoading(false); }
    };

    const handleVerify2FA = async () => {
        setIs2FALoading(true); setErrorMsg(''); setSuccessMsg('');
        try {
            const res = await fetch(`${apiUrl}/api/auth/2fa/verify`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ code: twoFactorCode }) });
            if (!res.ok) throw new Error('Invalid code or setup failed');
            setIs2FAEnabled(true); setSetupMode(false); setTwoFactorCode('');
            setSuccessMsg('Two-Factor Authentication has been successfully enabled!');
        } catch (err: any) { setErrorMsg(err.message || '2FA verification failed.'); }
        finally { setIs2FALoading(false); }
    };

    const handleDisable2FA = async () => {
        if (!twoFactorCode) { setErrorMsg('Please enter your authenticator code to disable 2FA.'); return; }
        setIs2FALoading(true); setErrorMsg(''); setSuccessMsg('');
        try {
            const res = await fetch(`${apiUrl}/api/auth/2fa/disable`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ code: twoFactorCode }) });
            if (!res.ok) throw new Error('Invalid code or disable failed');
            setIs2FAEnabled(false); setTwoFactorCode('');
            setSuccessMsg('Two-Factor Authentication has been disabled.');
        } catch (err: any) { setErrorMsg(err.message || '2FA disable failed.'); }
        finally { setIs2FALoading(false); }
    };

    if (!session) return null;
    const roleLabel = userRole === 'SELLER' ? 'Freelancer' : userRole === 'STUDENT' ? 'Student Freelancer' : userRole === 'EMPLOYER' || userRole === 'BUYER' ? 'Employer' : userRole === 'ADMIN' ? 'Admin' : 'Member';

    const sidebarTabs = [
        { id: 'account', icon: 'person', label: 'Account' },
        { id: 'security', icon: 'shield', label: 'Security' },
        { id: 'billing', icon: 'credit_card', label: 'Billing' },
        { id: 'notifications', icon: 'notifications', label: 'Notifications' },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-background-light text-text-main font-sans antialiased">
            <Navbar />

            <main className="flex-1" style={{ paddingTop: 96 }}>
                {/* Header */}
                <div className="border-b border-border-light bg-surface-light">
                    <div className="max-w-5xl mx-auto px-6 md:px-12 py-10">
                        <h1 className="text-3xl md:text-4xl font-bold text-text-main tracking-tight">Settings</h1>
                        <p className="text-text-muted mt-2 text-sm">Manage your preferences</p>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto px-6 md:px-12 py-10">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

                        {/* Settings Sidebar */}
                        <div className="space-y-1">
                            {sidebarTabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all duration-200 text-sm font-semibold ${activeTab === tab.id
                                            ? 'bg-slate-900 text-white shadow-sm'
                                            : 'text-text-muted hover:bg-background-light hover:text-text-main'
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Main Settings Panel */}
                        <div className="md:col-span-3 space-y-8">

                            {errorMsg && <div className="bg-red-50 text-red-700 border border-red-200 p-4 rounded-xl text-sm font-medium">{errorMsg}</div>}
                            {successMsg && (
                                <div className="bg-green-50 text-green-700 border border-green-200 p-4 rounded-xl text-sm font-semibold flex items-center gap-2">
                                    <span className="material-symbols-outlined text-lg">check_circle</span>
                                    {successMsg}
                                </div>
                            )}

                            {/* Account Tab */}
                            {activeTab === 'account' && (
                                <div className="bg-surface-light border border-border-light rounded-xl p-8">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="p-3 bg-background-light rounded-xl border border-border-light">
                                            <span className="material-symbols-outlined text-2xl text-primary">person</span>
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-text-main">Account Information</h2>
                                            <p className="text-sm text-text-muted">Your account details are shown below.</p>
                                        </div>
                                    </div>
                                    <hr className="border-border-light mb-8" />
                                    <div className="space-y-5">
                                        <InfoRow icon="mail" label="Email" value={userEmail || '...'} />
                                        <InfoRow icon="person" label="Full Name" value={userName || '...'} />
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <InfoRow icon="shield" label="Role" value={roleLabel} />
                                            {memberSince && <InfoRow icon="calendar_today" label="Member Since" value={memberSince} />}
                                        </div>
                                        {isGoogleAccount && (
                                            <div className="mt-2 text-xs text-text-muted flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-sm">account_circle</span>
                                                Signed in with Google
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Security Tab */}
                            {activeTab === 'security' && (
                                <>
                                    {/* Security Header */}
                                    <div className="bg-surface-light border border-border-light rounded-xl p-8">
                                        <h2 className="text-2xl font-bold text-text-main mb-2 tracking-tight">Security Settings</h2>
                                        <p className="text-text-muted text-sm leading-relaxed max-w-xl">
                                            Protect your executive account with our advanced 2-step verification protocols. We recommend enabling both methods for maximum redundancy.
                                        </p>
                                    </div>

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
                                                        Use an app like Google Authenticator or Authy to generate verification codes.
                                                    </p>
                                                    <p className="text-xs text-primary font-semibold">Highest security standard for instant verification.</p>

                                                    {is2FAEnabled === null ? (
                                                        <div className="mt-4 text-sm text-text-muted animate-pulse">Checking status...</div>
                                                    ) : is2FAEnabled ? (
                                                        <div className="mt-6 bg-background-light rounded-xl border border-border-light p-5">
                                                            <p className="text-xs text-text-muted mb-4">Enter a code from your authenticator app to disable 2FA.</p>
                                                            <div className="flex flex-col sm:flex-row gap-3">
                                                                <input type="text" placeholder="6-digit code" value={twoFactorCode} onChange={(e) => setTwoFactorCode(e.target.value)}
                                                                    className="bg-surface-light border border-border-light rounded-lg px-4 py-2.5 text-sm text-text-main focus:outline-none focus:border-primary transition-colors" maxLength={6} />
                                                                <button onClick={handleDisable2FA} disabled={is2FALoading || twoFactorCode.length < 6}
                                                                    className="px-6 py-2.5 bg-red-50 text-red-700 border border-red-200 font-bold rounded-lg text-sm hover:bg-red-100 transition disabled:opacity-50">{is2FALoading ? 'Disabling...' : 'Disable 2FA'}</button>
                                                            </div>
                                                        </div>
                                                    ) : setupMode && qrCodeUrl ? (
                                                        <div className="mt-6 bg-background-light rounded-xl border border-border-light p-5">
                                                            <h4 className="font-semibold text-text-main mb-4">Complete 2FA Setup</h4>
                                                            <ol className="text-sm text-text-muted space-y-2 mb-6 list-decimal list-inside">
                                                                <li>Open your Authenticator app.</li>
                                                                <li>Scan the QR code below.</li>
                                                                <li>Enter the 6-digit code generated.</li>
                                                            </ol>
                                                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
                                                                <div className="bg-white p-2 rounded-xl inline-block border border-border-light">
                                                                    <img src={qrCodeUrl} alt="2FA QR Code" className="w-32 h-32" loading="lazy" />
                                                                </div>
                                                                <div className="flex-1 w-full space-y-4">
                                                                    <div>
                                                                        <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1 block">Verification Code</label>
                                                                        <input type="text" placeholder="123456" value={twoFactorCode} onChange={(e) => setTwoFactorCode(e.target.value)}
                                                                            className="w-full bg-surface-light border border-border-light rounded-lg px-4 py-3 text-text-main focus:outline-none focus:border-primary text-lg tracking-[0.2em] font-mono" maxLength={6} />
                                                                    </div>
                                                                    <div className="flex gap-3">
                                                                        <button onClick={handleVerify2FA} disabled={is2FALoading || twoFactorCode.length < 6}
                                                                            className="flex-1 px-6 py-3 bg-primary text-white font-bold rounded-lg text-sm hover:bg-primary-dark transition shadow-lg shadow-primary/20 disabled:opacity-50">{is2FALoading ? 'Verifying...' : 'Verify & Enable'}</button>
                                                                        <button onClick={() => { setSetupMode(false); setQrCodeUrl(''); setTwoFactorCode(''); }}
                                                                            className="px-4 py-3 bg-background-light text-text-muted font-semibold rounded-lg text-sm hover:bg-border-light transition">Cancel</button>
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
                                                    <h4 className="font-bold text-text-main mb-1">Mobile Number</h4>
                                                    <p className="text-sm text-text-muted mb-2 leading-relaxed">Receive a secure verification code via SMS to your trusted mobile device.</p>
                                                    <p className="text-xs text-text-muted font-semibold">Reliable backup for account recovery.</p>
                                                    <span className="inline-block mt-3 text-[10px] font-bold text-text-muted uppercase tracking-wider bg-background-light border border-border-light px-3 py-1 rounded-full">Coming Soon</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Why 2-Step? */}
                                    <div className="bg-slate-900 text-white rounded-xl p-8 border border-white/5">
                                        <h4 className="font-bold text-lg mb-3 tracking-tight">Why 2-Step Verification?</h4>
                                        <p className="text-white/50 text-sm leading-relaxed">
                                            GIGLIGO serves high-profile clients and manages sensitive transactions. Enabling 2-Step Verification adds a critical layer of defense against unauthorized access, ensuring your portfolio and earnings remain secure.
                                        </p>
                                    </div>

                                    {/* Change Password */}
                                    {!isGoogleAccount && (
                                        <div className="bg-surface-light border border-border-light rounded-xl p-8">
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="p-3 bg-background-light rounded-xl border border-border-light">
                                                    <span className="material-symbols-outlined text-2xl text-primary">key</span>
                                                </div>
                                                <div>
                                                    <h2 className="text-xl font-bold text-text-main">Change Password</h2>
                                                    <p className="text-sm text-text-muted">Update your account password.</p>
                                                </div>
                                            </div>
                                            <hr className="border-border-light mb-6" />
                                            <div className="space-y-4 max-w-md">
                                                <div>
                                                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1 block">Current Password</label>
                                                    <div className="relative">
                                                        <input type={showCurrentPassword ? 'text' : 'password'} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Enter current password"
                                                            className="w-full bg-background-light border border-border-light rounded-lg px-4 py-3 text-sm text-text-main focus:outline-none focus:border-primary pr-10 transition-colors" />
                                                        <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-3 top-3 text-text-muted hover:text-text-main transition-colors">
                                                            <span className="material-symbols-outlined text-lg">{showCurrentPassword ? 'visibility_off' : 'visibility'}</span>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1 block">New Password</label>
                                                    <div className="relative">
                                                        <input type={showNewPassword ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Minimum 8 characters"
                                                            className="w-full bg-background-light border border-border-light rounded-lg px-4 py-3 text-sm text-text-main focus:outline-none focus:border-primary pr-10 transition-colors" />
                                                        <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-3 text-text-muted hover:text-text-main transition-colors">
                                                            <span className="material-symbols-outlined text-lg">{showNewPassword ? 'visibility_off' : 'visibility'}</span>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1 block">Confirm New Password</label>
                                                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter new password"
                                                        className="w-full bg-background-light border border-border-light rounded-lg px-4 py-3 text-sm text-text-main focus:outline-none focus:border-primary transition-colors" />
                                                </div>
                                                <button onClick={handleChangePassword} disabled={isChangingPassword}
                                                    className="px-6 py-3 bg-primary text-white font-bold rounded-lg text-sm hover:bg-primary-dark transition shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center gap-2">
                                                    {isChangingPassword && <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>}
                                                    {isChangingPassword ? 'Updating...' : 'Update Password'}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Billing Tab */}
                            {activeTab === 'billing' && (
                                <div className="bg-surface-light border border-border-light rounded-xl p-8 text-center py-20">
                                    <span className="material-symbols-outlined text-5xl text-text-muted/30 mb-4">credit_card</span>
                                    <h3 className="text-xl font-bold text-text-main mb-2">Billing</h3>
                                    <p className="text-text-muted text-sm">Billing management is coming soon.</p>
                                </div>
                            )}

                            {/* Notifications Tab */}
                            {activeTab === 'notifications' && (
                                <div className="bg-surface-light border border-border-light rounded-xl p-8 text-center py-20">
                                    <span className="material-symbols-outlined text-5xl text-text-muted/30 mb-4">notifications</span>
                                    <h3 className="text-xl font-bold text-text-main mb-2">Notifications</h3>
                                    <p className="text-text-muted text-sm">Notification preferences are coming soon.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1">
            <div className="flex items-center gap-2 min-w-[140px]">
                <span className="material-symbols-outlined text-lg text-text-muted/50">{icon}</span>
                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">{label}</span>
            </div>
            <div className="flex-1 bg-background-light border border-border-light rounded-lg px-4 py-2.5">
                <span className="text-sm text-text-main font-medium">{value}</span>
            </div>
        </div>
    );
}
