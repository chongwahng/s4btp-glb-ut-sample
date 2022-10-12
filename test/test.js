const cds = require("@sap/cds/lib");
const { expect, GET, POST, PATCH, DEL, data } = cds.test("serve", "--in-memory", "--project", `${__dirname}/..`)

describe("running simple unit test", () => {
    beforeAll(async () => {
        const db = await cds.connect.to('db')
        const { Users } = db.model.entities('db')
        await db.create(Users).entries([
            { ID: 'USR01', name: 'user 1 created in cds.test', dateOfBirth: '1990-01-20', email: 'usr01@gmail.com', isLock: false },
            { ID: 'USR02', name: 'user 2 created in cds.test', dateOfBirth: '1992-02-20', email: 'usr02@gmail.com', isLock: false }
        ])
    })

    it('[Test]: service APIs', async () => {
        const UserService = await cds.connect.to('UserService')
        const { Users } = UserService.entities
        expect(await SELECT.from(Users))
            .to.eql(await UserService.read(Users))
            .to.eql(await UserService.run(SELECT.from(Users)))
    })

    it("[Test]: serves $metadata documents in v4", async () => {
        const { headers, status, data } = await GET(`/user/$metadata`);
        expect(status).to.equal(200);
        expect(headers).to.contain({
            'content-type': 'application/xml',
            'odata-version': '4.0',
        })
        expect(data).to.contain('EntitySet Name="Users" EntityType="UserService.Users"')
    })

    it('[Test]: serves /user/Users', async () => {
        const { data } = await GET(`/user/Users`)
        expect(data.value).to.eql([
            { ID: 'USR01', name: 'user 1 created in cds.test', dateOfBirth: '1990-01-20', email: 'usr01@gmail.com', isLock: false },
            { ID: 'USR02', name: 'user 2 created in cds.test', dateOfBirth: '1992-02-20', email: 'usr02@gmail.com', isLock: false }
        ])
    })

    it('[Test]: supports $select', async () => {
        const { data } = await GET(`/user/Users`, {
            params: { $select: `ID, name, email` }
        })
        expect(data.value).to.eql([
            { ID: 'USR01', name: 'user 1 created in cds.test', email: 'usr01@gmail.com' },
            { ID: 'USR02', name: 'user 2 created in cds.test', email: 'usr02@gmail.com' }
        ])
    })
})