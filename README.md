![Moleculer logo](http://moleculer.services/images/banner.png)

[![Build Status](https://travis-ci.org/davidnussio/moleculer-swagger.svg?branch=master)](https://travis-ci.org/davidnussio/moleculer-swagger)
[![Coverage Status](https://coveralls.io/repos/github/davidnussio/moleculer-swagger/badge.svg?branch=master)](https://coveralls.io/github/davidnussio/moleculer-swagger?branch=master)
![Code Climate maintainability](https://img.shields.io/codeclimate/maintainability/davidnussio/moleculer-swagger)
[![David](https://img.shields.io/david/davidnussio/moleculer-swagger.svg)](https://david-dm.org/davidnussio/moleculer-swagger)
[![Known Vulnerabilities](https://snyk.io/test/github/davidnussio/moleculer-swagger/badge.svg)](https://snyk.io/test/github/davidnussio/moleculer-swagger)

# moleculer-swagger [![NPM version](https://img.shields.io/npm/v/moleculer-swagger.svg)](https://www.npmjs.com/package/moleculer-swagger)

Moleculer Service Mixin that convert internals moleculer structure to Swagger OpenAPI

More about openapi [specification](https://swagger.io/specification/)

## Getting started

### Create moleculer services

```js
const { ServiceBroker } = require("moleculer");
const APIGateway = require("moleculer-web");
const Swagger = require("moleculer-swagger");

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
      folder: "example/public", // Where create swagger.html page
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
```

### Swagger UI

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Swagger UI</title>
    <!-- needed for adaptive design -->
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link
      href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700"
      rel="stylesheet"
    />
    <link
      rel="stylesheet"
      type="text/css"
      href="https://unpkg.com/swagger-ui-dist@3/swagger-ui.css"
    />

    <!--
    script doesn't change outer page styles
    -->
    <style>
      body {
        margin: 0;
        padding: 0;
      }
    </style>
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script
      src="https://unpkg.com/swagger-ui-dist@3/swagger-ui-standalone-preset.js"
      charset="UTF-8"
    ></script>
    <script
      src="https://unpkg.com/swagger-ui-dist@3/swagger-ui-bundle.js"
      charset="UTF-8"
    ></script>
    <script type="text/javascript">
      window.onload = function () {
        const ui = SwaggerUIBundle({
          url: "/swagger.json",
          dom_id: "#swagger-ui",
          deepLinking: true,
          presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
          plugins: [SwaggerUIBundle.plugins.DownloadUrl],
          layout: "StandaloneLayout",
        });
        window.ui = ui;
      };
    </script>
  </body>
</html>
```

```html
<!DOCTYPE html>
<html>
  <head>
    <title>ReDoc</title>
    <!-- needed for adaptive design -->
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link
      href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700"
      rel="stylesheet"
    />

    <!--
    ReDoc doesn't change outer page styles
    -->
    <style>
      body {
        margin: 0;
        padding: 0;
      }
    </style>
  </head>
  <body>
    <redoc spec-url="/swagger.json"></redoc>
    <script src="https://cdn.jsdelivr.net/npm/redoc@next/bundles/redoc.standalone.js"></script>
  </body>
</html>
```

## Swagger settings

These settings would be updated to match openapi 3.0 specification

```js
Swagger({
  openapiSchema: {
    openapi: "3.0.3",
    info: {
      title: "The title of the API.",
      description:
        "A short description of the API. CommonMark syntax MAY be used for rich text representation.",
      termsOfService: "http://swagger.io/terms/",
      contact: {
        email: "apiteam@swagger.io",
      },
      license: {
        name: "Apache 2.0",
        url: "http://www.apache.org/licenses/LICENSE-2.0.html",
      },
      version: "3.0.3",
    },
    components: {
      responses: {
        Success: {
          description: "Successful operation",
          content: {
            "application/json": { schema: { type: "string" } },
            "text/html": { schema: { type: "string" } },
          },
        },
        Unauthorized: {
          description: "Unauthorized",
        },
        NotFound: {
          description: "The specified resource was not found",
        },
        ServiceUnaviable: {
          description: "Service Unaviable",
        },
      },
    },
  },
  defaults: {
    responses: {
      200: {
        $ref: "#/components/responses/Success",
      },
      401: {
        $ref: "#/components/responses/Unauthorized",
      },
      404: {
        $ref: "#/components/responses/NotFound",
      },
      503: { $ref: "#/components/responses/ServiceUnaviable" },
    },
  },
});
```
