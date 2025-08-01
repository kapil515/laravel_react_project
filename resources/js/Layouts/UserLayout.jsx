import Navbar from '@/Components/Navbar';
import { usePage } from '@inertiajs/react';
import Footer from '@/Components/Footer';

export default function UserLayout({ children }) {
    const { auth } = usePage().props;

    return (
        <>
            <Navbar auth={auth} />
            <main>{children}</main>
            <Footer />
        </>
    );
}
