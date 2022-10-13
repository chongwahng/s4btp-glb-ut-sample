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
}