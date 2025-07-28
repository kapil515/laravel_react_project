import { useForm } from '@inertiajs/react';

export default function Edit({ user }) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        role: user.role,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('dashboard.users.update', user.id));
    };

    return (
        <div className="max-w-xl mx-auto p-4 bg-white rounded shadow">
            <h1 className="text-2xl font-bold mb-4 text-green-700">Edit User</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-semibold">Name</label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={e => setData('name', e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                    />
                    {errors.name && <div className="text-red-600">{errors.name}</div>}
                </div>
                <div>
                    <label className="block font-semibold">Email</label>
                    <input
                        type="email"
                        value={data.email}
                        onChange={e => setData('email', e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                    />
                    {errors.email && <div className="text-red-600">{errors.email}</div>}
                </div>
                <div>
                    <label className="block font-semibold">Role</label>
                    <select
                        value={data.role}
                        onChange={e => setData('role', e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                    {errors.role && <div className="text-red-600">{errors.role}</div>}
                </div>
                <button
                    type="submit"
                    disabled={processing}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                    Update
                </button>
            </form>
        </div>
    );
}
