const { ServiceBroker } = require("moleculer");
const APIGateway = require("moleculer-web");
const Swagger = require("..");

const broker = new ServiceBroker({ cacher: "Memory" });

broker.createService({
  name: "swagger",
  mixins: [Swagger()],
});

broker.createService({
  name: "api",
  mixins: [APIGateway],
  settings: {
    routes: [
      {
        path: "/swagger.json",
        aliases: {
          "GET /": "swagger.openapi",
        },
      },
      {
        path: "/",
        autoAliases: true,
      },
    ],
    assets: {
      folder: "example/public",
    },
  },
});

broker.createService({
  name: "service-1",
  actions: {
    list: {
      rest: "GET /",
      params: {
        filter: "string",
        counter: "number|min:0|max:100",
        superCounter: { type: "number", min: 100, max: 1000 },
      },
      handler(ctx) {
        return { name: "sevice-1.list", ...ctx.params };
      },
    },
    superApi: {
      description: `Lorem ipsum dolor sit amet, [consectetur adipiscing elit](https://www.google.com), sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
      tags: ["service-1", "super-api"],
      rest: "POST /:id/super/:mode/api",
      params: {
        id: "number",
        mode: "string",
        filter: { type: "array", items: "string" },
      },
      handler(ctx) {
        return { name: "sevice-1.list", ...ctx.params };
      },
    },
  },
});

broker.start();

for (let cnt = 0; cnt < 100; cnt += 1) {
  broker.createService({
    name: `service-${Date.now()}`,
    actions: {
      list: {
        rest: "GET /",
        params: {
          filter: "string",
          counter: "number|min:0|max:100",
          superCounter: {
            type: "number",
            min: 100,
            max: Math.ceil(Math.random() * 10000),
          },
        },
        handler(ctx) {
          return { name: "sevice-1.list", ...ctx.params };
        },
      },
      superApi: {
        description: `Lorem ipsum dolor sit amet, [consectetur adipiscing elit](https://www.google.com), sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
        tags: ["service", "super-api"],
        rest: `${
          ["GET", "POST", "PUT", "DELETE"][cnt % 4]
        } /:id/super/:mode/api`,
        params: {
          id: "number",
          mode: "string",
          filter: { type: "array", items: "string" },
        },
        handler(ctx) {
          return { name: "sevice-1.list", ...ctx.params };
        },
      },
    },
  });
}

setInterval(() => {
  broker.createService({
    name: `service-2${Date.now()}`,
    actions: {
      list: {
        rest: "GET /",
        params: {
          filter: "string",
          counter: "number|min:0|max:100",
          superCounter: {
            type: "number",
            min: 100,
            max: Math.ceil(Math.random() * 10000),
          },
        },
        handler(ctx) {
          return { name: "sevice-1.list", ...ctx.params };
        },
      },
      superApi: {
        description: `Lorem ipsum dolor sit amet, [consectetur adipiscing elit](https://www.google.com), sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
        tags: ["service-1", "super-api"],
        rest: "POST /:id/super/:mode/api",
        params: {
          id: "number",
          mode: "string",
          filter: { type: "array", items: "string" },
        },
        handler(ctx) {
          return { name: "sevice-1.list", ...ctx.params };
        },
      },
    },
  });
}, 10000);
