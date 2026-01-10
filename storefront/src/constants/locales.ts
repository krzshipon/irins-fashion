export type Locale = 'en' | 'bn';

export interface Dictionary {
    nav: {
        home: string;
        shop: string;
        newCollection: string;
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
    shop: {
        filter: string;
        categories: string;
        price: string;
        min: string;
        max: string;
        status: string;
        clearAllFilters: string;
        noProductsFound: string;
        sortBy: string;
        newestArrivals: string;
        priceLowToHigh: string;
        priceHighToLow: string;
    };
    auth: {
        login: {
            title: string;
            subtitle: string;
            mobileNumber: string;
            mobilePlaceholder: string;
            password: string;
            passwordPlaceholder: string;
            forgotPassword: string;
            rememberMe: string;
            signIn: string;
            signingIn: string;
            noAccount: string;
            createAccount: string;
            invalidCredentials: string;
        };
        register: {
            title: string;
            subtitle: string;
            fullName: string;
            fullNamePlaceholder: string;
            mobileNumber: string;
            mobilePlaceholder: string;
            password: string;
            passwordPlaceholder: string;
            confirmPassword: string;
            confirmPasswordPlaceholder: string;
            createAccount: string;
            creatingAccount: string;
            termsPrefix: string;
            privacyPolicy: string;
            and: string;
            termsOfService: string;
            hasAccount: string;
            signIn: string;
            passwordsDoNotMatch: string;
            passwordTooShort: string;
            invalidMobile: string;
            registrationFailed: string;
        };
        forgotPassword: {
            title: string;
            subtitle: string;
            mobileNumber: string;
            mobilePlaceholder: string;
            sendOtp: string;
            sendingOtp: string;
            backToLogin: string;
            verifyOtpTitle: string;
            verifyOtpSubtitle: string;
            didntReceiveCode: string;
            resendOtp: string;
            resendIn: string;
            verifyOtp: string;
            verifying: string;
            changeNumber: string;
            newPasswordTitle: string;
            newPasswordSubtitle: string;
            newPassword: string;
            confirmPassword: string;
            resetPassword: string;
            resetting: string;
            successTitle: string;
            successMessage: string;
            goToLogin: string;
            rememberPassword: string;
            completeOtp: string;
            invalidOtp: string;
            failedToSendOtp: string;
            failedToResendOtp: string;
            failedToResetPassword: string;
        };
    };
    categories: {
        hijab: string;
        abaya: string;
        dress: string;
        borkha: string;
        gown: string;
        accessories: string;
    };
    products: {
        newArrival: string;
        addToCart: string;
        orderNow: string;
        quantity: string;
        alreadyInCart: string;
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
        login: string;
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
        privacy: string;
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
            phone: string;
            mobileNumber: string;
            division: string;
            selectDivision: string;
            fullAddress: string;
            fullAddressPlaceholder: string;
            notes: string;
            notesPlaceholder: string;
        };
        delivery: {
            insideDhaka: string;
            outsideDhaka: string;
            insideDhakaDesc: string;
            outsideDhakaDesc: string;
            onlyDhaka: string;
            freeShipping: string;
            freeShippingDesc: string;
            freeShippingMin: string;
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
        freeShipping: string;
        freeShippingNote: string;
        coupon: {
            title: string;
            placeholder: string;
            apply: string;
            remove: string;
            discount: string;
            invalid: string;
            applied: string;
            minAmount: string;
        };
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
            orderPlaced: string;
            processing: string;
            confirmed: string;
            shipped: string;
            delivered: string;
            cancelled: string;
        };
        statusDesc: {
            processing: string;
            confirmed: string;
            shipped: string;
            delivered: string;
            cancelled: string;
        };
        accessDenied: string;
        accessDeniedDesc: string;
        trackOrder: string;
    };
    trust: {
        secure: string;
        freeDelivery: string;
        easyReturns: string;
    };
    faq: {
        title: string;
        subtitle: string;
        allQuestions: string;
        ordersShipping: string;
        returnsRefunds: string;
        products: string;
        payment: string;
        stillHaveQuestions: string;
        cantFindAnswer: string;
        contactUs: string;
    };
    shippingPage: {
        title: string;
        subtitle: string;
        deliveryZones: string;
        insideDhaka: string;
        outsideDhaka: string;
        businessDays: string;
        freeShippingBanner: string;
        whyShopWithUs: string;
        carefulPackaging: string;
        carefulPackagingDesc: string;
        realTimeTracking: string;
        realTimeTrackingDesc: string;
        freeShipping: string;
        freeShippingDesc: string;
        qualityGuaranteed: string;
        qualityGuaranteedDesc: string;
        howItWorks: string;
        step1Title: string;
        step1Desc: string;
        step2Title: string;
        step2Desc: string;
        step3Title: string;
        step3Desc: string;
        step4Title: string;
        step4Desc: string;
        readyToShop: string;
        exploreCollection: string;
        shopNow: string;
    };
    returnsPage: {
        title: string;
        subtitle: string;
        howToReturn: string;
        step1Title: string;
        step1Desc: string;
        step2Title: string;
        step2Desc: string;
        step3Title: string;
        step3Desc: string;
        step4Title: string;
        step4Desc: string;
        returnPolicy: string;
        returnWindow: string;
        returnWindowDesc: string;
        originalCondition: string;
        originalConditionDesc: string;
        originalPackaging: string;
        originalPackagingDesc: string;
        nonReturnable: string;
        nonReturnableDesc: string;
        refundOptions: string;
        storeCredit: string;
        storeCreditDesc: string;
        recommended: string;
        cashRefund: string;
        cashRefundDesc: string;
        importantNotes: string;
        note1: string;
        note2: string;
        note3: string;
        note4: string;
        note5: string;
        needToReturn: string;
        supportReady: string;
        contactSupport: string;
        viewFaq: string;
    };
    privacyPage: {
        title: string;
        subtitle: string;
        lastUpdated: string;
        introduction: {
            title: string;
            content: string;
        };
        collection: {
            title: string;
            content: string;
            items: string[];
        };
        usage: {
            title: string;
            content: string;
            items: string[];
        };
        sharing: {
            title: string;
            content: string;
        };
        security: {
            title: string;
            content: string;
        };
        rights: {
            title: string;
            content: string;
            items: string[];
        };
        cookies: {
            title: string;
            content: string;
        };
        contact: {
            title: string;
            content: string;
        };
    };
    termsPage: {
        title: string;
        subtitle: string;
        lastUpdated: string;
        introduction: {
            title: string;
            content: string;
        };
        acceptance: {
            title: string;
            content: string;
        };
        products: {
            title: string;
            content: string;
            items: string[];
        };
        orders: {
            title: string;
            content: string;
            items: string[];
        };
        pricing: {
            title: string;
            content: string;
        };
        shipping: {
            title: string;
            content: string;
            items: string[];
        };
        returns: {
            title: string;
            content: string;
            items: string[];
        };
        customOrders: {
            title: string;
            content: string;
            items: string[];
        };
        intellectual: {
            title: string;
            content: string;
        };
        limitation: {
            title: string;
            content: string;
        };
        governing: {
            title: string;
            content: string;
        };
        changes: {
            title: string;
            content: string;
        };
        contact: {
            title: string;
            content: string;
        };
    };
}

export const dictionaries: Record<Locale, Dictionary> = {
    en: {
        nav: {
            home: 'Home',
            shop: 'Shop',
            newCollection: 'New Collection',
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
        shop: {
            filter: 'Filter',
            categories: 'Categories',
            price: 'Price (BDT)',
            min: 'Min',
            max: 'Max',
            status: 'Status',
            clearAllFilters: 'Clear All Filters',
            noProductsFound: 'No products found matching your filters.',
            sortBy: 'Sort by:',
            newestArrivals: 'Newest Arrivals',
            priceLowToHigh: 'Price: Low to High',
            priceHighToLow: 'Price: High to Low',
        },
        auth: {
            login: {
                title: 'Welcome Back',
                subtitle: 'Sign in to access your orders and profile',
                mobileNumber: 'Mobile Number',
                mobilePlaceholder: '017...',
                password: 'Password',
                passwordPlaceholder: '••••••••',
                forgotPassword: 'Forgot password?',
                rememberMe: 'Remember my credentials',
                signIn: 'Sign in',
                signingIn: 'Signing in...',
                noAccount: "Don't have an account?",
                createAccount: 'Create one now',
                invalidCredentials: 'Invalid mobile number or password.',
            },
            register: {
                title: 'Create Account',
                subtitle: 'Join us for exclusive offers and faster checkout',
                fullName: 'Full Name',
                fullNamePlaceholder: 'Your full name',
                mobileNumber: 'Mobile Number',
                mobilePlaceholder: '01XXXXXXXXX',
                password: 'Password',
                passwordPlaceholder: 'At least 6 characters',
                confirmPassword: 'Confirm Password',
                confirmPasswordPlaceholder: 'Confirm your password',
                createAccount: 'Create Account',
                creatingAccount: 'Creating account...',
                termsPrefix: 'By registering, you agree to our',
                privacyPolicy: 'Privacy Policy',
                and: 'and',
                termsOfService: 'Terms of Service',
                hasAccount: 'Already have an account?',
                signIn: 'Sign in',
                passwordsDoNotMatch: 'Passwords do not match.',
                passwordTooShort: 'Password must be at least 6 characters.',
                invalidMobile: 'Please enter a valid BD mobile number (01XXXXXXXXX).',
                registrationFailed: 'Registration failed. Please try again.',
            },
            forgotPassword: {
                title: 'Forgot Password?',
                subtitle: "Enter your mobile number and we'll send you a verification code",
                mobileNumber: 'Mobile Number',
                mobilePlaceholder: '01XXXXXXXXX',
                sendOtp: 'Send OTP',
                sendingOtp: 'Sending OTP...',
                backToLogin: 'Back to Login',
                verifyOtpTitle: 'Verify OTP',
                verifyOtpSubtitle: 'Enter the 6-digit code sent to',
                didntReceiveCode: "Didn't receive the code?",
                resendOtp: 'Resend OTP',
                resendIn: 'Resend in',
                verifyOtp: 'Verify OTP',
                verifying: 'Verifying...',
                changeNumber: 'Change Number',
                newPasswordTitle: 'Create New Password',
                newPasswordSubtitle: 'Enter a new password for your account',
                newPassword: 'New Password',
                confirmPassword: 'Confirm Password',
                resetPassword: 'Reset Password',
                resetting: 'Resetting...',
                successTitle: 'Password Reset Successful!',
                successMessage: 'Your password has been updated. Redirecting to login...',
                goToLogin: 'Go to Login',
                rememberPassword: 'Remember your password?',
                completeOtp: 'Please enter the complete OTP',
                invalidOtp: 'Invalid OTP',
                failedToSendOtp: 'Failed to send OTP',
                failedToResendOtp: 'Failed to resend OTP',
                failedToResetPassword: 'Failed to reset password',
            },
        },
        categories: {
            hijab: 'Hijabs',
            abaya: 'Abayas',
            dress: 'Dresses',
            borkha: 'Borkhas',
            gown: 'Gowns',
            accessories: 'Accessories',
        },
        products: {
            newArrival: 'New Arrival',
            addToCart: 'Add to Cart',
            orderNow: 'Order Now',
            quantity: 'Quantity',
            alreadyInCart: 'already in cart',
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
            login: 'Log In',
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
            privacy: 'Privacy Policy',
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
                phone: "Phone Number",
                mobileNumber: "Mobile Number",
                division: "Division",
                selectDivision: "Select Division",
                fullAddress: "Full Address",
                fullAddressPlaceholder: "House no, road no, area, landmarks...",
                notes: "Order Notes",
                notesPlaceholder: "Special instructions, custom requirements, or delivery preferences...",
            },
            delivery: {
                insideDhaka: "Inside Dhaka City",
                outsideDhaka: "Outside Dhaka City",
                insideDhakaDesc: "Delivery within 1-2 business days",
                outsideDhakaDesc: "Delivery within 3-5 business days",
                onlyDhaka: "Only available for Dhaka division",
                freeShipping: "Free Shipping",
                freeShippingDesc: "Congratulations! You qualify for free shipping",
                freeShippingMin: "Available on orders ℳ5,000+",
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
            freeShipping: "FREE",
            freeShippingNote: "Free shipping on orders ℳ5,000+",
            coupon: {
                title: "Have a coupon?",
                placeholder: "Enter coupon code",
                apply: "Apply",
                remove: "Remove",
                discount: "Discount",
                invalid: "Invalid coupon code",
                applied: "Coupon applied successfully!",
                minAmount: "Minimum order amount is",
            },
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
                orderPlaced: "Order Placed",
                processing: "Processing",
                confirmed: "Confirmed",
                shipped: "Shipped",
                delivered: "Delivered",
                cancelled: "Cancelled",
            },
            statusDesc: {
                processing: "Your order is being prepared for shipment",
                confirmed: "Order confirmed and ready to ship",
                shipped: "Your order is on its way to you",
                delivered: "Your order has been delivered successfully",
                cancelled: "This order has been cancelled",
            },
            accessDenied: "Order Not Found",
            accessDeniedDesc: "You don't have permission to view this order. Please log in or check your order ID.",
            trackOrder: "Track Your Order",
        },
        trust: {
            secure: "Secure",
            freeDelivery: "Free Delivery",
            easyReturns: "Easy Returns",
        },
        faq: {
            title: "Frequently Asked Questions",
            subtitle: "Find answers to common questions about orders, shipping, returns, and more.",
            allQuestions: "All Questions",
            ordersShipping: "Orders & Shipping",
            returnsRefunds: "Returns & Refunds",
            products: "Products",
            payment: "Payment",
            stillHaveQuestions: "Still have questions?",
            cantFindAnswer: "Can't find what you're looking for? Our support team is here to help!",
            contactUs: "Contact Us",
        },
        shippingPage: {
            title: "Shipping Information",
            subtitle: "Fast and reliable delivery across Bangladesh",
            deliveryZones: "Delivery Zones & Rates",
            insideDhaka: "Inside Dhaka City",
            outsideDhaka: "Outside Dhaka City",
            businessDays: "business days",
            freeShippingBanner: "FREE SHIPPING on orders above ৳5,000",
            whyShopWithUs: "Why Shop With Us?",
            carefulPackaging: "Careful Packaging",
            carefulPackagingDesc: "Every order is carefully packaged to ensure your items arrive in perfect condition.",
            realTimeTracking: "Real-time Tracking",
            realTimeTrackingDesc: "Track your order status via SMS updates and our customer support team.",
            freeShipping: "Free Shipping",
            freeShippingDesc: "Enjoy free delivery on all orders above ৳5,000 anywhere in Bangladesh.",
            qualityGuaranteed: "Quality Guaranteed",
            qualityGuaranteedDesc: "If your order arrives damaged, we'll replace it at no extra cost.",
            howItWorks: "How It Works",
            step1Title: "Place Your Order",
            step1Desc: "Browse our collection and checkout with your details",
            step2Title: "Order Confirmation",
            step2Desc: "Receive SMS confirmation with your Order ID",
            step3Title: "Dispatch & Track",
            step3Desc: "Get tracking updates as your order ships",
            step4Title: "Delivery",
            step4Desc: "Pay cash on delivery and enjoy your purchase!",
            readyToShop: "Ready to Shop?",
            exploreCollection: "Explore our latest collection and experience premium delivery",
            shopNow: "Shop Now",
        },
        returnsPage: {
            title: "Returns & Refunds",
            subtitle: "Easy returns with hassle-free refund process",
            howToReturn: "How to Return",
            step1Title: "Contact Us",
            step1Desc: "Reach out within 3 days of delivery with your Order ID",
            step2Title: "Get Approval",
            step2Desc: "Our team will review and approve your return request",
            step3Title: "Ship or Pickup",
            step3Desc: "Send the item back or we'll arrange pickup",
            step4Title: "Refund",
            step4Desc: "Get refund within 7-10 business days",
            returnPolicy: "Return Policy",
            returnWindow: "3-Day Return Window",
            returnWindowDesc: "Returns must be initiated within 3 days of receiving your order.",
            originalCondition: "Original Condition",
            originalConditionDesc: "Items must be unused, unwashed, and have all original tags attached.",
            originalPackaging: "Original Packaging",
            originalPackagingDesc: "Products should be returned in their original packaging.",
            nonReturnable: "Non-Returnable Items",
            nonReturnableDesc: "Undergarments, customized items, and sale items cannot be returned.",
            refundOptions: "Refund Options",
            storeCredit: "Store Credit",
            storeCreditDesc: "Get full value as store credit for your next purchase. Instant processing.",
            recommended: "Recommended",
            cashRefund: "Cash Refund",
            cashRefundDesc: "Receive refund via bKash or bank transfer. 7-10 business days.",
            importantNotes: "Important Notes",
            note1: "Shipping costs for returns are non-refundable unless the item is defective",
            note2: "Exchanges are subject to stock availability",
            note3: "Refund will be processed to original payment method for online payments",
            note4: "Quality checks are performed on all returned items",
            note5: "Items showing signs of wear, damage, or alterations will not be accepted",
            needToReturn: "Need to Return Something?",
            supportReady: "Our support team is ready to help you with your return request",
            contactSupport: "Contact Support",
            viewFaq: "View FAQ",
        },
        privacyPage: {
            title: "Privacy Policy",
            subtitle: "Your privacy is important to us. Learn how we collect, use, and protect your information.",
            lastUpdated: "Last Updated",
            introduction: {
                title: "Introduction",
                content: "At Irin's Fashion, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data when you visit our website or make a purchase."
            },
            collection: {
                title: "Information We Collect",
                content: "We collect information required to process your orders and improve your shopping experience, including:",
                items: [
                    "Personal identification (Name, Email, Phone Number, Shipping Address)",
                    "Order history and shopping preferences",
                    "Device and browser information for website optimization"
                ]
            },
            usage: {
                title: "How We Use Your Information",
                content: "Your data is used solely for the following purposes:",
                items: [
                    "Processing and delivering your orders",
                    "Communicating order updates and delivery status",
                    "Improving our website functionality and customer service",
                    "Sending promotional offers (only if you have opted in)"
                ]
            },
            sharing: {
                title: "Information Sharing",
                content: "We do not sell, trade, or rent your personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners and trusted affiliates."
            },
            security: {
                title: "Data Security",
                content: "We implement appropriate data collection, storage, and processing practices and security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information."
            },
            rights: {
                title: "Your Rights",
                content: "You have the right to:",
                items: [
                    "Access the personal data we hold about you",
                    "Request correction of inaccurate data",
                    "Request deletion of your data (subject to legal retention requirements)"
                ]
            },
            cookies: {
                title: "Cookies",
                content: "Our website uses 'cookies' to enhance user experience. You may choose to set your web browser to refuse cookies, or to alert you when cookies are being sent."
            },
            contact: {
                title: "Contact Us",
                content: "If you have any questions about this Privacy Policy, please contact us at info@irinsfashion.com or +8801648593538."
            }
        },
        termsPage: {
            title: "Terms of Service",
            subtitle: "Please read these terms carefully before using our services.",
            lastUpdated: "Last Updated",
            introduction: {
                title: "Introduction",
                content: "Welcome to Irin's Fashion. By accessing or using our website and services, you agree to be bound by these Terms of Service. We are a Dhaka-based modest fashion retailer specializing in hijabs, abayas, borkhas, niqabs, gowns, and women's accessories — offering both ready-made and custom-tailored products."
            },
            acceptance: {
                title: "Acceptance of Terms",
                content: "By placing an order or using our website, you confirm that you are at least 18 years old or have parental/guardian consent, and that you agree to comply with these terms. If you do not agree with any part of these terms, please do not use our services."
            },
            products: {
                title: "Products and Services",
                content: "We offer a variety of modest fashion products including:",
                items: [
                    "Ready-made hijabs, abayas, borkhas, niqabs, and gowns",
                    "Custom-tailored garments made to your specifications",
                    "Women's fashion accessories",
                    "All products are designed with modesty and elegance in mind"
                ]
            },
            orders: {
                title: "Orders and Payment",
                content: "When placing an order, please note:",
                items: [
                    "All prices are listed in Bangladeshi Taka (BDT)",
                    "We accept cash on delivery (COD) within Dhaka and online payments",
                    "Orders are confirmed only after successful payment verification",
                    "We reserve the right to cancel orders due to stock unavailability or pricing errors",
                    "Order confirmation will be sent via SMS or email"
                ]
            },
            pricing: {
                title: "Pricing",
                content: "All prices displayed are in BDT and include applicable taxes. We reserve the right to modify prices at any time without prior notice. However, any price changes will not affect orders that have already been confirmed."
            },
            shipping: {
                title: "Shipping and Delivery",
                content: "We currently serve customers in Dhaka and across Bangladesh:",
                items: [
                    "Delivery within Dhaka: 2-3 business days",
                    "Delivery outside Dhaka: 5-7 business days",
                    "Custom-tailored orders require additional 7-14 days for preparation",
                    "Shipping costs are calculated at checkout based on location",
                    "Tracking information will be provided via SMS"
                ]
            },
            returns: {
                title: "Returns and Exchanges",
                content: "We want you to be completely satisfied with your purchase:",
                items: [
                    "Ready-made items may be returned within 7 days of delivery if unused and in original packaging",
                    "Custom-tailored items are non-returnable unless there is a manufacturing defect",
                    "Intimate wear and accessories are non-returnable for hygiene reasons",
                    "Refunds are processed within 7-10 business days after receiving the returned item",
                    "Exchange is subject to product availability"
                ]
            },
            customOrders: {
                title: "Custom Orders Policy",
                content: "For custom-tailored garments:",
                items: [
                    "50% advance payment is required to start production",
                    "Accurate measurements must be provided by the customer",
                    "Production time is typically 7-14 days depending on complexity",
                    "Minor variations in color or fabric texture may occur",
                    "Custom orders are final and non-refundable unless defective"
                ]
            },
            intellectual: {
                title: "Intellectual Property",
                content: "All content on this website, including but not limited to text, images, logos, designs, and product photos, are the property of Irin's Fashion and are protected by copyright laws. You may not reproduce, distribute, or use any content without our written permission."
            },
            limitation: {
                title: "Limitation of Liability",
                content: "Irin's Fashion shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use our products or services. Our total liability shall not exceed the amount paid for the specific product or service in question."
            },
            governing: {
                title: "Governing Law",
                content: "These Terms of Service are governed by and construed in accordance with the laws of Bangladesh. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of Dhaka, Bangladesh."
            },
            changes: {
                title: "Changes to Terms",
                content: "We reserve the right to update or modify these Terms of Service at any time. Changes will be effective immediately upon posting on our website. Your continued use of our services after any changes constitutes acceptance of the new terms."
            },
            contact: {
                title: "Contact Us",
                content: "If you have any questions about these Terms of Service, please contact us at info@irinsfashion.com or call +8801648593538. Our office is located in Dhaka, Bangladesh."
            }
        },
    },
    bn: {
        nav: {
            home: 'হোম',
            shop: 'দোকান',
            newCollection: 'নতুন কালেকশন',
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
        shop: {
            filter: 'ফিল্টার',
            categories: 'বিভাগ',
            price: 'মূল্য (টাকা)',
            min: 'সর্বনিম্ন',
            max: 'সর্বোচ্চ',
            status: 'স্ট্যাটাস',
            clearAllFilters: 'সব ফিল্টার মুছুন',
            noProductsFound: 'আপনার ফিল্টার অনুযায়ী কোনো পণ্য পাওয়া যায়নি।',
            sortBy: 'সাজান:',
            newestArrivals: 'নতুন আগমন',
            priceLowToHigh: 'মূল্য: কম থেকে বেশি',
            priceHighToLow: 'মূল্য: বেশি থেকে কম',
        },
        auth: {
            login: {
                title: 'স্বাগতম',
                subtitle: 'আপনার অর্ডার এবং প্রোফাইল দেখতে সাইন ইন করুন',
                mobileNumber: 'মোবাইল নম্বর',
                mobilePlaceholder: '০১৭...',
                password: 'পাসওয়ার্ড',
                passwordPlaceholder: '••••••••',
                forgotPassword: 'পাসওয়ার্ড ভুলে গেছেন?',
                rememberMe: 'আমার তথ্য মনে রাখুন',
                signIn: 'সাইন ইন',
                signingIn: 'সাইন ইন হচ্ছে...',
                noAccount: 'আকাউন্ট নেই?',
                createAccount: 'এখনই তৈরি করুন',
                invalidCredentials: 'ভুল মোবাইল নম্বর বা পাসওয়ার্ড।',
            },
            register: {
                title: 'আকাউন্ট তৈরি করুন',
                subtitle: 'বিশেষ অফার এবং দ্রুত চেকআউটের জন্য যুক্ত হন',
                fullName: 'পূর্ণ নাম',
                fullNamePlaceholder: 'আপনার পূর্ণ নাম',
                mobileNumber: 'মোবাইল নম্বর',
                mobilePlaceholder: '০১XXXXXXXXX',
                password: 'পাসওয়ার্ড',
                passwordPlaceholder: 'কমপক্ষে ৬ অক্ষর',
                confirmPassword: 'পাসওয়ার্ড নিশ্চিত করুন',
                confirmPasswordPlaceholder: 'পাসওয়ার্ড নিশ্চিত করুন',
                createAccount: 'আকাউন্ট তৈরি করুন',
                creatingAccount: 'আকাউন্ট তৈরি হচ্ছে...',
                termsPrefix: 'নিবন্ধন করে আপনি আমাদের',
                privacyPolicy: 'গোপনীয়তা নীতি',
                and: 'এবং',
                termsOfService: 'সেবার শর্তাবলী',
                hasAccount: 'ইতিমধ্যে আকাউন্ট আছে?',
                signIn: 'সাইন ইন',
                passwordsDoNotMatch: 'পাসওয়ার্ড মিলছে না।',
                passwordTooShort: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।',
                invalidMobile: 'অনুগ্রহ করে সঠিক BD মোবাইল নম্বর লিখুন (০১XXXXXXXXX)।',
                registrationFailed: 'নিবন্ধন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।',
            },
            forgotPassword: {
                title: 'পাসওয়ার্ড ভুলে গেছেন?',
                subtitle: 'আপনার মোবাইল নম্বর লিখুন, আমরা একটি ভেরিফিকেশন কোড পাঠাব',
                mobileNumber: 'মোবাইল নম্বর',
                mobilePlaceholder: '০১XXXXXXXXX',
                sendOtp: 'OTP পাঠান',
                sendingOtp: 'OTP পাঠানো হচ্ছে...',
                backToLogin: 'লগইনে ফিরে যান',
                verifyOtpTitle: 'OTP যাচাই',
                verifyOtpSubtitle: 'পাঠানো ৬ সংখ্যার কোড লিখুন',
                didntReceiveCode: 'কোড পাননি?',
                resendOtp: 'আবার পাঠান',
                resendIn: 'আবার পাঠাতে পারবেন',
                verifyOtp: 'OTP যাচাই',
                verifying: 'যাচাই হচ্ছে...',
                changeNumber: 'নম্বর পরিবর্তন',
                newPasswordTitle: 'নতুন পাসওয়ার্ড তৈরি করুন',
                newPasswordSubtitle: 'আপনার আকাউন্টের জন্য নতুন পাসওয়ার্ড লিখুন',
                newPassword: 'নতুন পাসওয়ার্ড',
                confirmPassword: 'পাসওয়ার্ড নিশ্চিত করুন',
                resetPassword: 'পাসওয়ার্ড রিসেট',
                resetting: 'রিসেট হচ্ছে...',
                successTitle: 'পাসওয়ার্ড রিসেট সফল!',
                successMessage: 'আপনার পাসওয়ার্ড আপডেট হয়েছে। লগইনে যাচ্ছে...',
                goToLogin: 'লগইনে যান',
                rememberPassword: 'পাসওয়ার্ড মনে আছে?',
                completeOtp: 'অনুগ্রহ করে সম্পূর্ণ OTP লিখুন',
                invalidOtp: 'ভুল OTP',
                failedToSendOtp: 'OTP পাঠাতে ব্যর্থ হয়েছে',
                failedToResendOtp: 'আবার OTP পাঠাতে ব্যর্থ হয়েছে',
                failedToResetPassword: 'পাসওয়ার্ড রিসেট ব্যর্থ হয়েছে',
            },
        },
        categories: {
            hijab: 'হিজাব',
            abaya: 'আবায়া',
            dress: 'জুব্বা',
            borkha: 'বোরখা',
            gown: 'গাউন',
            accessories: 'অন্যান্য',
        },
        products: {
            newArrival: 'নতুন আগমন',
            addToCart: 'কার্টে যোগ করুন',
            orderNow: 'এখনই অর্ডার করুন',
            quantity: 'পরিমাণ',
            alreadyInCart: 'ইতিমধ্যে কার্টে আছে',
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
            login: 'লগ ইন',
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
            privacy: 'গোপনীয়তা নীতি',
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
                phone: "ফোন নম্বর",
                mobileNumber: "মোবাইল নম্বর",
                division: "বিভাগ",
                selectDivision: "বিভাগ নির্বাচন করুন",
                fullAddress: "পূর্ণ ঠিকানা",
                fullAddressPlaceholder: "বাসা নং, রোড নং, এলাকা, ল্যান্ডমার্ক...",
                notes: "অর্ডার নোট",
                notesPlaceholder: "বিশেষ নির্দেশনা, কাস্টম প্রয়োজনীয়তা, বা ডেলিভারি পছন্দ...",
            },
            delivery: {
                insideDhaka: "ঢাকার ভেতরে",
                outsideDhaka: "ঢাকার বাইরে",
                insideDhakaDesc: "১-২ কর্মদিবসে ডেলিভারি",
                outsideDhakaDesc: "৩-৫ কর্মদিবসে ডেলিভারি",
                onlyDhaka: "শুধুমাত্র ঢাকা বিভাগের জন্য প্রযোজ্য",
                freeShipping: "ফ্রি শিপিং",
                freeShippingDesc: "অভিনন্দন! আপনি ফ্রি শিপিং পাচ্ছেন",
                freeShippingMin: "৫,০০০+ টাকার অর্ডারে প্রযোজ্য",
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
            freeShipping: "ফ্রি",
            freeShippingNote: "৫,০০০+ টাকার অর্ডারে ফ্রি শিপিং",
            coupon: {
                title: "কুপন আছে?",
                placeholder: "কুপন কোড লিখুন",
                apply: "প্রয়োগ করুন",
                remove: "সরান",
                discount: "ছাড়",
                invalid: "অকার্যকর কুপন কোড",
                applied: "কুপন সফলভাবে প্রয়োগ করা হয়েছে!",
                minAmount: "ন্যূনতম অর্ডারের পরিমাণ",
            },
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
                orderPlaced: "অর্ডার গ্রহণ করা হয়েছে",
                processing: "প্রক্রিয়াধীন",
                confirmed: "নিশ্চিত",
                shipped: "শিপ করা হয়েছে",
                delivered: "ডেলিভারি হয়েছে",
                cancelled: "বাতিল",
            },
            statusDesc: {
                processing: "আপনার অর্ডারটি শিপমেন্টের জন্য প্রস্তুত করা হচ্ছে",
                confirmed: "অর্ডার নিশ্চিত হয়েছে এবং শিপিংয়ের জন্য প্রস্তুত",
                shipped: "আপনার অর্ডারটি আপনার পথে রয়েছে",
                delivered: "আপনার অর্ডার সফলভাবে ডেলিভারি হয়েছে",
                cancelled: "এই অর্ডারটি বাতিল করা হয়েছে",
            },
            accessDenied: "অর্ডার পাওয়া যায়নি",
            accessDeniedDesc: "এই অর্ডারটি দেখার অনুমতি আপনার নেই। অনুগ্রহ করে লগ ইন করুন বা আপনার অর্ডার আইডি চেক করুন।",
            trackOrder: "আপনার অর্ডার ট্র্যাক করুন",
        },
        trust: {
            secure: "নিরাপদ",
            freeDelivery: "ফ্রি ডেলিভারি",
            easyReturns: "সহজ রিটার্ন",
        },
        faq: {
            title: "সাধারণ জিজ্ঞাসা",
            subtitle: "অর্ডার, শিপিং, রিটার্ন এবং অন্যান্য বিষয়ে সাধারণ প্রশ্নের উত্তর খুঁজুন।",
            allQuestions: "সব প্রশ্ন",
            ordersShipping: "অর্ডার ও শিপিং",
            returnsRefunds: "রিটার্ন ও রিফান্ড",
            products: "পণ্য",
            payment: "পেমেন্ট",
            stillHaveQuestions: "এখনও প্রশ্ন আছে?",
            cantFindAnswer: "যা খুঁজছেন তা পাচ্ছেন না? আমাদের সাপোর্ট টিম সাহায্য করতে প্রস্তুত!",
            contactUs: "যোগাযোগ করুন",
        },
        shippingPage: {
            title: "শিপিং তথ্য",
            subtitle: "সারা বাংলাদেশে দ্রুত এবং নির্ভরযোগ্য ডেলিভারি",
            deliveryZones: "ডেলিভারি জোন ও চার্জ",
            insideDhaka: "ঢাকার ভেতরে",
            outsideDhaka: "ঢাকার বাইরে",
            businessDays: "কর্মদিবস",

            freeShippingBanner: "৳৫,০০০ এর উপরে অর্ডারে ফ্রি শিপিং",
            whyShopWithUs: "কেন আমাদের কাছ থেকে কিনবেন?",
            carefulPackaging: "যত্নশীল প্যাকেজিং",
            carefulPackagingDesc: "প্রতিটি অর্ডার সাবধানে প্যাক করা হয় যাতে আপনার পণ্য নিখুঁত অবস্থায় পৌঁছায়।",
            realTimeTracking: "রিয়েল-টাইম ট্র্যাকিং",
            realTimeTrackingDesc: "SMS আপডেট এবং কাস্টমার সাপোর্টের মাধ্যমে অর্ডার ট্র্যাক করুন।",
            freeShipping: "ফ্রি শিপিং",
            freeShippingDesc: "বাংলাদেশের যেকোনো জায়গায় ৳৫,০০০ এর উপরে অর্ডারে ফ্রি ডেলিভারি উপভোগ করুন।",
            qualityGuaranteed: "মান নিশ্চিত",
            qualityGuaranteedDesc: "যদি অর্ডার ক্ষতিগ্রস্ত অবস্থায় আসে, আমরা বিনা খরচে প্রতিস্থাপন করব।",
            howItWorks: "কিভাবে কাজ করে",
            step1Title: "অর্ডার করুন",
            step1Desc: "আমাদের কালেকশন ব্রাউজ করুন এবং চেকআউট করুন",
            step2Title: "অর্ডার নিশ্চিতকরণ",
            step2Desc: "অর্ডার আইডি সহ SMS নিশ্চিতকরণ পান",
            step3Title: "ডিসপ্যাচ ও ট্র্যাক",
            step3Desc: "অর্ডার শিপ হওয়ার সাথে সাথে ট্র্যাকিং আপডেট পান",
            step4Title: "ডেলিভারি",
            step4Desc: "ক্যাশ অন ডেলিভারিতে পেমেন্ট করুন এবং কেনাকাটা উপভোগ করুন!",
            readyToShop: "কেনাকাটা করতে প্রস্তুত?",
            exploreCollection: "আমাদের সর্বশেষ কালেকশন দেখুন এবং প্রিমিয়াম ডেলিভারি উপভোগ করুন",
            shopNow: "এখন কিনুন",
        },
        returnsPage: {
            title: "রিটার্ন ও রিফান্ড",
            subtitle: "ঝামেলামুক্ত রিফান্ড প্রক্রিয়ার সাথে সহজ রিটার্ন",
            howToReturn: "কিভাবে রিটার্ন করবেন",
            step1Title: "যোগাযোগ করুন",
            step1Desc: "ডেলিভারির ৩ দিনের মধ্যে অর্ডার আইডি সহ যোগাযোগ করুন",
            step2Title: "অনুমোদন পান",
            step2Desc: "আমাদের টিম আপনার রিটার্ন অনুরোধ পর্যালোচনা করে অনুমোদন দেবে",
            step3Title: "শিপ বা পিকআপ",
            step3Desc: "পণ্য ফেরত পাঠান অথবা আমরা পিকআপের ব্যবস্থা করব",
            step4Title: "রিফান্ড",
            step4Desc: "৭-১০ কর্মদিবসের মধ্যে রিফান্ড পান",
            returnPolicy: "রিটার্ন পলিসি",
            returnWindow: "৩ দিনের রিটার্ন উইন্ডো",
            returnWindowDesc: "অর্ডার পাওয়ার ৩ দিনের মধ্যে রিটার্ন শুরু করতে হবে।",
            originalCondition: "আসল অবস্থা",
            originalConditionDesc: "পণ্য অব্যবহৃত, অধোয়া এবং সব আসল ট্যাগ সংযুক্ত থাকতে হবে।",
            originalPackaging: "আসল প্যাকেজিং",
            originalPackagingDesc: "পণ্য তাদের আসল প্যাকেজিংয়ে ফেরত দিতে হবে।",
            nonReturnable: "ফেরতযোগ্য নয়",
            nonReturnableDesc: "অন্তর্বাস, কাস্টমাইজড আইটেম এবং সেল আইটেম ফেরত দেওয়া যাবে না।",
            refundOptions: "রিফান্ড অপশন",
            storeCredit: "স্টোর ক্রেডিট",
            storeCreditDesc: "পরবর্তী কেনাকাটার জন্য পূর্ণ মূল্যে স্টোর ক্রেডিট পান। তাৎক্ষণিক প্রক্রিয়াকরণ।",
            recommended: "প্রস্তাবিত",
            cashRefund: "নগদ রিফান্ড",
            cashRefundDesc: "বিকাশ বা ব্যাংক ট্রান্সফারের মাধ্যমে রিফান্ড পান। ৭-১০ কর্মদিবস।",
            importantNotes: "গুরুত্বপূর্ণ নোট",
            note1: "রিটার্নের শিপিং খরচ ফেরতযোগ্য নয় যদি না পণ্য ত্রুটিপূর্ণ হয়",
            note2: "এক্সচেঞ্জ স্টক প্রাপ্যতার উপর নির্ভরশীল",
            note3: "অনলাইন পেমেন্টের জন্য রিফান্ড মূল পেমেন্ট মাধ্যমে প্রক্রিয়া করা হবে",
            note4: "সমস্ত ফেরত পণ্যে গুণমান পরীক্ষা করা হয়",
            note5: "পরিধান, ক্ষতি বা পরিবর্তনের চিহ্ন আছে এমন পণ্য গ্রহণ করা হবে না",
            needToReturn: "কিছু ফেরত দিতে চান?",
            supportReady: "আমাদের সাপোর্ট টিম আপনার রিটার্ন অনুরোধে সাহায্য করতে প্রস্তুত",
            contactSupport: "সাপোর্টে যোগাযোগ করুন",
            viewFaq: "FAQ দেখুন",
        },
        privacyPage: {
            title: "গোপনীয়তা নীতি",
            subtitle: "আপনার গোপনীয়তা আমাদের কাছে গুরুত্বপূর্ণ। আমরা কীভাবে আপনার তথ্য সংগ্রহ, ব্যবহার এবং সুরক্ষা করি তা জানুন।",
            lastUpdated: "সর্বশেষ আপডেট",
            introduction: {
                title: "ভূমিকা",
                content: "আইরিন'স ফ্যাশনে, আমরা আপনার গোপনীয়তা রক্ষা করতে এবং আপনার ব্যক্তিগত তথ্যের নিরাপত্তা নিশ্চিত করতে প্রতিশ্রুতিবদ্ধ। এই গোপনীয়তা নীতিতে বর্ণিত হয়েছে যে আপনি যখন আমাদের ওয়েবসাইট পরিদর্শন করেন বা কেনাকাটা করেন তখন আমরা কীভাবে আপনার ডেটা সংগ্রহ, ব্যবহার এবং সুরক্ষা করি।"
            },
            collection: {
                title: "আমরা যে তথ্য সংগ্রহ করি",
                content: "আমরা আপনার অর্ডার প্রসেস করতে এবং আপনার কেনাকাটার অভিজ্ঞতা উন্নত করতে প্রয়োজনীয় তথ্য সংগ্রহ করি, যার মধ্যে রয়েছে:",
                items: [
                    "ব্যক্তিগত পরিচয় (নাম, ইমেল, ফোন নম্বর, শিপিং ঠিকানা)",
                    "অর্ডার ইতিহাস এবং কেনাকাটার পছন্দ",
                    "ওয়েবসাইট অপ্টিমাইজেশনের জন্য ডিভাইস এবং ব্রাউজার তথ্য"
                ]
            },
            usage: {
                title: "আমরা কীভাবে আপনার তথ্য ব্যবহার করি",
                content: "আপনার ডেটা শুধুমাত্র নিম্নলিখিত উদ্দেশ্যে ব্যবহার করা হয়:",
                items: [
                    "আপনার অর্ডার প্রসেস এবং ডেলিভারি করা",
                    "অর্ডার আপডেট এবং ডেলিভারি স্ট্যাটাস জানানো",
                    "আমাদের ওয়েবসাইটের কার্যকারিতা এবং কাস্টমার সার্ভিস উন্নত করা",
                    "প্রমোশনাল অফার পাঠানো (শুধুমাত্র যদি আপনি রাজি থাকেন)"
                ]
            },
            sharing: {
                title: "তথ্য শেয়ারিং",
                content: "আমরা অন্যদের কাছে আপনার ব্যক্তিগত পরিচয় তথ্য বিক্রি, বাণিজ্য বা ভাড়া দেই না। আমরা আমাদের ব্যবসায়িক অংশীদার এবং বিশ্বস্ত সহযোগীদের সাথে দর্শকদের এবং ব্যবহারকারীদের সম্পর্কে ব্যক্তিগত পরিচয় তথ্যের সাথে লিঙ্ক করা নেই এমন সাধারণ সামগ্রিক ডেমোগ্রাফিক তথ্য শেয়ার করতে পারি।"
            },
            security: {
                title: "ডেটা নিরাপত্তা",
                content: "আপনার ব্যক্তিগত তথ্যের অননুমোদিত অ্যাক্সেস, পরিবর্তন, প্রকাশ বা ধ্বংসের বিরুদ্ধে সুরক্ষার জন্য আমরা উপযুক্ত ডেটা সংগ্রহ, স্টোরেজ এবং প্রসেসিং অনুশীলন এবং নিরাপত্তা ব্যবস্থা গ্রহণ করি।"
            },
            rights: {
                title: "আপনার অধিকার",
                content: "আপনার অধিকার আছে:",
                items: [
                    "আপনার সম্পর্কে আমাদের কাছে থাকা ব্যক্তিগত ডেটা অ্যাক্সেস করার",
                    "ভুল ডেটা সংশোধনের অনুরোধ করার",
                    "আপনার ডেটা মুছে ফেলার অনুরোধ করার (আইনি সংরক্ষণের প্রয়োজনীয়তা সাপেক্ষে)"
                ]
            },
            cookies: {
                title: "কুকিজ",
                content: "আমাদের ওয়েবসাইট ব্যবহারকারীর অভিজ্ঞতা উন্নত করতে 'কুকিজ' ব্যবহার করে। আপনি কুকিজ প্রত্যাখ্যান করতে বা কুকিজ পাঠানো হলে আপনাকে সতর্ক করতে আপনার ওয়েব ব্রাউজার সেট করতে পারেন।"
            },
            contact: {
                title: "যোগাযোগ করুন",
                content: "এই গোপনীয়তা নীতি সম্পর্কে আপনার কোন প্রশ্ন থাকলে, অনুগ্রহ করে আমাদের সাথে info@irinsfashion.com বা +8801648593538 এ যোগাযোগ করুন।"
            }
        },
        termsPage: {
            title: "সেবার শর্তাবলী",
            subtitle: "আমাদের সেবা ব্যবহার করার আগে অনুগ্রহ করে এই শর্তাবলী মনোযোগ সহকারে পড়ুন।",
            lastUpdated: "সর্বশেষ আপডেট",
            introduction: {
                title: "ভূমিকা",
                content: "আইরিন'স ফ্যাশনে স্বাগতম। আমাদের ওয়েবসাইট এবং সেবা ব্যবহার করে আপনি এই সেবার শর্তাবলী মেনে নিতে সম্মত হচ্ছেন। আমরা ঢাকা-ভিত্তিক একটি শালীন পোশাকের খুচরা বিক্রেতা যারা হিজাব, আবায়া, বোরখা, নেকাব, গাউন এবং মহিলাদের অ্যাক্সেসরিজে বিশেষজ্ঞ — রেডিমেড এবং কাস্টম-টেইলর্ড উভয় পণ্য অফার করে।"
            },
            acceptance: {
                title: "শর্তাবলী গ্রহণ",
                content: "অর্ডার দেওয়া বা আমাদের ওয়েবসাইট ব্যবহার করে আপনি নিশ্চিত করছেন যে আপনি কমপক্ষে ১৮ বছর বয়সী বা পিতামাতা/অভিভাবকের সম্মতি আছে, এবং আপনি এই শর্তাবলী মেনে চলতে সম্মত। আপনি যদি এই শর্তাবলীর কোন অংশে সম্মত না হন, তাহলে অনুগ্রহ করে আমাদের সেবা ব্যবহার করবেন না।"
            },
            products: {
                title: "পণ্য এবং সেবা",
                content: "আমরা বিভিন্ন ধরনের শালীন পোশাক পণ্য অফার করি, যার মধ্যে রয়েছে:",
                items: [
                    "রেডিমেড হিজাব, আবায়া, বোরখা, নেকাব এবং গাউন",
                    "আপনার স্পেসিফিকেশন অনুযায়ী কাস্টম-টেইলর্ড পোশাক",
                    "মহিলাদের ফ্যাশন অ্যাক্সেসরিজ",
                    "সমস্ত পণ্য শালীনতা এবং সৌন্দর্যের কথা মাথায় রেখে ডিজাইন করা"
                ]
            },
            orders: {
                title: "অর্ডার এবং পেমেন্ট",
                content: "অর্ডার দেওয়ার সময় অনুগ্রহ করে লক্ষ্য করুন:",
                items: [
                    "সমস্ত মূল্য বাংলাদেশী টাকায় (BDT) উল্লেখ করা হয়েছে",
                    "আমরা ঢাকার মধ্যে ক্যাশ অন ডেলিভারি (COD) এবং অনলাইন পেমেন্ট গ্রহণ করি",
                    "সফল পেমেন্ট যাচাইয়ের পরেই অর্ডার নিশ্চিত হয়",
                    "স্টক অপ্রাপ্যতা বা মূল্য ত্রুটির কারণে অর্ডার বাতিল করার অধিকার আমরা সংরক্ষণ করি",
                    "অর্ডার নিশ্চিতকরণ SMS বা ইমেলের মাধ্যমে পাঠানো হবে"
                ]
            },
            pricing: {
                title: "মূল্য নির্ধারণ",
                content: "প্রদর্শিত সমস্ত মূল্য BDT তে এবং প্রযোজ্য কর অন্তর্ভুক্ত। আমরা পূর্ব বিজ্ঞপ্তি ছাড়াই যেকোনো সময় মূল্য পরিবর্তন করার অধিকার সংরক্ষণ করি। তবে, কোনো মূল্য পরিবর্তন ইতিমধ্যে নিশ্চিত হওয়া অর্ডারগুলিকে প্রভাবিত করবে না।"
            },
            shipping: {
                title: "শিপিং এবং ডেলিভারি",
                content: "আমরা বর্তমানে ঢাকা এবং সারা বাংলাদেশে গ্রাহকদের সেবা দিই:",
                items: [
                    "ঢাকার মধ্যে ডেলিভারি: ২-৩ কর্মদিবস",
                    "ঢাকার বাইরে ডেলিভারি: ৫-৭ কর্মদিবস",
                    "কাস্টম-টেইলর্ড অর্ডারের জন্য অতিরিক্ত ৭-১৪ দিন প্রস্তুতির সময় প্রয়োজন",
                    "শিপিং খরচ লোকেশনের উপর ভিত্তি করে চেকআউটে গণনা করা হয়",
                    "ট্র্যাকিং তথ্য SMS এর মাধ্যমে প্রদান করা হবে"
                ]
            },
            returns: {
                title: "রিটার্ন এবং এক্সচেঞ্জ",
                content: "আমরা চাই আপনি আপনার কেনাকাটায় সম্পূর্ণ সন্তুষ্ট থাকুন:",
                items: [
                    "রেডিমেড পণ্য ডেলিভারির ৭ দিনের মধ্যে ফেরত দেওয়া যেতে পারে যদি অব্যবহৃত এবং মূল প্যাকেজিংয়ে থাকে",
                    "কাস্টম-টেইলর্ড পণ্য ফেরতযোগ্য নয় যদি না উৎপাদন ত্রুটি থাকে",
                    "স্বাস্থ্যবিধির কারণে অন্তর্বাস এবং অ্যাক্সেসরিজ ফেরতযোগ্য নয়",
                    "ফেরত পণ্য পাওয়ার পরে ৭-১০ কর্মদিবসের মধ্যে রিফান্ড প্রক্রিয়া করা হয়",
                    "এক্সচেঞ্জ পণ্যের প্রাপ্যতার উপর নির্ভরশীল"
                ]
            },
            customOrders: {
                title: "কাস্টম অর্ডার নীতি",
                content: "কাস্টম-টেইলর্ড পোশাকের জন্য:",
                items: [
                    "উৎপাদন শুরু করতে ৫০% অগ্রিম পেমেন্ট প্রয়োজন",
                    "গ্রাহককে সঠিক মাপ প্রদান করতে হবে",
                    "উৎপাদন সময় সাধারণত জটিলতার উপর নির্ভর করে ৭-১৪ দিন",
                    "রঙ বা কাপড়ের টেক্সচারে সামান্য পার্থক্য হতে পারে",
                    "কাস্টম অর্ডার চূড়ান্ত এবং ত্রুটিপূর্ণ না হলে ফেরতযোগ্য নয়"
                ]
            },
            intellectual: {
                title: "বুদ্ধিবৃত্তিক সম্পত্তি",
                content: "এই ওয়েবসাইটের সমস্ত কন্টেন্ট, যার মধ্যে রয়েছে টেক্সট, ছবি, লোগো, ডিজাইন এবং পণ্যের ফটো, আইরিন'স ফ্যাশনের সম্পত্তি এবং কপিরাইট আইন দ্বারা সুরক্ষিত। আমাদের লিখিত অনুমতি ছাড়া কোনো কন্টেন্ট পুনরুৎপাদন, বিতরণ বা ব্যবহার করতে পারবেন না।"
            },
            limitation: {
                title: "দায়বদ্ধতার সীমাবদ্ধতা",
                content: "আইরিন'স ফ্যাশন আমাদের পণ্য বা সেবা ব্যবহার বা ব্যবহারে অক্ষমতার ফলে সৃষ্ট কোনো পরোক্ষ, আকস্মিক, বিশেষ বা পরিণতিমূলক ক্ষতির জন্য দায়ী থাকবে না। আমাদের মোট দায় প্রশ্নবিদ্ধ নির্দিষ্ট পণ্য বা সেবার জন্য প্রদত্ত পরিমাণের বেশি হবে না।"
            },
            governing: {
                title: "প্রযোজ্য আইন",
                content: "এই সেবার শর্তাবলী বাংলাদেশের আইন অনুসারে পরিচালিত এবং ব্যাখ্যা করা হয়। এই শর্তাবলী থেকে উদ্ভূত যেকোনো বিরোধ ঢাকা, বাংলাদেশের আদালতের একচেটিয়া এখতিয়ারের অধীন হবে।"
            },
            changes: {
                title: "শর্তাবলী পরিবর্তন",
                content: "আমরা যেকোনো সময় এই সেবার শর্তাবলী আপডেট বা পরিবর্তন করার অধিকার সংরক্ষণ করি। পরিবর্তনগুলি আমাদের ওয়েবসাইটে পোস্ট করার সাথে সাথে কার্যকর হবে। কোনো পরিবর্তনের পরে আমাদের সেবা ব্যবহার অব্যাহত রাখা নতুন শর্তাবলী গ্রহণ করা বোঝায়।"
            },
            contact: {
                title: "যোগাযোগ করুন",
                content: "এই সেবার শর্তাবলী সম্পর্কে আপনার কোন প্রশ্ন থাকলে, অনুগ্রহ করে আমাদের সাথে info@irinsfashion.com এ যোগাযোগ করুন বা +8801648593538 এ কল করুন। আমাদের অফিস ঢাকা, বাংলাদেশে অবস্থিত।"
            }
        },
    },
};
