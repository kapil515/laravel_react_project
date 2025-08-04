import { router, Link } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';

export default function UserList({ users, filters = {} }) {
    const userList = users?.data || [];
    const { data, setData, get } = useForm({
        search: filters.search || '',
    });

    useEffect(() => {
        setData('search', filters.search || '');
    }, [filters.search]);

    return (

        <div className="overflow-x-auto bg-white rounded shadow p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold text-green-700 underline">All Users</h1>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        get(route('dashboard.users'), {
                            preserveState: true,
                            preserveScroll: true,
                            only: ['users'],
                            data: {
                                search: data.search,
                            },
                        });
                    }}
                    className="flex gap-3 mb-4 flex-wrap"
                >

                    <input
                        type="text"
                        placeholder="Search by name, email or phone"
                        value={data.search}
                        onChange={(e) => setData('search', e.target.value)}
                        className="border rounded px-3 py-2 text-sm w-64"
                    />
                    <button
                        type="submit"
                        className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
                    >
                        Filter
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            router.get(route('dashboard.users'), { search: '' }, {
                                preserveScroll: true,
                                onSuccess: () => {
                                    setData('search', ''); 
                                }
                            });
                        }}
                        className="bg-gray-400 text-white px-4 py-2 rounded text-sm hover:bg-gray-500"
                    >
                        Reset
                    </button>



                </form>


                <button
                    className="px-5 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-500 text-lg"
                    onClick={() => router.visit(route('dashboard.users.create'))}
                >
                    Add New User
                </button>
            </div>
            {!Array.isArray(userList) || userList.length === 0 ? (
                <p className="text-gray-500">No users found.</p>
            ) : (
                <table className="min-w-full table-auto border border-gray-300 rounded overflow-hidden">
                    <thead className="bg-gray-100 text-left">
                        <tr>
                            <th className="px-4 py-2 border-b text-green-700">S.No</th>
                            <th className="px-4 py-2 border-b text-green-700">Image</th>
                            <th className="px-4 py-2 border-b text-green-700">Name</th>
                            <th className="px-4 py-2 border-b text-green-700">Email</th>
                            <th className="px-4 py-2 border-b text-green-700">Phone</th>
                            <th className="px-4 py-2 border-b text-green-700">Active</th>
                            <th className="px-4 py-2 border-b text-green-700">Role</th>
                            <th className="px-4 py-2 border-b text-green-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userList.map((user, index) => (
                            <tr key={user.id} className="hover:bg-gray-50 text-sm">
                                <td className="px-4 py-2 border-b">{index + 1}</td>
                                <td className="px-4 py-2 border-b">
                                    {user.image ? (
                                        <img
                                            src={`/storage/${user.image}`}
                                            alt={user.name}
                                            className="w-20 h-20 rounded object-cover"
                                        />
                                    ) : (
                                        <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm">
                                            👤
                                        </div>
                                    )}
                                </td>
                                <td className="px-4 py-2 border-b">{user.name}</td>
                                <td className="px-4 py-2 border-b text-gray-700">{user.email}</td>
                                <td className="px-4 py-2 border-b text-gray-700">{user.phone || '-'}</td>
                                <td className="px-4 py-2 border-b">
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={user.active}
                                            onChange={() =>
                                                router.put(route('users.toggleActive', user.id), {
                                                    preserveScroll: true,
                                                })
                                            }
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 transition-all duration-300 relative">
                                            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-full transition-transform duration-300"></div>
                                        </div>
                                    </label>
                                </td>


                                <td className="px-4 py-2 border-b text-gray-700">{user.role || '-'}</td>
                                <td className="px-4 py-2 border-b">
                                    <div className="flex space-x-2">
                                        <button
                                            className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                            onClick={() =>
                                                router.visit(route('dashboard.users.edit', user.id))
                                            }
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                                            onClick={() =>
                                                router.delete(route('dashboard.users.destroy', user.id))
                                            }
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    {users.links.length > 3 && (
                        <div className="flex justify-center mt-6 flex-wrap gap-2">
                            {users.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || ''}
                                    className={`px-3 py-1 border rounded text-sm transition ${link.active
                                        ? 'bg-green-600 text-white'
                                        : !link.url
                                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed pointer-events-none'
                                            : 'bg-white text-gray-700 hover:bg-gray-200'
                                        }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </table>



            )}

        </div>
    );
}
