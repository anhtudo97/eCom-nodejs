const redisPubsubService = require("../services/redisPubsub.service")

class InventoryServiceTest {
    constructor() {
        redisPubsubService.subscribe("purchase_event", (channel, message) => {
            InventoryServiceTest.updateInventory(message)
        })
    }

    static updateInventory(productId, quantity) {
        console.log(`Update inventory ${productId} with quantity ${quantity}`)
    }
}

module.exports = new InventoryServiceTest()