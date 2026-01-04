
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
    const adminEmail = 'admin@irinsfashion.com';
    const adminMobile = '00000000000';

    const existingAdmin = await prisma.user.findFirst({
        where: { role: 'ADMIN' }
    });

    if (existingAdmin) {
        console.log('Admin already exists:', existingAdmin.email);
        return;
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const admin = await prisma.user.create({
        data: {
            name: 'Super Admin',
            mobile: adminMobile,
            email: adminEmail,
            password: hashedPassword,
            role: 'ADMIN'
        }
    });

    console.log('Created Admin:', admin);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
