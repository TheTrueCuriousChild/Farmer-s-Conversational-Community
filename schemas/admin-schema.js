//ADMIN
db.createCollection("admins", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["username", "email", "passwordHash", "role", "createdAt"],
      properties: {
        _id: {
          bsonType: "objectId",
          description: "Auto-generated unique ID"
        },
        username: {
          bsonType: "string",
          minLength: 3,
          maxLength: 50,
          pattern: "^[a-zA-Z0-9_]+$",
          description: "Unique username - required"
        },
        email: {
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
          description: "Professional email address - required and unique"
        },
        passwordHash: {
          bsonType: "string",
          description: "Hashed password - required"
        },
        role: {
          bsonType: "string",
          enum: ["super_admin", "regional_admin", "support_admin", "audit_admin"],
          description: "Admin role level - required"
        },
        personalInfo: {
          bsonType: "object",
          properties: {
            firstName: { bsonType: "string" },
            lastName: { bsonType: "string" },
            phone: { bsonType: "string" }
          }
        },
        permissions: {
          bsonType: "array",
          items: {
            bsonType: "string",
            enum: ["user_management", "content_management", "reporting", "system_config", "audit_logs"]
          },
          description: "Specific permissions for this admin"
        },
        lastLogin: {
          bsonType: "date",
          description: "Timestamp of last successful login"
        },
        loginAttempts: {
          bsonType: "int",
          minimum: 0,
          default: 0
        },
        lockedUntil: {
          bsonType: "date",
          description: "Account lock expiration time"
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
          enum: ["active", "inactive", "locked"],
          default: "active"
        }
      }
    }
  }
});
db.admins.createIndex({ username: 1 }, { unique: true });
db.admins.createIndex({ email: 1 }, { unique: true });
db.admins.createIndex({ role: 1 });
db.admins.createIndex({ status: 1 });
