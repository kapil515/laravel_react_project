import { useForm } from '@inertiajs/react';

export default function UpdatePassword() {
    const form = useForm({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
    });

    const handleSubmit = e => {
        e.preventDefault();
        form.post('/dashboard/settings/password');
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3 className="text-2xl font-semibold mb-4">Change Password</h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Current Password</label>
                    <input
                        type="password"
                        value={form.data.current_password}
                        onChange={e => form.setData('current_password', e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                    />
                    {form.errors.current_password && (
                        <p className="text-red-500 text-sm">{form.errors.current_password}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium">New Password</label>
                    <input
                        type="password"
                        value={form.data.new_password}
                        onChange={e => form.setData('new_password', e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                    />
                    {form.errors.new_password && (
                        <p className="text-red-500 text-sm">{form.errors.new_password}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium">Confirm Password</label>
                    <input
                        type="password"
                        value={form.data.new_password_confirmation}
                        onChange={e => form.setData('new_password_confirmation', e.target.value)}
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
    );
}
