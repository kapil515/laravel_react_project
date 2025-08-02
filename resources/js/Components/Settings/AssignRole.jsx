import { useForm } from '@inertiajs/react';

export default function AssignRole({ users }) {
    const form = useForm({
        user_id: '',
        role: 'user',
    });

    const roles = ['user', 'admin'];

    const handleSubmit = e => {
        e.preventDefault();
        form.post('/dashboard/settings/assign-role');
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3 className="text-2xl font-semibold mb-4">Assign Role</h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Select User</label>
                    <select
                        value={form.data.user_id}
                        onChange={e => form.setData('user_id', e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                    >
                        <option value="">Choose User </option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>
                                {user.name} ({user.email})
                            </option>
                        ))}
                    </select>
                    {form.errors.user_id && (
                        <p className="text-red-500 text-sm">{form.errors.user_id}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium">Assign Role</label>
                    <select
                        value={form.data.role}
                        onChange={e => form.setData('role', e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                    >
                        {roles.map(r => (
                            <option key={r} value={r}>
                                {r.charAt(0).toUpperCase() + r.slice(1)}
                            </option>
                        ))}
                    </select>
                    {form.errors.role && (
                        <p className="text-red-500 text-sm">{form.errors.role}</p>
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
    );
}
