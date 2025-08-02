<?php
namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Product;
use App\Models\Category;
   use Illuminate\Support\Facades\Hash;

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
    $products = Product::latest()->paginate(5)->through(function ($product) {
        return [
            'id' => $product->id,
            'name' => $product->name,
            'price' => $product->price,
            'category_id' => $product->category_id,
            'subcategory_id' => $product->subcategory_id,
            'description' => $product->description, 
            'imageAlt' => $product->image_alt,
            'images' => $product->images ? json_decode(str_replace('\/', '/', $product->images), true) : [],
        ];
    });

    $categories = Category::with('subcategories')->get();
    $totalProducts = Product::count();

    return Inertia::render('Dashboard', [  
        'section' => 'products',
        'products' => $products,
        'categories' => $categories ,
        'totalProducts' => $totalProducts
    ]);
}



    public function members()
    {
        return Inertia::render('Dashboard', ['section' => 'members']);
    }


public function settings()
{
    return Inertia::render('Dashboard', [
        'section' => 'settings',
        'admin'   => auth()->user(),
        'users'   => User::where('id', '!=', auth()->id())->get(),
    ]);
}

public function updateProfile(Request $request)
{
    $user = auth()->user();

    $data = $request->validate([
        'name'  => 'required|string|max:255',
        'email' => 'required|email|unique:users,email,' . $user->id,
    ]);

    $user->update($data);

   return redirect()->route('dashboard.settings', ['tab' => 'profile'])
    ->with('success', 'Profile updated successfully.');

}

public function updatePassword(Request $request)
{
    $request->validate([
        'current_password' => 'required',
        'new_password'     => 'required|min:6|confirmed',
    ]);

    $user = auth()->user();

    if (!Hash::check($request->current_password, $user->password)) {
        return back()->withErrors(['current_password' => 'Current password is incorrect.']);
    }

    $user->update([
        'password' => Hash::make($request->new_password),
    ]);

   return redirect()->route('dashboard.settings', ['tab' => 'password'])
    ->with('success', 'Password updated successfully.');

}

public function assignRole(Request $request)
{
    $request->validate([
        'user_id' => 'required|exists:users,id',
        'role'    => 'required|in:user,admin',
    ]);

    $user = User::findOrFail($request->user_id);
    $user->role = $request->role;
    $user->save();

 return redirect()->route('dashboard.settings', ['tab' => 'role'])
    ->with('success', 'Role updated successfully.');

}


public function Category()
{
    if (auth()->user()->role !== 'admin') {
        abort(403, 'Unauthorized');
    }
    $categories = Category::with('subcategories')->get();

    return Inertia::render('Dashboard', [
        'section' => 'Categories',
        'categories' => $categories
    ]);
}

}
