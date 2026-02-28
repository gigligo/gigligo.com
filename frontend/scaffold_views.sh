#!/bin/bash
VIEWS=(
    "ProfileView"
    "ProfileSettingsView"
    "ContactInfoView"
    "IdentityVerificationView"
    "SecurityView"
    "ConnectedServicesView"
    "BillingPaymentsView"
    "WithdrawalsView"
    "MembershipView"
    "TeamsView"
    "NotificationsView"
)

for view in "${VIEWS[@]}"; do
cat << INNER_EOF > src/app/dashboard/settings/components/${view}.tsx
export function ${view}() {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">${view}</h2>
            <div className="p-8 bg-[#1E1E1E]/50 border border-white/5 rounded-2xl">
                <p className="text-white/50">This module is being constructed.</p>
            </div>
        </div>
    );
}
INNER_EOF
done

echo "Scaffolded all 11 views."
