import React, { useEffect, useMemo, useRef, useState } from "react";

const NAMES = [
    "Aarav",
    "Siya",
    "Vivaan",
    "Ananya",
    "Ishaan",
    "Diya",
    "Aditya",
    "Aisha",
    "Kabir",
    "Myra",
    "Arjun",
    "Zara",
];

const PRODUCTS = [
    {
        title: "Wireless Earbuds Pro",
        img: "https://picsum.photos/seed/earbuds/80/80",
    },
    {
        title: "Smart Fitness Band",
        img: "https://picsum.photos/seed/band/80/80",
    },
    {
        title: "Eco Water Bottle",
        img: "https://picsum.photos/seed/bottle/80/80",
    },
    {
        title: "Minimal Desk Lamp",
        img: "https://picsum.photos/seed/lamp/80/80",
    },
    {
        title: "Ergo Office Chair",
        img: "https://picsum.photos/seed/chair/80/80",
    },
    {
        title: "Bluetooth Speaker",
        img: "https://picsum.photos/seed/speaker/80/80",
    },
    { title: "Comfy Hoodie", img: "https://picsum.photos/seed/hoodie/80/80" },
    { title: "Travel Backpack", img: "https://picsum.photos/seed/bag/80/80" },
];

const CITIES = [
    "Mumbai",
    "Delhi",
    "Bengaluru",
    "Hyderabad",
    "Chennai",
    "Pune",
    "Kolkata",
    "Ahmedabad",
    "Jaipur",
    "Lucknow",
];

function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
function randomFirstName() {
    return randomItem(NAMES);
}
function randomCity() {
    return randomItem(CITIES);
}
function maskName(name) {
    // "Aarav M." style
    return `${name} ${String.fromCharCode(
        65 + Math.floor(Math.random() * 26)
    )}.`;
}
function randomDelay(minMs, maxMs) {
    return Math.floor(minMs + Math.random() * (maxMs - minMs));
}

export default function FakePurchaseAlert({
    minIntervalMs = 1000,
    maxIntervalMs = 4500,
    showDurationMs = 6000,
    bottomOffset = "1rem",
    leftOffset = "1rem",
    products = PRODUCTS,
}) {
    const [visible, setVisible] = useState(false);
    const [purchase, setPurchase] = useState(null);
    const timerRef = useRef(null);
    const hideRef = useRef(null);

    const containerStyle = useMemo(
        () => ({ bottom: bottomOffset, left: leftOffset }),
        [bottomOffset, leftOffset]
    );

    const generatePurchase = () => {
        const p = randomItem(products);
        const qty = Math.random() < 0.85 ? 1 : Math.ceil(Math.random() * 3);
        return {
            name: maskName(randomFirstName()),
            city: randomCity(),
            product: p.title,
            img: p.img,
            qty,
            timeText: ["Just now", "1 min ago", "a moment ago"][
                Math.floor(Math.random() * 3)
            ],
        };
    };

    const scheduleNext = () => {
        clearTimeout(timerRef.current);

        timerRef.current = setTimeout(() => {
            if (visible) {
                setVisible(false);

                setTimeout(() => {
                    const newPurchase = generatePurchase();
                    setPurchase(newPurchase);
                    setVisible(true);

                    clearTimeout(hideRef.current);
                    hideRef.current = setTimeout(
                        () => setVisible(false),
                        showDurationMs
                    );

                    const nextGap = randomDelay(minIntervalMs, maxIntervalMs);
                    timerRef.current = setTimeout(
                        () => scheduleNext(),
                        showDurationMs + nextGap
                    );
                }, 500); 
            } else {
                const newPurchase = generatePurchase();
                setPurchase(newPurchase);
                setVisible(true);

                clearTimeout(hideRef.current);
                hideRef.current = setTimeout(
                    () => setVisible(false),
                    showDurationMs
                );

                const nextGap = randomDelay(minIntervalMs, maxIntervalMs);
                timerRef.current = setTimeout(
                    () => scheduleNext(),
                    showDurationMs + nextGap
                );
            }
        }, randomDelay(minIntervalMs, maxIntervalMs));
    };

    useEffect(() => {
        setPurchase(generatePurchase());
        setVisible(true);
        hideRef.current = setTimeout(() => setVisible(false), showDurationMs);

        timerRef.current = setTimeout(
            () => scheduleNext(),
            randomDelay(minIntervalMs, maxIntervalMs)
        );

        return () => {
            clearTimeout(timerRef.current);
            clearTimeout(hideRef.current);
        };
    }, []);

    useEffect(() => {
        products.forEach((p) => {
            const img = new Image();
            img.src = p.img;
        });
    }, [products]);

    return (
        <div
            className={`fixed z-[9999] transition-all duration-500 ease-out
     ${
         visible
             ? "opacity-100 translate-x-0"
             : "opacity-0 -translate-x-full pointer-events-none"
     }`}
            style={containerStyle}
            role="status"
            aria-live="polite"
        >
            {purchase && (
                <div
                    key={purchase.name + purchase.product + purchase.timeText} 
                    className="flex items-center gap-4 max-w-[480px] rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-[2px] shadow-2xl border border-transparent"
                >
                    <div className="flex items-center gap-2 w-full rounded-2xl bg-white p-3">
                        <img
                            src={purchase.img}
                            alt={purchase.product}
                            className="h-16 w-16 rounded-2xl object-cover flex-shrink-0 shadow-md"
                            loading="eager"
                        />

                        <div className="min-w-0">
                            <p className="text-xs text-gray-500">
                                {purchase.timeText}
                            </p>
                            <p className="text-lg font-semibold text-gray-900 truncate">
                                {purchase.name}{" "}
                                <span className="text-gray-600">
                                    from {purchase.city}
                                </span>
                            </p>
                            <p className="text-base text-gray-700 truncate">
                                purchased{" "}
                                <span className="font-bold text-indigo-600">
                                    {purchase.product}
                                </span>
                                {purchase.qty > 1 ? ` ×${purchase.qty}` : ""}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
