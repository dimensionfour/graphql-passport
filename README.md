`graphql-passport` provides simple functionality to authenticate with Passport.js from mutation resolvers.

Inside your resolvers you can get access to the following functions and attributes inside the context.

```js
context.authenticate('graphql-local', { email, password })
context.login(user)
context.logout()
context.isAuthenticated()
context.isUnauthenticated()
context.user
```

`authenticate` and `login` are basically `passport.authenticate` and `passport.login` wrapped in a promise. `user`, `logout`, `isAuthenticated` and `isUnauthenticated` are just copies of the corresponding passport functions and attributes.

## Usage

Initialize the `GraphQLLocalStrategy` and create the GraphQL context by using `buildContext`.

```js
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import passport from 'passport';
import { GraphQLLocalStrategy, buildContext } from 'graphql-passport';

passport.use(
  new GraphQLLocalStrategy((email, password, done) => {
    // Adjust this callback to your needs
    const users = User.getUsers();
    const matchingUser = users.find(user => email === user.email && password === user.password);
    const error = matchingUser ? null : new Error('no matching user');
    done(error, matchingUser);
  }),
);

const app = express();
app.use(passport.initialize());

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => buildContext({ req, res, User }),
});

server.applyMiddleware({ app, cors: false });

app.listen({ port: PORT }, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
});
```

Inside your resolvers you can call `context.authenticate` to authenticate the user with the given credentials. If you want to use `expression-session` as well you need to call `context.login(user)` after `authenticate`.

```js
const resolvers = {
  Query: {
    currentUser: (parent, args, context) => context.user,
  },
  Mutation: {
    login: async (parent, { email, password }, context) => {
      // instead of email you can pass username as well
      const { user } = await context.authenticate('graphql-local', { email, password });

      // call login if you want to use express-session
      // context.login(user);

      return { user }
    },
  },
};
```