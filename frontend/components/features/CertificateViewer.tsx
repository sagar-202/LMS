'use client';

import React, { useState, useEffect } from 'react';
import { lmsApi, Certificate } from '@/lib/api';
import Button from '@/components/ui/Button';

export default function CertificateViewer() {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCertificates = async () => {
            try {
                setLoading(true);
                const data = await lmsApi.getMyCertificates();
                setCertificates(data);
            } catch (err) {
                console.error('Failed to fetch certificates:', err);
                setError('Failed to load certificates.');
            } finally {
                setLoading(false);
            }
        };

        fetchCertificates();
    }, []);

    if (loading) return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
                <div key={i} className="bg-gray-50 dark:bg-gray-800 rounded-[2.5rem] p-8 h-48 animate-pulse border border-gray-100 dark:border-gray-700"></div>
            ))}
        </div>
    );

    if (error) return (
        <div className="p-12 text-center bg-red-50 dark:bg-red-900/10 rounded-[2.5rem] border border-red-100 dark:border-red-900/30">
            <p className="text-red-500 font-bold">{error}</p>
        </div>
    );

    if (certificates.length === 0) return (
        <div className="bg-white dark:bg-gray-800 rounded-[3rem] p-16 text-center border border-gray-100 dark:border-gray-700 shadow-xl shadow-blue-500/5">
            <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-blue-600 dark:text-blue-400 rotate-3">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">No certificates yet</h3>
            <p className="text-gray-500 dark:text-gray-400 font-medium max-w-sm mx-auto mb-8">
                Complete a course with 100% progress to earn your industry-recognized certification!
            </p>
            <Button href="/courses" variant="primary">Browse Courses</Button>
        </div>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {certificates.map((cert) => (
                <div key={cert.id} className="group bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="relative z-10 flex flex-col h-full">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-500/20">
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 leading-tight flex-1">
                            {cert.subject_title}
                        </h3>
                        <div className="flex flex-col gap-1 mb-6">
                            <span className="text-[10px] uppercase font-black tracking-widest text-gray-400 dark:text-gray-500">Issued On</span>
                            <span className="text-sm font-bold text-gray-600 dark:text-gray-400">
                                {new Date(cert.issued_at).toLocaleDateString()}
                            </span>
                        </div>
                        <Button 
                            href={cert.certificate_url} 
                            variant="primary" 
                            size="sm" 
                            className="w-full rounded-xl flex items-center justify-center gap-2 group/btn"
                            target="_blank"
                        >
                            <span>View Certificate</span>
                            <svg className="w-4 h-4 group-hover/btn:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}
