const { retrieveJwt, decodeJwtComplete } = require("@sap-cloud-sdk/core")

module.exports = async function (srv) {
    const cds = require('@sap/cds')

    srv.on('lockAccount', async (req) => {
        const { Users } = cds.entities
        let query = UPDATE(Users).set({ isLock: true }).where({ ID: req.data.id })
        await cds.run(query)
    })

    srv.on('unlockAccount', async (req) => {
        const { Users } = cds.entities
        let query = UPDATE(Users).set({ isLock: false }).where({ ID: req.data.id })
        await cds.run(query)
    })

    srv.on("myUserInfo", async (req) => {
        let token = retrieveJwt(req)

        console.log(`*** user data -> ${JSON.stringify(req.user)}`)

        if (token) {
            let decodedJWT = decodeJwtComplete(token)
            console.log(decodedJWT)
            console.log(`*** JWT payload.xs.user.attributes -> ${JSON.stringify(decodedJWT.payload["xs.user.attributes"])}`)
            return JSON.stringify(decodedJWT)
        }
    })
}