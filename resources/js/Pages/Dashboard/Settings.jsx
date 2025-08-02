import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import UpdateProfile from '@/Components/Settings/UpdateProfile';
import UpdatePassword from '@/Components/Settings/Updatepass';
import AssignRole from '@/Components/Settings/AssignRole';

export default function Settings({ admin, users }) {
    const [tab, setTab] = useState('profile');
    const { url } = usePage();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const initialTab = params.get('tab');
        if (initialTab) {
            setTab(initialTab);
        }
    }, [url]);

    const renderTabContent = () => {
        switch (tab) {
            case 'profile':
                return <UpdateProfile user={admin} />;
            case 'password':
                return <UpdatePassword />;
            case 'role':
                return <AssignRole users={users} />;
            default:
                return <UpdateProfile user={admin} />;
        }
    };

    return (
        <div className="flex gap-6 p-6">
            <div className="flex-1 bg-white rounded-lg shadow p-6">
                {renderTabContent()}
            </div>
        </div>
    );
}
