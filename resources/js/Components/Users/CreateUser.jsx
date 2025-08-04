import { useForm } from '@inertiajs/react';
// import { useState } from 'react';

export default function CreateUser() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        role: 'user',
        password: '',
        status: true, // active/inactive toggle
        join_date: '',
        image: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route('dashboard.users.store'), {
            forceFormData: true,
        });
    };

    const handleImageChange = (e) => {
        setData('image', e.target.files[0]);
    };

    return (
        <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
            <h1 className="text-2xl font-bold mb-4 text-green-700">Add New User</h1>
            <form onSubmit={handleSubmit} className="space-y-4" enctype="multipart/form-data">
                <div>
                    <label className="block font-semibold">Name</label>
                    <input
                        type="text"
                        className="w-full border px-3 py-2 rounded"
                        value={data.name}
                        onChange={e => setData('name', e.target.value)}
                    />
                    {errors.name && <div className="text-red-600">{errors.name}</div>}
                </div>

                <div>
                    <label className="block font-semibold">Email</label>
                    <input
                        type="email"
                        className="w-full border px-3 py-2 rounded"
                        value={data.email}
                        onChange={e => setData('email', e.target.value)}
                    />
                    {errors.email && <div className="text-red-600">{errors.email}</div>}
                </div>

                <div>
                    <label className="block font-semibold">Phone</label>
                    <input
                        type="text"
                        className="w-full border px-3 py-2 rounded"
                        value={data.phone}
                        onChange={e => setData('phone', e.target.value)}
                    />
                    {errors.phone && <div className="text-red-600">{errors.phone}</div>}
                </div>

                <div>
                    <label className="block font-semibold">Role</label>
                    <select
                        className="w-full border px-3 py-2 rounded"
                        value={data.role}
                        onChange={e => setData('role', e.target.value)}
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                    {errors.role && <div className="text-red-600">{errors.role}</div>}
                </div>

                <div>
                    <label className="block font-semibold">Password</label>
                    <input
                        type="password"
                        className="w-full border px-3 py-2 rounded"
                        value={data.password}
                        onChange={e => setData('password', e.target.value)}
                    />
                    {errors.password && <div className="text-red-600">{errors.password}</div>}
                </div>

                <div>
                    <label className="block font-semibold">Profile Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        className="w-full"
                        onChange={handleImageChange}
                    />
                    {errors.image && <div className="text-red-600">{errors.image}</div>}
                </div>

                <div>
                    <label className="block font-semibold">Active Status</label>
                    <label className="inline-flex items-center mt-1">
                        <input
                            type="checkbox"
                            checked={data.status}
                            onChange={e => setData('status', e.target.checked)}
                            className="form-checkbox h-5 w-5 text-green-600"
                        />
                        <span className="ml-2">{data.status ? 'Active' : 'Inactive'}</span>
                    </label>
                    {errors.status && <div className="text-red-600">{errors.status}</div>}
                </div>

                <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    disabled={processing}
                >
                    Create
                </button>
            </form>
        </div>
    );
}
