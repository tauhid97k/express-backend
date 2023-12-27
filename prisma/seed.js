const prisma = require('../utils/prisma')

const roles = [{ name: 'admin' }, { name: 'user' }]
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

async function main() {
  await prisma.$transaction([
    prisma.roles.createMany({
      data: roles,
    }),
    prisma.permissions.createMany({
      data: permissions,
    }),
  ])
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
