/**
 * @typedef {import('moleculer').Context} Context
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema
 * @typedef {import('moleculer').ServiceSettingSchema} ServiceSettingSchema
 */

/**
 * TODO: POC of Moleculer mixin to convert internals to openapi
 * @param {SwaggerSettings} swaggerSettings
 * @returns {ServiceSchema}
 */
module.exports = function Swagger(
  swaggerSettings = {
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
  }
) {
  const mergedSwaggerSettings = {
    disabled: true,
    defaults: {},
    ...swaggerSettings,
  };
  return {
    name: "swagger",

    /**
     * Settings
     */
    settings: {
      swagger: mergedSwaggerSettings,
    },

    /**
     * Action Hooks
     */
    hooks: {},

    /**
     * Actions
     */
    actions: {
      openapi: {
        cache: true,
        rest: "GET /",
        /**
         *
         * @param {Context} ctx
         */
        async handler(ctx) {
          const services = await ctx.call("$node.services", {
            skipInternal: true,
            withActions: true,
          });

          const openapiPaths = services.reduce((paths, service) => {
            if (
              service.settings.swagger &&
              service.settings.swagger.disabled === true
            ) {
              return paths;
            }
            Object.values(service.actions)
              .filter(this.filterActions)
              .forEach((actionDefinition) => {
                const [method, restPath] = actionDefinition.rest.split(" ");
                const path = this.getServiceActionPath(service, restPath);

                if (!paths[path]) {
                  paths[path] = {};
                }

                paths[path][method.toLowerCase()] = {
                  summary: actionDefinition.summary || path,
                  ...(actionDefinition.description && {
                    description: actionDefinition.description,
                  }),
                  tags: actionDefinition.tags || [service.name],
                  operationId: actionDefinition.name,
                  parameters: this.getActionParameters(path, actionDefinition),
                  responses:
                    actionDefinition.responses ||
                    this.settings.swagger.defaults.responses,
                };
              });
            return paths;
          }, {});
          return {
            ...this.settings.swagger.openapiSchema,
            paths: { ...openapiPaths },
          };
        },
      },
    },

    /**
     * Methods
     */
    methods: {
      filterActions(actionDefinition) {
        return !!actionDefinition.rest;
      },

      getServiceActionPath(service, restPath) {
        let path = "";
        if (service.version && !service.$noVersionPrefix) {
          path += `/v${service.version}`;
        }

        if (!service.$noServiceNamePrefix) {
          path += `/${service.name}`;
        }

        path += restPath.replace(/\/:([^/]+)/g, "/{$1}");

        return path;
      },

      validationStringParser(def) {
        const [type] = def.split("|");

        return {
          type,
          optional: false,
          // ...rest.reduce((acc, cur) => {
          //   const [key, val] = cur.split(":");
          //   acc[key] = val;
          //   return acc;
          // }, {}),
        };
      },

      getActionParameters(path, actionDefinition) {
        const getParameters = Object.keys(
          actionDefinition.params || {}
        ).flatMap((name) =>
          (Array.isArray(actionDefinition.params[name])
            ? actionDefinition.params[name]
            : [actionDefinition.params[name]]
          ).map((def) => {
            const objectifyDef = {}.hasOwnProperty.call(def, "type")
              ? def
              : this.validationStringParser(def);
            return {
              name,
              in: path.search(`{${name}}`) !== -1 ? "path" : "query",
              required: !objectifyDef.optional,
              schema: {
                type: objectifyDef.type,
                ...(objectifyDef.items && {
                  items: { type: objectifyDef.items },
                }),
              },
            };
          })
        );
        return getParameters;
      },
    },

    events: {
      "$services.changed": (ctx) => {
        if (ctx.broker.cacher) {
          ctx.broker.cacher.clean("swagger.openapi:**");
        }
      },
    },
  };
};
