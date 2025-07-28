import { router, usePage, Link } from '@inertiajs/react';

export default function UserList({ users }) {
    const userList = users?.data || [];

    if (!Array.isArray(userList) || userList.length === 0) {
        return <p className="text-gray-500">No users found.</p>;
    }

    return (
        <div className="overflow-x-auto bg-white rounded shadow p-4">
            <div className="flex justify-between">
                <h1 className="text-4xl font-bold mb-7 underline text-green-700">All Users</h1>
                <button
                    className="px-9 text-[20px] mb-6 bg-yellow-600 text-white rounded hover:bg-yellow-500"
                    onClick={() => router.visit(route('dashboard.users.create'))}
                >
                    Add New User
                </button>
            </div>

            <table className="min-w-full table-auto border border-gray-200">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-2 text-left border-b text-green-700">Name</th>
                        <th className="px-4 py-2 text-left border-b text-green-700">Email</th>
                        <th className="px-4 py-2 text-left border-b text-green-700">Role</th>
                        <th className="px-4 py-2 text-left border-b text-green-700">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {userList.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-4 py-2 border-b font-medium">{user.name}</td>
                            <td className="px-4 py-2 border-b text-gray-700">{user.email}</td>
                            <td className="px-4 py-2 border-b text-gray-600">{user.role}</td>
                            <td className="px-4 py-2 border-b">
                                <div className="flex space-x-2">
                                    <button
                                        className="px-3 py-1 text-sm bg-yellow-400 text-white rounded hover:bg-yellow-500"
                                        onClick={() => router.visit(route('dashboard.users.edit', user.id))}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                                        onClick={() => router.delete(route('dashboard.users.destroy', user.id))}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
           <div className="flex justify-center mt-6 flex-wrap gap-2">
            {users.links.map((link, index) => (
                <Link
                    key={index}
                    href={link.url || ''}
                    className={`px-3 py-1 border rounded text-sm transition ${
                        link.active
                            ? 'bg-green-600 text-white'
                            : !link.url
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed pointer-events-none'
                            : 'bg-white text-gray-700 hover:bg-gray-200'
                    }`}
                    disabled={!link.url}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ))}
        </div>

        </div>
    );
}
