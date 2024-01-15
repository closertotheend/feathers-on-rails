import { Knex } from 'knex'

export async function seed(knex: Knex): Promise<void> {
  const inserted = await knex('users').insert({
    email: 'admin@admin',
    password: '$2a$10$gXz1JEcCoCprFI3bz8ly0OCnEmV3bOO9k5rRj/2gNbHcfzjg02oym'
  })

  await knex('posts').insert([
    {
      heading: '4th news column',
      text: 'If you give end-users unfettered access to the EJS render method, you are using EJS in an inherently un-secure way. Please do not report security issues that stem from doing that.',
      userId: 1
    },
    {
      heading: 'Getting Started',
      text: 'This is a starter template for creating a beautiful, customizable blog with minimal effort. You’ll only have to change a few settings and you’re ready to go. As with all Jigsaw sites, configuration settings can be found in config',
      userId: 1
    },
    {
      heading: 'Custom 404 Pages',
      text: 'This starter template includes a custom 404 Not Found error page, located at /source/404.blade.php. To preview the 404 page, you can visit /404 in your browser. Depending...',
      userId: 1
    },
    {
      heading: 'Fuse Search',
      text: 'To provide fast, local search of your blog, this starter template comes with a pre-built Vue.js component that uses Fuse.js. Fuse.js is a "lightweight fuzzy-search library with no...',
      userId: 1
    },
    {
      heading: 'Absurd World',
      text: 'Curabitur accumsan turpis pharetra augue tincidunt blandit. Quisque condimentum maximus mi, sit amet commodo arcu rutrum id. Proin pretium urna vel cursus venenatis. Suspendisse potenti. Etiam mattis sem rhoncus lacus dapibus facilisis. Donec at dignissim dui. Ut et neque nisl.',
      userId: 1
    },
    {
      heading: 'Hello World',
      text: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laborum cupiditate dolorum vitae dolores nesciunt totam magni quas.',
      userId: 1
    }
  ])
}
