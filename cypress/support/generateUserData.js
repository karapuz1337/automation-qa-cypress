import { faker } from "@faker-js/faker";

// Helper function to create valid credentials
export const generateUserData = () => {
    // Generate unique email to avoid duplicates
    const timeStamp = Date.now();
    const randomString = faker.string.alphanumeric(5);
    const email = `test-${timeStamp}-${randomString}@test.com`;

    // Generate password: "Qwerty@" (7 chars) + number (1-8 digits) = 8-15 chars total
    const randomNumber = faker.number.int({ min: 1, max: 99999999 }); // 1-8 digits
    const password = `Qwerty@${randomNumber}`;


    return {
        // Trim name and lastName of any symbols
        name: faker.person.firstName().replace(/[^a-zA-Z]/g, ""),
        lastName: faker.person.lastName().replace(/[^a-zA-Z]/g, ""),
        email,
        password,
        repeatPassword: password
    };
};