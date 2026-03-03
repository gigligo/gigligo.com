'use client';

import { useState, useRef, useCallback, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Webcam from 'react-webcam';
import { Navbar } from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldCheck,
    User,
    CreditCard,
    ChevronRight,
    UploadCloud,
    CheckCircle2,
    Camera,
    Lock,
    Zap,
    History,
    MoreVertical,
    Activity,
    Fingerprint,
    Info
} from 'lucide-react';
import { toast } from 'sonner';

function KYCContent() {
    const { data: session, update, status } = useSession();
    const router = useRouter();
    const [step, setStep] = useState<1 | 2 | 3>(1);

    const [selfieFile, setSelfieFile] = useState<File | null>(null);
    const [idFrontFile, setIdFrontFile] = useState<File | null>(null);
    const [idBackFile, setIdBackFile] = useState<File | null>(null);

    const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const webcamRef = useRef<Webcam>(null);

    const captureSelfie = useCallback(() => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) {
            setSelfiePreview(imageSrc);
            fetch(imageSrc)
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' });
                    setSelfieFile(file);
                });
        }
    }, [webcamRef]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<File | null>>) => {
        if (e.target.files && e.target.files[0]) {
            setter(e.target.files[0]);
        }
    };

    const submitKycDetails = async () => {
        if (!selfieFile || !idFrontFile || !idBackFile) {
            setError('Incomplete authorization parameters. Please fulfill all requirements.');
            return;
        }

        setIsUploading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('selfie', selfieFile);
            formData.append('cnicFront', idFrontFile);
            formData.append('cnicBack', idBackFile);

            const token = (session as any)?.accessToken;
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

            const res = await fetch(`${apiUrl}/api/kyc/submit`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Transmission failure. Security clearance denied.');
            }

            await update({ kycStatus: 'PENDING' });
            toast.success("Identity transmission complete. Authorization pending.");
            router.push('/dashboard?kyc=pending');
        } catch (err: any) {
            setError(err.message);
            toast.error(err.message);
        } finally {
            setIsUploading(false);
        }
    };

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center">
                <div className="flex flex-col items-center gap-6">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-2xl shadow-primary/20" />
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] italic animate-pulse">Initializing Security Protocols...</p>
                </div>
            </div>
        );
    }

    const kycStatus = (session as any)?.kycStatus;

    return (
        <div className="flex flex-col min-h-screen bg-background-dark text-white font-sans antialiased selection:bg-primary/30 overflow-x-hidden">
            <Navbar />

            <main className="flex-1" style={{ paddingTop: 72 }}>
                {/* Tactical Header */}
                <div className="relative border-b border-white/5 bg-black/40 overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,124,255,0.05)_0%,transparent_50%)] pointer-events-none" />

                    <div className="max-w-[1440px] mx-auto px-10 md:px-20 py-24 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <Link href="/dashboard" className="group inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-white/30 hover:text-primary transition-colors mb-12">
                                <span className="material-symbols-outlined text-xl group-hover:-translate-x-3 transition-transform">arrow_back</span> Dashboard
                            </Link>

                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
                                <div className="space-y-6">
                                    <h1 className="text-5xl md:text-[8rem] font-black tracking-tighter text-white leading-[0.8] uppercase italic">
                                        Security <span className="text-primary not-italic">Clearance.</span>
                                    </h1>
                                    <p className="text-xl md:text-2xl font-bold italic text-white/40 max-w-2xl leading-relaxed">
                                        Identity synchronization is mandatory for all high-value operatives within the network to maintain strategic integrity.
                                    </p>
                                </div>

                                <div className="flex gap-6">
                                    <div className="bg-white/5 border border-white/10 rounded-3xl px-10 py-6 flex flex-col gap-2 min-w-[140px] shadow-2xl backdrop-blur-3xl">
                                        <Lock className="text-primary" size={24} />
                                        <div>
                                            <p className="text-4xl font-black text-white italic tracking-tighter uppercase">{kycStatus || 'UNSET'}</p>
                                            <p className="text-[9px] text-white/20 uppercase tracking-[0.4em] font-black mt-1">Status Protocol</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Verification Hub */}
                <div className="max-w-[1440px] mx-auto px-10 md:px-20 py-24">
                    {kycStatus === 'PENDING' ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full bg-white/2 border border-white/5 rounded-[4rem] p-24 md:p-32 backdrop-blur-3xl shadow-3xl shadow-black flex flex-col items-center justify-center text-center relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
                            <div className="w-24 h-24 bg-primary rounded-2xl flex items-center justify-center mb-12 shadow-2xl shadow-primary/40 animate-pulse">
                                <Activity className="w-10 h-10 text-white" />
                            </div>
                            <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter mb-8 leading-tight">
                                Authorization In <span className="text-primary">Progress.</span>
                            </h2>
                            <p className="text-xl md:text-2xl font-bold italic text-white/40 max-w-2xl mx-auto leading-relaxed">
                                Your identity transmission has been received by the Central Command. Protocols are being evaluated for network synchronization. Typical clearance window: 24-48H.
                            </p>
                            <button onClick={() => router.push('/dashboard')} className="mt-16 px-12 py-6 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl hover:bg-white/10 transition-all italic">
                                RETURN TO HUD
                            </button>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                            {/* Navigation Protocols */}
                            <div className="lg:col-span-4 space-y-6">
                                <ProtocolStep
                                    step={1}
                                    activeStep={step}
                                    title="Live Biometric Capture"
                                    icon={Fingerprint}
                                    status={selfieFile ? 'COMPLETED' : 'PENDING'}
                                />
                                <ProtocolStep
                                    step={2}
                                    activeStep={step}
                                    title="ID Authorization (Front)"
                                    icon={CreditCard}
                                    status={idFrontFile ? 'COMPLETED' : (step > 2 ? 'FAILED' : 'PENDING')}
                                />
                                <ProtocolStep
                                    step={3}
                                    activeStep={step}
                                    title="ID Authorization (Back)"
                                    icon={CreditCard}
                                    status={idBackFile ? 'COMPLETED' : 'PENDING'}
                                />

                                <div className="bg-white/1 border border-white/5 rounded-[3rem] p-10 mt-12 space-y-6 opacity-40">
                                    <div className="flex items-center gap-4 text-primary">
                                        <ShieldCheck size={20} />
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em]">Military-Grade Encryption</h4>
                                    </div>
                                    <p className="text-sm font-bold italic text-white/30 leading-relaxed">
                                        All biometric data is processed through end-to-end encrypted tunnels. No sensitive intel is stored locally after transmission.
                                    </p>
                                </div>
                            </div>

                            {/* Main Transmission Console */}
                            <div className="lg:col-span-8 bg-white/2 border border-white/5 rounded-[4rem] p-12 md:p-20 backdrop-blur-3xl shadow-3xl shadow-black relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mb-12 p-6 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-xs font-black uppercase tracking-widest italic flex items-center gap-4"
                                    >
                                        <Info size={18} />
                                        {error}
                                    </motion.div>
                                )}

                                <AnimatePresence mode="wait">
                                    {step === 1 && (
                                        <motion.div
                                            key="step1"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.5 }}
                                            className="space-y-12"
                                        >
                                            <div className="space-y-4">
                                                <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Biometric Capture</h2>
                                                <p className="text-xl font-bold italic text-white/40 leading-relaxed">Align your facial structure within the digital frame for live biometric verification.</p>
                                            </div>

                                            <div className="aspect-video bg-black rounded-[3rem] overflow-hidden border border-white/10 relative group shadow-2xl shadow-black">
                                                {!selfiePreview ? (
                                                    <Webcam
                                                        audio={false}
                                                        ref={webcamRef}
                                                        screenshotFormat="image/jpeg"
                                                        className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700"
                                                        videoConstraints={{ facingMode: "user" }}
                                                    />
                                                ) : (
                                                    <img src={selfiePreview} alt="Selfie" className="w-full h-full object-cover" loading="lazy" />
                                                )}

                                                {/* Tactical Overlays */}
                                                <div className="absolute inset-0 pointer-events-none border-20 border-black/20" />
                                                <div className="absolute top-10 left-10 w-10 h-10 border-t-2 border-l-2 border-primary/40 rounded-tl-2xl" />
                                                <div className="absolute top-10 right-10 w-10 h-10 border-t-2 border-r-2 border-primary/40 rounded-tr-2xl" />
                                                <div className="absolute bottom-10 left-10 w-10 h-10 border-b-2 border-l-2 border-primary/40 rounded-bl-2xl" />
                                                <div className="absolute bottom-10 right-10 w-10 h-10 border-b-2 border-r-2 border-primary/40 rounded-br-2xl" />

                                                {!selfiePreview && (
                                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                                        <div className="w-64 h-64 border border-primary/20 rounded-full animate-ping" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex gap-6">
                                                {!selfiePreview ? (
                                                    <button onClick={captureSelfie} className="h-16 px-12 bg-primary text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl hover:bg-primary-dark transition-all shadow-2xl shadow-primary/30 flex items-center gap-4 italic active:scale-95">
                                                        <Camera size={18} />
                                                        EXECUTE CAPTURE
                                                    </button>
                                                ) : (
                                                    <>
                                                        <button onClick={() => setSelfiePreview(null)} className="h-16 px-10 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl hover:bg-white/10 transition-all italic">
                                                            RETRY CAPTURE
                                                        </button>
                                                        <button onClick={() => setStep(2)} className="h-16 px-12 bg-primary text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl flex items-center justify-center gap-4 italic shadow-2xl active:scale-95">
                                                            SYNCHRONIZE & PROCEED <ChevronRight size={18} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}

                                    {(step === 2 || step === 3) && (
                                        <motion.div
                                            key={`step${step}`}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.5 }}
                                            className="space-y-12"
                                        >
                                            <div className="space-y-4">
                                                <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">CNIC Authorization ({step === 2 ? 'FRONT' : 'BACK'})</h2>
                                                <p className="text-xl font-bold italic text-white/40 leading-relaxed">Upload a clear high-resolution digital copy of your national credentials.</p>
                                            </div>

                                            <label className="flex flex-col items-center justify-center w-full h-80 border-2 border-dashed border-white/5 rounded-[3rem] hover:bg-white/2 hover:border-primary/50 transition-all duration-700 cursor-pointer mb-6 relative group shadow-2xl shadow-black overflow-hidden active:scale-[0.99]">
                                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,124,255,0.03)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity" />

                                                {(step === 2 ? idFrontFile : idBackFile) ? (
                                                    <div className="flex flex-col items-center gap-6 relative z-10 text-emerald-500">
                                                        <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center shadow-2xl">
                                                            <CheckCircle2 size={40} />
                                                        </div>
                                                        <span className="text-xl font-black italic tracking-tighter text-white">{(step === 2 ? idFrontFile : idBackFile)?.name}</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center gap-6 text-white/20 relative z-10">
                                                        <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center group-hover:text-primary group-hover:scale-110 transition-all duration-700">
                                                            <UploadCloud size={40} />
                                                        </div>
                                                        <div className="text-center space-y-2">
                                                            <p className="text-[10px] font-black uppercase tracking-[0.4em]">Browse Credentials or Drop</p>
                                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 italic">PNG, JPG, HEIC (MAX 5MB)</p>
                                                        </div>
                                                    </div>
                                                )}
                                                <input type="file" className="hidden" accept="image/png, image/jpeg, image/jpg" onChange={(e) => handleFileChange(e, step === 2 ? setIdFrontFile : setIdBackFile)} />
                                            </label>

                                            <div className="flex items-center gap-6">
                                                <button onClick={() => setStep(step === 2 ? 1 : 2)} className="h-16 px-10 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl hover:bg-white/10 transition-all italic">
                                                    NAVIGATE BACK
                                                </button>
                                                {step === 2 ? (
                                                    <button onClick={() => setStep(3)} disabled={!idFrontFile} className="h-16 px-12 bg-primary text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl disabled:opacity-20 transition-all shadow-2xl shadow-primary/30 italic active:scale-95 flex items-center gap-4">
                                                        ADVANCE PROTOCOL <ChevronRight size={18} />
                                                    </button>
                                                ) : (
                                                    <button onClick={submitKycDetails} disabled={isUploading || !idBackFile} className="h-16 px-12 bg-primary text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl disabled:opacity-20 transition-all shadow-2xl shadow-primary/30 italic active:scale-95 flex items-center gap-4">
                                                        {isUploading ? (
                                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                        ) : (
                                                            <>
                                                                INITIATE TRANSMISSION
                                                                <Zap size={18} />
                                                            </>
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

function ProtocolStep({ step, activeStep, title, icon: Icon, status }: any) {
    const isActive = step === activeStep;
    const isCompleted = status === 'COMPLETED';

    return (
        <div className={`p-8 rounded-4xl border transition-all duration-700 flex items-center justify-between ${isActive ? 'bg-primary/5 border-primary/30 shadow-2xl shadow-primary/5' : 'bg-white/1 border-white/5 grayscale opacity-40'}`}>
            <div className="flex items-center gap-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${isActive ? 'bg-primary text-white' : 'bg-white/5 text-white/40'}`}>
                    <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
                </div>
                <div className="space-y-1">
                    <p className={`text-[12px] font-black italic uppercase tracking-tighter ${isActive ? 'text-white' : 'text-white/20'}`}>{title}</p>
                    <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em]">PROTOCOL 0{step}</p>
                </div>
            </div>
            {isCompleted && (
                <CheckCircle2 size={18} className="text-emerald-500" />
            )}
        </div>
    );
}

export default function KYCVerificationPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background-dark flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-2xl shadow-primary/20" />
            </div>
        }>
            <KYCContent />
        </Suspense>
    );
}
