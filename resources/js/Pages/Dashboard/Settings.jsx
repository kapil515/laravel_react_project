import { useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Settings({ admin, users }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: admin.name,
        email: admin.email,
    });

    const [passwordData, setPasswordData] = useState({
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
    });

    const [roleForm, setRoleForm] = useState({
        user_id: '',
        role: 'user',
    });

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        post(route('dashboard.updateProfile'));
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        post(route('dashboard.updatePassword'), {
            preserveScroll: true,
            onSuccess: () => setPasswordData({ current_password: '', new_password: '', new_password_confirmation: '' }),
        });
    };

    const handleRoleAssign = (e) => {
        e.preventDefault();
        post(route('dashboard.assignRole'), {
            preserveScroll: true,
        });
    };

    return (
        <div className="p-6 space-y-10">
            <h2 className="text-xl font-bold">Admin Settings</h2>

            <form onSubmit={handleProfileSubmit} className="space-y-4 bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold">Update Profile</h3>
                <div>
                    <label>Name</label>
                    <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full border px-3 py-2" />
                    {errors.name && <div className="text-red-500">{errors.name}</div>}
                </div>
                <div>
                    <label>Email</label>
                    <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className="w-full border px-3 py-2" />
                    {errors.email && <div className="text-red-500">{errors.email}</div>}
                </div>
                <button type="submit" disabled={processing} className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
            </form>

            {/* Password Update */}
            <form onSubmit={handlePasswordSubmit} className="space-y-4 bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold">Change Password</h3>
                <div>
                    <label>Current Password</label>
                    <input type="password" value={passwordData.current_password} onChange={e => setPasswordData({ ...passwordData, current_password: e.target.value })} className="w-full border px-3 py-2" />
                    {errors.current_password && <div className="text-red-500">{errors.current_password}</div>}
                </div>
                <div>
                    <label>New Password</label>
                    <input type="password" value={passwordData.new_password} onChange={e => setPasswordData({ ...passwordData, new_password: e.target.value })} className="w-full border px-3 py-2" />
                </div>
                <div>
                    <label>Confirm New Password</label>
                    <input type="password" value={passwordData.new_password_confirmation} onChange={e => setPasswordData({ ...passwordData, new_password_confirmation: e.target.value })} className="w-full border px-3 py-2" />
                    {errors.new_password && <div className="text-red-500">{errors.new_password}</div>}
                </div>
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Update Password</button>
            </form>

            {/* Role Assignment */}
            <form onSubmit={handleRoleAssign} className="space-y-4 bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold">Assign Role</h3>
                <div>
                    <label>Select User</label>
                    <select onChange={e => setRoleForm({ ...roleForm, user_id: e.target.value })} className="w-full border px-3 py-2">
                        <option value="">Select user</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>
                                {user.name} ({user.email}) - Current: {user.role}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Role</label>
                    <select onChange={e => setRoleForm({ ...roleForm, role: e.target.value })} className="w-full border px-3 py-2">
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Assign Role</button>
            </form>
        </div>
    );
}
