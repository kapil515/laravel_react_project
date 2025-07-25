import { StarIcon } from '@heroicons/react/20/solid';
import { Head, usePage } from '@inertiajs/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';


function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function SingleProduct() {
    const { props } = usePage();
    const product = props.product || {};
    if (!product || !product.id) {
        return <div>Product not found. Check ID or database. Props: {JSON.stringify(product)}</div>;
    }

    const reviews = {
        href: '#',
        average: product.reviews?.average || 0,
        totalCount: product.reviews?.totalCount || 0,
    };

    const images = Array.isArray(product.images) ? product.images : (typeof product.images === 'string' ? JSON.parse(product.images.replace(/\\\//g, '/')) : []);

    return (
        <>
        <Head title="SingleProduct" />
        <div className="bg-white">
            <div className="pt-6">
                <nav aria-label="Breadcrumb">
                    <ol role="list" className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                        {product.breadcrumbs.map((breadcrumb) => (
                            <li key={breadcrumb.id}>
                                <div className="flex items-center">
                                    <a href={breadcrumb.href} className="mr-2 text-sm font-medium text-gray-900">
                                        {breadcrumb.name}
                                    </a>
                                    <svg
                                        fill="currentColor"
                                        width={16}
                                        height={20}
                                        viewBox="0 0 16 20"
                                        aria-hidden="true"
                                        className="h-5 w-4 text-gray-300"
                                    >
                                        <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                                    </svg>
                                </div>
                            </li>
                        ))}
                        <li className="text-sm">
                            <a href={product.href} aria-current="page" className="font-medium text-gray-500 hover:text-gray-600">
                                {product.name || 'No name'}
                            </a>
                        </li>
                    </ol>
                </nav>

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                        {/* LEFT SIDE: Swiper Slider */}
                        <div>
                            <Swiper
                                spaceBetween={10}
                                slidesPerView={1}
                                navigation
                                pagination={{ clickable: true }}
                                modules={[Navigation, Pagination]}
                                className="rounded-lg overflow-hidden"
                            >
                                {images.map((img, index) => (
                                    <SwiperSlide key={index}>
                                        <img
                                            src={img.startsWith('products/') ? `/storage/${img}` : img}
                                            alt={product.image_alt || `Product Image`}
                                            className="w-full h-[500px] object-cover object-center"
                                            onError={(e) => {
                                                console.log('Image load error:', img);
                                                e.target.src = '/images/fallback.jpg';
                                            }}
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>

                        {/* RIGHT SIDE: Product Info */}
                        <div className="flex flex-col ">
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                                    {product.name || 'No name'}
                                </h1>
                                <p className="text-3xl tracking-tight text-gray-900 mt-4">
                                    {product.price || 'N/A'}
                                </p>

                                <div className="mt-6">
                                    <div className="flex items-center">
                                        {[0, 1, 2, 3, 4].map((rating) => (
                                            <StarIcon
                                                key={rating}
                                                aria-hidden="true"
                                                className={classNames(
                                                    reviews.average > rating ? 'text-gray-900' : 'text-gray-200',
                                                    'h-5 w-5 flex-shrink-0'
                                                )}
                                            />
                                        ))}
                                        <a href={reviews.href} className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                                            {reviews.totalCount} reviews
                                        </a>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <p className="text-base text-gray-900">{product.description || 'No description'}</p>
                                </div>
                            </div>

                            <form className="mt-10">
                                <button
                                    type="submit"
                                    className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    Add to bag
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        </>
    );
}