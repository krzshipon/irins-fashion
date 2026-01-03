"use client";

import Link from 'next/link';
import { useLocalization } from '@/context/LocalizationContext';
import styles from './returns.module.css';

export default function ReturnsPage() {
    const { dictionary: t } = useLocalization();

    const returnSteps = [
        { step: 1, title: t.returnsPage.step1Title, description: t.returnsPage.step1Desc, icon: "📞" },
        { step: 2, title: t.returnsPage.step2Title, description: t.returnsPage.step2Desc, icon: "✅" },
        { step: 3, title: t.returnsPage.step3Title, description: t.returnsPage.step3Desc, icon: "📦" },
        { step: 4, title: t.returnsPage.step4Title, description: t.returnsPage.step4Desc, icon: "💰" }
    ];

    const policies = [
        { icon: "⏰", title: t.returnsPage.returnWindow, description: t.returnsPage.returnWindowDesc },
        { icon: "🏷️", title: t.returnsPage.originalCondition, description: t.returnsPage.originalConditionDesc },
        { icon: "📦", title: t.returnsPage.originalPackaging, description: t.returnsPage.originalPackagingDesc },
        { icon: "🚫", title: t.returnsPage.nonReturnable, description: t.returnsPage.nonReturnableDesc }
    ];

    const refundOptions = [
        {
            title: t.returnsPage.storeCredit,
            description: t.returnsPage.storeCreditDesc,
            highlight: t.returnsPage.recommended,
            icon: "🎁"
        },
        {
            title: t.returnsPage.cashRefund,
            description: t.returnsPage.cashRefundDesc,
            highlight: null,
            icon: "💵"
        }
    ];

    const notes = [
        t.returnsPage.note1,
        t.returnsPage.note2,
        t.returnsPage.note3,
        t.returnsPage.note4,
        t.returnsPage.note5,
    ];

    return (
        <div className={styles.page}>
            <div className="container">
                {/* Header */}
                <header className={styles.header}>
                    <div className={styles.breadcrumbs}>
                        <Link href="/">{t.nav.home}</Link> / <span className={styles.active}>{t.footer.returns}</span>
                    </div>
                    <h1 className={styles.title}>{t.returnsPage.title}</h1>
                    <p className={styles.subtitle}>{t.returnsPage.subtitle}</p>
                </header>

                {/* Return Process */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>{t.returnsPage.howToReturn}</h2>
                    <div className={styles.stepsGrid}>
                        {returnSteps.map((item, index) => (
                            <div key={index} className={styles.stepCard}>
                                <div className={styles.stepIcon}>{item.icon}</div>
                                <div className={styles.stepNumber}>Step {item.step}</div>
                                <h3>{item.title}</h3>
                                <p>{item.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Return Policy */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>{t.returnsPage.returnPolicy}</h2>
                    <div className={styles.policiesGrid}>
                        {policies.map((policy, index) => (
                            <div key={index} className={styles.policyCard}>
                                <span className={styles.policyIcon}>{policy.icon}</span>
                                <h3>{policy.title}</h3>
                                <p>{policy.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Refund Options */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>{t.returnsPage.refundOptions}</h2>
                    <div className={styles.refundGrid}>
                        {refundOptions.map((option, index) => (
                            <div key={index} className={`${styles.refundCard} ${option.highlight ? styles.highlighted : ''}`}>
                                {option.highlight && (
                                    <span className={styles.badge}>{option.highlight}</span>
                                )}
                                <span className={styles.refundIcon}>{option.icon}</span>
                                <h3>{option.title}</h3>
                                <p>{option.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Important Notes */}
                <section className={styles.notesSection}>
                    <h2 className={styles.notesTitle}>📋 {t.returnsPage.importantNotes}</h2>
                    <ul className={styles.notesList}>
                        {notes.map((note, index) => (
                            <li key={index}>{note}</li>
                        ))}
                    </ul>
                </section>

                {/* CTA */}
                <div className={styles.cta}>
                    <h3>{t.returnsPage.needToReturn}</h3>
                    <p>{t.returnsPage.supportReady}</p>
                    <div className={styles.ctaButtons}>
                        <Link href="/contact" className={styles.ctaBtn}>
                            {t.returnsPage.contactSupport}
                        </Link>
                        <Link href="/faq" className={styles.ctaBtnOutline}>
                            {t.returnsPage.viewFaq}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
