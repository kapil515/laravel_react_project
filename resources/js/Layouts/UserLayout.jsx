import Navbar from '@/Components/Navbar';
import { usePage } from '@inertiajs/react';

export default function UserLayout({ children }) {
    const { auth } = usePage().props;

    return (
        <>
            <Navbar auth={auth} />
            <main>{children}</main>
        </>
    );
}
