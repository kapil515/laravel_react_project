import { useForm, router } from '@inertiajs/react';

export default function Edit({ user }) {
    const { data, setData, put, processing, errors } = useForm({
        name: user?.name ?? '',
        email: user?.email ?? '',
        phone: user?.phone ?? '',
        role: user?.role?.toLowerCase() ?? 'user',
        status: user?.status === 1 || user?.status === true,
        join_date: user?.join_date ?? '',
        image: null,
        password: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('dashboard.users.update', user.id), {
            forceFormData: true,
            onSuccess: () => {
                router.visit(route('dashboard.users')); // redirect after success
            },
        });
    };

    const handleImageChange = (e) => {
        setData('image', e.target.files[0]);
    };

    return (
        <div className="max-w-xl mx-auto p-4 bg-white rounded shadow">
            <h1 className="text-2xl font-bold mb-4 text-green-700">Edit User</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-semibold">Name</label>
                    <input
                        name="name"
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
                        name="email"
                        type="email"
                        value={data.email}
                        onChange={e => setData('email', e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                    />
                    {errors.email && <div className="text-red-600">{errors.email}</div>}
                </div>

                <div>
                    <label className="block font-semibold">Phone</label>
                    <input
                        name="phone"
                        type="text"
                        value={data.phone}
                        onChange={e => setData('phone', e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                    />
                    {errors.phone && <div className="text-red-600">{errors.phone}</div>}
                </div>

                <div>
                    <label className="block font-semibold">Role</label>
                    <select
                        name="role"
                        value={data.role}
                        onChange={e => setData('role', e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>

                    {errors.role && <div className="text-red-600">{errors.role}</div>}
                </div>

                <div>
                    <label className="block font-semibold">Profile Image</label>
                    <input
                        name="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full"
                    />
                    {errors.image && <div className="text-red-600">{errors.image}</div>}
                </div>

                <div>
                    <label className="block font-semibold">Active Status</label>
                    <label className="inline-flex items-center mt-1">
                        <input
                            name="status"
                            type="checkbox"
                            checked={data.status}
                            onChange={e => setData('status', e.target.checked)}
                            className="form-checkbox h-5 w-5 text-green-600"
                        />
                        <span className="ml-2">{data.status ? 'Active' : 'Inactive'}</span>
                    </label>
                    {errors.status && <div className="text-red-600">{errors.status}</div>}
                </div>

                <div>
                    <label className="block font-semibold">Join Date</label>
                    <input
                        name="join_date"
                        type="date"
                        value={data.join_date}
                        onChange={e => setData('join_date', e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                    />
                    {errors.join_date && <div className="text-red-600">{errors.join_date}</div>}
                </div>

                <div>
                    <label className="block font-semibold">Password</label>
                    <input
                        name="password"
                        type="password"
                        value={data.password}
                        onChange={e => setData('password', e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                    />
                    {errors.password && <div className="text-red-600">{errors.password}</div>}
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
