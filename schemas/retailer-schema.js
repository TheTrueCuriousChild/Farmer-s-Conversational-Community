//RETAILER
db.createCollection("retailers", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["businessName", "contactEmail", "phone", "businessAddress", "createdAt"],
      properties: {
        _id: {
          bsonType: "objectId",
          description: "Auto-generated unique ID"
        },
        businessName: {
          bsonType: "string",
          minLength: 2,
          maxLength: 200,
          description: "Official business name - required"
        },
        contactEmail: {
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
          description: "Business email address - required and unique"
        },
        phone: {
          bsonType: "string",
          pattern: "^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\\s\\./0-9]*$",
          description: "Business phone number - required"
        },
        businessAddress: {
          bsonType: "object",
          required: ["street", "city", "state", "country", "zipCode"],
          properties: {
            street: { bsonType: "string" },
            city: { bsonType: "string" },
            state: { bsonType: "string" },
            country: { bsonType: "string" },
            zipCode: { bsonType: "string" }
          }
        },
        businessType: {
          bsonType: "string",
          enum: ["supermarket", "grocery_store", "online_store", "wholesaler", "restaurant", "other"],
          default: "other"
        },
        licenseNumber: {
          bsonType: "string",
          description: "Business license number"
        },
        taxID: {
          bsonType: "string",
          description: "Tax identification number"
        },
        contactPerson: {
          bsonType: "object",
          properties: {
            name: { bsonType: "string" },
            position: { bsonType: "string" },
            mobile: { bsonType: "string" }
          }
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
          enum: ["active", "inactive", "pending_verification", "suspended"],
          default: "pending_verification"
        },
        rating: {
          bsonType: "double",
          minimum: 0,
          maximum: 5,
          description: "Average rating from farmers"
        }
      }
    }
  }
});

db.retailers.createIndex({ contactEmail: 1 }, { unique: true });
db.retailers.createIndex({ businessName: 1 });
db.retailers.createIndex({ "businessAddress.city": 1, "businessAddress.state": 1 });
db.retailers.createIndex({ status: 1 });
