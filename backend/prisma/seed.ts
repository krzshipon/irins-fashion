
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const masterCategories = [
    {
        name: 'Hijab',
        slug: 'hijabs',
        icon: '🧕',
        localizedNames: {
            en: 'Hijab',
            bn: 'হিজাব',
        },
        localizedDescriptions: {
            en: 'Premium Georgette, Chiffon, and Cotton hijabs for daily and party wear.',
            bn: 'প্রতিদিনের এবং পার্টির জন্য প্রিমিয়াম জর্জেট, শিফন এবং কটন হিজাব।',
        },
    },
    {
        name: 'Abaya',
        slug: 'abayas',
        icon: '👘',
        localizedNames: {
            en: 'Abaya',
            bn: 'আবায়া',
        },
        localizedDescriptions: {
            en: 'Dubai Cherry, Crystal, and Kimono style stylish abayas.',
            bn: 'দুবাই চেরি, ক্রিস্টাল এবং কিমানো স্টাইলের আধুনিক আবায়া কালেকশন।',
        },
    },
    {
        name: 'Borka',
        slug: 'borkas',
        icon: '🧥',
        localizedNames: {
            en: 'Borka',
            bn: 'বোরকা',
        },
        localizedDescriptions: {
            en: 'Traditional modest coat-style borkas for maximum coverage.',
            bn: 'শালীনতা বজায় রাখার জন্য ঐতিহ্যবাহী কোট বা ঢিলেঢালা বোরকা।',
        },
    },
    {
        name: 'Khimar',
        slug: 'khimars',
        icon: '🧣',
        localizedNames: {
            en: 'Khimar',
            bn: 'খিমার',
        },
        localizedDescriptions: {
            en: 'Long, free-flowing head covering for ultimate modesty and comfort.',
            bn: 'পরিপূর্ণ পর্দার জন্য লম্বা এবং আরামদায়ক খিমার।',
        },
    },
    {
        name: 'Niqab',
        slug: 'niqabs',
        icon: '🕶️',
        localizedNames: {
            en: 'Niqab',
            bn: 'নিকাব',
        },
        localizedDescriptions: {
            en: 'Breathable nose pieces and layer niqabs.',
            bn: 'আরামদায়ক এবং শ্বাসপ্রশ্বাসের উপযোগী নোজ পিস ও লেয়ার নিকাব।',
        },
    },
    {
        name: 'Modest Gown',
        slug: 'gowns',
        icon: '👗',
        localizedNames: {
            en: 'Modest Gown',
            bn: 'মডেস্ট গাউন',
        },
        localizedDescriptions: {
            en: 'Non-transparent, loose-fitting party gowns.',
            bn: 'পার্টি বা বিশেষ অনুষ্ঠানের জন্য মার্জিত ও ঢিলেঢালা গাউন।',
        },
    },
    {
        name: 'Kurti / Kammiz',
        slug: 'kurtis',
        icon: '👚',
        localizedNames: {
            en: 'Modest Kurti',
            bn: 'মডেস্ট কুর্তি',
        },
        localizedDescriptions: {
            en: 'Long kurtis and salwar kameez sets for casual wear.',
            bn: 'ক্যাজুয়াল ব্যবহারের জন্য লম্বা কুর্তি এবং সালোয়ার কামিজ।',
        },
    },
    {
        name: 'Accessories',
        slug: 'accessories',
        icon: '👜',
        localizedNames: {
            en: 'Hijab Accessories',
            bn: 'হিজাব এক্সেসরিজ',
        },
        localizedDescriptions: {
            en: 'Inner caps, pins, magnets, and underscarves.',
            bn: 'ইনার ক্যাপ, পিন, ম্যাগনেট এবং হিজাব বাধার প্রয়োজনীয় অনুষঙ্গ।',
        },
    },
];

async function main() {
    console.log('Starting Master Category Seeding...');

    for (const cat of masterCategories) {
        await prisma.category.upsert({
            where: { slug: cat.slug },
            update: {
                name: cat.name,
                icon: cat.icon,
                localizedNames: cat.localizedNames,
                localizedDescriptions: cat.localizedDescriptions,
            },
            create: {
                name: cat.name,
                slug: cat.slug,
                icon: cat.icon,
                localizedNames: cat.localizedNames,
                localizedDescriptions: cat.localizedDescriptions,
            },
        });
    }

    console.log(`✅ Seeded ${masterCategories.length} Master Categories.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
