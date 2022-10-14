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

    srv.on("userInfo", async (req) => {
        var token = retrieveJwt(req)

        console.log(`User data -> ${JSON.stringify(req.user)}`)
        console.log(`User ID -> ${req.user.id}`)
        console.log(`User attr -> ${JSON.stringify(req.user.attr)}`)
        console.log(`Is user authenticated? ${req.user.is('authenticated-user')}`)
        console.log(`Is system-user? ${req.user.is('system-user')}`)
        console.log(`Is internal-user? ${req.user.is('internal-user')}`)

        if (token) {
            var decodedJWT = decodeJwtComplete(token)
            console.log(decodedJWT)
            return JSON.stringify(decodedJWT)
        }
    })
}