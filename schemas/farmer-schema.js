// FARMER
db.createCollection("farmers", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "email", "phone", "farmLocation", "createdAt"],
      properties: {
        _id: {
          bsonType: "objectId",
          description: "Auto-generated unique ID"
        },
        name: {
          bsonType: "string",
          minLength: 2,
          maxLength: 100,
          description: "Full name of the farmer - required"
        },
        email: {
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
          description: "Valid email address - required and unique"
        },
        phone: {
          bsonType: "string",
          pattern: "^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\\s\\./0-9]*$",
          description: "Phone number with country code - required"
        },
        farmLocation: {
          bsonType: "object",
          required: ["coordinates", "address"],
          properties: {
            type: {
              bsonType: "string",
              enum: ["Point"],
              default: "Point",
              description: "GeoJSON type - always Point"
            },
            coordinates: {
              bsonType: "array",
              items: {
                bsonType: "double",
                minimum: -180,
                maximum: 180
              },
              description: "[longitude, latitude]"
            },
            address: {
              bsonType: "string",
              description: "Physical address"
            }
          }
        },
        farmSize: {
          bsonType: "double",
          minimum: 0,
          description: "Farm size in acres"
        },
        crops: {
          bsonType: "array",
          items: {
            bsonType: "string",
            enum: ["wheat", "rice", "corn", "vegetables", "fruits", "cotton", "other"]
          },
          description: "Types of crops grown"
        },
        certification: {
          bsonType: "string",
          enum: ["organic", "non-organic", "in-transition", "not-certified"],
          default: "not-certified"
        },
        createdAt: {
          bsonType: "date",
          description: "Registration timestamp - required"
        },
        updatedAt: {
          bsonType: "date",
          description: "Last update timestamp"
        },
        status: {
          bsonType: "string",
          enum: ["active", "inactive", "suspended"],
          default: "active"
        }
      }
    }
  }
});

db.farmers.createIndex({ email: 1 }, { unique: true });
db.farmers.createIndex({ "farmLocation.coordinates": "2dsphere" });
db.farmers.createIndex({ status: 1 });
