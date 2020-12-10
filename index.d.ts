declare namespace MoleculerSwagger {
  type OpenapiSchemaContect = { name?: string; url?: string; email?: string };

  type OpenapiSchemaLicense = { name: string; url?: string };

  type OpenapiSchemaServers = {
    url: string;
    description?: string;
    variables?: Array<any>;
  };

  type OpenapiSchemaInfo = {
    title: string;
    description?: string;
    termsOfService?: string;
    contact?: OpenapiSchemaContect;
    license?: OpenapiSchemaLicense;
    version: string;
  };

  type OpenapiVersion = "3.0.3";

  interface OpenapiSchema {
    openapi: OpenapiVersion;
    info: OpenapiSchemaInfo;
    servers?: Array<OpenapiSchemaServers>;
    paths?: any;
    components?: any;
    security?: any;
    tags?: any;
    externalDocs?: any;
  }

  interface SwaggerSettings {
    openapiSchema: OpenapiSchema;
    disabled?: boolean;
    defaults?: any;
  }
}

export = MoleculerSwagger;
