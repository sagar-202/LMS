'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, loading } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // If we're not loading and not authenticated, redirect to login
        if (!loading) {
            if (!isAuthenticated) {
                // Store the current path to redirect back after login (optional future enhancement)
                router.push(`/auth/login?returnUrl=${encodeURIComponent(pathname)}`);
            } else {
                setIsChecking(false);
            }
        }
    }, [isAuthenticated, loading, router, pathname]);

    // While checking or loading, show nothing or a spinner
    if (loading || isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return <>{children}</>;
}
