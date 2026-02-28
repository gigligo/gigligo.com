/// <reference types="node" />
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function apiFetch(path: string, options: RequestInit & { token?: string } = {}) {
    const { token, ...fetchOptions } = options;
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string> || {}),
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await fetch(`${API_URL}${path}`, { ...fetchOptions, headers });
    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `API error: ${res.status}`);
    }
    return res.json();
}

// Credit APIs
export const creditApi = {
    getPackages: () => apiFetch('/api/credits/packages'),
    getBalance: (token: string) => apiFetch('/api/credits/balance', { token }),
    purchase: (token: string, packageId: string) =>
        apiFetch('/api/credits/purchase', { method: 'POST', token, body: JSON.stringify({ packageId }) }),
    getLedger: (token: string, page = 1) =>
        apiFetch(`/api/credits/ledger?page=${page}`, { token }),
};

// Job APIs
export const jobApi = {
    list: (params?: URLSearchParams) =>
        apiFetch(`/api/jobs${params ? '?' + params.toString() : ''}`),
    get: (id: string) => apiFetch(`/api/jobs/${id}`),
    create: (token: string, data: any) =>
        apiFetch('/api/jobs', { method: 'POST', token, body: JSON.stringify(data) }),
    update: (token: string, id: string, data: any) =>
        apiFetch(`/api/jobs/${id}`, { method: 'PATCH', token, body: JSON.stringify(data) }),
    delete: (token: string, id: string) =>
        apiFetch(`/api/jobs/${id}`, { method: 'DELETE', token }),
    getMyJobs: (token: string) =>
        apiFetch('/api/jobs/mine', { token }),
    getRecommended: (token: string) =>
        apiFetch('/api/jobs/recommended', { token }),
};

// Application APIs
export const applicationApi = {
    apply: (token: string, data: { jobId: string; coverLetter: string; proposedRate?: number; timeline?: string }) =>
        apiFetch('/api/applications', { method: 'POST', token, body: JSON.stringify(data) }),
    getMine: (token: string) =>
        apiFetch('/api/applications/mine', { token }),
    getForJob: (token: string, jobId: string) =>
        apiFetch(`/api/applications/job/${jobId}`, { token }),
    hire: (token: string, id: string) =>
        apiFetch(`/api/applications/${id}/hire`, { method: 'PATCH', token }),
    shortlist: (token: string, id: string) =>
        apiFetch(`/api/applications/${id}/shortlist`, { method: 'PATCH', token }),
    reject: (token: string, id: string) =>
        apiFetch(`/api/applications/${id}/reject`, { method: 'PATCH', token }),
    withdraw: (token: string, id: string) =>
        apiFetch(`/api/applications/${id}/withdraw`, { method: 'PATCH', token }),
};

// Wallet APIs
export const walletApi = {
    getBalance: (token: string) =>
        apiFetch('/api/wallet/balance', { token }),
    withdraw: (token: string, amount: number, method: string) =>
        apiFetch('/api/wallet/withdraw', { method: 'POST', token, body: JSON.stringify({ amount, method }) }),
    getTransactions: (token: string, page = 1) =>
        apiFetch(`/api/wallet/transactions?page=${page}`, { token }),
};

// Notification APIs
export const notificationApi = {
    getAll: (token: string, page = 1) =>
        apiFetch(`/api/notifications?page=${page}`, { token }),
    getUnreadCount: (token: string) =>
        apiFetch('/api/notifications/unread-count', { token }),
    markRead: (token: string, id: string) =>
        apiFetch(`/api/notifications/${id}/read`, { method: 'PATCH', token }),
    markAllRead: (token: string) =>
        apiFetch('/api/notifications/read-all', { method: 'PATCH', token }),
};

// Order APIs
export const orderApi = {
    getMyPurchases: (token: string) =>
        apiFetch('/api/orders/mine/purchases', { token }),
    getMySales: (token: string) =>
        apiFetch('/api/orders/mine/sales', { token }),
};

// Auth APIs
export const authApi = {
    getProfile: (token: string) =>
        apiFetch('/api/auth/profile', { token }),
    forgotPassword: (email: string) =>
        apiFetch('/api/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
    resetPassword: (email: string, code: string, newPassword: string) =>
        apiFetch('/api/auth/reset-password', { method: 'POST', body: JSON.stringify({ email, code, newPassword }) }),
    changePassword: (token: string, currentPassword: string, newPassword: string) =>
        apiFetch('/api/auth/change-password', { method: 'POST', token, body: JSON.stringify({ currentPassword, newPassword }) }),
};

// KYC APIs
export const kycApi = {
    getStatus: (token: string) =>
        apiFetch('/api/kyc/status', { token }),
};

// User State API
export const userStateApi = {
    getState: (token: string) =>
        apiFetch('/api/user/state', { token }),
};

// Gig APIs
export const gigApi = {
    list: (params?: URLSearchParams) => apiFetch(`/api/gigs${params ? '?' + params.toString() : ''}`),
    get: (id: string) => apiFetch(`/api/gigs/${id}`),
    getMyGigs: (token: string) => apiFetch('/api/gigs/mine', { token }),
    boost: (token: string, id: string, durationDays: number) =>
        apiFetch(`/api/gigs/${id}/boost`, { method: 'POST', token, body: JSON.stringify({ durationDays }) }),
    delete: (token: string, id: string) => apiFetch(`/api/gigs/${id}`, { method: 'DELETE', token }),
};

// Admin APIs
export const adminApi = {
    getStats: (token: string) => apiFetch('/api/admin/stats', { token }),
    getActivity: (token: string) => apiFetch('/api/admin/activity', { token }),
    getFounders: (token: string) => apiFetch('/api/admin/founders', { token }),
    getPendingKyc: (token: string) => apiFetch('/api/admin/kyc/pending', { token }),
    decideKyc: (token: string, kycId: string, status: 'APPROVED' | 'REJECTED') =>
        apiFetch('/api/admin/kyc/decide', { method: 'POST', token, body: JSON.stringify({ kycId, status }) }),
    getAnalytics: (token: string) => apiFetch('/api/admin/analytics', { token }),
    addCredits: (token: string, userId: string, amount: number) =>
        apiFetch(`/api/admin/users/${userId}/credits`, { method: 'POST', token, body: JSON.stringify({ amount }) }),
    suspendUser: (token: string, userId: string) =>
        apiFetch(`/api/admin/users/${userId}/suspend`, { method: 'POST', token }),
    getAuditLogs: (token: string, page = 1) =>
        apiFetch(`/api/admin/audit-logs?page=${page}`, { token }),
};

// Payment APIs
export const paymentApi = {
    checkout: (token: string, data: { packageId: string, method: string }) =>
        apiFetch('/api/payments/checkout', { method: 'POST', token, body: JSON.stringify(data) }),
};

// Chat APIs
export const chatApi = {
    getConversations: (token: string) => apiFetch('/chat/conversations', { token }),
    getConversation: (token: string, id: string) => apiFetch(`/chat/conversations/${id}`, { token }),
    findOrCreate: (token: string, freelancerId: string, employerId: string, orderId?: string, jobId?: string) =>
        apiFetch('/chat/conversations', {
            method: 'POST',
            token,
            body: JSON.stringify({ freelancerId, employerId, orderId, jobId })
        }),
};

// Dispute APIs
export const disputeApi = {
    create: (token: string, data: { orderId?: string; jobId?: string; reason: string }) =>
        apiFetch('/api/disputes', { method: 'POST', token, body: JSON.stringify(data) }),
    getMyDisputes: (token: string) => apiFetch('/api/disputes/me', { token }),
    getAdminDisputes: (token: string) => apiFetch('/api/disputes/admin', { token }),
    resolve: (token: string, id: string, data: { status: 'RESOLVED_BUYER' | 'RESOLVED_SELLER'; resolution: string }) =>
        apiFetch(`/api/disputes/admin/${id}/resolve`, { method: 'POST', token, body: JSON.stringify(data) }),
};

// Review APIs
export const reviewApi = {
    submit: (token: string, data: { orderId: string; rating: number; comment: string }) =>
        apiFetch('/api/reviews', { method: 'POST', token, body: JSON.stringify(data) }),
    getForGig: (gigId: string) => apiFetch(`/api/reviews/gig/${gigId}`),
    getForSeller: (sellerId: string) => apiFetch(`/api/reviews/seller/${sellerId}`),
};

export const analyticsApi = {
    getFreelancerStats: (token: string, days: number = 30) =>
        apiFetch(`/api/analytics/freelancer?days=${days}`, { token })
};

// Profile APIs
export const profileApi = {
    getMine: (token: string) => apiFetch('/api/profile/me', { token }),
    updateMine: (token: string, data: any) =>
        apiFetch('/api/profile/me', { method: 'PUT', token, body: JSON.stringify(data) }),
    updateAvatar: (token: string, data: FormData) =>
        fetch(`${API_URL}/api/profile/avatar`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` },
            body: data
        }).then(async res => {
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.message || 'Avatar upload failed');
            }
            return res.json();
        }),
    getPublic: (id: string) => apiFetch(`/api/profile/public/${id}`),

    // Experience
    addExperience: (token: string, data: any) =>
        apiFetch('/api/profile/experience', { method: 'POST', token, body: JSON.stringify(data) }),
    updateExperience: (token: string, id: string, data: any) =>
        apiFetch(`/api/profile/experience/${id}`, { method: 'PUT', token, body: JSON.stringify(data) }),
    deleteExperience: (token: string, id: string) =>
        apiFetch(`/api/profile/experience/${id}`, { method: 'DELETE', token }),

    // Education
    addEducation: (token: string, data: any) =>
        apiFetch('/api/profile/education', { method: 'POST', token, body: JSON.stringify(data) }),
    updateEducation: (token: string, id: string, data: any) =>
        apiFetch(`/api/profile/education/${id}`, { method: 'PUT', token, body: JSON.stringify(data) }),
    deleteEducation: (token: string, id: string) =>
        apiFetch(`/api/profile/education/${id}`, { method: 'DELETE', token }),

    // Portfolio
    addPortfolioItem: (token: string, formData: FormData) => {
        return fetch(`${API_URL}/api/profile/portfolio`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
        }).then(async res => {
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        });
    },
    updatePortfolioItem: (token: string, id: string, formData: FormData) => {
        return fetch(`${API_URL}/api/profile/portfolio/${id}`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
        }).then(async res => {
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        });
    },
    deletePortfolioItem: (token: string, id: string) =>
        apiFetch(`/api/profile/portfolio/${id}`, { method: 'DELETE', token }),
};

// Subscription APIs
export const subscriptionApi = {
    getStatus: (token: string) => apiFetch('/api/subscription/status', { token }),
    subscribe: (token: string) =>
        apiFetch('/api/subscription/subscribe', { method: 'POST', token }),
};

