import Banner from "@/Components/Banner";
import UserLayout from "@/Layouts/UserLayout";
import { Head} from '@inertiajs/react';

export default function BestSellers() {
    return (
        <>
        <Head title="BestSeller" />
        <UserLayout>
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
        <h1 className="mt-5 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl lg:text-6xl">Our Best Sellers</h1>
        <Banner/>
        </div>
        </UserLayout>
        </>
    )
}