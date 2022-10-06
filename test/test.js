const cds = require("@sap/cds/lib");
const {
    expect,
    GET,
    POST,
    PATCH,
    DEL,
    data
} = cds.test(
    "serve",
    "--in-memory",
    "--project",
    `${__dirname}/..`
)
axios.defaults.auth = { username: 'alice', password: 'admin' }

describe("checking that it is running with false", () => {

    it('Allows testing programmatic APIs', async () => {
        const UserService = await cds.connect.to('UserService')
        const { Users } = UserService.entities
        expect(await SELECT.from(Users))
            .to.eql(await UserService.read(Users))
            .to.eql(await UserService.run(SELECT.from(Users)))
    })

    it("serves custom endpoint", async () => {
        const {
            headers,
            status
        } = await GET("/user/$metadata", {});
        expect(status).to.equal(200);
    })
})