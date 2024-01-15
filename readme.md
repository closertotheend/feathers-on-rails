# Feathers on Rails

Welcome to Feathers on Rails, a robust and fully functional blog template designed to streamline your Node.js projects with authentication, authorization, security and all needed modules. 

## Features
- Server-Side Rendering: Enjoy the simplicity and reliability of server-side rendering, providing a solid foundation for your application.
- Feathers.js: Leveraging the power of Feathers.js, which includes Koa.js and Knex, this template offers a well-structured architecture for rapid prototyping and CRUD operations.
- EJS Templating: Utilizing mature and familiar EJS templating, there's no need to learn a new templating language if you're already comfortable with JavaScript.
- HTMX: Optionally integrated for seamless HTML updates over the wire, ensuring stability and compatibility with minimal changes.
- Alpine.js: An optional lightweight alternative to Angular.js and Vue.js, offering simplicity and ease of understanding.
- Bulma CSS: A simple, stable, and aesthetically pleasing CSS framework with utility classes, ensuring a sleek appearance without the hassle of frequent updates.


## About

This project uses [Feathers](http://feathersjs.com). An open source framework for building APIs and real-time applications.

## Getting Started

1. Make sure you have [NodeJS](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.
2. Install your dependencies

    ```
    cd path/to/feathers-on-rails
    npm install
    ```

3. Start your app

    ```
    npm run compile # Compile TypeScript source
    npm run migrate # Run migrations to set up the database
    npm start
    ```

## Testing

Run `npm test` and all your tests in the `test/` directory will be run.

## Scaffolding

This app comes with a powerful command line interface for Feathers. Here are a few things it can do:

```
$ npx feathers help                           # Show all commands
$ npx feathers generate service               # Generate a new Service
```

## Help

For more information on all the things you can do with Feathers visit [docs.feathersjs.com](http://docs.feathersjs.com).
