import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma, UserRole } from '@prisma/client'; // Added UserRole
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService implements OnModuleInit {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) { }

  async onModuleInit() {
    await this.seedSuperAdmin();
  }

  private async seedSuperAdmin() {
    const superAdminPhone = this.configService.get<string>('SUPER_ADMIN_PHONE');
    const superAdminPassword = this.configService.get<string>('SUPER_ADMIN_PASSWORD');
    const superAdminEmail = this.configService.get<string>('SUPER_ADMIN_EMAIL');

    if (!superAdminPhone || !superAdminPassword) {
      this.logger.warn('Super Admin credentials (PHONE, PASSWORD) not found in env. Skipping seeding.');
      return;
    }

    // Check if SUPERADMIN exists
    const existingSuperAdmin = await this.prisma.user.findFirst({
      where: { role: UserRole.SUPERADMIN }, // Use enum
    });

    if (existingSuperAdmin) {
      this.logger.log('Super Admin already exists. Skipping seeding.');
      return;
    }

    this.logger.log(`Seeding Super Admin (${superAdminPhone})...`);

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(superAdminPassword, salt);

    try {
      await this.prisma.user.create({
        data: {
          mobile: superAdminPhone,
          password: hashedPassword,
          email: superAdminEmail, // Optional in schema
          name: 'Super Admin',
          role: UserRole.SUPERADMIN,
          addresses: {
            create: {
              label: 'Office',
              recipientName: 'Super Admin',
              address: 'Headquarters, Dhaka',
              division: 'dhaka',
              phone: superAdminPhone,
              isDefault: true
            }
          }
        },
      });
      this.logger.log('Super Admin seeded successfully.');
    } catch (error) {
      this.logger.error('Failed to seed Super Admin:', error);
    }
  }

  async findOne(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async findByMobile(mobile: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { mobile },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { email },
    });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(data.password, salt);

    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }
  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        _count: {
          select: { orders: true },
        },
        orders: {
          select: {
            total: true,
          }
        }
      }
    });
  }

  async count(where: Prisma.UserWhereInput): Promise<number> {
    return this.prisma.user.count({ where });
  }

  async delete(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }
}
