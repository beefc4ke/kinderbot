//TO START KINDERBOT, TYPE "node bot" IN TERMINAL FROM FILEPATH C:\Users\Kinder\Desktop\KinderBot> 
//TO KILL KINDERBOT, USE ctrl + C IN TERMINAL

const Discord = require('discord.js');
require('dotenv').config();
const bot = new Discord.Client(); //most people use client = new Discord.Client so 'bot' is actually referred to as such in most tutorials
const version = '20.8.1'; //year.month.revision
const fs = require("fs");
const auth = process.env.BOT_TOKEN;; //RENAME ".env_sample" to ".env" and enter bot token in file
bot.storageTest = require("./storageTest.json")
bot.charSheets = require("./charSheets.json")



bot.on('ready', () => {
    console.log('KinderBot version ' + version + ' ready for action!')
});

bot.login(auth); 

const prefix = '?';

function randomNum(die) {
    return Math.floor((Math.random() * die) + 1)
}

bot.on('message', message => {
    let args = message.content.substring(prefix.length).split(' ');
    switch (args[0]) {

        //?ping -> '@user pong!'
        case 'ping':
            try {
                message.reply('pong!');
            } catch (ex) {
                console.log("Error: " + ex.message)
            }
            break;

            //?ding -> 'dong'
        case 'ding':
            try {
                message.channel.send('dong!');
            } catch (ex) {
                console.log("Error: " + ex.message)
            }


            break;


            //?info -> Bot info
        case 'info':
            message.channel.send(
                'I am KinderBot, Version ' + version + '! An automated discord response bot, created by J. Kinder! I\'m currently still just a pet project, but one day, I hope to actually not be trash!!! '
            )


            break;


            //?roll info -> how to roll
        case 'roll':
            try {
                var result = 0

                if (args[1] && args[1] > 0) {
                    if (args[2] && args[2] > 0) {
                        if (args[1] > 100000 || args[2] > 100000) {
                            message.reply('Bruh...')
                        } else if (args[1] < 100000 && args[2] < 100000) {
                            let dieArr = [];
                            for (i = 0; i < args[1]; i++) {
                                dieArr.push(randomNum(args[2]));
                            }
                            result = dieArr.reduce(function (a, b) { //adding the die in dieArr together
                                return a + b;
                            }, 0);
                            if (args[1] > 10) {
                                message.channel.send("You try to roll " + args[1] + " d" + args[2] + "'s, all at the same time. You tip over the DM's drink onto the table map. The DM is now actively trying to murder your character...");
                                if (result == 69) {
                                    message.reply(' rolled ' + result + " *nice*");
                                } else {
                                    message.reply(' rolled ' + result);
                                }
                            } else {
                                message.channel.send(dieArr);
                                if (result == 69) {
                                    message.reply(' rolled ' + result + " *nice*");
                                } else {
                                    message.reply(' rolled ' + result);
                                }
                            }
                        } else {
                            result = randomNum(args[1]);
                            if (result == 69) {
                                message.reply(' rolled ' + result + " *nice*");
                            } else if (result == 1) {
                                message.reply(' rolled a nat ' + result + "... you threw the die directly in the trash...");
                            } else if (args[1] == 20 && result == 20) {
                                message.reply(' rolled a natty ' + result + ", LET'S GOOOOOOO!!!");
                            } else {
                                message.reply(' rolled ' + result);
                            }
                        }
                    }
                } else if (args[1] == 'info') {
                    message.reply('Type "?roll" then a number greater than zero, to get a random number between 1 and your number. If you want to roll more than 1 die (say you want to roll 4d8\'s), then type "?roll 4 8", and I will roll 4 8-sided dies for you. I\'ll even show you exactly what each die rolled (probably)!')
                } else {
                    message.reply('Invalid: Gimme a number greater than 0, ya lunk');
                }
            } catch (ex) {
                console.log("Error: " + ex.message);
            };


            break;


        case 'clear':

            try {
                if (!args[1] || args[1] < 1) return message.reply('Error: Please define how many messages to clear');
                message.channel.bulkDelete(args[1]);
                message.channel.send("```" + args[1] + ' messages cleared!```').then(r => r.delete(5000));
            } catch (ex) {
                console.log("Error: " + ex.message);
            }


            break;


       case 'RollChar':
            try {
                const filter = m => m.author.id === message.author.id;
                message.reply("What is your character's name? Type 'cancel' to cancel naming")

                message.channel.awaitMessages(filter, {
                    max: 1,
                    time: 30000,
                    errors: ['time']
                }).then(response => {

                    if (response.first().content === "cancel") { //if user replies "cancel -> cancels run"
                        return message.reply("Canceled!")
                    } else {
                        bot.charSheets[message.author.username].Character = { //creates json obj for character_name and names it the reponse
                            Character_Name: response.first().content
                        };
                        fs.writeFile("./charSheets.json", JSON.stringify(bot.charSheets, null, 4), err => {
                            if (err) throw err;
                            return message.reply("saved");
                        });
                    }
                });
            } catch (ex) {
                console.log("Error: " + ex.message);
            } 


            break;


        case 'dndChar':
            let charName = bot.charSheets[message.author.username].Character_Name;
            message.channel.send("Character Name: " + charName);


            break;


            //Test case for JSON storage
       case 'storeVal':
           try {
            bot.storageTest[message.author.username].newStoreTest = {
                TestValue: "new test!",
                Value2: "Just checking in!"
            }

            fs.writeFile("./storageTest.json", JSON.stringify(bot.storageTest, null, 4), err => {
                if (err) throw err;
                message.channel.send("saved");
            });
           } catch(ex) {
               console.log("Error " + ex.message)
           }

            
            break;

        

            //Still in development
            case 'savequote':
                slicedQuote = message.content.slice(10)
                try {
                    if (args[0].length > 0) { 
                        bot.storageTest [message.author.username].quote = {
                           quote: slicedQuote
                        }
                        fs.writeFile ("./storageTest.json", JSON.stringify (bot.storageTest, null, 4), err => {
                            if (err) throw err;
                            message.channel.send ("quote saved");
                        });
                    } 
                } catch(ex) {
                        console.log("Error: " + ex.message);
                    }


                    break;


            case 'quote':
                try {
                    let returnedQuote =  bot.storageTest[message.author.username].quote.quote //format for nested JSON
                    if(returnedQuote == undefined){
                        message.channel.send("No quote saved")
                    } else {
                        message.channel.send(returnedQuote);
                    }
                } catch(ex){
                    console.log("Error " + ex.message);
                }
                

                break;

                

    }
});