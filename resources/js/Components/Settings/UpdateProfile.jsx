import { useForm } from '@inertiajs/react';

export default function UpdateProfile({ user }) {
    const form = useForm({
        name: user.name,
        email: user.email,
    });

    const handleSubmit = e => {
        e.preventDefault();
        form.post('/dashboard/settings/profile');
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3 className="text-2xl font-semibold mb-4">Update Profile</h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Name</label>
                    <input
                        type="text"
                        value={form.data.name}
                        onChange={e => form.setData('name', e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                    />
                    {form.errors.name && (
                        <p className="text-red-500 text-sm">{form.errors.name}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium">Email</label>
                    <input
                        type="email"
                        value={form.data.email}
                        onChange={e => form.setData('email', e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                    />
                    {form.errors.email && (
                        <p className="text-red-500 text-sm">{form.errors.email}</p>
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
    );
}
