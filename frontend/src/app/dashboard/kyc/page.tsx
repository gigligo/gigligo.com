'use client';

import { useState, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Webcam from 'react-webcam';
import { UserCircle, CreditCard, ChevronRight, UploadCloud, CheckCircle2 } from 'lucide-react';

export default function KYCVerificationPage() {
    const { data: session, update } = useSession();
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
            // Convert base64 to file
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
            setError('Please complete all steps before submitting.');
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
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

            const res = await fetch(`${apiUrl}/kyc/submit`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Verification submission failed');
            }

            // Force session refresh so role/kycStatus updates
            await update();
            router.push('/dashboard?kyc=pending');

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsUploading(false);
        }
    };

    if (!session) return null;

    return (
        <div className="min-h-screen bg-slate-950 px-4 py-12 flex flex-col items-center">

            <div className="w-full max-w-3xl mb-12 text-center">
                <h1 className="text-3xl font-bold text-white mb-3">Identity Verification</h1>
                <p className="text-slate-400">To maintain a secure marketplace, we require government ID and a live selfie from all sellers.</p>
            </div>

            <div className="w-full max-w-3xl flex gap-8">

                {/* Fixed Progress Sidebar */}
                <div className="w-64 shrink-0 hidden md:block space-y-6">
                    <div className={`p-4 rounded-xl border ${step >= 1 ? 'border-teal-vibrant/30 bg-teal-vibrant/5 text-white' : 'border-white/10 text-slate-500'}`}>
                        <div className="flex items-center gap-3">
                            <UserCircle className={step >= 1 ? 'text-teal-vibrant' : 'text-slate-500'} />
                            <span className="font-semibold text-sm">Live Selfie</span>
                        </div>
                    </div>
                    <div className={`p-4 rounded-xl border ${step >= 2 ? 'border-teal-vibrant/30 bg-teal-vibrant/5 text-white' : 'border-white/10 text-slate-500'}`}>
                        <div className="flex items-center gap-3">
                            <CreditCard className={step >= 2 ? 'text-teal-vibrant' : 'text-slate-500'} />
                            <span className="font-semibold text-sm">ID Card Front</span>
                        </div>
                    </div>
                    <div className={`p-4 rounded-xl border ${step >= 3 ? 'border-teal-vibrant/30 bg-teal-vibrant/5 text-white' : 'border-white/10 text-slate-500'}`}>
                        <div className="flex items-center gap-3">
                            <CreditCard className={step >= 3 ? 'text-teal-vibrant' : 'text-slate-500'} />
                            <span className="font-semibold text-sm">ID Card Back</span>
                        </div>
                    </div>
                </div>

                {/* Main Content Pane */}
                <div className="flex-1 bg-slate-900 border border-white/10 rounded-2xl p-8 shadow-2xl">

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    {/* Step 1: Selfie */}
                    {step === 1 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                            <h2 className="text-xl font-bold text-white mb-2">Take a live selfie</h2>
                            <p className="text-slate-400 text-sm mb-8">Please align your face in the center and ensure good lighting.</p>

                            <div className="aspect-video bg-slate-950 rounded-xl overflow-hidden border border-white/10 mb-6 flex items-center justify-center relative">
                                {!selfiePreview ? (
                                    <Webcam
                                        audio={false}
                                        ref={webcamRef}
                                        screenshotFormat="image/jpeg"
                                        className="w-full h-full object-cover"
                                        videoConstraints={{ facingMode: "user" }}
                                    />
                                ) : (
                                    <img src={selfiePreview} alt="Selfie" className="w-full h-full object-cover" />
                                )}
                            </div>

                            <div className="flex justify-between items-center">
                                {!selfiePreview ? (
                                    <button onClick={captureSelfie} className="px-6 py-3 bg-white text-slate-950 font-bold rounded-xl shadow-lg">
                                        Capture Photo
                                    </button>
                                ) : (
                                    <div className="flex gap-4 w-full">
                                        <button onClick={() => setSelfiePreview(null)} className="flex-1 py-3 bg-white/5 text-white border border-white/10 font-bold rounded-xl hover:bg-white/10 transition">
                                            Retake
                                        </button>
                                        <button onClick={() => setStep(2)} className="flex-1 py-3 bg-teal-vibrant text-slate-950 font-bold rounded-xl hover:bg-teal-vibrant/90 transition shadow-lg shadow-teal-vibrant/20 flex items-center justify-center gap-2">
                                            Continue <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 2: ID Front */}
                    {step === 2 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                            <h2 className="text-xl font-bold text-white mb-2">Upload ID (Front)</h2>
                            <p className="text-slate-400 text-sm mb-8">Upload a clear photo of the front of your National ID or Passport.</p>

                            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-white/20 rounded-xl hover:bg-white/5 hover:border-teal-vibrant/50 transition cursor-pointer mb-6 relative">
                                {idFrontFile ? (
                                    <div className="flex flex-col items-center gap-4">
                                        <CheckCircle2 className="w-12 h-12 text-teal-vibrant" />
                                        <span className="text-white font-medium">{idFrontFile.name}</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-4 text-slate-400">
                                        <UploadCloud className="w-12 h-12" />
                                        <p className="text-sm">Click to browse files or drag and drop</p>
                                        <p className="text-xs">PNG, JPG, JPEG (Max 5MB)</p>
                                    </div>
                                )}
                                <input type="file" className="hidden" accept="image/png, image/jpeg, image/jpg" onChange={(e) => handleFileChange(e, setIdFrontFile)} />
                            </label>

                            <div className="flex justify-between items-center gap-4">
                                <button onClick={() => setStep(1)} className="px-6 py-3 text-slate-400 hover:text-white font-medium transition">
                                    Back
                                </button>
                                <button onClick={() => setStep(3)} disabled={!idFrontFile} className="px-8 py-3 bg-teal-vibrant text-slate-950 font-bold rounded-xl disabled:opacity-50 transition shadow-lg shadow-teal-vibrant/20">
                                    Continue
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: ID Back */}
                    {step === 3 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                            <h2 className="text-xl font-bold text-white mb-2">Upload ID (Back)</h2>
                            <p className="text-slate-400 text-sm mb-8">Upload a clear photo of the back of your National ID.</p>

                            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-white/20 rounded-xl hover:bg-white/5 hover:border-teal-vibrant/50 transition cursor-pointer mb-6 relative">
                                {idBackFile ? (
                                    <div className="flex flex-col items-center gap-4">
                                        <CheckCircle2 className="w-12 h-12 text-teal-vibrant" />
                                        <span className="text-white font-medium">{idBackFile.name}</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-4 text-slate-400">
                                        <UploadCloud className="w-12 h-12" />
                                        <p className="text-sm">Click to browse files or drag and drop</p>
                                        <p className="text-xs">PNG, JPG, JPEG (Max 5MB)</p>
                                    </div>
                                )}
                                <input type="file" className="hidden" accept="image/png, image/jpeg, image/jpg" onChange={(e) => handleFileChange(e, setIdBackFile)} />
                            </label>

                            <div className="flex justify-between items-center gap-4">
                                <button onClick={() => setStep(2)} className="px-6 py-3 text-slate-400 hover:text-white font-medium transition">
                                    Back
                                </button>
                                <button onClick={submitKycDetails} disabled={isUploading || !idBackFile} className="px-8 py-3 bg-[#FE7743] hover:bg-[#FE7743]/90 text-white font-bold rounded-xl disabled:opacity-50 transition shadow-lg flex items-center gap-2">
                                    {isUploading ? 'Uploading...' : 'Submit Verification'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
