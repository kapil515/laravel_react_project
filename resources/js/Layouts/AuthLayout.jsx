import React from 'react';
import { usePage } from '@inertiajs/react';
import Navbar from '@/Components/Navbar'; 

export default function AuthLayout({ children }) {
    const { auth } = usePage().props;
    return (
            <>
                        <Navbar auth={auth} />
                        <main>{children}</main>
                    </>
    );
}
