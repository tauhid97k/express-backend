const prisma = require('../utils/prisma')
const bcrypt = require('bcrypt')
const { faker } = require('@faker-js/faker')

// Create admin and user role
const roles = [{ name: 'admin' }, { name: 'user' }]

// Create a few permissions
const permissions = [
  {
    name: 'view_users',
    group: 'users',
  },
  {
    name: 'create_users',
    group: 'users',
  },
  {
    name: 'update_users',
    group: 'users',
  },
  {
    name: 'delete_users',
    group: 'users',
  },
  {
    name: 'view_posts',
    group: 'posts',
  },
  {
    name: 'create_posts',
    group: 'posts',
  },
  {
    name: 'update_posts',
    group: 'posts',
  },
  {
    name: 'delete_posts',
    group: 'posts',
  },
]

// Create a few posts
const posts = []

for (let i = 0; i <= 50; i++) {
  const postObject = {
    user_id: 1,
    title: faker.lorem.sentence(),
    slug: faker.lorem.slug(),
    description: faker.lorem.paragraph(),
    status: faker.helpers.arrayElement(['DRAFT', 'PUBLISHED', 'UNPUBLISHED']),
  }

  posts.push(postObject)
}

async function main() {
  const [usersCount, rolesCount, permissionsCount] = await prisma.$transaction([
    prisma.users.count(),
    prisma.roles.count(),
    prisma.permissions.count(),
  ])

  if (!usersCount) {
    const password = await bcrypt.hash('admin12345', 12)
    await prisma.users.create({
      data: {
        name: 'admin',
        email: 'admin@example.com',
        password,
        email_verified_at: new Date().toISOString(),
      },
    })
  }

  if (!rolesCount && !permissionsCount) {
    await prisma.$transaction([
      prisma.roles.createMany({
        data: roles,
      }),
      prisma.permissions.createMany({
        data: permissions,
      }),
    ])
  }

  if (usersCount) {
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
