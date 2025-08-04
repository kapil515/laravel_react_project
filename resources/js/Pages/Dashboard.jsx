import { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Users from './Dashboard/Users';
import Product from './Dashboard/Products';
import { usePage } from '@inertiajs/react';
import EditUser from '@/Components/Users/Edit';
import CreateUser from '@/Components/Users/CreateUser';
import Category from './Dashboard/Category';
import Orders from './Dashboard/Orders';
import Settings from './Dashboard/Settings';
import OrderDetails from './Dashboard/OrderDetails';
import Transactions from './Dashboard/Transactions';



export default function Dashboard({ section, products }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const { users, categories, order } = usePage().props;
    const { url } = usePage();

    useEffect(() => {
        if (url.startsWith('/dashboard/settings')) {
            setOpenDropdown('settings');
        } else {
            setOpenDropdown(null);
        }
    }, [url]);


    const renderContent = () => {
        switch (section) {
            case 'users': return <Users users={users} />;
            case 'create': return <CreateUser />;
            case 'edit-user': return <EditUser user={usePage().props.user} />
            case 'transactions': return <Transactions transactions={usePage().props.transactions} />;
            case 'sales': return <div className="p-6">Sales Content</div>;
            case 'products': return <Product products={products} categories={usePage().props.categories} />;;
            case 'members': return <div className="p-6">Prime Members Content</div>;
            case 'settings': return <Settings admin={usePage().props.admin} users={usePage().props.users} />;
            case 'Categories': return <Category categories={categories} />;
            case 'orders': return <Orders orders={usePage().props.orders} />;
            case 'order-details': return <OrderDetails order={order} />;
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
                        <SidebarLink href="/dashboard/products" label="Products" />
                        <SidebarLink href="/dashboard/Categories" label="Categories" />
                        <SidebarLink href="/dashboard/orders" label="All Orders" />
                        <SidebarLink href="/dashboard/transactions" label="Transactions" />
                        <SidebarLink
                            label="Settings"
                            isDropdown={true}
                            dropdownKey="settings"
                            openDropdown={openDropdown}
                            setOpenDropdown={setOpenDropdown}
                        >
                            <Link
                                href="/dashboard/settings?tab=profile"
                                className="block px-8 py-2 text-sm text-green-700 hover:bg-green-200"
                            >
                                Update Profile
                            </Link>
                            <Link
                                href="/dashboard/settings?tab=password"
                                className="block px-8 py-2 text-sm text-green-700 hover:bg-green-200"
                            >
                                Update Password
                            </Link>
                            <Link
                                href="/dashboard/settings?tab=role"
                                className="block px-8 py-2 text-sm text-green-700 hover:bg-green-200"
                            >
                                Assign Role
                            </Link>
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="block w-full text-left px-8 py-2 text-sm text-green-600 hover:bg-green-200"
                            >
                                Logout
                            </Link>
                        </SidebarLink>

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


export function SidebarLink({
    href,
    label,
    children,
    isDropdown = false,
    dropdownKey,
    openDropdown,
    setOpenDropdown
}) {
    const { url } = usePage();
    const isActive = href && url.startsWith(href);

    const isOpen = dropdownKey === openDropdown;

    const handleToggle = () => {
        if (isOpen) {
            setOpenDropdown(null);
        } else {
            setOpenDropdown(dropdownKey);
        }
    };

    const linkClasses = `px-6 py-3 text-green-700 font-medium block border-b border-gray-300 ${isActive ? 'bg-green-100' : 'hover:bg-green-100'
        }`;

    if (isDropdown) {
        return (
            <div className="border-b border-gray-300">
                <button
                    className="w-full text-left px-6 py-3 text-green-700 hover:bg-green-100 font-medium flex justify-between items-center"
                    onClick={handleToggle}
                >
                    {label}
                    <span>{isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}</span>
                </button>
                {isOpen && (
                    <div className="bg-gray-100">
                        {children}
                    </div>
                )}
            </div>
        );
    }

    return (
        <Link href={href} className={linkClasses}>
            {label}
        </Link>
    );
}
