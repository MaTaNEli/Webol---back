import { faker } from '@faker-js/faker'

export function createFullUserDetails (){
    return({
        username: faker.internet.userName().toLocaleLowerCase(),
        password: faker.internet.password(),
        fullName: faker.name.findName(),
        email: faker.internet.email()
    })
};