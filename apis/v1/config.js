module.exports = {
  version: 1,
  baseUri: "/api/v1",
  policies:["cors","authorized"],
  resources: {
    items: {
      uri: "/items",
      // middleware executed on all routes
      policies: ["authorized"],
      endpoints: {
        "/": {
          controller:"index",
          method: "get",
          // middleware executed specifically on this route
          policies: ["authorized","cookies"],
          // params to be validated, and sanitized to their types
          params: {
            // required for type saftey
            required: {},
            optional: {
              offset: {
                type: "number",
                dependsOn: "limit"
              },
              limit: {
                type: "number",
                dependsOn: "offset"
              }
            }
          },
          // Attributes && type checking
          // for API respons
          // can be extended by model
          responseSchema: {
            // extendedBy:itemModel
            id: "string",
            name: "string",
          }
        },
        "/:id": {
          method: "get",
          policies: [],
          params: {
            // if required
            required: {
              upc: {
                type: "number",
                or: "id"
              },
              id: {
                type: "string",
                or: "upc"
              }
            },
            optional: {}
          }
        }
      }
    }
  }
}