"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const shared_prisma_client_1 = require("@my-fullstack-repo/shared-prisma-client");
const shared_prisma_types_1 = require("@my-fullstack-repo/shared-prisma-types");
const bcrypt = __importStar(require("bcrypt"));
async function main() {
    console.log('Seeding database...');
    // Delete all existing users
    await shared_prisma_client_1.prisma.user.deleteMany({});
    console.log('Deleted all existing users');
    const users = [];
    for (let i = 1; i <= 20; i++) {
        users.push({
            email: `user${i}@example.com`,
            password: await bcrypt.hash('password123', 10),
            firstName: `User${i}`,
            lastName: 'Test',
            role: shared_prisma_types_1.Role.USER,
            dob: new Date(1990, i % 12, i),
            address: `Address ${i}`,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }
    for (let i = 1; i <= 10; i++) {
        users.push({
            email: `admin${i}@example.com`,
            password: await bcrypt.hash('adminpass', 10),
            firstName: `Admin${i}`,
            lastName: 'Test',
            role: shared_prisma_types_1.Role.ADMIN,
            dob: new Date(1985, i % 12, i),
            address: `Admin Address ${i}`,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }
    // Insert all users
    await shared_prisma_client_1.prisma.user.createMany({
        data: users,
        skipDuplicates: true, // optional
    });
    console.log('Inserted 30 users (20 users + 10 admins)');
    console.log('Seeding database finished successfully...');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await shared_prisma_client_1.prisma.$disconnect();
});
