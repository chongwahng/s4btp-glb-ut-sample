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
if (cds.User.default) cds.User.default = cds.User.Privileged // hard core monkey patch
else cds.User = cds.User.Privileged // hard core monkey patch for older cds releases

describe("running simple unit test", () => {
    before(() => { })

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