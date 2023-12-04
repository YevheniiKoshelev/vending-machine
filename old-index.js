prompt = require('prompt-sync')()

money = 0;

soda = function(){
    inventory = [{
        name: "coke",
        nr: 5
    },{
        name: "sprite",
        nr: 3
    },{
        name: "fanta",
        nr: 3
    }];

    while(true){
        console.log("\n\nAvailable commands:")
        console.log("insert (money) - Money put into money slot")
        console.log("order (coke, sprite, fanta) - Order from machines buttons")
        console.log("sms order (coke, sprite, fanta) - Order sent by sms")
        console.log("recall - gives money back")
        console.log("-------")
        console.log("Inserted money: " + money)
        console.log("-------")

        var input = prompt();
        if (input.startsWith("insert"))
        {
            //Add to credit
            money += parseInt(input.split(' ')[1]);
            console.log("Adding " + parseInt(input.split(' ')[1]) + " to credit");
        }
        if (input.startsWith("order"))
        {
            // split string on space
            var csoda = input.split(' ')[1];
            //Find out witch kind
            switch (csoda)
            {
                case "coke":
                    var coke = inventory[0];
                    if (coke.name == csoda && money > 19 && coke.nr > 0)
                    {
                        console.log("Giving coke out");
                        money -= 20;
                        console.log("Giving " + money + " out in change");
                        money = 0;
                        coke.nr--;
                    }
                    else if (coke.name == csoda && coke.nr == 0)
                    {
                        console.log("No coke left");
                    }
                    else if (coke.name == csoda)
                    {
                        console.log("Need " + (20 - money) + " more");
                    }

                    break;
                case "fanta":
                    var fanta = inventory[2];
                    if (fanta.name == csoda && money > 14 && fanta.nr >= 0)
                    {
                        console.log("Giving fanta out");
                        money -= 15;
                        console.log("Giving " + money + " out in change");
                        money = 0;
                        fanta.nr--;
                    }
                    else if (fanta.name == csoda && fanta.nr == 0)
                    {
                        console.log("No fanta left");
                    }
                    else if (fanta.name == csoda)
                    {
                        console.log("Need " + (15 - money) + " more");
                    }

                    break;
                case "sprite":
                    var sprite = inventory[1];
                    if (sprite.name == csoda && money > 14 && sprite.nr > 0)
                    {
                        console.log("Giving sprite out");
                        money -= 15;
                        console.log("Giving " + money + " out in change");
                        money = 0;
                        sprite.nr--;
                    }
                    else if (sprite.name == csoda && sprite.nr == 0)
                    {
                        console.log("No sprite left");
                    }
                    else if (sprite.name == csoda)
                    {
                        console.log("Need " + (15 - money) + " more");
                    }
                    break;
                default:
                    console.log("No such soda");
                    break;
            }
        }
        if (input.startsWith("sms order"))
        {
            var csoda = input.split(' ')[2];
            //Find out witch kind
            switch (csoda)
            {
                case "coke":
                    if (inventory[0].nr > 0)
                    {
                        console.log("Giving coke out");
                        inventory[0].nr--;
                    }
                    break;
                case "sprite":
                    if (inventory[1].nr > 0)
                    {
                        console.log("Giving sprite out");
                        inventory[1].nr--;
                    }
                    break;
                case "fanta":
                    if (inventory[2].nr > 0)
                    {
                        console.log("Giving fanta out");
                        inventory[2].nr--;
                    }
                    break;
            }

        }

        if (input =="recall")
        {
            //Give money back
            console.log("Returning " + money + " to customer");
            money = 0;
        }
    }

}
soda();