import Banner from '@/Components/Banner';
import Category from '@/Components/Categories';
import Navbar from '@/Components/Navbar';
import Products from '@/Components/Products'; 
import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth,products }) {
    return (
        <>
            <Head title="Home" />
            <div className="bg-gray-50 text-black/50 dark:bg-black dark:text-white/50">
                <Navbar auth={auth} />
                <div className="relative flex min-h-screen flex-col items-center justify-start selection:bg-[#FF2D20] selection:text-white">
                    <div className="relative w-full max-w-2xl px-6 lg:max-w-7xl">
                        <Banner />
                        <Category />
                        <Products products={products} /> 
                        <header className="grid grid-cols-2 gap-2 py-10 lg:grid-cols-1 items-start">
                            <nav className="-mx-3 flex flex-1 justify-start">
                                
                            </nav>
                        </header>
                    </div>
                </div>
            </div>
        </>
    );
}