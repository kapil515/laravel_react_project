
import AuthLayout from '@/Layouts/UserLayout';
import ProductForm from '@/Components/ProductForm';

export default function Create({ categories, subcategories }) {
    return (
        <AuthLayout>
            <div className="p-6 max-w-3xl mx-auto">
                <h1 className="text-xl font-bold mb-4">Create Product</h1>
                <ProductForm categories={categories} subcategories={subcategories} />
            </div>
        </AuthLayout>
    );
}
