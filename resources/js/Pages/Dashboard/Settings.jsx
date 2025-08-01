import { useState, useEffect } from 'react';
import { useForm, usePage } from '@inertiajs/react';

export default function Settings({ admin, users }) {
    const { url } = usePage();
    const [tab, setTab] = useState('profile');

    // Parse tab from query param on initial mount
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const initialTab = params.get('tab');
        if (initialTab) {
            setTab(initialTab);
        }
    }, [url]);

    // Form for updating profile
    const profileForm = useForm({
        name: admin.name,
        email: admin.email,
    });

    // Form for updating password
    const passwordForm = useForm({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
    });

    // Form for assigning roles
    const roleForm = useForm({
        user_id: '',
        role: 'user',
    });

    const roles = ['user', 'admin'];

    return (
        <div className="flex gap-6 p-6">
            <div className="flex-1 bg-white rounded-lg shadow p-6">
                {/* Update Profile */}
                {tab === 'profile' && (
                    <form
                        onSubmit={e => {
                            e.preventDefault();
                            profileForm.post('/dashboard/settings/profile');
                        }}
                    >
                        <h3 className="text-2xl font-semibold mb-4">Update Profile</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Name</label>
                                <input
                                    type="text"
                                    value={profileForm.data.name}
                                    onChange={e => profileForm.setData('name', e.target.value)}
                                    className="w-full border px-3 py-2 rounded"
                                />
                                {profileForm.errors.name && (
                                    <p className="text-red-500 text-sm">{profileForm.errors.name}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Email</label>
                                <input
                                    type="email"
                                    value={profileForm.data.email}
                                    onChange={e => profileForm.setData('email', e.target.value)}
                                    className="w-full border px-3 py-2 rounded"
                                />
                                {profileForm.errors.email && (
                                    <p className="text-red-500 text-sm">{profileForm.errors.email}</p>
                                )}
                            </div>
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                )}

                {/* Change Password */}
                {tab === 'password' && (
                    <form
                        onSubmit={e => {
                            e.preventDefault();
                            passwordForm.post('/dashboard/settings/password');
                        }}
                    >
                        <h3 className="text-2xl font-semibold mb-4">Change Password</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Current Password</label>
                                <input
                                    type="password"
                                    value={passwordForm.data.current_password}
                                    onChange={e =>
                                        passwordForm.setData('current_password', e.target.value)
                                    }
                                    className="w-full border px-3 py-2 rounded"
                                />
                                {passwordForm.errors.current_password && (
                                    <p className="text-red-500 text-sm">
                                        {passwordForm.errors.current_password}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium">New Password</label>
                                <input
                                    type="password"
                                    value={passwordForm.data.new_password}
                                    onChange={e => passwordForm.setData('new_password', e.target.value)}
                                    className="w-full border px-3 py-2 rounded"
                                />
                                {passwordForm.errors.new_password && (
                                    <p className="text-red-500 text-sm">{passwordForm.errors.new_password}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Confirm Password</label>
                                <input
                                    type="password"
                                    value={passwordForm.data.new_password_confirmation}
                                    onChange={e =>
                                        passwordForm.setData('new_password_confirmation', e.target.value)
                                    }
                                    className="w-full border px-3 py-2 rounded"
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            >
                                Update Password
                            </button>
                        </div>
                    </form>
                )}

                {/* Assign Role */}
                {tab === 'role' && (
                    <form
                        onSubmit={e => {
                            e.preventDefault();
                            roleForm.post('/dashboard/settings/assign-role');
                        }}
                    >
                        <h3 className="text-2xl font-semibold mb-4">Assign Role</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Select User</label>
                                <select
                                    value={roleForm.data.user_id}
                                    onChange={e => roleForm.setData('user_id', e.target.value)}
                                    className="w-full border px-3 py-2 rounded"
                                >
                                    <option value="">-- Choose User --</option>
                                    {users.map(user => (
                                        <option key={user.id} value={user.id}>
                                            {user.name} ({user.email})
                                        </option>
                                    ))}
                                </select>
                                {roleForm.errors.user_id && (
                                    <p className="text-red-500 text-sm">{roleForm.errors.user_id}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Assign Role</label>
                                <select
                                    value={roleForm.data.role}
                                    onChange={e => roleForm.setData('role', e.target.value)}
                                    className="w-full border px-3 py-2 rounded"
                                >
                                    {roles.map(r => (
                                        <option key={r} value={r}>
                                            {r.charAt(0).toUpperCase() + r.slice(1)}
                                        </option>
                                    ))}
                                </select>
                                {roleForm.errors.role && (
                                    <p className="text-red-500 text-sm">{roleForm.errors.role}</p>
                                )}
                            </div>
                            <button
                                type="submit"
                                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                            >
                                Update Role
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
