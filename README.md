# NEXUS

- NODE JS
- EXPRESS JS
- ANGULAR.JS
- STACK

- socket.io
- redis
- mongodb
- elasticsearch
- mysql
- postgres
- dynamoDB
- elasticcache

Reactive / Realtime Web Applications have more layers
today than ever before. The stack consists of the following

- RESTful API JSON / XML
- Server Capable of handling conncurrent connections
  as well as web sockets
- Client Side application written in JS to make XmlHttp / CORS req
- Client also equiped with web socket library.  Socket.io
- Fast Datastore
- Fast Search Engine

Most frameworks that are being released do not stick to a common convension and often add a learning curve rather than extending what is already available, and creating a convension over configuration like Ruby on Rails. Rails strong suit was that it was simple to get started and there were only a few ways to do things.

Parts of a web framework following MVC
- Models, define the data structure of your apps resources
- Views, create templates for HTML rendering
- Controllers, write logic that will communicate between the view, and the model

Model -> DB
Controller -> Model -> Controller -> View -> User

Views for dynamic web pages have typically been rendered by the server with content
pre populated, client side frameworks like Angular.js and Backbone.js have made it simple to make a call to your server and gather partial HTML files to construct a page, reducing the number of page loads required, however increasing the complexity of the front end. This isn't completely nessicary for new applications, but it is useful if you plan on introducing a lot of functionality to make the users expereince feel more like a desktop application.

So, how do we standardize this for Node.JS?
Pick a convention and stick with it!

- Client Side:     Angular.js
- Server Side:     Express.js
- Template Engine: Jade
- LESS for CSS:    Less

Possible support for coffee-script later. Note* NodeJS is much easier to debug when running compiled JavaScript.

- Standardize API schemas to ensure consistancy.
  Put configurations in middleware for each route, and define an API structure.
  This will ensure your API type safety, field consistency, and whitelists values so nothing that isnt supposed to be seen slips through the cracks.

Lets build a smart API. What if we could define a spec, and it would take care of all the heavy lifting

- response type / field checking white / black listing
- request param validations and sanitization
- developer productivity <3

```javascript
// API Schema
{
  title:"Nutritionix API",
  version:1,
  baseUri:"/api/v1"
  resources:{
    items:{
      uri:"/items"
      // middleware executed on all routes
      policies:[],
      endpoints:{
        "/":{
          method:"get",
          // middleware executed specifically on this route
          policies:[],
          // params to be validated, and sanitized to their types
          params:{
            // required for type saftey
            required:{},
            optional:{
              offset:{
                type:Number,
                dependsOn:"limit"
              },
              limit:{
                type:Number,
                dependsOn:"offset"
              }
            }
          },
          // Attributes && type checking
          // for API respons
          // can be extended by model
          responseSchema:{
            // extendedBy:itemModel
            id:String,
            name:String,
          }
        },
        "/:id":{
          method:"get",
          policies:[],
          params:{
            // if required
            required:{
              upc:{
                type:Number,
                or:"id"
              },
              id:{
                type:String,
                or:"upc"
              }
            },
            optional:{}
          }
        }
      }
    }
  }
}
```


- API schemas need to be extendable by Models, and it should allow white / black listing
  of values.

- API schemas also need to include error_handling templates.

- Error Handling: A configuration file should hold a base schema of an error_message, as
  well as a list of error responses that fit the schema that can be called to avoid duplication. Otherwise you can send a custom error
  constructor function that will have methods matching the schema, and will validate that those fields were populated.

```javascript
{
  // all fields required
  schema:{
    code:Number,
    message:String,
    more_info_url:String
  },
  // Contructor to build new error
  newError:function(){

  },
  // Pre Defined Error Responses
  definitions:{
    item_not_found:{
      code: 401,
      message: "An item could not be found with the request details",
      more_info_url : "http://developer.nutritionix.com.com/help/errors/item_not_found",
      // Optional Debugging Info
      params:{
        // object containing query string attrs
        qs:{},
        // object containing JSON req body
        body:{},
        // object containing info on any uploaded files,
        files:{}
      }
    }
  }
}
```