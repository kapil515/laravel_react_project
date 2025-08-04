import React from 'react';
import { Head } from '@inertiajs/react';

export default function Category({
  categories = [],
  selectedCategoryId,
  setSelectedCategoryId,
  selectedSubcategoryId,
  setSelectedSubcategoryId,
  setSearchQuery,
}) {
  const selectedCategory = categories.find((category) => category.id === parseInt(selectedCategoryId));
  const subcategories = selectedCategory ? selectedCategory.subcategories : [];
  const [localSearchQuery, setLocalSearchQuery] = React.useState('');

  return (
    <div className="bg-white">
      <Head title="Shop by Category" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold text-gray-900">All Products</h2>
        <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:max-w-none lg:py-0">
          <div className="mt-4 mb-6 flex items-center space-x-4">
            <div className="flex-1 max-w-md">
              <label htmlFor="category" className="block text-md font-medium text-gray-700">
                Category
              </label>
              <select
                id="category"
                value={selectedCategoryId}
                onChange={(e) => {
                  setSelectedCategoryId(e.target.value);
                  setSelectedSubcategoryId('');
                }}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 max-w-md">
              <label htmlFor="subcategory" className="block text-md font-medium text-gray-700">
                Subcategory
              </label>
              <select
                id="subcategory"
                value={selectedSubcategoryId}
                onChange={(e) => setSelectedSubcategoryId(e.target.value)}
                disabled={!selectedCategoryId}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <option value="">All Subcategories</option>
                {subcategories.map((subcategory) => (
                  <option key={subcategory.id} value={subcategory.id}>
                    {subcategory.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 max-w-md">
              <label htmlFor="search" className="block text-md font-medium text-gray-700">
                Search Products
              </label>
              <input
                id="search"
                type="text"
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
                placeholder="Enter product name"
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-end mt-4">
              <button
                onClick={() => setSearchQuery(localSearchQuery)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Search
              </button>
              {(selectedCategoryId || selectedSubcategoryId || localSearchQuery) && (
                <button
                  onClick={() => {
                    setSelectedCategoryId('');
                    setSelectedSubcategoryId('');
                    setLocalSearchQuery('');
                    setSearchQuery('');
                  }}
                  className="ml-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}