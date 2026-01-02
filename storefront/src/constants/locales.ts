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
        required: string;
        optional: string;
        loading: string;
        processing: string;
        backToHome: string;
        remove: string;
        secureCheckout: string;
        allRightsReserved: string;
    };
    footer: {
        brandTagline: string;
        shop: string;
        newArrivals: string;
        abayas: string;
        hijabs: string;
        company: string;
        aboutUs: string;
        contactUs: string;
        support: string;
        faq: string;
        shipping: string;
        returns: string;
    };
    cart: {
        title: string;
        emptyTitle: string;
        emptyMessage: string;
        continueShopping: string;
        color: string;
        size: string;
        orderSummary: string;
        subtotal: string;
        items: string;
        shipping: string;
        calculatedAtCheckout: string;
        total: string;
        proceedToCheckout: string;
    };
    about: {
        ourStory: string;
        ourMission: string;
        whyChooseUs: string;
        premiumQuality: string;
        craftsmanship: string;
        reliableDelivery: string;
        customerSupport: string;
    };
    contact: {
        title: string;
        intro: string;
        getInTouch: string;
        address: string;
        phone: string;
        email: string;
        sendMessage: string;
        form: {
            name: string;
            namePlaceholder: string;
            email: string;
            emailPlaceholder: string;
            message: string;
            messagePlaceholder: string;
            send: string;
        };
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
        contactInfo: string;
        shippingAddress: string;
        deliveryZone: string;
        paymentMethod: string;
        orderSummary: string;
        placeOrder: string;
        form: {
            fullName: string;
            email: string;
            phone: string;
            mobileNumber: string;
            address: string;
            city: string;
            postalCode: string;
        };
        delivery: {
            insideDhaka: string;
            outsideDhaka: string;
            insideDhakaDesc: string;
            outsideDhakaDesc: string;
        };
        payment: {
            cod: string;
            codDescription: string;
            secureNote: string;
        };
        success: {
            title: string;
            message: string;
            orderId: string;
            backToHome: string;
            continueShopping: string;
            viewOrderDetails: string;
            copyOrderId: string;
            copied: string;
            confirmationSent: string;
            paymentMethod: string;
            status: string;
        };
        emptyCart: string;
        subtotal: string;
        total: string;
        shippingFee: string;
        free: string;
    };
    orders: {
        title: string;
        orderDetails: string;
        orderNumber: string;
        placedOn: string;
        items: string;
        shippingAddress: string;
        orderSummary: string;
        subtotal: string;
        shipping: string;
        deliveryZone: string;
        insideDhaka: string;
        outsideDhaka: string;
        total: string;
        paymentMethod: string;
        cod: string;
        needHelp: string;
        contactSupport: string;
        status: {
            processing: string;
            confirmed: string;
            shipped: string;
            delivered: string;
            cancelled: string;
        };
    };
    trust: {
        secure: string;
        freeDelivery: string;
        easyReturns: string;
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
            required: 'Required',
            optional: 'Optional',
            loading: 'Loading...',
            processing: 'Processing...',
            backToHome: 'Back to Home',
            remove: 'Remove',
            secureCheckout: 'Secure Checkout',
            allRightsReserved: 'All rights reserved.',
        },
        footer: {
            brandTagline: 'Modest fashion for the modern woman.',
            shop: 'Shop',
            newArrivals: 'New Arrivals',
            abayas: 'Abayas',
            hijabs: 'Hijabs',
            company: 'Company',
            aboutUs: 'About Us',
            contactUs: 'Contact Us',
            support: 'Support',
            faq: 'FAQ',
            shipping: 'Shipping',
            returns: 'Returns',
        },
        cart: {
            title: 'Shopping Cart',
            emptyTitle: 'Your cart is currently empty.',
            emptyMessage: "Looks like you haven't made your choice yet.",
            continueShopping: 'Continue Shopping',
            color: 'Color',
            size: 'Size',
            orderSummary: 'Order Summary',
            subtotal: 'Subtotal',
            items: 'items',
            shipping: 'Shipping',
            calculatedAtCheckout: 'Calculated at checkout',
            total: 'Total',
            proceedToCheckout: 'Proceed to Checkout',
        },
        about: {
            ourStory: 'Our Story',
            ourMission: 'Our Mission',
            whyChooseUs: 'Why Choose Us?',
            premiumQuality: 'Premium Quality Fabrics',
            craftsmanship: 'Exquisite Craftsmanship',
            reliableDelivery: 'Reliable Delivery',
            customerSupport: 'Dedicated Customer Support',
        },
        contact: {
            title: 'Contact Us',
            intro: "We'd love to hear from you. Here's how you can reach us.",
            getInTouch: 'Get in Touch',
            address: 'Address',
            phone: 'Phone',
            email: 'Email',
            sendMessage: 'Send us a Message',
            form: {
                name: 'Name',
                namePlaceholder: 'Your Name',
                email: 'Email',
                emailPlaceholder: 'Your Email',
                message: 'Message',
                messagePlaceholder: 'How can we help?',
                send: 'Send Message',
            },
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
            contactInfo: "Contact Information",
            shippingAddress: "Shipping Address",
            deliveryZone: "Delivery Zone",
            paymentMethod: "Payment Method",
            orderSummary: "Order Summary",
            placeOrder: "Place Order",
            form: {
                fullName: "Full Name",
                email: "Email Address",
                phone: "Phone Number",
                mobileNumber: "Mobile Number",
                address: "Street Address",
                city: "City",
                postalCode: "Postal Code",
            },
            delivery: {
                insideDhaka: "Inside Dhaka City",
                outsideDhaka: "Outside Dhaka City",
                insideDhakaDesc: "Delivery within 1-2 business days",
                outsideDhakaDesc: "Delivery within 3-5 business days",
            },
            payment: {
                cod: "Cash on Delivery (COD)",
                codDescription: "Pay securely with cash when your order is delivered to your doorstep.",
                secureNote: "All transactions are secure and encrypted.",
            },
            success: {
                title: "Order Placed Successfully!",
                message: "Thank you for your purchase. We will contact you shortly to confirm your order.",
                orderId: "Order ID",
                backToHome: "Back to Home",
                continueShopping: "Continue Shopping",
                viewOrderDetails: "View Order Details",
                copyOrderId: "Copy Order ID",
                copied: "Copied!",
                confirmationSent: "Confirmation email sent. Our team will contact you to confirm delivery.",
                paymentMethod: "Payment",
                status: "Status",
            },
            emptyCart: "Your cart is empty.",
            subtotal: "Subtotal",
            total: "Total",
            shippingFee: "Shipping",
            free: "Free",
        },
        orders: {
            title: "Order Details",
            orderDetails: "Order Details",
            orderNumber: "Order",
            placedOn: "Placed on",
            items: "Items",
            shippingAddress: "Shipping Address",
            orderSummary: "Order Summary",
            subtotal: "Subtotal",
            shipping: "Shipping",
            deliveryZone: "Delivery Zone",
            insideDhaka: "Inside Dhaka",
            outsideDhaka: "Outside Dhaka",
            total: "Total",
            paymentMethod: "Payment Method",
            cod: "Cash on Delivery",
            needHelp: "Need help with your order?",
            contactSupport: "Contact Support",
            status: {
                processing: "Processing",
                confirmed: "Confirmed",
                shipped: "Shipped",
                delivered: "Delivered",
                cancelled: "Cancelled",
            },
        },
        trust: {
            secure: "Secure",
            freeDelivery: "Free Delivery",
            easyReturns: "Easy Returns",
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
            required: 'আবশ্যক',
            optional: 'ঐচ্ছিক',
            loading: 'লোড হচ্ছে...',
            processing: 'প্রক্রিয়াকরণ হচ্ছে...',
            backToHome: 'হোমে ফিরে যান',
            remove: 'সরান',
            secureCheckout: 'নিরাপদ চেকআউট',
            allRightsReserved: 'সর্বস্বত্ব সংরক্ষিত।',
        },
        footer: {
            brandTagline: 'আধুনিক নারীদের জন্য শালীন ফ্যাশন।',
            shop: 'দোকান',
            newArrivals: 'নতুন আগমন',
            abayas: 'আবায়া',
            hijabs: 'হিজাব',
            company: 'কোম্পানি',
            aboutUs: 'আমাদের সম্পর্কে',
            contactUs: 'যোগাযোগ করুন',
            support: 'সাপোর্ট',
            faq: 'প্রশ্নোত্তর',
            shipping: 'শিপিং',
            returns: 'রিটার্ন',
        },
        cart: {
            title: 'শপিং কার্ট',
            emptyTitle: 'আপনার কার্ট বর্তমানে খালি।',
            emptyMessage: 'মনে হচ্ছে আপনি এখনও কিছু বাছাই করেননি।',
            continueShopping: 'কেনাকাটা চালিয়ে যান',
            color: 'রং',
            size: 'সাইজ',
            orderSummary: 'অর্ডার সারাংশ',
            subtotal: 'সাবটোটাল',
            items: 'আইটেম',
            shipping: 'শিপিং',
            calculatedAtCheckout: 'চেকআউটে হিসাব হবে',
            total: 'মোট',
            proceedToCheckout: 'চেকআউটে যান',
        },
        about: {
            ourStory: 'আমাদের গল্প',
            ourMission: 'আমাদের লক্ষ্য',
            whyChooseUs: 'কেন আমাদের বেছে নেবেন?',
            premiumQuality: 'প্রিমিয়াম মানের কাপড়',
            craftsmanship: 'অসাধারণ কারুশিল্প',
            reliableDelivery: 'নির্ভরযোগ্য ডেলিভারি',
            customerSupport: 'নিবেদিত কাস্টমার সাপোর্ট',
        },
        contact: {
            title: 'যোগাযোগ করুন',
            intro: 'আমরা আপনার কাছ থেকে শুনতে চাই। এভাবে আমাদের সাথে যোগাযোগ করতে পারেন।',
            getInTouch: 'যোগাযোগ করুন',
            address: 'ঠিকানা',
            phone: 'ফোন',
            email: 'ইমেইল',
            sendMessage: 'আমাদের মেসেজ পাঠান',
            form: {
                name: 'নাম',
                namePlaceholder: 'আপনার নাম',
                email: 'ইমেইল',
                emailPlaceholder: 'আপনার ইমেইল',
                message: 'মেসেজ',
                messagePlaceholder: 'আমরা কিভাবে সাহায্য করতে পারি?',
                send: 'মেসেজ পাঠান',
            },
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
            contactInfo: "যোগাযোগের তথ্য",
            shippingAddress: "শিপিং ঠিকানা",
            deliveryZone: "ডেলিভারি জোন",
            paymentMethod: "পেমেন্ট পদ্ধতি",
            orderSummary: "অর্ডার সারাংশ",
            placeOrder: "অর্ডার করুন",
            form: {
                fullName: "পুরো নাম",
                email: "ইমেইল",
                phone: "ফোন নম্বর",
                mobileNumber: "মোবাইল নম্বর",
                address: "ঠিকানা",
                city: "শহর",
                postalCode: "পোস্টাল কোড",
            },
            delivery: {
                insideDhaka: "ঢাকার ভেতরে",
                outsideDhaka: "ঢাকার বাইরে",
                insideDhakaDesc: "১-২ কর্মদিবসে ডেলিভারি",
                outsideDhakaDesc: "৩-৫ কর্মদিবসে ডেলিভারি",
            },
            payment: {
                cod: "ক্যাশ অন ডেলিভারি (COD)",
                codDescription: "আপনার অর্ডার ডেলিভারি হলে নগদে নিরাপদে পেমেন্ট করুন।",
                secureNote: "সমস্ত লেনদেন নিরাপদ এবং এনক্রিপ্টেড।",
            },
            success: {
                title: "অর্ডার সফলভাবে সম্পন্ন হয়েছে!",
                message: "কেনার জন্য ধন্যবাদ। আমরা শীঘ্রই আপনার অর্ডার নিশ্চিত করতে যোগাযোগ করব।",
                orderId: "অর্ডার আইডি",
                backToHome: "হোমে ফিরে যান",
                continueShopping: "কেনাকাটা চালিয়ে যান",
                viewOrderDetails: "অর্ডার বিস্তারিত দেখুন",
                copyOrderId: "অর্ডার আইডি কপি করুন",
                copied: "কপি হয়েছে!",
                confirmationSent: "নিশ্চিতকরণ ইমেইল পাঠানো হয়েছে। আমাদের টিম ডেলিভারি নিশ্চিত করতে যোগাযোগ করবে।",
                paymentMethod: "পেমেন্ট",
                status: "স্ট্যাটাস",
            },
            emptyCart: "আপনার কার্ট খালি।",
            subtotal: "সাবটোটাল",
            total: "মোট",
            shippingFee: "শিপিং",
            free: "ফ্রি",
        },
        orders: {
            title: "অর্ডার বিস্তারিত",
            orderDetails: "অর্ডার বিস্তারিত",
            orderNumber: "অর্ডার",
            placedOn: "অর্ডারের তারিখ",
            items: "পণ্য",
            shippingAddress: "শিপিং ঠিকানা",
            orderSummary: "অর্ডার সারাংশ",
            subtotal: "সাবটোটাল",
            shipping: "শিপিং",
            deliveryZone: "ডেলিভারি জোন",
            insideDhaka: "ঢাকার ভেতরে",
            outsideDhaka: "ঢাকার বাইরে",
            total: "মোট",
            paymentMethod: "পেমেন্ট পদ্ধতি",
            cod: "ক্যাশ অন ডেলিভারি",
            needHelp: "অর্ডার সংক্রান্ত সাহায্য দরকার?",
            contactSupport: "সাপোর্টে যোগাযোগ করুন",
            status: {
                processing: "প্রক্রিয়াধীন",
                confirmed: "নিশ্চিত",
                shipped: "শিপ করা হয়েছে",
                delivered: "ডেলিভারি হয়েছে",
                cancelled: "বাতিল",
            },
        },
        trust: {
            secure: "নিরাপদ",
            freeDelivery: "ফ্রি ডেলিভারি",
            easyReturns: "সহজ রিটার্ন",
        },
    },
};
