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
);
describe("checking that it is running with false", () => {
    it("serves custom endpoint", async () => {
        const {
            headers,
            status
        } = await GET("/user/$metadata", {});
        expect(status).to.equal(200);
    });
});