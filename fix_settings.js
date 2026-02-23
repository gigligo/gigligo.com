const fs = require('fs');
let content = fs.readFileSync('/Users/Apple/Documents/earnify.pk/frontend/src/app/dashboard/settings/page.tsx', 'utf-8');

const replacements = [
    { target: 'bg-[#000]', replacement: 'bg-slate-50 dark:bg-[#000]' },
    { target: 'text-[#EFEEEA]', replacement: 'text-slate-900 dark:text-[#EFEEEA]' },
    { target: 'bg-[#111] border border-[#FE7743]/50 text-[#FE7743]', replacement: 'bg-white dark:bg-[#111] border-slate-200 dark:border-[#FE7743]/50 text-slate-900 dark:text-[#FE7743]' },
    { target: 'text-[#EFEEEA]/50 hover:bg-white/5', replacement: 'text-slate-500 dark:text-[#EFEEEA]/50 hover:bg-slate-100 dark:hover:bg-white/5' },
    { target: 'bg-[#111] p-6 rounded-2xl border border-white/10', replacement: 'bg-white dark:bg-[#111] p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none' },
    { target: 'bg-white/5 rounded-xl border border-white/10', replacement: 'bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/10' },
    { target: 'text-[#EFEEEA]/60', replacement: 'text-slate-500 dark:text-[#EFEEEA]/60' },
    { target: 'border-white/10 my-', replacement: 'border-slate-200 dark:border-white/10 my-' },
    { target: 'bg-white/2 rounded-xl border border-white/5', replacement: 'bg-slate-50 dark:bg-white/2 rounded-xl border border-slate-200 dark:border-white/5' },
    { target: 'text-[#EFEEEA]/50', replacement: 'text-slate-500 dark:text-[#EFEEEA]/50' },
    { target: 'text-white/50 animate-pulse', replacement: 'text-slate-500 dark:text-white/50 animate-pulse' },
    { target: 'text-[#EFEEEA]/70', replacement: 'text-slate-600 dark:text-[#EFEEEA]/70' },
    { target: 'bg-black border border-white/10 rounded-lg px-4 py-3 text-white', replacement: 'bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 text-slate-900 dark:text-white' },
    { target: 'bg-black border border-white/10 rounded-lg px-4 py-2 text-white', replacement: 'bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 text-slate-900 dark:text-white' },
];

for (const p of replacements) {
    content = content.split(p.target).join(p.replacement);
}
fs.writeFileSync('/Users/Apple/Documents/earnify.pk/frontend/src/app/dashboard/settings/page.tsx', content);
