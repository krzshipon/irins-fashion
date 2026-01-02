export type Locale = 'en' | 'bn';

export interface Dictionary {
    nav: {
        home: string;
        shop: string;
        about: string;
        contact: string;
        cart: string;
    };
    hero: {
        cta: string;
    };
    section: {
        categories: string;
    };
    categories: {
        hijab: string;
        abaya: string;
        dress: string;
        accessories: string;
    };
    products: {
        newArrival: string;
        addToCart: string;
    };
    common: {
        seeMore: string;
    };
    company: {
        about: {
            title: string;
            story: string;
            mission: string;
        };
        contact: {
            title: string;
            address: string;
            phone: string;
            email: string;
        };
    };
    checkout: {
        title: string;
        shipping: string;
        orderSummary: string;
        placeOrder: string;
        form: {
            firstName: string;
            lastName: string;
            email: string;
            phone: string;
            address: string;
            city: string;
            postalCode: string;
        };
        success: {
            title: string;
            message: string;
            orderId: string;
            backToHome: string;
            continueShopping: string;
        };
        emptyCart: string;
        subtotal: string;
        total: string;
        shippingFee: string;
        free: string;
    };
}

export const dictionaries: Record<Locale, Dictionary> = {
    en: {
        nav: {
            home: 'Home',
            shop: 'Shop',
            about: 'About',
            contact: 'Contact',
            cart: 'Cart',
        },
        hero: {
            cta: 'Shop Now',
        },
        section: {
            categories: 'Shop by Category',
        },
        categories: {
            hijab: 'Hijabs',
            abaya: 'Abayas',
            dress: 'Dresses',
            accessories: 'Accessories',
        },
        products: {
            newArrival: 'New Arrival',
            addToCart: 'Add to Cart',
        },
        common: {
            seeMore: 'See More',
        },
        company: {
            about: {
                title: "About Irin's Fashion",
                story: "Founded with a passion for blending tradition with contemporary style, Irin's Fashion has grown from a small boutique to a beloved brand. We believe that modesty and elegance are not mutually exclusive but go hand-in-hand to create truly timeless looks.",
                mission: "Our mission is to empower women to feel confident and beautiful in attire that respects their values. We are committed to high-quality fabrics, intricate craftsmanship, and designs that celebrate the modern woman.",
            },
            contact: {
                title: "Contact Us",
                address: "Dahaka, Bangladesh",
                phone: "+8801648593538",
                email: "info@irinsfashion.com",
            },
        },
        checkout: {
            title: "Checkout",
            shipping: "Shipping Information",
            orderSummary: "Order Summary",
            placeOrder: "Place Order",
            form: {
                firstName: "First Name",
                lastName: "Last Name",
                email: "Email Address",
                phone: "Phone Number",
                address: "Street Address",
                city: "City",
                postalCode: "Postal Code"
            },
            success: {
                title: "Order Placed Successfully!",
                message: "Thank you for your purchase. We will contact you shortly to confirm your order.",
                orderId: "Order ID",
                backToHome: "Back to Home",
                continueShopping: "Continue Shopping"
            },
            emptyCart: "Your cart is empty.",
            subtotal: "Subtotal",
            total: "Total",
            shippingFee: "Shipping",
            free: "Free"
        },
    },
    bn: {
        nav: {
            home: 'হোম',
            shop: 'দোকান',
            about: 'আমাদের সম্পর্কে',
            contact: 'যোগাযোগ',
            cart: 'কার্ট',
        },
        hero: {
            cta: 'এখন কিনুন',
        },
        section: {
            categories: 'বিভাগ অনুযায়ী কেনাকাটা',
        },
        categories: {
            hijab: 'হিজাব',
            abaya: 'আবায়া',
            dress: 'জুব্বা',
            accessories: 'অন্যান্য',
        },
        products: {
            newArrival: 'নতুন আগমন',
            addToCart: 'কার্টে যোগ করুন',
        },
        common: {
            seeMore: 'আরও দেখুন',
        },
        company: {
            about: {
                title: "আইরিন'স ফ্যাশন সম্পর্কে",
                story: "ঐতিহ্যের সাথে সমসাময়িক শৈলীর মিশ্রণের আবেগ নিয়ে প্রতিষ্ঠিত, আইরিন'স ফ্যাশন একটি ছোট বুটিক থেকে একটি প্রিয় ব্র্যান্ডে পরিণত হয়েছে। আমরা বিশ্বাস করি যে শালীনতা এবং কমনীয়তা পারস্পরিকভাবে একচেটিয়া নয় বরং সত্যিকারের কালজয়ী লুক তৈরি করতে একসাথে চলে।",
                mission: "আমাদের লক্ষ্য নারীদের তাদের মূল্যবোধের প্রতি শ্রদ্ধাশীল পোশাকে আত্মবিশ্বাসী এবং সুন্দর বোধ করতে ক্ষমতায়ন করা। আমরা উচ্চ-মানের কাপড়, জটিল কারুকাজ এবং আধুনিক নারীকে উদযাপনকারী ডিজাইনের প্রতি প্রতিশ্রুতিবদ্ধ।",
            },
            contact: {
                title: "যোগাযোগ করুন",
                address: "ঢাকা, বাংলাদেশ",
                phone: "+8801648593538",
                email: "info@irinsfashion.com",
            },
        },
        checkout: {
            title: "চেকআউট",
            shipping: "শিপিং তথ্য",
            orderSummary: "অর্ডার সারাংশ",
            placeOrder: "অর্ডার করুন",
            form: {
                firstName: "নামের প্রথম অংশ",
                lastName: "নামের শেষ অংশ",
                email: "ইমেইল",
                phone: "ফোন নম্বর",
                address: "ঠিকানা",
                city: "শহর",
                postalCode: "পোস্টাল কোড"
            },
            success: {
                title: "অর্ডার সফলভাবে সম্পন্ন হয়েছে!",
                message: "কেনার জন্য ধন্যবাদ। আমরা শীঘ্রই আপনার অর্ডার নিশ্চিত করতে আপনার সাথে যোগাযোগ করব।",
                orderId: "অর্ডার আইডি",
                backToHome: "হোমে ফিরে যান",
                continueShopping: "কেনাকাটা চালিয়ে যান"
            },
            emptyCart: "আপনার কার্ট খালি।",
            subtotal: "সাবটোটাল",
            total: "মোট",
            shippingFee: "শিপিং",
            free: "ফ্রি"
        },
    },
};
