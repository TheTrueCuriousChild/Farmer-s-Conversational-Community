//LABORER
db.createCollection("laborers", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "phone", "skills", "availability", "location", "createdAt"],
      properties: {
        _id: {
          bsonType: "objectId",
          description: "Auto-generated unique ID"
        },
        name: {
          bsonType: "string",
          minLength: 2,
          maxLength: 100,
          description: "Full name of the laborer - required"
        },
        phone: {
          bsonType: "string",
          pattern: "^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\\s\\./0-9]*$",
          description: "Primary contact number - required and unique"
        },
        alternatePhone: {
          bsonType: "string",
          pattern: "^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\\s\\./0-9]*$",
          description: "Secondary contact number"
        },
        skills: {
          bsonType: "array",
          items: {
            bsonType: "string",
            enum: ["planting", "harvesting", "irrigation", "pruning", "pest_control", "machine_operation", "packing", "other"]
          },
          minItems: 1,
          description: "At least one skill required"
        },
        experience: {
          bsonType: "int",
          minimum: 0,
          description: "Years of experience"
        },
        availability: {
          bsonType: "string",
          enum: ["full_time", "part_time", "seasonal", "available", "not_available"],
          default: "available"
        },
        location: {
          bsonType: "object",
          required: ["coordinates", "address"],
          properties: {
            type: {
              bsonType: "string",
              enum: ["Point"],
              default: "Point"
            },
            coordinates: {
              bsonType: "array",
              items: {
                bsonType: "double",
                minimum: -180,
                maximum: 180
              }
            },
            address: {
              bsonType: "string"
            },
            village: { bsonType: "string" },
            district: { bsonType: "string" }
          }
        },
        wageExpectation: {
          bsonType: "object",
          properties: {
            daily: { bsonType: "double", minimum: 0 },
            hourly: { bsonType: "double", minimum: 0 },
            currency: { bsonType: "string", default: "INR" }
          }
        },
        documents: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              type: { bsonType: "string" },
              number: { bsonType: "string" },
              verified: { bsonType: "bool", default: false }
            }
          }
        },
        rating: {
          bsonType: "double",
          minimum: 0,
          maximum: 5,
          description: "Average rating from employers"
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
          enum: ["available", "working", "not_available", "blacklisted"],
          default: "available"
        }
      }
    }
  }
});
db.laborers.createIndex({ phone: 1 }, { unique: true });
db.laborers.createIndex({ "location.coordinates": "2dsphere" });
db.laborers.createIndex({ skills: 1 });
db.laborers.createIndex({ availability: 1 });
db.laborers.createIndex({ status: 1 });
