"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useLocalization } from '@/context/LocalizationContext';
import styles from './faq.module.css';

interface FAQItem {
    questionKey: string;
    answerKey: string;
    category: string;
}

const faqData: FAQItem[] = [
    // Orders & Shipping
    { questionKey: "trackOrder", answerKey: "trackOrderAnswer", category: "orders" },
    { questionKey: "shippingCharges", answerKey: "shippingChargesAnswer", category: "orders" },
    { questionKey: "deliveryTime", answerKey: "deliveryTimeAnswer", category: "orders" },
    { questionKey: "changeAddress", answerKey: "changeAddressAnswer", category: "orders" },
    // Returns & Refunds
    { questionKey: "returnPolicy", answerKey: "returnPolicyAnswer", category: "returns" },
    { questionKey: "initiateReturn", answerKey: "initiateReturnAnswer", category: "returns" },
    { questionKey: "refundTime", answerKey: "refundTimeAnswer", category: "returns" },
    // Products
    { questionKey: "authentic", answerKey: "authenticAnswer", category: "products" },
    { questionKey: "rightSize", answerKey: "rightSizeAnswer", category: "products" },
    { questionKey: "customSize", answerKey: "customSizeAnswer", category: "products" },
    // Payment
    { questionKey: "paymentMethods", answerKey: "paymentMethodsAnswer", category: "payment" },
    { questionKey: "paymentSecure", answerKey: "paymentSecureAnswer", category: "payment" },
];

// Hardcoded FAQ content (not in dictionary for simplicity - these are content, not UI labels)
const faqContent: Record<string, { question: string; answer: string }> = {
    trackOrder: {
        question: "How can I track my order?",
        answer: "Once your order is shipped, you will receive an SMS with tracking details. You can also contact our customer support with your Order ID to get updates."
    },
    shippingCharges: {
        question: "What are the shipping charges?",
        answer: "We charge ৳80 for delivery inside Dhaka and ৳120 for delivery outside Dhaka. Free shipping is available on orders above ৳5,000."
    },
    deliveryTime: {
        question: "How long does delivery take?",
        answer: "Inside Dhaka: 1-2 business days. Outside Dhaka: 3-5 business days. During peak seasons, delivery may take slightly longer."
    },
    changeAddress: {
        question: "Can I change my delivery address after placing an order?",
        answer: "Please contact us immediately after placing your order. Address changes can only be made before the order is dispatched."
    },
    returnPolicy: {
        question: "What is your return policy?",
        answer: "We accept returns within 3 days of delivery. Items must be unused, unwashed, and in original packaging with tags attached."
    },
    initiateReturn: {
        question: "How do I initiate a return?",
        answer: "Contact our support team via phone or email with your Order ID. We will arrange a pickup or provide instructions for returning the item."
    },
    refundTime: {
        question: "When will I receive my refund?",
        answer: "Refunds are processed within 7-10 business days after we receive and inspect the returned item. You can choose store credit or cash refund."
    },
    authentic: {
        question: "Are your products authentic?",
        answer: "Yes, all our products are 100% authentic and sourced directly from trusted manufacturers. We guarantee the quality of every item."
    },
    rightSize: {
        question: "How do I choose the right size?",
        answer: "Each product page includes a detailed size chart. If you're unsure, contact our support team with your measurements for personalized advice."
    },
    customSize: {
        question: "Do you offer custom sizes?",
        answer: "Yes, we offer custom sizing for abayas and dresses. Contact us with your measurements for a quote."
    },
    paymentMethods: {
        question: "What payment methods do you accept?",
        answer: "We currently accept Cash on Delivery (COD). Online payment options including bKash and card payments are coming soon!"
    },
    paymentSecure: {
        question: "Is my payment information secure?",
        answer: "Yes, all transactions are secure. For COD orders, you pay only when you receive your order."
    },
};

export default function FAQPage() {
    const { dictionary: t } = useLocalization();
    const [activeCategory, setActiveCategory] = useState('all');
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const categories = [
        { id: 'all', label: t.faq.allQuestions, icon: '📋' },
        { id: 'orders', label: t.faq.ordersShipping, icon: '📦' },
        { id: 'returns', label: t.faq.returnsRefunds, icon: '↩️' },
        { id: 'products', label: t.faq.products, icon: '👗' },
        { id: 'payment', label: t.faq.payment, icon: '💳' },
    ];

    const filteredFAQs = activeCategory === 'all'
        ? faqData
        : faqData.filter(faq => faq.category === activeCategory);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className={styles.page}>
            <div className="container">
                {/* Header */}
                <header className={styles.header}>
                    <div className={styles.breadcrumbs}>
                        <Link href="/">{t.nav.home}</Link> / <span className={styles.active}>{t.footer.faq}</span>
                    </div>
                    <h1 className={styles.title}>{t.faq.title}</h1>
                    <p className={styles.subtitle}>{t.faq.subtitle}</p>
                </header>

                {/* Category Tabs */}
                <div className={styles.categories}>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            className={`${styles.categoryBtn} ${activeCategory === cat.id ? styles.active : ''}`}
                            onClick={() => {
                                setActiveCategory(cat.id);
                                setOpenIndex(null);
                            }}
                        >
                            <span className={styles.categoryIcon}>{cat.icon}</span>
                            <span>{cat.label}</span>
                        </button>
                    ))}
                </div>

                {/* FAQ Accordion */}
                <div className={styles.faqList}>
                    {filteredFAQs.map((faq, index) => {
                        const content = faqContent[faq.questionKey];
                        return (
                            <div
                                key={index}
                                className={`${styles.faqItem} ${openIndex === index ? styles.open : ''}`}
                            >
                                <button
                                    className={styles.faqQuestion}
                                    onClick={() => toggleFAQ(index)}
                                >
                                    <span>{content.question}</span>
                                    <span className={styles.arrow}>
                                        {openIndex === index ? '−' : '+'}
                                    </span>
                                </button>
                                {openIndex === index && (
                                    <div className={styles.faqAnswer}>
                                        <p>{content.answer}</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Contact CTA */}
                <div className={styles.contactCta}>
                    <div className={styles.ctaIcon}>💬</div>
                    <h3>{t.faq.stillHaveQuestions}</h3>
                    <p>{t.faq.cantFindAnswer}</p>
                    <Link href="/contact" className={styles.contactBtn}>
                        {t.faq.contactUs}
                    </Link>
                </div>
            </div>
        </div>
    );
}
