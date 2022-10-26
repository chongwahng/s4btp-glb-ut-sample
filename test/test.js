const cds = require("@sap/cds/lib");
const { expect, GET, POST, PATCH, DEL, axios } = cds.test("serve", "--in-memory", "--project", `${__dirname}/..`)

describe("***** Running unit test *****", () => {
    beforeAll(async () => {
        const db = await cds.connect.to('db')
        const { Users } = db.model.entities('db')

        await db.delete(Users)
        await db.create(Users).entries([
            { ID: 'USR01', name: 'user 1 created in cds.test', dateOfBirth: '1990-01-20', email: 'usr1@gmail.com', isLock: false, company: 'AU01' },
            { ID: 'USR02', name: 'user 2 created in cds.test', dateOfBirth: '1990-02-20', email: 'usr2@gmail.com', isLock: false, company: 'AU01' },
            { ID: 'USR03', name: 'user 3 created in cds.test', dateOfBirth: '1990-03-20', email: 'usr3@gmail.com', isLock: false, company: 'AU01' },
            { ID: 'USR04', name: 'user 4 created in cds.test', dateOfBirth: '1990-04-20', email: 'usr4@gmail.com', isLock: false, company: 'AU01' },
            { ID: 'USR05', name: 'user 5 created in cds.test', dateOfBirth: '1990-05-20', email: 'usr5@gmail.com', isLock: false, company: 'AU01' },
        ])
    })

    it('[Test]: service APIs', async () => {
        const UserService = await cds.connect.to('UserService')
        const { Users } = UserService.entities
        expect(await SELECT.from(Users))
            //.to.eql(await UserService.read(Users))
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
            { ID: 'USR01', name: 'user 1 created in cds.test', dateOfBirth: '1990-01-20', email: 'usr1@gmail.com', isLock: false, company: 'AU01' },
            { ID: 'USR02', name: 'user 2 created in cds.test', dateOfBirth: '1990-02-20', email: 'usr2@gmail.com', isLock: false, company: 'AU01' },
            { ID: 'USR03', name: 'user 3 created in cds.test', dateOfBirth: '1990-03-20', email: 'usr3@gmail.com', isLock: false, company: 'AU01' },
            { ID: 'USR04', name: 'user 4 created in cds.test', dateOfBirth: '1990-04-20', email: 'usr4@gmail.com', isLock: false, company: 'AU01' },
            { ID: 'USR05', name: 'user 5 created in cds.test', dateOfBirth: '1990-05-20', email: 'usr5@gmail.com', isLock: false, company: 'AU01' },
        ])
    })

    it(`[Test]: serves /user/lockAccount('USR01')`, async () => {
        await POST(`/user/lockAccount`, {
            id: 'USR01'
        })
        const { data } = await GET(`/user/Users('USR01')`, {
            params: { $select: `isLock` }
        })
        expect(data.isLock).to.eql(true)
    })

    it(`[Test]: serves /user/unlockAccount('USR01')`, async () => {
        await POST(`/user/unlockAccount`, {
            id: 'USR01'
        })
        const { data } = await GET(`/user/Users('USR01')`, {
            params: { $select: `isLock` }
        })
        expect(data.isLock).to.eql(false)
    })

    it('[Test]: supports $select', async () => {
        const { data } = await GET(`/user/Users`, {
            params: { $select: `ID,name,email` }
        })
        expect(data.value).to.eql([
            { ID: 'USR01', name: 'user 1 created in cds.test', email: 'usr1@gmail.com' },
            { ID: 'USR02', name: 'user 2 created in cds.test', email: 'usr2@gmail.com' },
            { ID: 'USR03', name: 'user 3 created in cds.test', email: 'usr3@gmail.com' },
            { ID: 'USR04', name: 'user 4 created in cds.test', email: 'usr4@gmail.com' },
            { ID: 'USR05', name: 'user 5 created in cds.test', email: 'usr5@gmail.com' }
        ])
    })

    it('[Test]: supports $top/$skip paging', async () => {
        const { data: p1 } = await GET(`/user/Users?$select=name&$top=3`)
        expect(p1.value).to.eql([
            { ID: 'USR01', name: 'user 1 created in cds.test' },
            { ID: 'USR02', name: 'user 2 created in cds.test' },
            { ID: 'USR03', name: 'user 3 created in cds.test' }
        ])

        const { data: p2 } = await GET(`/user/Users?$select=name&$skip=3`)
        expect(p2.value).to.eql([
            { ID: 'USR04', name: 'user 4 created in cds.test' },
            { ID: 'USR05', name: 'user 5 created in cds.test' }
        ])
    })
})