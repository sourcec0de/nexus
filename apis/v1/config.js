module.exports = {
  version: 1,
  baseUri: "/api/v1",
  policies:["cors","authorized"],
  resources: {
    items: {
      uri: "/items",
      // middleware executed on all item routes
      policies: ["authorized"],
      endpoints: {
        "/": {
          controller:"index",
          method: "get",
          // middleware executed specifically on this route
          policies: ["authorized","cookies"],
          // params to be validated, and sanitized to their types
          params: {},
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
          controller:"show",
          method: "get",
          policies: [],
          params: {
            upc:{
              notEmpty:{
                args:null,
                msg:"cannot be empty"
              },
              isInt:{
                args:null,
                msg:"must be a valid integer"
              },
              len:{
                args:[6,12],
                msg:"must have between 6 and 12 chars"
              },
              isIn:{
                args:[[123456]],
                msg:"must be one of [123456]"
              }
            }
          }
        }
      }
    }
  }
}