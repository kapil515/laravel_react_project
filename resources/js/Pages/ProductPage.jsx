import Navbar from "@/Components/Navbar";
import { Head } from '@inertiajs/react';
import Products from '@/Components/Products'; 

export default function ProductsPage({ products }) {
    return (
        <>
            <Head title="Products" />
            <Navbar />
            <div className="container px-4 mx-auto sm:px-6 lg:px-8">
                <h1 className="mt-5 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
                    Our Products
                </h1>
                <Products products={products} />
            </div>
        </>
    );
}
