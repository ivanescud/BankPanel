import { PrismaClient, Role, UserStatus, AccountType, AccountStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando siembra de datos para Credicord Bank...');

  // Limpiar datos existentes
  await prisma.auditLog.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.user.deleteMany({});

  const defaultPassword = await bcrypt.hash('Credicord2025!', 10);

  // 1. Usuarios administrativos del DevPanel
  const admin = await prisma.user.create({
    data: {
      email: 'admin@credicordbank.com',
      password: defaultPassword,
      firstName: 'Alejandro',
      lastName: 'Montenegro',
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      accounts: {
        create: [
          {
            accountNumber: 'CCB-10029384',
            accountType: AccountType.CHECKING,
            balance: 145000.5,
            currency: 'USD',
            status: AccountStatus.ACTIVE,
          },
          {
            accountNumber: 'CCB-90812734',
            accountType: AccountType.INVESTMENT,
            balance: 620000.0,
            currency: 'USD',
            status: AccountStatus.ACTIVE,
          },
        ],
      },
    },
  });

  const dev = await prisma.user.create({
    data: {
      email: 'dev@credicordbank.com',
      password: defaultPassword,
      firstName: 'Valentina',
      lastName: 'Gómez',
      role: Role.DEVELOPER,
      status: UserStatus.ACTIVE,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      accounts: {
        create: [
          {
            accountNumber: 'CCB-20048192',
            accountType: AccountType.SAVINGS,
            balance: 38400.25,
            currency: 'USD',
            status: AccountStatus.ACTIVE,
          },
        ],
      },
    },
  });

  const auditor = await prisma.user.create({
    data: {
      email: 'auditor@credicordbank.com',
      password: defaultPassword,
      firstName: 'Carlos',
      lastName: 'Sánchez',
      role: Role.AUDITOR,
      status: UserStatus.ACTIVE,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      accounts: {
        create: [
          {
            accountNumber: 'CCB-30019283',
            accountType: AccountType.CHECKING,
            balance: 19800.0,
            currency: 'USD',
            status: AccountStatus.ACTIVE,
          },
        ],
      },
    },
  });

  // 2. Clientes bancarios
  const mockClients = [
    {
      firstName: 'Elena',
      lastName: 'Ríos Mendoza',
      email: 'elena.rios@empresasrios.com',
      role: Role.USER,
      status: UserStatus.ACTIVE,
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
      accounts: [
        { accountNumber: 'CCB-88392019', accountType: AccountType.CHECKING, balance: 84320.5, status: AccountStatus.ACTIVE },
        { accountNumber: 'CCB-88392020', accountType: AccountType.INVESTMENT, balance: 250000.0, status: AccountStatus.ACTIVE },
      ],
    },
    {
      firstName: 'Mateo',
      lastName: 'Herrera Vivas',
      email: 'm.herrera@techsolutions.io',
      role: Role.USER,
      status: UserStatus.ACTIVE,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      accounts: [
        { accountNumber: 'CCB-77491028', accountType: AccountType.SAVINGS, balance: 45200.0, status: AccountStatus.ACTIVE },
        { accountNumber: 'CCB-77491029', accountType: AccountType.CREDIT, balance: 5000.0, status: AccountStatus.ACTIVE },
      ],
    },
    {
      firstName: 'Lucía',
      lastName: 'Fernández Silva',
      email: 'lucia.fernandez@globaltrd.com',
      role: Role.USER,
      status: UserStatus.ACTIVE,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      accounts: [
        { accountNumber: 'CCB-66293847', accountType: AccountType.INVESTMENT, balance: 412900.75, status: AccountStatus.ACTIVE },
      ],
    },
    {
      firstName: 'Diego',
      lastName: 'Alvarado Paz',
      email: 'diego.alvarado@constructoraap.com',
      role: Role.USER,
      status: UserStatus.ACTIVE,
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
      accounts: [
        { accountNumber: 'CCB-55910283', accountType: AccountType.CHECKING, balance: 120500.0, status: AccountStatus.ACTIVE },
        { accountNumber: 'CCB-55910284', accountType: AccountType.SAVINGS, balance: 93400.1, status: AccountStatus.ACTIVE },
      ],
    },
    {
      firstName: 'Camila',
      lastName: 'Ortega Benítez',
      email: 'camilao@consultoresob.com',
      role: Role.USER,
      status: UserStatus.INACTIVE,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      accounts: [
        { accountNumber: 'CCB-44829103', accountType: AccountType.SAVINGS, balance: 1450.0, status: AccountStatus.FROZEN },
      ],
    },
    {
      firstName: 'Andrés',
      lastName: 'Pérez Calderón',
      email: 'andres.perez@calderongroup.org',
      role: Role.USER,
      status: UserStatus.ACTIVE,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      accounts: [
        { accountNumber: 'CCB-33918274', accountType: AccountType.CHECKING, balance: 67800.4, status: AccountStatus.ACTIVE },
      ],
    },
    {
      firstName: 'Sofía',
      lastName: 'Navarro Quiroz',
      email: 'sofia.navarro@logisticsnq.com',
      role: Role.USER,
      status: UserStatus.ACTIVE,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      accounts: [
        { accountNumber: 'CCB-22819201', accountType: AccountType.INVESTMENT, balance: 310450.0, status: AccountStatus.ACTIVE },
        { accountNumber: 'CCB-22819202', accountType: AccountType.CHECKING, balance: 52100.0, status: AccountStatus.ACTIVE },
      ],
    },
    {
      firstName: 'Javier',
      lastName: 'Guzmán Restrepo',
      email: 'jguzman@inversionesgr.co',
      role: Role.USER,
      status: UserStatus.SUSPENDED,
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
      accounts: [
        { accountNumber: 'CCB-11928374', accountType: AccountType.CHECKING, balance: 8900.0, status: AccountStatus.FROZEN },
      ],
    },
    {
      firstName: 'Mariana',
      lastName: 'Castillo Vega',
      email: 'mariana.castillo@agroholding.com',
      role: Role.USER,
      status: UserStatus.ACTIVE,
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
      accounts: [
        { accountNumber: 'CCB-99182736', accountType: AccountType.SAVINGS, balance: 182300.9, status: AccountStatus.ACTIVE },
      ],
    },
    {
      firstName: 'Rodrigo',
      lastName: 'Salazar Marín',
      email: 'rsalazar@finanzassm.com',
      role: Role.USER,
      status: UserStatus.ACTIVE,
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
      accounts: [
        { accountNumber: 'CCB-88271635', accountType: AccountType.CHECKING, balance: 94100.0, status: AccountStatus.ACTIVE },
      ],
    },
    {
      firstName: 'Isabella',
      lastName: 'Romero Castro',
      email: 'isabella.romero@retailrc.com',
      role: Role.USER,
      status: UserStatus.ACTIVE,
      avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150',
      accounts: [
        { accountNumber: 'CCB-77182930', accountType: AccountType.INVESTMENT, balance: 540000.0, status: AccountStatus.ACTIVE },
      ],
    },
    {
      firstName: 'Gabriel',
      lastName: 'Morales Gil',
      email: 'gmorales@techexplorers.net',
      role: Role.USER,
      status: UserStatus.ACTIVE,
      avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150',
      accounts: [
        { accountNumber: 'CCB-66192837', accountType: AccountType.SAVINGS, balance: 29800.5, status: AccountStatus.ACTIVE },
      ],
    },
  ];

  for (const client of mockClients) {
    await prisma.user.create({
      data: {
        email: client.email,
        password: defaultPassword,
        firstName: client.firstName,
        lastName: client.lastName,
        role: client.role,
        status: client.status,
        avatar: client.avatar,
        accounts: {
          create: client.accounts.map((acc) => ({
            accountNumber: acc.accountNumber,
            accountType: acc.accountType,
            balance: acc.balance,
            currency: 'USD',
            status: acc.status,
          })),
        },
      },
    });
  }

  // 3. Auditoría inicial
  await prisma.auditLog.createMany({
    data: [
      {
        action: 'SYSTEM_INITIALIZATION',
        details: 'Configuración inicial del DevPanel y base de datos bancaria',
        userId: admin.id,
      },
      {
        action: 'SECURITY_AUDIT',
        details: 'Verificación de políticas de seguridad y roles bancarios',
        userId: auditor.id,
      },
      {
        action: 'CORE_DEPLOYMENT',
        details: 'Despliegue del servicio de métricas financieras v1.0.0',
        userId: dev.id,
      },
    ],
  });

  console.log('✅ Siembra completada con éxito.');
  console.log('Credenciales de acceso para DevPanel:');
  console.log('• Admin: admin@credicordbank.com / Credicord2025!');
  console.log('• Dev:   dev@credicordbank.com   / Credicord2025!');
  console.log('• Audit: auditor@credicordbank.com / Credicord2025!');
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
