import promptSync from "prompt-sync";

type ProductAmount = number;
type Money = number;

enum ProductNames {
    coke = 'coke',
    sprite = 'sprite',
    fanta = 'fanta'
}

enum ProductPrices {
    coke = 20,
    sprite = 15,
    fanta = 15
}

enum Commands {
    insert = 'insert',
    recall = 'recall',
    order = 'order',
    sms = 'sms order'
}

class Display {
    displayOptions(money: Money): void {
        console.log("\n\nAvailable commands:");
        console.log("insert (money) - Money put into money slot");
        console.log("order (coke, sprite, fanta) - Order from machines buttons");
        console.log("sms order (coke, sprite, fanta) - Order sent by sms");
        console.log("recall - gives money back");
        console.log("-------");
        console.log("Inserted money: " + money);
        console.log("-------");
    }

    recall(money: Money): void {
        console.log(`Returning ${money} to customer`);
    }

    insertMoney(money: Money): void {
        console.log(`Adding ${money} to credit`);
    }

    giveProductOut(productName: ProductNames) {
        console.log(`Giving ${productName} out`);
    }

    giveChange(money: Money) {
        console.log("Giving " + money + " out in change");
    }

    emptyProductInventory(productName: ProductNames) {
        console.log(`No ${productName} left`);
    }

    unexpectedProduct() {
        console.log("No such soda");
    }

    invalidCommand() {
        console.log("Invalid command");
    }

    notEnoughMoney(money: Money) {
        console.log(`Need ${money} more`);
    }

}

class Inventory {
    products: Map<ProductNames, ProductAmount>;

    constructor() {
        this.products = new Map();
    }

    addProduct(name: ProductNames, amount: ProductAmount): void {
        this.products.set(name, this.getProductAmount(name) + amount)
    }

    giveProduct(name: ProductNames) {
        if (this.getProductAmount(name)) {
            this.products.set(name, this.getProductAmount(name) - 1)
        }
    }

    getProductAmount(name: ProductNames): ProductAmount {
        return this.products.get(name) || 0;
    }
}

class SodaMachine {
    private readonly inventory: Inventory = new Inventory();
    private readonly display: Display = new Display();
    private money: Money = 0;
    private productMap: Map<string, number>;
    private prompt: any;

    constructor() {
        this.prompt = promptSync({ sigint: true });
        this.productMap = this.generateProductMap(ProductNames, ProductPrices);

        this.inventory.addProduct(ProductNames.coke, 5);
        this.inventory.addProduct(ProductNames.fanta, 3);
        this.inventory.addProduct(ProductNames.sprite, 3);
    }

    private generateProductMap(
        names: typeof ProductNames,
        prices: typeof ProductPrices
    ): Map<string, number> {
        const productMap = new Map<string, number>();

        Object.values(names).forEach((productName) => {
            const productPrice = prices[productName];

            productMap.set(productName, productPrice);
        });

        return productMap
    }

    insertMoney(amount: string): void {
        const money = Math.abs(parseInt(amount, 10));

        if (money) {
            this.money += money;
            this.display.insertMoney(this.money)
        }
    }

    giveSoda(productName: ProductNames, isRemote?: boolean): void {
        const price = this.productMap.get(productName);

        if (!price) {
            return;
        }

        if (this.money >= price) {
            this.money -= price;
            this.display.giveProductOut(productName);
            this.inventory.giveProduct(productName);

            if (!isRemote) {
                this.display.giveChange(this.money);
                this.money = 0;
            }

        } else {
            this.display.notEnoughMoney(price - this.money);
        }
    }

    processOrder(productName: ProductNames, isRemote?: boolean): void {
        if (Object.values(ProductNames).includes(productName)) {
            const soda = this.inventory.getProductAmount(productName);

            if (soda) {
                this.giveSoda(productName, isRemote)
            }
            else {
                this.display.emptyProductInventory(productName);
            }

        } else {
            this.display.unexpectedProduct();
        }
    }

    recall(): void {
        this.display.recall(this.money);
        this.money = 0;
    }

    run(): void {
        while (true) {
            this.display.displayOptions(this.money);
            let input: string = this.prompt().trim();
            let isRemoteOrder = false;

            if (input.startsWith(Commands.sms)) {
                isRemoteOrder = true;
                input = input.replace(Commands.sms, Commands.order);
            }

            const [command, value]: [Commands, string] = input.split(" ") as [Commands, string]

            switch (command) {
                case Commands.insert:
                    this.insertMoney(value);
                    break;
                case Commands.recall:
                    this.recall();
                    break;
                case Commands.order:
                    this.processOrder(value as ProductNames, isRemoteOrder);
                    break;
                default:
                    this.display.invalidCommand();
            }
        }
    }
}

const sodaMachine = new SodaMachine();
sodaMachine.run();