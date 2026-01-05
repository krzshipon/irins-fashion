import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Start seeding products...');

    // 1. Get Categories
    const categories = await prisma.category.findMany();
    const catMap = {
        abayas: categories.find((c) => c.slug === 'abayas'),
        hijabs: categories.find((c) => c.slug === 'hijabs'),
        borkas: categories.find((c) => c.slug === 'borkas' || c.slug === 'burqa'), // Handle potential slug naming
        accessories: categories.find((c) => c.slug === 'accessories'),
    };

    if (!catMap.abayas || !catMap.hijabs || !catMap.borkas || !catMap.accessories) {
        console.error('❌ Categories missing. Please seed categories first.');
        console.log('Found categories:', categories.map(c => c.slug));
        return;
    }

    // Helper to ensure correct type for Discount
    const percent = (val: number) => ({ type: 'percentage', value: val });
    const flat = (val: number) => ({ type: 'flat', value: val });

    const products = [
        // --- ABAYAS ---
        {
            name: 'Premium Dubai Cherry Stone Work Abaya',
            slug: 'dubai-cherry-stone-work-abaya',
            sku: 'ABA-001',
            price: 4500, // Original 5200, but logic dictates Base input. If we input price (selling), we should align. 
            // Wait, Seed creates DIRECTLY in DB.
            // Schema: price (Decimal), originalPrice (Decimal), discount (Json).
            // If I want Selling=4500, Base=5200.
            // 5200 - 13.4% = 4500.
            // Let's stick to the MD which says Price: 4500 (Original 5200).
            // Discount: 13%.
            originalPrice: 5200,
            discount: percent(13),
            description: 'Elegant Dubai Cherry fabric abaya with intricate stone work on sleeves and borders. Front open style.',
            localizedNames: { bn: 'প্রিমিয়াম দুবাই চেরি স্টোন ওয়ার্ক আবায়া' },
            localizedDescriptions: { bn: 'হাতায় এবং বর্ডারে নিখুঁত স্টোন ওয়ার্ক করা মার্জিত দুবাই চেরি কাপড়ের আবায়া। ফ্রন্ট ওপেন স্টাইল।' },
            categoryId: catMap.abayas.id,
            badges: ['Bestseller', 'New Arrival'],
            colors: [
                { name: 'Black', code: '#000000', variants: [{ size: 'S', stock: 5 }, { size: 'M', stock: 10 }, { size: 'L', stock: 8 }] },
                { name: 'Maroon', code: '#800000', variants: [{ size: 'M', stock: 5 }, { size: 'L', stock: 5 }] }
            ]
        },
        {
            name: 'Butterfly Style Kimono Abaya',
            slug: 'butterfly-kimono-abaya',
            sku: 'ABA-002',
            price: 3200,
            originalPrice: 3200,
            discount: null, // No discount
            description: 'Loose fitting butterfly style abaya made from Nidha fabric. Perfect for summer.',
            localizedNames: { bn: 'বাটারফ্লাই স্টাইল কিমোনো আবায়া' },
            localizedDescriptions: { bn: 'নিদা কাপড়ের তৈরি ঢিলেঢালা বাটারফ্লাই স্টাইল আবায়া। গরমের জন্য আরামদায়ক।' },
            categoryId: catMap.abayas.id,
            badges: ['Summer Collection'],
            colors: [
                { name: 'Dusty Pink', code: '#dca4a4', variants: [{ size: 'Free Size', stock: 20 }] },
                { name: 'Sage Green', code: '#9caf88', variants: [{ size: 'Free Size', stock: 15 }] }
            ]
        },
        {
            name: 'Floral Embroidered Gown Abaya',
            slug: 'floral-embroidered-gown-abaya',
            sku: 'ABA-003',
            price: 5500, // Original 6000
            originalPrice: 6000,
            discount: percent(8), // approx
            description: 'Full flair gown style abaya with heavy floral embroidery.',
            localizedNames: { bn: 'ফ্লোরাল এমব্রয়ডারি গাউন আবায়া' },
            localizedDescriptions: { bn: 'ভারী ফ্লোরাল এমব্রয়ডারি সহ ফুল ফ্লেয়ার গাউন আবায়া।' },
            categoryId: catMap.abayas.id,
            badges: ['Premium'],
            colors: [
                { name: 'Navy Blue', code: '#000080', variants: [{ size: '52', stock: 3 }, { size: '54', stock: 3 }, { size: '56', stock: 3 }] },
                { name: 'Black', code: '#000000', variants: [{ size: '52', stock: 5 }, { size: '54', stock: 5 }, { size: '56', stock: 5 }] }
            ]
        },
        {
            name: 'Kuku Style Front Open Abaya',
            slug: 'kuku-front-open-abaya',
            sku: 'ABA-004',
            price: 3800,
            originalPrice: 3800,
            discount: null,
            description: 'Modern kuku style cut with front buttons, suitable for university students.',
            localizedNames: { bn: 'কুকু স্টাইল ফ্রন্ট ওপেন আবায়া' },
            localizedDescriptions: { bn: 'আধুনিক কুকু স্টাইল কাট এবং ফ্রন্ট বাটন, ইউনিভার্সিটি শিক্ষার্থীদের জন্য পারফেক্ট।' },
            categoryId: catMap.abayas.id,
            colors: [
                { name: 'Beige', code: '#f5f5dc', variants: [{ size: '52', stock: 10 }, { size: '54', stock: 10 }] },
                { name: 'Black', code: '#000000', variants: [{ size: '52', stock: 15 }, { size: '54', stock: 15 }, { size: '56', stock: 15 }] }
            ]
        },
        {
            name: 'Dubai Silk Party Wear Abaya',
            slug: 'dubai-silk-party-abaya',
            sku: 'ABA-005',
            price: 6500, // Original 7000, flat 500 off
            originalPrice: 7000,
            discount: flat(500),
            description: 'Shiny Dubai silk abaya for parties, includes matching belt.',
            localizedNames: { bn: 'দুবাই সিল্ক পার্টি আবায়া' },
            localizedDescriptions: { bn: 'পার্টির জন্য চকচকে দুবাই সিল্ক আবায়া, সাথে ম্যাচিং বেল্ট।' },
            categoryId: catMap.abayas.id,
            colors: [
                { name: 'Gold', code: '#ffd700', variants: [{ size: '54', stock: 5 }, { size: '56', stock: 5 }] },
                { name: 'Silver', code: '#c0c0c0', variants: [{ size: '54', stock: 5 }, { size: '56', stock: 5 }] }
            ]
        },

        // --- HIJABS ---
        {
            name: 'Solid Premium Georgette Hijab',
            slug: 'solid-georgette-hijab',
            sku: 'HIJ-001',
            price: 450,
            originalPrice: 450,
            discount: null,
            description: 'Non-slip, matte finish premium georgette hijabs in daily colors.',
            localizedNames: { bn: 'সলিড প্রিমিয়াম জর্জেট হিজাব' },
            localizedDescriptions: { bn: 'প্রতিদিনের ব্যবহারের জন্য নন-স্লিপ, ম্যাট ফিনিশ প্রিমিয়াম জর্জেট হিজাব।' },
            categoryId: catMap.hijabs.id,
            badges: ['Bestseller'],
            colors: [
                { name: 'Black', code: '#000000', variants: [{ size: 'Free Size', stock: 50 }] },
                { name: 'Nude', code: '#e3c6b2', variants: [{ size: 'Free Size', stock: 40 }] },
                { name: 'Olive', code: '#808000', variants: [{ size: 'Free Size', stock: 30 }] }
            ]
        },
        {
            name: 'Malaysian Chiffon Printed Hijab',
            slug: 'malaysian-chiffon-printed',
            sku: 'HIJ-002',
            price: 650,
            originalPrice: 650,
            discount: null,
            description: 'Soft and airy Malaysian chiffon with exclusive floral prints.',
            localizedNames: { bn: 'মালয়েশিয়ান শিফন প্রিন্টেড হিজাব' },
            localizedDescriptions: { bn: 'এক্সক্লুসিভ ফ্লোরাল প্রিন্টের নরম এবং আরামদায়ক মালয়েশিয়ান শিফন।' },
            categoryId: catMap.hijabs.id,
            colors: [
                { name: 'Floral Pink', code: '#ffc0cb', variants: [{ size: 'Free Size', stock: 20 }] },
                { name: 'Abstract Blue', code: '#add8e6', variants: [{ size: 'Free Size', stock: 15 }] }
            ]
        },
        {
            name: 'Cotton Crinkle Hijab',
            slug: 'cotton-crinkle-hijab',
            sku: 'HIJ-003',
            price: 350,
            originalPrice: 400, // Implied original
            discount: flat(50),
            description: 'No-iron needed cotton crinkle hijabs, perfect for rough use.',
            localizedNames: { bn: 'কটন ক্রিংকেল হিজাব' },
            localizedDescriptions: { bn: 'আয়রন করার প্রয়োজন নেই এমন কটন ক্রিংকেল হিজাব, রাফ ব্যবহারের জন্য সেরা।' },
            categoryId: catMap.hijabs.id,
            colors: [
                { name: 'White', code: '#ffffff', variants: [{ size: 'Free Size', stock: 25 }] },
                { name: 'Grey', code: '#808080', variants: [{ size: 'Free Size', stock: 25 }] }
            ]
        },
        {
            name: 'Instant Jersey Prayer Hijab',
            slug: 'instant-jersey-prayer-hijab',
            sku: 'HIJ-004',
            price: 550,
            originalPrice: 550,
            discount: null,
            description: 'Ready-to-wear instant hijab made of stretchy jersey fabric.',
            localizedNames: { bn: 'ইনস্ট্যান্ট জার্সি প্রেয়ার হিজাব' },
            localizedDescriptions: { bn: 'স্ট্রেচেবল জার্সি কাপড়ের তৈরি রেডি-টু-ওয়্যার ইনস্ট্যান্ট হিজাব।' },
            categoryId: catMap.hijabs.id,
            colors: [
                { name: 'Black', code: '#000000', variants: [{ size: 'L', stock: 30 }] },
                { name: 'Navy', code: '#000080', variants: [{ size: 'L', stock: 20 }] }
            ]
        },
        {
            name: 'Luxury Satin Silk Hijab',
            slug: 'luxury-satin-silk-hijab',
            sku: 'HIJ-005',
            price: 850,
            originalPrice: 850,
            discount: null,
            description: 'Glossy satin silk hijab for special occasions.',
            localizedNames: { bn: 'লাক্সারি সাটিন সিল্ক হিজাব' },
            localizedDescriptions: { bn: 'বিশেষ অনুষ্ঠানের জন্য চকচকে সাটিন সিল্ক হিজাব।' },
            categoryId: catMap.hijabs.id,
            colors: [
                { name: 'Champagne', code: '#f7e7ce', variants: [{ size: 'Free Size', stock: 15 }] },
                { name: 'Rose Gold', code: '#b76e79', variants: [{ size: 'Free Size', stock: 15 }] }
            ]
        },

        // --- BORKAS ---
        {
            name: 'Institutional Classic Coat Borka',
            slug: 'classic-coat-borka',
            sku: 'BRK-001',
            price: 2500,
            originalPrice: 2500,
            discount: null,
            description: 'Formal coat-style borka with collar and buttons. Suitable for office/students.',
            localizedNames: { bn: 'ক্লাসিক কোট বোরকা' },
            localizedDescriptions: { bn: 'কলার এবং বাটন সহ ফরমাল কোট স্টাইল বোরকা। অফিস বা শিক্ষার্থীদের জন্য উপযুক্ত।' },
            categoryId: catMap.borkas.id,
            colors: [
                { name: 'Black', code: '#000000', variants: [{ size: '52', stock: 10 }, { size: '54', stock: 10 }, { size: '56', stock: 10 }] }
            ]
        },
        {
            name: 'Simple Flair Daily Borka',
            slug: 'simple-flair-daily-borka',
            sku: 'BRK-002',
            price: 1800, // Original 2000
            originalPrice: 2000,
            discount: percent(10),
            description: 'Simple designs for everyday prayer and outdoor use.',
            localizedNames: { bn: 'সিম্পল ফ্লেয়ার ডেইলি বোরকা' },
            localizedDescriptions: { bn: 'প্রতিদিনের নামাজ এবং বাইরের ব্যবহারের জন্য সাধারণ ডিজাইনের বোরকা।' },
            categoryId: catMap.borkas.id,
            colors: [
                { name: 'Coffee', code: '#6f4e37', variants: [{ size: '52', stock: 5 }, { size: '54', stock: 5 }, { size: '56', stock: 5 }] }
            ]
        },
        {
            name: '3-Piece Borka Set (Gown, Inner, Hijab)',
            slug: '3-piece-borka-set',
            sku: 'BRK-003',
            price: 4000,
            originalPrice: 4000,
            discount: null,
            description: 'Complete set including outer gown, inner dress, and matching hijab.',
            localizedNames: { bn: '৩-পিস বোরকা সেট' },
            localizedDescriptions: { bn: 'আউটার গাউন, ইনার ড্রেস এবং ম্যাচিং হিজাব সহ সম্পূর্ণ সেট।' },
            categoryId: catMap.borkas.id,
            colors: [
                { name: 'Dusty Pink', code: '#dca4a4', variants: [{ size: '52', stock: 8 }, { size: '54', stock: 8 }] },
                { name: 'Mint', code: '#98ff98', variants: [{ size: '52', stock: 6 }, { size: '54', stock: 6 }] }
            ]
        },
        {
            name: 'Loose Fit Kaftan Borka',
            slug: 'loose-fit-kaftan-borka',
            sku: 'BRK-004',
            price: 3000,
            originalPrice: 3000,
            discount: null,
            description: 'Extremely loose fitting kaftan style borka for maximum modesty.',
            localizedNames: { bn: 'লুজ ফিট কাফতান বোরকা' },
            localizedDescriptions: { bn: 'সর্বোচ্চ পর্দার জন্য অত্যন্ত ঢিলেঢালা কাফতান স্টাইল বোরকা।' },
            categoryId: catMap.borkas.id,
            colors: [
                { name: 'Black', code: '#000000', variants: [{ size: 'Free Size', stock: 20 }] },
                { name: 'Dark Grey', code: '#a9a9a9', variants: [{ size: 'Free Size', stock: 15 }] }
            ]
        },
        {
            name: 'Dubai Irani Style Borka',
            slug: 'dubai-irani-style-borka',
            sku: 'BRK-005',
            price: 3500,
            originalPrice: 3500,
            discount: null,
            description: 'Unique front design inspired by Irani fashion.',
            localizedNames: { bn: 'দুবাই ইরানি স্টাইল বোরকা' },
            localizedDescriptions: { bn: 'ইরানি ফ্যাশন দ্বারা অনুপ্রাণিত অনন্য ফ্রন্ট ডিজাইন।' },
            categoryId: catMap.borkas.id,
            colors: [
                { name: 'Maroon', code: '#800000', variants: [{ size: '52', stock: 5 }, { size: '54', stock: 5 }, { size: '56', stock: 5 }] }
            ]
        },

        // --- ACCESSORIES ---
        {
            name: 'Cotton Tube Inner Cap',
            slug: 'cotton-tube-inner-cap',
            sku: 'ACC-001',
            price: 80,
            originalPrice: 80,
            discount: null,
            description: 'Stretchable cotton tube caps to keep hair in place.',
            localizedNames: { bn: 'কটন টিউব ইনার ক্যাপ' },
            localizedDescriptions: { bn: 'চুল যথাস্থানে রাখার জন্য স্ট্রেচেবল কটন টিউব ক্যাপ।' },
            categoryId: catMap.accessories.id,
            colors: [
                { name: 'Black', code: '#000000', variants: [{ size: 'One Size', stock: 100 }] },
                { name: 'White', code: '#ffffff', variants: [{ size: 'One Size', stock: 100 }] },
                { name: 'Skin', code: '#e3c6b2', variants: [{ size: 'One Size', stock: 80 }] }
            ]
        },
        {
            name: 'Strong Magnetic Hijab Pins (4pcs)',
            slug: 'magnetic-hijab-pins',
            sku: 'ACC-002',
            price: 250,
            originalPrice: 250,
            discount: null,
            description: "Snag-free magnetic pins that won't damage your expensive fabric.",
            localizedNames: { bn: 'শক্তিশালী ম্যাগনেটিক হিজাব পিন (৪টি)' },
            localizedDescriptions: { bn: 'কাপড় নষ্ট হবে না এমন শক্তিশালী ম্যাগনেটিক পিন।' },
            categoryId: catMap.accessories.id,
            colors: [
                { name: 'Matte Black', code: '#1a1a1a', variants: [{ size: 'Set', stock: 50 }] },
                { name: 'Metallic Mixed', code: '#b0b0b0', variants: [{ size: 'Set', stock: 30 }] }
            ]
        },
        {
            name: 'Breathable Single Layer Niqab',
            slug: 'single-layer-niqab',
            sku: 'ACC-003',
            price: 150,
            originalPrice: 150,
            discount: null,
            description: 'Soft chiffon niqab with tying cords. Breathable fabric.',
            localizedNames: { bn: 'আরামদায়ক সিঙ্গেল লেয়ার নিকাব' },
            localizedDescriptions: { bn: 'বাঁধার ফিতা সহ নরম শিফন নিকাব। শ্বাসপ্রশ্বাস নেওয়ার উপযোগী কাপড়।' },
            categoryId: catMap.accessories.id,
            colors: [
                { name: 'Black', code: '#000000', variants: [{ size: 'Free Size', stock: 50 }] }
            ]
        },
        {
            name: 'Velvet Hijab Volumizer Scrunchie',
            slug: 'velvet-volumizer-scrunchie',
            sku: 'ACC-004',
            price: 200,
            originalPrice: 200,
            discount: null,
            description: 'Adds volume to your hijab bun without damaging hair.',
            localizedNames: { bn: 'ভেলভেট হিজাব ভলিউম স্ক্রাঞ্চি' },
            localizedDescriptions: { bn: 'চুলের ক্ষতি না করে আপনার হিজাবের খোঁপার ভলিউম বাড়ায়।' },
            categoryId: catMap.accessories.id,
            colors: [
                { name: 'Black', code: '#000000', variants: [{ size: 'One Size', stock: 30 }] },
                { name: 'Brown', code: '#654321', variants: [{ size: 'One Size', stock: 20 }] }
            ]
        },
        {
            name: 'Cotton Arm Sleeves (Pair)',
            slug: 'cotton-arm-sleeves',
            sku: 'ACC-005',
            price: 120,
            originalPrice: 120,
            discount: null,
            description: 'Extends sleeve coverage for short-sleeved dresses.',
            localizedNames: { bn: 'কটন আর্ম স্লিভস (জোড়া)' },
            localizedDescriptions: { bn: 'ছোট হাতার জামার জন্য হাতার কভারেজ বাড়ায়।' },
            categoryId: catMap.accessories.id,
            colors: [
                { name: 'Black', code: '#000000', variants: [{ size: 'One Size', stock: 40 }] },
                { name: 'Skin', code: '#e3c6b2', variants: [{ size: 'One Size', stock: 40 }] }
            ]
        }
    ];

    for (const p of products) {
        const existing = await prisma.product.findUnique({
            where: { slug: p.slug }
        });

        if (existing) {
            console.log(`Skipping ${p.name}, already exists.`);
            continue;
        }

        await prisma.product.create({
            data: {
                name: p.name,
                slug: p.slug,
                sku: p.sku,
                price: p.price,
                originalPrice: p.originalPrice,
                description: p.description,
                localizedNames: p.localizedNames as any,
                localizedDescriptions: p.localizedDescriptions as any,
                categoryId: p.categoryId,
                status: 'Published',
                discount: p.discount ? p.discount : undefined,
                badges: {
                    create: p.badges?.map(b => ({
                        type: 'custom',
                        text: b,
                        color: '#10b981', // Default Emerald
                        textColor: '#ffffff'
                    })) || []
                },
                colors: {
                    create: p.colors.map(c => ({
                        name: c.name,
                        code: c.code,
                        variants: {
                            create: c.variants.map(v => ({
                                size: v.size,
                                stock: v.stock,
                                sku: `${p.sku}-${c.name}-${v.size}`.toUpperCase().replace(/\s+/g, '-')
                            }))
                        }
                    }))
                }
            }
        });
        console.log(`✅ Created ${p.name}`);
    }

    console.log('🎉 Seeding completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
