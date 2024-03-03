import prisma from '../config/db.config.js'
import bcrypt from 'bcrypt'
import { faker } from '@faker-js/faker'
import assignRole from '../utils/assignRole.js'

// Create admin and user role
const roles = [{ name: 'admin' }, { name: 'user' }]

// Create a few permissions
const permissions = [
  { name: 'view_users', group: 'users' },
  { name: 'create_user', group: 'users' },
  { name: 'edit_user', group: 'users' },
  { name: 'update_user', group: 'users' },
  { name: 'delete_user', group: 'users' },
  { name: 'view_posts', group: 'posts' },
  { name: 'create_post', group: 'posts' },
  { name: 'edit_post', group: 'posts' },
  { name: 'update_post', group: 'posts' },
  { name: 'delete_post', group: 'posts' },
  { name: 'view_role_permissions', group: 'role_permissions' },
  { name: 'create_role_permissions', group: 'role_permissions' },
  { name: 'update_role_permissions', group: 'role_permissions' },
  { name: 'delete_role_permissions', group: 'role_permissions' },
  { name: 'view_settings', group: 'settings' },
  { name: 'update_settings', group: 'settings' },
]

// Create a few posts
const posts = []

for (let i = 0; i <= 50; i++) {
  const postObject = {
    user_id: 1,
    title: faker.lorem.sentence(),
    slug: faker.lorem.slug(),
    summary: faker.lorem.sentences(),
    description: faker.lorem.paragraph(),
    status: faker.helpers.arrayElement(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
  }

  posts.push(postObject)
}

async function main() {
  const [usersCount, rolesCount, permissionsCount] = await prisma.$transaction([
    prisma.users.count(),
    prisma.roles.count(),
    prisma.permissions.count(),
  ])

  if (!rolesCount && !permissionsCount) {
    await prisma.$transaction(async (tx) => {
      await tx.roles.createMany({
        data: roles,
      })

      await tx.permissions.createMany({
        data: permissions,
      })
    })
  }

  if (!usersCount) {
    await prisma.$transaction(async (tx) => {
      const password = await bcrypt.hash('admin12345', 12)

      const user = await tx.users.create({
        data: {
          name: 'admin',
          email: 'admin@example.com',
          password,
          email_verified_at: new Date().toISOString(),
        },
      })

      // Assign role
      await assignRole(user.id, 'admin', tx)
    })

    // Create posts
    await prisma.posts.createMany({
      data: posts,
    })
  }
}

main()
  .then(async () => {
    console.log('Seeding was successful')
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.log('Error seeding database', error)
    await prisma.$disconnect()
    process.exit(1)
  })
