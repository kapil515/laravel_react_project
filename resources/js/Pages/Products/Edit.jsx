
import AuthLayout from '@/Layouts/AuthLayout';
import ProductForm from '@/Components/ProductForm';

export default function Edit({ product, categories, subcategories }) {
    return (
        <AuthLayout>
            <div className="p-6 max-w-3xl mx-auto">
                <h1 className="text-xl font-bold mb-4">Edit Product</h1>
                <ProductForm
                    product={product}
                    categories={categories}
                    subcategories={subcategories}
                />
            </div>
        </AuthLayout>
    );
}
