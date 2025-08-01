import { PrismaClient, UserRole, UserStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create permissions
  console.log('📝 Creating permissions...')
  const permissions = await Promise.all([
    prisma.permission.upsert({
      where: { name: 'user:read' },
      update: {},
      create: {
        name: 'user:read',
        description: 'Read user information'
      }
    }),
    prisma.permission.upsert({
      where: { name: 'user:write' },
      update: {},
      create: {
        name: 'user:write',
        description: 'Create and update users'
      }
    }),
    prisma.permission.upsert({
      where: { name: 'user:delete' },
      update: {},
      create: {
        name: 'user:delete',
        description: 'Delete users'
      }
    }),
    prisma.permission.upsert({
      where: { name: 'admin:access' },
      update: {},
      create: {
        name: 'admin:access',
        description: 'Access admin panel'
      }
    }),
    prisma.permission.upsert({
      where: { name: 'content:moderate' },
      update: {},
      create: {
        name: 'content:moderate',
        description: 'Moderate content'
      }
    })
  ])

  // Create roles
  console.log('👥 Creating roles...')
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
      description: 'Administrator with full access'
    }
  })

  const moderatorRole = await prisma.role.upsert({
    where: { name: 'moderator' },
    update: {},
    create: {
      name: 'moderator',
      description: 'Moderator with limited admin access'
    }
  })

  const userRole = await prisma.role.upsert({
    where: { name: 'user' },
    update: {},
    create: {
      name: 'user',
      description: 'Regular user'
    }
  })

  // Assign permissions to roles
  console.log('🔗 Assigning permissions to roles...')

  // Admin gets all permissions
  for (const permission of permissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: permission.id
        }
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: permission.id
      }
    })
  }

  // Moderator gets content moderation and user read permissions
  const moderatorPermissions = permissions.filter(p =>
    ['user:read', 'content:moderate'].includes(p.name)
  )
  for (const permission of moderatorPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: moderatorRole.id,
          permissionId: permission.id
        }
      },
      update: {},
      create: {
        roleId: moderatorRole.id,
        permissionId: permission.id
      }
    })
  }

  // User gets only read permission
  const userPermissions = permissions.filter(p => p.name === 'user:read')
  for (const permission of userPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: userRole.id,
          permissionId: permission.id
        }
      },
      update: {},
      create: {
        roleId: userRole.id,
        permissionId: permission.id
      }
    })
  }

  // Create users
  console.log('👤 Creating users...')

  // Admin user
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@example.com',
      name: 'System Administrator',
      password: await bcrypt.hash('admin123', 12),
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE
    }
  })

  // Moderator user
  await prisma.user.upsert({
    where: { username: 'moderator' },
    update: {},
    create: {
      username: 'moderator',
      email: 'moderator@example.com',
      name: 'Content Moderator',
      password: await bcrypt.hash('mod123', 12),
      role: UserRole.MODERATOR,
      status: UserStatus.ACTIVE
    }
  })

  // Regular users
  const regularUsers = [
    {
      username: 'john_doe',
      email: 'john@example.com',
      name: 'John Doe',
      password: 'user123'
    },
    {
      username: 'jane_smith',
      email: 'jane@example.com',
      name: 'Jane Smith',
      password: 'user123'
    },
    {
      username: 'bob_wilson',
      email: 'bob@example.com',
      name: 'Bob Wilson',
      password: 'user123'
    }
  ]

  for (const userData of regularUsers) {
    await prisma.user.upsert({
      where: { username: userData.username },
      update: {},
      create: {
        username: userData.username,
        email: userData.email,
        name: userData.name,
        password: await bcrypt.hash(userData.password, 12),
        role: UserRole.USER,
        status: UserStatus.ACTIVE
      }
    })
  }

  // Create a guest user
  await prisma.user.upsert({
    where: { username: 'guest' },
    update: {},
    create: {
      username: 'guest',
      email: 'guest@example.com',
      name: 'Guest User',
      password: await bcrypt.hash('guest123', 12),
      role: UserRole.GUEST,
      status: UserStatus.ACTIVE
    }
  })

  console.log('✅ Seed completed successfully!')
  console.log('\n📋 Created users:')
  console.log('- admin / admin123 (ADMIN)')
  console.log('- moderator / mod123 (MODERATOR)')
  console.log('- john_doe / user123 (USER)')
  console.log('- jane_smith / user123 (USER)')
  console.log('- bob_wilson / user123 (USER)')
  console.log('- guest / guest123 (GUEST)')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
