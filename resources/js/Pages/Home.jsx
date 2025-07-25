import Banner from '@/Components/Banner';
import Category from '@/Components/Categories';
import Products from '@/Components/Products'; 
import UserLayout from '@/Layouts/UserLayout';
import { Head} from '@inertiajs/react';

export default function Welcome({ products }) {
    return (
        <>
            <Head title="Home" />
            <UserLayout>
                <div className="bg-gray-50 text-black/50 dark:bg-black dark:text-white/50">
                    <div className="relative flex min-h-screen flex-col items-center justify-start selection:bg-[#FF2D20] selection:text-white">
                        <div className="relative w-full max-w-2xl px-6 lg:max-w-7xl">
                            <Banner />
                            <Category />
                            <Products products={products} /> 
                        </div>
                    </div>
                </div>
            </UserLayout>
        </>
    );
}
