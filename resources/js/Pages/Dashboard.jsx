import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Users from './Dashboard/Users';
import Product from './Dashboard/Products';
import { usePage } from '@inertiajs/react';
import EditUser from '@/Components/Users/Edit';
import CreateUser from '@/Components/Users/CreateUser';
import Category from './Dashboard/Category';


export default function Dashboard({ section, products }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { users, categories } = usePage().props;

    const renderContent = () => {
        switch (section) {
            case 'users': return <Users users={users} />;
            case 'create': return <CreateUser />;
            case 'edit-user': return <EditUser user={usePage().props.user} />
            case 'transactions': return <div className="p-6">Transactions</div>;
            case 'sales': return <div className="p-6">Sales Content</div>;
            case 'products': return <Product products={products} categories={usePage().props.categories} />;;
            case 'members': return <div className="p-6">Prime Members Content</div>;
            case 'settings': return <div className="p-6">Settings Content</div>;
            case 'Categories': return <Category categories={categories} />;
            default: return <div className="p-6">You're logged in!</div>;
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />
            {/* Mobile Hamburger Button */}
            <div className="lg:hidden bg-white px-4 py-3 shadow-md flex justify-between items-center">
                <div className="text-xl font-bold text-green-700">MENU</div>
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="text-green-700 focus:outline-none"
                >
                    ☰
                </button>
            </div>

            <div className="flex h-screen">
                {/* Sidebar */}
                <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-200 shadow-md transform lg:relative lg:translate-x-0 transition-transform duration-200 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:flex lg:flex-col`}>
                    <div className="px-6 py-4 text-xl font-bold text-green-700 border-b lg:block hidden">MENU</div>
                    <div className="px-6 py-4 lg:hidden flex justify-between items-center border-b">
                        <span className="text-xl font-bold text-green-700">Menu</span>
                        <button onClick={() => setSidebarOpen(false)}>✕</button>
                    </div>
                    <nav className="flex flex-col mt-2">
                        <SidebarLink href="/dashboard/users" label="All Users" />
                        <SidebarLink href="/dashboard/transactions" label="Transactions" />
                        <SidebarLink href="/dashboard/sales" label="Sales" />
                        <SidebarLink href="/dashboard/products" label="Products" />
                        <SidebarLink href="/dashboard/members" label="Prime Members" />
                        <SidebarLink href="/dashboard/Categories" label="Categories" />
                        <SidebarLink href="/dashboard/settings" label="Settings" />
                    </nav>
                </aside>

                {/* Overlay on mobile */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-30 z-20 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    ></div>
                )}

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto bg-gray-100">
                    {renderContent()}
                </main>
            </div>
        </AuthenticatedLayout>
    );
}

function SidebarLink({ href, label }) {
    return (
        <Link
            href={href}
            className="px-6 py-3 text-green-700 hover:bg-green-100 border-b border-gray-300 font-medium"
        >
            {label}
        </Link>
    );
}
