const { time } = require('console');
const Discord = require('discord.js');

client = new Discord.Client({
    intents: [
     "GUILDS",
     "GUILD_MESSAGES"
    ]
  });

//const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILD] });
const fs = require("fs");
const { stringify } = require('querystring');
const papa = "737595849000878081"
const prefix = "!";

client.on("ready", () => {
    
    console.log("ITS ALIVE");

})



client.on("messageCreate",async message => {

    if (message.content.startsWith(prefix))
    {
        console.log(message.content);
        var args = message.content.substring(prefix.length)
            .toLowerCase()
            .split(" ");
        if (args[0] == "help") 
        {
            helpEmbed = new Discord.MessageEmbed();
            helpEmbed.setTitle("commands")
            helpEmbed.addField("start", "Starts the ecomony",true);
            helpEmbed.addField("daily","get your daily reward",true)
            helpEmbed.addField("balance", "check your balance",true)
            helpEmbed.addField("pay", "give someone money", true)
            helpEmbed.addField("buy", "buy items",true)
            helpEmbed.addField("help", "shows the commands",true)
            helpEmbed.addField("work", "gets you to work",true)
            message.channel.send({embeds: [helpEmbed]})
        }
        if (args[0] == "start")
        {
            var UsersJSON = JSON.parse(fs.readFileSync("./DB/users.json"));

            if (UsersJSON[message.author.id]) 
            {
                let WarningEmbed = new Discord.MessageEmbed();
                WarningEmbed.setTitle("**ERROR!**")
                WarningEmbed.setDescription("bro you already started")
                WarningEmbed.setColor(2347);
                message.channel.send({embeds: [WarningEmbed]});
                return;
            }

            UsersJSON[message.author.id] = {
                bal: 0,
                lastClaim: 0,
                lastWork:0,
                lollipop: 0,
            }
            fs.writeFileSync("./DB/users.json",JSON.stringify(UsersJSON));

            let susscessEmbed = new Discord.MessageEmbed();
            susscessEmbed.setTitle("**SUCCES!!**");
            susscessEmbed.setDescription("welcome comrade to mah ~~pieace of trash~~ encomny. now type" + prefix +"help to get started :)");
            message.channel.send({embeds: [susscessEmbed]});
            return;
        }

        if(args[0] == "daily") {
            let UsersJSON = JSON.parse(fs.readFileSync("./DB/users.json"));

            if (!UsersJSON[message.author.id]){
                let WarningEmbed = new Discord.MessageEmbed();
                WarningEmbed.setTitle("**ERROR!**")
                
                WarningEmbed.setDescription("bro you didn't start yet say " + prefix + "start")
                WarningEmbed.setColor(2347);
                message.channel.send({embeds: [WarningEmbed]});
                return;
            }

            if (Math.floor(new Date().getTime() - UsersJSON[message.author.id].lastClaim) / (1000 * 60 * 60 * 24) < 1)
            {
                let WarningEmbed = new Discord.MessageEmbed();
                WarningEmbed.setTitle("**ERROR!**")
                WarningEmbed.setDescription("you have already claimed today bro")
                WarningEmbed.setColor(2347);
                message.channel.send({embeds: [WarningEmbed]});
                return;
            }
            UsersJSON[message.author.id].bal += 500;
            UsersJSON[message.author.id].lastClaim = new Date().getTime();
            fs.writeFileSync("./DB/users.json", JSON.stringify(UsersJSON));
            let succesEmbed = new Discord.MessageEmbed();
            succesEmbed.setTitle("**SUCCES!!**")
            succesEmbed.setDescription("**YAAAY** you have claimed A daily reward OF 500 MONEY");
            message.channel.send({embeds: [succesEmbed]});
        }
        if (args[0] == "bal" || args[0] == "balance")
        {
            let UsersJSON = JSON.parse(fs.readFileSync("./DB/users.json"));
            if (!UsersJSON[message.author.id]){
                let WarningEmbed = new Discord.MessageEmbed();
                WarningEmbed.setTitle("**ERROR!**")
                
                WarningEmbed.setDescription("bro you didn't start yet say " + prefix + "start")
                WarningEmbed.setColor(2347);
                message.channel.send({embeds: [WarningEmbed]});
                return;
            }

            
            let Mentioned = message.mentions.members.first()
            if (Mentioned) 
            {
                
                if (!UsersJSON[Mentioned.id]) 
                {

                    let WarningEmbed = new Discord.MessageEmbed();
                WarningEmbed.setTitle("**ERROR!**")
                WarningEmbed.setDescription("this human didn't join the econemy")
                WarningEmbed.setColor(2347);
                message.channel.send({embeds: [WarningEmbed]});
                return;

                }

                let moneyEmbed = new Discord.MessageEmbed();
                moneyEmbed.setTitle("Balance")
                moneyEmbed.setDescription(Mentioned.user.username + " have " + UsersJSON[Mentioned.id].bal + " money")
            message.channel.send({embeds: [moneyEmbed]});

            } else {
                moneyEmbed = new Discord.MessageEmbed();
            moneyEmbed.setTitle("Balance")
            moneyEmbed.setDescription("you have " + UsersJSON[message.author.id].bal + " money")
            message.channel.send({embeds: [moneyEmbed]});
            }
            
        }
        if (args[0] == "pay") 
        {
            let UsersJSON = JSON.parse(fs.readFileSync("./DB/users.json"));
            let money = args[1];

            if (!UsersJSON[message.author.id]){
                let WarningEmbed = new Discord.MessageEmbed();
                WarningEmbed.setTitle("**ERROR!**")
                
                WarningEmbed.setDescription("bro you didn't start yet say " + prefix + "start")
                WarningEmbed.setColor(2347);
                message.channel.send({embeds: [WarningEmbed]});
                return;
            }
            if (isNaN(money)){
                let WarningEmbed = new Discord.MessageEmbed();
                WarningEmbed.setTitle("**ERROR!**")
                WarningEmbed.setDescription("please specfiy a number")
                WarningEmbed.setColor(2347);
                message.channel.send({embeds: [WarningEmbed]});
                return;
            }
            if (UsersJSON[message.author.id].bal < money){
                let WarningEmbed = new Discord.MessageEmbed();
                WarningEmbed.setTitle("**ERROR!**")
                WarningEmbed.setDescription("it seems you don't have enough money")
                WarningEmbed.setColor(2347);
                message.channel.send({embeds: [WarningEmbed]});
                return;
            }
            if (money.indexOf(".") != -1 || money.indexOf("-") != -1 || money == 0) { 
                let WarningEmbed = new Discord.MessageEmbed();
                WarningEmbed.setTitle("**ERROR!**")
                WarningEmbed.setDescription("please specify integer value  greater than 0")
                WarningEmbed.setColor(2347);
                message.channel.send({embeds: [WarningEmbed]});
                return;
            }

            let Mentioned = message.mentions.members.first()
            if (!Mentioned) {
                let WarningEmbed = new Discord.MessageEmbed();
                WarningEmbed.setTitle("**ERROR!**")
                WarningEmbed.setDescription("please mention a human")
                WarningEmbed.setColor(2347);
                message.channel.send({embeds: [WarningEmbed]});
                return;
            }

            if (!UsersJSON[Mentioned.id]) {
                let WarningEmbed = new Discord.MessageEmbed();
                WarningEmbed.setTitle("**ERROR!**")
                WarningEmbed.setDescription("this human didn't joined the econemy")
                WarningEmbed.setColor(2347);
                message.channel.send({embeds: [WarningEmbed]});
                return;
            }

            UsersJSON[message.author.id].bal -= parseInt(money);
            UsersJSON[Mentioned.id].bal += parseInt(money);

            fs.writeFileSync("./DB/users.json",JSON.stringify(UsersJSON));

            let succesEmbed = new Discord.MessageEmbed();
            succesEmbed.setTitle("**SUCCES!!**")
            succesEmbed.setDescription("congrats you have given " + money + " to " + Mentioned.user.username);
            message.channel.send({embeds: [succesEmbed]});
            return;
        }

        if (args[0] == "buy")
        {
            let UsersJSON = JSON.parse(fs.readFileSync("./DB/users.json"));

            if (!UsersJSON[message.author.id]){
                let WarningEmbed = new Discord.MessageEmbed();
                WarningEmbed.setTitle("**ERROR!**")
                
                WarningEmbed.setDescription("bro you didn't start yet say " + prefix + "start")
                WarningEmbed.setColor(2347);
                message.channel.send({embeds: [WarningEmbed]});
                return;
            }

            

            if (!UsersJSON[message.author.id]){
                let WarningEmbed = new Discord.MessageEmbed();
                WarningEmbed.setTitle("**ERROR!**")
                
                WarningEmbed.setDescription("bro you didn't start yet say " + prefix + "start")
                WarningEmbed.setColor(2347);
                message.channel.send({embeds: [WarningEmbed]});
                return;
            }

            let item = args[1];
            let amount = args[2]

            if (!item) 
            {
                let WarningEmbed = new Discord.MessageEmbed();
                WarningEmbed.setTitle("**ERROR!**")
                
                WarningEmbed.setDescription("please specfiy an item")
                WarningEmbed.setColor(2347);
                message.channel.send({embeds: [WarningEmbed]});
                return;
            } 
            if (!amount) 
            {
                let WarningEmbed = new Discord.MessageEmbed();
                WarningEmbed.setTitle("**ERROR!**")
                
                WarningEmbed.setDescription("please specfiy an amount")
                WarningEmbed.setColor(2347);
                message.channel.send({embeds: [WarningEmbed]});
                return;
            }
            if (isNaN(amount)) 
            {
                let WarningEmbed = new Discord.MessageEmbed();
                WarningEmbed.setTitle("**ERROR!**")
                
                WarningEmbed.setDescription("please please specfiy a number")
                WarningEmbed.setColor(2347);
                message.channel.send({embeds: [WarningEmbed]});
                return;
            }
            if (amount.indexOf(".") != -1 || amount.indexOf("-") != -1 || amount == 0) { 
                let WarningEmbed = new Discord.MessageEmbed();
                WarningEmbed.setTitle("**ERROR!**")
                WarningEmbed.setDescription("please specify integer value  greater than 0")
                WarningEmbed.setColor(2347);
                message.channel.send({embeds: [WarningEmbed]});
                return;
            }

            switch (item) {
                case "lollipop":
                    if (7 * parseInt(amount) >  UsersJSON[message.author.id].bal) 
                    {
                        let WarningEmbed = new Discord.MessageEmbed();
                        WarningEmbed.setTitle("**ERROR!**")
                        WarningEmbed.setDescription("you don't have enough money")
                        WarningEmbed.setColor(2347);
                        message.channel.send({embeds: [WarningEmbed]});
                        return;
                    }

                    UsersJSON[message.author.id].lollipop += parseInt(amount);
                    UsersJSON[message.author.id].bal -= 7 * parseInt(amount) ;
                    fs.writeFileSync("./DB/users.json", JSON.stringify(UsersJSON));

                    let succses = new Discord.MessageEmbed();
                    succses.setTitle("**SUCCSES**")
                    succses.setDescription(`you have bought ${amount} ${item}s.`);
                    message.channel.send({embeds: [succses]});
                    break;
                default:
                    let WarningEmbed = new Discord.MessageEmbed();
                    WarningEmbed.setTitle("**ERROR!**")
                    WarningEmbed.setDescription("this is item doesn't exist.")
                    WarningEmbed.setColor(2347);
                    message.channel.send({embeds: [WarningEmbed]});
                    return;
            }
        }

        if (args[0] == "work") 
        {
            let UsersJSON = JSON.parse(fs.readFileSync("./DB/users.json"));

            if (!UsersJSON[message.author.id]){
                let WarningEmbed = new Discord.MessageEmbed();
                WarningEmbed.setTitle("**ERROR!**")
                
                WarningEmbed.setDescription("bro you didn't start yet say " + prefix + "start")
                WarningEmbed.setColor(2347);
                message.channel.send({embeds: [WarningEmbed]});
                return;
            }

            let deltaTime = Math.floor((new Date().getTime() - UsersJSON[message.author.id].lastWork) / (1000 * 60));

            if (deltaTime < 30)
            {
                let WarningEmbed = new Discord.MessageEmbed();
                WarningEmbed.setTitle("**ERROR!**")
                
                WarningEmbed.setDescription(`you can only work after ${30 - deltaTime} mintues.`)
                WarningEmbed.setColor(2347);
                message.channel.send({embeds: [WarningEmbed]});
                return;
            }

            UsersJSON[message.author.id].bal += 30
            UsersJSON[message.author.id].lastWork = new Date().getTime();
            fs.writeFileSync("./DB/users.json", JSON.stringify(UsersJSON));

            succesEmbed = new Discord.MessageEmbed();
            succesEmbed.setTitle("good job")
            succesEmbed.setDescription("you got payed 30 have fun with it");
            message.channel.send({embeds: [succesEmbed]});
        }

        if (args[0] == "lb") 
        {
            let UsersJSON = JSON.parse(fs.readFileSync("./DB/users.json"));
            var sorted = Object.entries(UsersJSON).sort((a, b) => b[1].bal - a[1].bal);
            if (sorted.length > 10) sorted = sorted.slice(0,10);

            var LBString = "";
            sorted.forEach(user => {
                LBString += `${client.users.cache.find(u => u.id == user[0])} - ${user[1].bal}\n`
            });
            var LBEmbed = new Discord.MessageEmbed()
                .setTitle("**Leadboard**")
                .setDescription(LBString);
            message.channel.send({embeds: [LBEmbed]});
        }
    }


})

client.login('');
