<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard', ['section' => 'home']);
    }

    public function users()
    {
        $users = User::where('role', '!=', 'admin')->paginate(5);

        return Inertia::render('Dashboard', [
            'section' => 'users',
            'users'   => $users,
        ]);
    }

    public function edit($id)
    {
        return Inertia::render('Dashboard', [
            'section' => 'edit-user',
            'user'    => User::findOrFail($id),
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $data = $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'role'  => 'required|in:user,admin',
        ]);

        $user->update($data);

        return redirect()
            ->route('dashboard.users')
            ->with('success', 'User updated successfully.');
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        return redirect()
            ->route('dashboard.users')
            ->with('success', 'User deleted successfully.');
    }

    public function create()
    {
        return Inertia::render('Dashboard', [
            'section' => 'create',
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'role'     => 'required|in:user,admin',
            'password' => 'required|min:6',
        ]);

        $data['password'] = bcrypt($data['password']);

        User::create($data);

        return redirect()->route('dashboard.users')->with('success', 'User created successfully.');
    }

    public function transactions()
    {
        return Inertia::render('Dashboard', ['section' => 'transactions']);
    }

    public function sales()
    {
        return Inertia::render('Dashboard', ['section' => 'sales']);
    }

    public function products()
    {
        return Inertia::render('Dashboard', ['section' => 'products']);
    }

    public function members()
    {
        return Inertia::render('Dashboard', ['section' => 'members']);
    }

    public function settings()
    {
        return Inertia::render('Dashboard', ['section' => 'settings']);
    }
}
