
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding ...');

    // 1. Clean up existing data
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.productVariant.deleteMany();
    await prisma.productImage.deleteMany();
    await prisma.productBadge.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.address.deleteMany();
    await prisma.user.deleteMany();

    console.log('Deleted existing data.');

    // 2. Seed Categories
    const categories = [
        {
            name: 'Hijab',
            slug: 'hijab',
            icon: '🧕',
            image: '/images/cat-hijab.png',
        },
        {
            name: 'Abaya',
            slug: 'abaya',
            icon: '👗',
            image: '/images/cat-abaya.png',
        },
        {
            name: 'Borkha',
            slug: 'borkha',
            icon: '👗',
            image: '/images/cat-borkha-v3.png',
        },
        {
            name: 'Gown',
            slug: 'gown',
            icon: '👗',
            image: '/images/cat-gown-v3.png',
        },
        {
            name: 'Accessories',
            slug: 'accessories',
            icon: '👜',
            image: '/images/cat-accessories.png',
        },
    ];

    for (const cat of categories) {
        await prisma.category.create({
            data: cat,
        });
    }

    console.log(`Seeded ${categories.length} categories.`);

    // Helper to find category ID by slug
    const getCatId = async (slug: string) => {
        const cat = await prisma.category.findUnique({ where: { slug } });
        return cat?.id;
    };

    const hijabId = await getCatId('hijab');
    const abayaId = await getCatId('abaya');
    const borkhaId = await getCatId('borkha');
    const gownId = await getCatId('gown');
    const accId = await getCatId('accessories');

    if (!hijabId || !abayaId || !borkhaId || !gownId || !accId) {
        throw new Error('Failed to retrieve seeded category IDs');
    }

    // 3. Seed Products
    const products = [
        // Hijabs
        {
            sku: 'IF-HJB-EM-001',
            name: 'Premium Silk Hijab - Emerald',
            price: 1250.0,
            description: 'Experience the luxury of our Premium Silk Hijab in Emerald. Crafted from the finest silk, this hijab offers a smooth, lustrous finish that drapes beautifully.',
            categoryId: hijabId,
            image: '/images/products/hijab-emerald.png',
            isNew: true,
            originalPrice: 1500,
            images: [
                '/images/products/hijab-emerald.png',
                '/images/products/hijab-rose.png',
                '/images/products/hijab-black.png'
            ],
            variants: [
                { size: 'One Size', color: 'Emerald', stock: 50 },
                { size: 'One Size', color: 'Dusty Rose', stock: 50 },
                { size: 'One Size', color: 'Black', stock: 50 }
            ],
            badges: [{ type: 'new', text: 'New Arrival' }]
        },
        {
            sku: 'IF-HJB-DR-002',
            name: 'Chiffon Hijab - Dusty Rose',
            price: 850.0,
            description: 'Our Chiffon Hijab in Dusty Rose is perfect for everyday wear. Lightweight, breathable, and easy to style.',
            categoryId: hijabId,
            image: '/images/products/hijab-rose.png',
            isNew: true,
            images: [
                '/images/products/hijab-rose.png',
                '/images/products/hijab-emerald.png',
                '/images/products/hijab-navy.png'
            ],
            variants: [
                { size: 'One Size', color: 'Dusty Rose', stock: 100 },
                { size: 'One Size', color: 'Emerald', stock: 100 },
                { size: 'One Size', color: 'Navy', stock: 100 }
            ]
        },
        {
            sku: 'IF-HJB-BK-003',
            name: 'Jersey Hijab - Black',
            price: 650.0,
            description: 'The essential Jersey Hijab in Black. Made from high-quality stretch cotton jersey.',
            categoryId: hijabId,
            image: '/images/products/hijab-black.png',
            images: ['/images/products/hijab-black.png', '/images/products/hijab-navy.png'],
            variants: [
                { size: 'One Size', color: 'Black', stock: 150 },
                { size: 'One Size', color: 'Navy', stock: 150 }
            ]
        },
        {
            sku: 'IF-HJB-NV-004',
            name: 'Georgette Hijab - Navy',
            price: 750.0,
            description: 'Elegant Georgette Hijab in deep Navy. The semi-sheer, matte fabric drapes effortlessly.',
            categoryId: hijabId,
            image: '/images/products/hijab-navy.png',
            images: ['/images/products/hijab-navy.png', '/images/products/hijab-rose.png'],
            variants: [
                { size: 'One Size', color: 'Navy', stock: 80 },
                { size: 'One Size', color: 'Dusty Rose', stock: 80 }
            ]
        },
        {
            sku: 'IF-HJB-GD-005',
            name: 'Satin Hijab - Gold',
            price: 1450.0,
            description: 'Radiate elegance with our Satin Hijab in Gold. The high-shine finish and silky feel make this hijab a showstopper.',
            categoryId: hijabId,
            image: '/images/products/hijab-emerald.png', // Fallback from mock
            images: ['/images/products/hijab-emerald.png'],
            variants: [
                { size: 'One Size', color: 'Gold', stock: 40 }
            ]
        },

        // Abayas
        {
            sku: 'IF-ABY-BK-001',
            name: 'Classic Black Abaya',
            price: 4500.0,
            description: 'A timeless Classic Black Abaya that embodies simplicity and grace.',
            categoryId: abayaId,
            image: '/images/product-abaya.png',
            images: ['/images/product-abaya.png'],
            variants: [
                { size: '52', color: 'Black', stock: 20 },
                { size: '54', color: 'Black', stock: 20 },
                { size: '56', color: 'Black', stock: 20 },
                { size: '58', color: 'Black', stock: 20 },
                { size: '60', color: 'Black', stock: 20 }
            ]
        },
        {
            sku: 'IF-ABY-EM-002',
            name: 'Embroidered Open Abaya',
            price: 6500.0,
            description: 'Elevate your style with this Embroidered Open Abaya. Featuring intricate floral embroidery.',
            categoryId: abayaId,
            image: '/images/product-abaya.png',
            isNew: true,
            images: ['/images/product-abaya.png'],
            variants: [
                { size: '52', color: 'Black/Gold', stock: 15 },
                { size: '54', color: 'Black/Gold', stock: 15 },
                { size: '56', color: 'Black/Gold', stock: 15 },
                { size: '58', color: 'Black/Silver', stock: 15 }
            ],
            badges: [
                { type: 'new', text: 'New' },
                { type: 'bestseller', text: 'Best Seller', color: '#f59e0b', textColor: '#ffffff' }
            ]
        },
        {
            sku: 'IF-ABY-KM-003',
            name: 'Kimono Style Abaya',
            price: 5200.0,
            description: 'Modern Kimono Style Abaya with wide sleeves and a relaxed fit.',
            categoryId: abayaId,
            image: '/images/product-abaya.png',
            images: ['/images/product-abaya.png'],
            variants: [
                { size: 'Free Size', color: 'Grey', stock: 30 },
                { size: 'Free Size', color: 'Beige', stock: 30 },
                { size: 'Free Size', color: 'Black', stock: 30 }
            ]
        },
        {
            sku: 'IF-ABY-BF-004',
            name: 'Butterfly Abaya - Beige',
            price: 4800.0,
            description: 'Float through your day in this ethereal Butterfly Abaya in Beige. The ultra-wide cut provides maximum coverage.',
            categoryId: abayaId,
            image: '/images/product-abaya.png',
            isNew: true,
            images: ['/images/product-abaya.png'],
            variants: [
                { size: 'One Size', color: 'Beige', stock: 25 }
            ]
        },

        // Borkhas
        {
            sku: 'IF-DRS-FL-001',
            name: 'Floral Maxi Dress',
            price: 3500.0,
            description: 'Embrace the season with our Floral Maxi Dress. Featuring a vibrant botanical print.',
            categoryId: borkhaId,
            image: '/images/product-dress.png',
            isNew: true,
            originalPrice: 3900,
            images: ['/images/product-dress.png'],
            variants: [
                { size: 'S', color: 'Floral Pink', stock: 10 },
                { size: 'M', color: 'Floral Pink', stock: 10 },
                { size: 'L', color: 'Floral Pink', stock: 10 },
                { size: 'S', color: 'Floral Blue', stock: 10 },
                { size: 'M', color: 'Floral Blue', stock: 10 },
                { size: 'L', color: 'Floral Blue', stock: 10 }
            ],
            badges: [{ type: 'discount', text: '10% OFF' }]
        },
        {
            sku: 'IF-DRS-EV-002',
            name: 'Elegant Evening Gown',
            price: 8500.0,
            description: 'Make an entrance in this Elegant Evening Gown. With detailed beading on the bodice.',
            categoryId: borkhaId,
            image: '/images/product-dress.png',
            images: ['/images/product-dress.png'],
            variants: [
                { size: 'S', color: 'Midnight Blue', stock: 5 },
                { size: 'M', color: 'Midnight Blue', stock: 5 },
                { size: 'L', color: 'Burgundy', stock: 5 }
            ]
        },
        {
            sku: 'IF-DRS-CT-003',
            name: 'Summer Cotton Dress',
            price: 2200.0,
            description: 'Stay cool and chic in our Summer Cotton Dress. Made from 100% organic cotton.',
            categoryId: borkhaId,
            image: '/images/product-dress.png',
            images: ['/images/product-dress.png'],
            variants: [
                { size: 'S', color: 'White', stock: 40 },
                { size: 'M', color: 'White', stock: 40 },
                { size: 'M', color: 'Sage Green', stock: 40 }
            ]
        },
        {
            sku: 'IF-DRS-PL-004',
            name: 'Pleated Midi Dress',
            price: 2800.0,
            description: 'Style meets texture in this Pleated Midi Dress. The accordion pleats add movement.',
            categoryId: borkhaId,
            image: '/images/product-dress.png',
            images: ['/images/product-dress.png'],
            variants: [
                { size: 'M', color: 'Rust', stock: 20 },
                { size: 'L', color: 'Black', stock: 20 }
            ]
        },

        // Gowns
        {
            sku: 'IF-GWN-RB-001',
            name: 'Royal Blue Velvet Gown',
            price: 9500.0,
            description: 'Stunning Royal Blue Velvet Gown perfect for special occasions.',
            categoryId: gownId,
            image: '/images/product-dress.png',
            isNew: true,
            originalPrice: 12000,
            images: ['/images/product-dress.png'],
            variants: [
                { size: 'M', color: 'Royal Blue', stock: 5 }
            ],
            badges: [{ type: 'custom', text: 'Exquisite', color: '#7e22ce', textColor: '#ffffff' }]
        },

        // Accessories
        {
            sku: 'IF-ACC-HB-001',
            name: 'Leather Handbag',
            price: 3200.0,
            description: 'Complete your look with this premium Leather Handbag.',
            categoryId: accId,
            image: '/images/product-cardigan.png',
            images: ['/images/product-cardigan.png'],
            variants: [
                { size: 'One Size', color: 'Tan', stock: 15 },
                { size: 'One Size', color: 'Black', stock: 15 }
            ]
        },
        {
            sku: 'IF-ACC-NK-002',
            name: 'Statement Necklace',
            price: 1200.0,
            description: 'Add a touch of sparkle with our Statement Necklace.',
            categoryId: accId,
            image: '/images/product-cardigan.png',
            images: ['/images/product-cardigan.png'],
            variants: [
                { size: 'Adjustable', color: 'Gold', stock: 50 },
                { size: 'Adjustable', color: 'Silver', stock: 50 }
            ]
        },
    ];

    for (const p of products) {
        const { images, variants, badges, ...productData } = p;

        // Create Product
        const createdProduct = await prisma.product.create({
            data: productData,
        });

        // Create Images
        if (images && images.length > 0) {
            await prisma.productImage.createMany({
                data: images.map((url, index) => ({
                    productId: createdProduct.id,
                    url,
                    isPrimary: index === 0,
                })),
            });
        }

        // Create Variants
        if (variants && variants.length > 0) {
            await prisma.productVariant.createMany({
                data: variants.map(v => ({
                    productId: createdProduct.id,
                    size: v.size,
                    color: v.color,
                    stock: v.stock,
                })),
            });
        }

        // Create Badges
        if (badges && badges.length > 0) {
            await prisma.productBadge.createMany({
                data: badges.map((b: any) => ({
                    productId: createdProduct.id,
                    type: b.type,
                    text: b.text,
                    color: b.color,
                    textColor: b.textColor,
                })),
            });
        }
    }

    console.log(`Seeded ${products.length} products.`);

    // 4. Seed Test User
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash('password123', salt);

    await prisma.user.upsert({
        where: { mobile: '01700000000' },
        update: {},
        create: {
            mobile: '01700000000',
            password: hashedPassword,
            name: 'Test Customer',
            role: 'CUSTOMER',
            addresses: {
                create: {
                    label: 'Home',
                    recipientName: 'Test Customer',
                    street: '123 Fake St',
                    city: 'Dhaka',
                    division: 'dhaka',
                    phone: '01700000000',
                    isDefault: true
                }
            }
        }
    });
    console.log('Seeded test user: 01700000000 / password123');

    console.log('Seeding finished.');
    // Seed Super Admin
    const superAdminPassword = await bcrypt.hash('Admin123!', await bcrypt.genSalt());

    await prisma.user.upsert({
        where: { mobile: '01711111111' },
        update: {
            password: superAdminPassword,
            role: 'SUPERADMIN',
        },
        create: {
            mobile: '01711111111',
            email: 'superadmin@irinsfashion.com',
            name: 'Super Admin',
            password: superAdminPassword,
            role: 'SUPERADMIN',
        },
    });
    console.log('Seeded super admin: 01711111111 / Admin123!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
