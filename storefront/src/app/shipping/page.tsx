"use client";

import Link from 'next/link';
import { useLocalization } from '@/context/LocalizationContext';
import styles from './shipping.module.css';

export default function ShippingPage() {
    const { dictionary: t } = useLocalization();

    const shippingZones = [
        {
            zone: t.shippingPage.insideDhaka,
            price: "৳80",
            time: `1-2 ${t.shippingPage.businessDays}`,
            icon: "🏙️"
        },
        {
            zone: t.shippingPage.outsideDhaka,
            price: "৳120",
            time: `3-5 ${t.shippingPage.businessDays}`,
            icon: "🚚"
        }
    ];

    const features = [
        {
            icon: "📦",
            title: t.shippingPage.carefulPackaging,
            description: t.shippingPage.carefulPackagingDesc
        },
        {
            icon: "📍",
            title: t.shippingPage.realTimeTracking,
            description: t.shippingPage.realTimeTrackingDesc
        },
        {
            icon: "🎁",
            title: t.shippingPage.freeShipping,
            description: t.shippingPage.freeShippingDesc
        },
        {
            icon: "💯",
            title: t.shippingPage.qualityGuaranteed,
            description: t.shippingPage.qualityGuaranteedDesc
        }
    ];

    const steps = [
        { title: t.shippingPage.step1Title, desc: t.shippingPage.step1Desc },
        { title: t.shippingPage.step2Title, desc: t.shippingPage.step2Desc },
        { title: t.shippingPage.step3Title, desc: t.shippingPage.step3Desc },
        { title: t.shippingPage.step4Title, desc: t.shippingPage.step4Desc },
    ];

    return (
        <div className={styles.page}>
            <div className="container">
                {/* Header */}
                <header className={styles.header}>
                    <div className={styles.breadcrumbs}>
                        <Link href="/">{t.nav.home}</Link> / <span className={styles.active}>{t.footer.shipping}</span>
                    </div>
                    <h1 className={styles.title}>{t.shippingPage.title}</h1>
                    <p className={styles.subtitle}>{t.shippingPage.subtitle}</p>
                </header>

                {/* Shipping Zones */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>{t.shippingPage.deliveryZones}</h2>
                    <div className={styles.zonesGrid}>
                        {shippingZones.map((zone, index) => (
                            <div key={index} className={styles.zoneCard}>
                                <span className={styles.zoneIcon}>{zone.icon}</span>
                                <h3>{zone.zone}</h3>
                                <div className={styles.zonePrice}>{zone.price}</div>
                                <p className={styles.zoneTime}>{zone.time}</p>
                            </div>
                        ))}
                    </div>
                    <div className={styles.freeShippingBanner}>
                        <span className={styles.bannerIcon}>🎉</span>
                        <div>
                            <strong>{t.shippingPage.freeShippingBanner}</strong>
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>{t.shippingPage.whyShopWithUs}</h2>
                    <div className={styles.featuresGrid}>
                        {features.map((feature, index) => (
                            <div key={index} className={styles.featureCard}>
                                <span className={styles.featureIcon}>{feature.icon}</span>
                                <h3>{feature.title}</h3>
                                <p>{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Process */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>{t.shippingPage.howItWorks}</h2>
                    <div className={styles.processSteps}>
                        {steps.map((step, index) => (
                            <>
                                <div key={index} className={styles.step}>
                                    <div className={styles.stepNumber}>{index + 1}</div>
                                    <h3>{step.title}</h3>
                                    <p>{step.desc}</p>
                                </div>
                                {index < steps.length - 1 && <div className={styles.stepLine}></div>}
                            </>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <div className={styles.cta}>
                    <h3>{t.shippingPage.readyToShop}</h3>
                    <p>{t.shippingPage.exploreCollection}</p>
                    <Link href="/shop" className={styles.ctaBtn}>
                        {t.shippingPage.shopNow}
                    </Link>
                </div>
            </div>
        </div>
    );
}
