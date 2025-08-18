import Navbar from '@/Components/Navbar';
import { usePage } from '@inertiajs/react';
import Footer from '@/Components/Footer';
import FakePurchaseAlert from '@/Components/FakePurchaseAlert';

export default function UserLayout({ children }) {
    const { auth } = usePage().props;

    return (
        <>
            <Navbar auth={auth} />
            <main>{children}</main>
               <FakePurchaseAlert
        minIntervalMs={2000}
        maxIntervalMs={4500}
        showDurationMs={6000}
        bottomOffset="1rem"
        leftOffset="1rem"
      />
            <Footer />
        </>
    );
}
