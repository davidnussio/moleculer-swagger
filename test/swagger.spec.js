const { ServiceBroker } = require("moleculer");
const Swagger = require("../src/swagger.mixin");

describe("Create a Swagger service without settings", () => {
  const broker = new ServiceBroker({
    transporter: "Fake",
    nodeID: "node-1",
    logger: false,
  });

  const SwaggerService = {
    name: "swagger",
    mixins: [Swagger()],
  };

  broker.createService(SwaggerService);

  beforeAll(() => broker.start());
  afterAll(() => broker.stop());

  test("Mixin should register an openapi action", () => {
    const localService = broker.getLocalService("swagger");
    expect(localService.fullName).toEqual("swagger");
    expect(localService.actions.openapi).not.toBeUndefined();
  });

  test("Mixin should register an openapi action", async () => {
    const response = await broker.call("swagger.openapi");
    expect(response).toMatchInlineSnapshot(`
      Object {
        "components": Object {
          "responses": Object {
            "NotFound": Object {
              "description": "The specified resource was not found",
            },
            "ServiceUnaviable": Object {
              "description": "Service Unaviable",
            },
            "Success": Object {
              "content": Object {
                "application/json": Object {
                  "schema": Object {
                    "type": "string",
                  },
                },
                "text/html": Object {
                  "schema": Object {
                    "type": "string",
                  },
                },
              },
              "description": "Successful operation",
            },
            "Unauthorized": Object {
              "description": "Unauthorized",
            },
          },
        },
        "info": Object {
          "contact": Object {
            "email": "apiteam@swagger.io",
          },
          "description": "A short description of the API. CommonMark syntax MAY be used for rich text representation.",
          "license": Object {
            "name": "Apache 2.0",
            "url": "http://www.apache.org/licenses/LICENSE-2.0.html",
          },
          "termsOfService": "http://swagger.io/terms/",
          "title": "The title of the API.",
          "version": "3.0.3",
        },
        "openapi": "3.0.3",
        "paths": Object {},
      }
    `);
  });

  describe("Create service-1 and service-2 with decorated actions", () => {
    beforeAll(async () => {
      await broker.createService({
        name: "service-1",
        actions: {
          list: {
            rest: "GET /",
            handler() {},
          },
        },
      });
      await broker.createService({
        name: "service-2",
        actions: {
          list: {
            rest: "GET /",
            handler() {},
          },
          get: {
            rest: "GET /:id",
            params: { id: "string" },
            handler() {},
          },
          complex: {
            rest: "GET /complex/:id/case/:type",
            params: {
              id: "string",
              type: "number",
              filter: { type: "array", items: "string" },
            },
            handler() {},
          },
        },
      });
      await broker.start();
    });
    afterAll(() => broker.stop());

    test("Mixin should register an openapi action", async () => {
      const response = await broker.call("swagger.openapi");
      expect(response).toMatchSnapshot();
    });

    test("Mixin should register an openapi action", async () => {
      const response = await broker.call("swagger.openapi");
      expect(response).toMatchSnapshot();
    });
  });
});
