require('events').EventEmitter.prototype._maxListeners = 100;
const { channel } = require('diagnostics_channel');
const Discord = require("discord.js")
const { Client, Collection, Intents } = require('discord.js');

const client = new Client({
    intents: 32767
});

const Database = require('json-database-rf')
const db = new Database()


client.login(process.env.token)

client.on("messageCreate", (message)=>{
    console.log("Messagio dall'utente");
});

client.on("messageCreate", message => {
    if (message.content == "m!comando") {
        const embed = new Discord.MessageEmbed()
        .setTitle("apri un TICKET")
        .setColor("#0000CD")
        .setDescription("Hai bisogno di una mano con il Mett_Bot o altro? apri un ticket ora!")
        .setFooter("💢N.B. se la motivazione dell'apertura del tu ticket non sarà coerente con il Mett_bot o il server del precedente verrai warnato")


        let button1 = new Discord.MessageButton()
            .setLabel("Apri ticket")
            .setCustomId("apriTicket")
            .setStyle("PRIMARY")
            .setEmoji("📩")

        let row = new Discord.MessageActionRow()
            .addComponents(button1)

        message.channel.send({ embeds: [embed], components: [row] })
    }
})

client.on("interactionCreate", async interaction => {
    if (interaction.customId == "apriTicket") {
        const embed = new Discord.MessageEmbed()
        .setTitle("❤️Grazie per aver aperto il ticket!")
        .setColor("#0000CD")
        .setDescription("uno staffer verrà presto da lei!")
        .setFooter("N.B. se la motivazione dell'apertura del tu ticket non sarà coerente con il Mett_bot o il server del precedente verrai warnato")
        const embed1 = new Discord.MessageEmbed()
        .setTitle("Hai già un ticket aperto")
        .setColor("#0000CD")
        .setDescription("mi dispiace non puoi aprire un altro ticket")
        .setTimestamp()
        await interaction.deferUpdate()
        if (interaction.guild.channels.cache.find(canale => canale.topic == `User ID: ${interaction.user.id}`)) {
            interaction.user.send({ embeds: [embed1]}).catch(() => { })
            return
        }
        interaction.guild.channels.create(interaction.user.username, {
            type: "text",
            topic: `User ID: ${interaction.user.id}`,
            parent: "1003784624457130184", //Settare la categoria,
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: ["VIEW_CHANNEL"]
                },
                {
                    id: interaction.user.id,
                    allow: ["VIEW_CHANNEL"]
                },
                { //Aggiungere altri "blocchi" se si vogliono dare permessi anche a ruoli o utenti
                    id: "1003759720684855397",
                    allow: ["VIEW_CHANNEL"]
                }
            ]
        }).then(canale => {
            canale.send({ embeds: [embed]})
            canale.send("<@&1003759720684855397>")
        })
    }
})

client.on("messageCreate", message => {
    if (message.content == "m!close") {
        let topic = message.channel.topic;
        if (!topic) {
            message.channel.send("Non puoi utilizzare questo comando qui");
            return
        }
        if (topic.startsWith("User ID:")) {
            let idUtente = topic.slice(9);
            if (message.author.id == idUtente || message.member.permissions.has("MANAGE_CHANNELS")) {
                message.channel.delete();
            }
        }
        else {
            message.channel.send("Non puoi utilizzare questo comando qui")
        }
    }
    if (message.content.startsWith("m!add")) {
        let topic = message.channel.topic;
        if (!topic) {
            message.channel.send("Non puoi utilizzare questo comando qui");
            return
        }
        if (topic.startsWith("User ID:")) {
            let idUtente = topic.slice(9);
            if (message.author.id == idUtente || message.member.permissions.has("MANAGE_CHANNELS")) {
                let utente = message.mentions.members.first();
                if (!utente) {
                    message.channel.send("Inserire un utente valido");
                    return
                }
                let haIlPermesso = message.channel.permissionsFor(utente).has("VIEW_CHANNEL", true)
                if (haIlPermesso) {
                    message.channel.send("Questo utente ha gia accesso al ticket")
                    return
                }
                message.channel.permissionOverwrites.edit(utente, {
                    VIEW_CHANNEL: true
                })
                message.channel.send(`${utente.toString()} è stato aggiunto al ticket`)
            }
        }
        else {
            message.channel.send("Non puoi utilizzare questo comando qui")
        }
    }
    if (message.content.startsWith("m!remove")) {
        let topic = message.channel.topic;
        if (!topic) {
            message.channel.send("Non puoi utilizzare questo comando qui");
            return
        }
        if (topic.startsWith("User ID:")) {
            let idUtente = topic.slice(9);
            if (message.author.id == idUtente || message.member.permissions.has("MANAGE_CHANNELS")) {
                let utente = message.mentions.members.first();
                if (!utente) {
                    message.channel.send("Inserire un utente valido");
                    return
                }
                let haIlPermesso = message.channel.permissionsFor(utente).has("VIEW_CHANNEL", true)
                if (!haIlPermesso) {
                    message.channel.send("Questo utente non ha gia accesso al ticket")
                    return
                }
                if (utente.permissions.has("MANAGE_CHANNELS")) {
                    message.channel.send("Non puoi rimuovere questo utente")
                    return
                }
                message.channel.permissionOverwrites.edit(utente, {
                    VIEW_CHANNEL: false
                })
                message.channel.send(`${utente.toString()} è stato rimosso al ticket`)
            }
        }
        else {
            message.channel.send("Non puoi utilizzare questo comando qui")
        }
    }
})

client.on("messageCreate", message => {
    if (message.content == "m!tickethelp") {
        const embed = new Discord.MessageEmbed()
            .setTitle("HELP PER I TICKET") 
            .setColor("#0000CD")
            .setDescription("ecco tutti i comandi del Mett_Ticket")
            .addField("❌m!close", `chiudi un ticket aperto`)
            .addField("➕m!add", `aggiungi un utente al ticket`)
            .addField("➖m!remove", `rimuovi un utente da un ticket`)
            .addField("✨m!tickethelp", `visualizzi questo help`)

        message.channel.send({ embeds: [embed]})
    }
})

client.on("messageCreate", message => {
    if (message.content.startsWith("m!ban")) {
if (message.author.bot) {
    message.channel.send("non puoi bannare con say")
    return
}
        var BanUser = message.mentions.members.first();
        if (!message.member.permissions.has('BAN_MEMBERS')) {
            message.channel.send('Non hai il permesso per eseguire questa azione');
            return;
        }
if (!BanUser) {
            message.channel.send('Menziona un utente'); 
            return;
        }
        if (!message.mentions.members.first().kickable) {
            message.channel.send('Non ho il permesso per eeguire questa azione');
            return
        }

        BanUser.ban()
            .then(() => message.channel.send("<@" + BanUser + ">" + " è stato bannato correttamente"))
    }
})

client.on("messageCreate", message => {
    if (message.content.startsWith("m!clear")) {
        if (!message.member.permissions.has("MANAGE_MESSAGES")) {
            return message.channel.send('Non hai il permesso');
        }
        if (!message.guild.me.permissions.has("MANAGE_MESSAGES")) {
            return message.channel.send('Non ho il permesso');
        }
        let count = parseInt(message.content.split(/\s+/)[1]);
        if (!count) {
            return message.channel.send("Inserisci un numero valido")
        }
        if (count > 100) {
            return message.channel.send("Non puoi cancellare più di 100 messaggi")
        }
        if (message.author.bot) return
        message.channel.bulkDelete(count, true)
        message.channel.send(count + " messaggi eliminati").then(msg => {
            setTimeout(() => msg.delete(), 5000)
        })
    }
})

client.on("messageCreate", message => {
    if (message.content.startsWith("m!kick")) {
if (message.author.bot) {
        message.channel.send("non puoi usare say per kickare")
        return
}
        var utenteKick = message.mentions.members.first();
        if (!message.member.permissions.has('KICK_MEMBERS')) { //Controllare che l'utente abbia il permesso di bannare
            message.channel.send('Non hai il permesso');
            return;
        }
        if (!utenteKick) {
            message.channel.send('Non hai menzionato nessun utente'); //Controllare che sia stato menzionato un utente
            return;
        }
        if (!message.mentions.members.first().kickable) { //Controllare che il bot abbia il permesso di bannare
            message.channel.send('Io non ho il permesso');
            return
        }
        if (message.author.bot) return
        utenteKick.kick()
            .then(() => message.channel.send("<@" + utenteKick + ">" + " kiccato"))
    }
})


client.on("messageCreate", message => {
    if (message.content.startsWith("m!say")) {
        var args = message.content.split(/\s+/);
        var testo;
        testo = args.slice(1).join(" ");
        if (!testo) {
            return message.channel.send("Inserire un messaggio");
        }
        if (message.content.includes("@everyone") || message.content.includes("@here")) {
            return message.channel.send("Non taggare everyone o here");
        }
        message.delete()
        message.channel.send(testo)
    }
})

client.on("messageCreate", message => {
    if (message.content.startsWith("m!userinfo")) {
        
         var utente = message.mentions.members.first()
    
        if (!utente) {
            utente = message.member
        }


        var elencoPermessi = "";
        if(utente.permissions.has("ADMINISTRATOR")) {
            elencoPermessi = "👑  ADMINISTRATOR";
        }
        else {
            var permessi = ["CREATE_INSTANT_INVITE", "KICK_MEMBERS", "BAN_MEMBERS", "MANAGE_CHANNELS", "MANAGE_GUILD", "ADD_REACTIONS", "VIEW_AUDIT_LOG", "PRIORITY_SPEAKER", "STREAM", "VIEW_CHANNEL", "SEND_MESSAGES", "SEND_TTS_MESSAGES", "MANAGE_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "READ_MESSAGE_HISTORY", "MENTION_EVERYONE", "USE_EXTERNAL_EMOJIS", "VIEW_GUILD_INSIGHTS", "CONNECT", "SPEAK", "MUTE_MEMBERS", "DEAFEN_MEMBERS", "MOVE_MEMBERS", "USE_VAD", "CHANGE_NICKNAME", "MANAGE_NICKNAMES", "MANAGE_ROLES", "MANAGE_WEBHOOKS","MANAGE_EMOJIS_AND_STICKERS"]
            for (var i = 0; i < permessi.length; i++) {
                if (utente.permissions.has(permessi[i])) {
                    elencoPermessi += "- " + permessi[i] + "\r";
                }
            }
        }
        var embed = new Discord.MessageEmbed()
            .setTitle(utente.user.tag)
            .setColor("#0000CD")
            .setDescription("Tutte le info di questo utente")
            .setThumbnail(utente.user.avatarURL())
            .addField("User id", utente.user.id, true)
            .addField("Status", utente.presence.status, utente.user.bot ? "Yes" : "No", true)
            .addField("Account created", utente.user.createdAt.toDateString(), true)
            .addField("Joined this server", utente.joinedAt.toDateString(), true)
            .addField("Permissions", elencoPermessi, false)
            .addField("Roles", utente.roles.cache.map(ruolo => ruolo.name).join("\r"), false)
            message.channel.send({embeds:  [embed] })
    }
})


client.on("messageCreate", message => {
    if (message.content == "m!invite") {
        const embed = new Discord.MessageEmbed()
            .setTitle("INVITO") //Titolo
            .setColor("#0000CD") // Colore principale
            .setURL("https://discord.com/oauth2/authorize?client_id=983747811432603668&scope=bot&permissions=8") //Link sul titolo
            .setAuthor("mett_300")
            .setDescription("Ecco il mio link d'invito, con questo puoi aggiungermi al tuo server!") //Descrizione
            .setImage("https://cdn.discordapp.com/attachments/984407134919868426/998195234112544788/AGGIUNGIMI_AL_TUO_SERVER.gif") //Immagine
            .setFooter("creato da mett_300")
            .setTimestamp()
        message.channel.send({embeds: [embed]})
    }
})

client.on("messageCreate", message => {
    if (message.content == "m!prefisso") {
        const embed = new Discord.MessageEmbed()
            .setTitle("PREFISSO") //Titolo
            .setColor("#0000CD") // Colore principale
            .setURL("https://discord.com/oauth2/authorize?client_id=983747811432603668&scope=bot&permissions=8") //Link sul titolo
            .setAuthor("mett_300")
            .setDescription("il prefisso del bot è **m!**") //Descrizione
            .setImage("https://cdn.discordapp.com/attachments/984407134919868426/998341268918767687/AGGIUNGIMI_AL_TUO_SERVER_1.gif") //Immagine
            .setFooter("creato da mett_300")
            .setTimestamp()
        message.channel.send({embeds: [embed]})
    }
})

client.on("messageCreate", message => {
    if (message.content == "m!ping") {
        var embed = new Discord.MessageEmbed()
            .setTitle("Ping del bot")
            .setColor("#0000CD")
            .setDescription("Ecco la latenza del bot")
            .addField("Ping", `${client.ws.ping}ms`)

        message.channel.send({embeds: [embed]})
    }
})

client.on("messageCreate", message => {
    if (message.content.startsWith("m!mute")) {
if (message.author.bot) {
        message.channel.send("non puoi mutare con say")
        return
}
        var utente = message.mentions.members.first();
        if (!message.member.permissions.has("MANAGE_ROLES")) {
            return message.channel.send('Non hai il permesso');
        }
        if (!utente) {
            return message.channel.send('Non hai menzionato nessun utente');
        }
        if (message.author.bot) return
        
        let ruolo = message.guild.roles.cache.find(x => x.name === "Mute")

        if (!ruolo) {
            message.guild.roles.create("Mute").then((r) => {
              message.guild.channels.cache.forEach(c => {
                c. permissionOverwrites.edit(r.id , {
                    VIEW_CHANNEL: false
                })
              })
              r.setPermissions(["READ_MESSAGE_HISTORY", "SEND_MESSAGES"]) 
              utente.roles.add(r.id)
            })
        }
        else {
          message.member.roles.add(ruolo)   
        }

        var embed = new Discord.MessageEmbed()
            .setTitle(`${utente.user.username} mutato`)
            .setColor("#0000CD")
            .setDescription(`Utente mutato da ${message.author.toString()}`)

        message.channel.send({ embeds: [embed] })
    }
})

client.on("messageCreate", message => {
    if (message.content.startsWith("m!unmute")) {
if (message.author.bot) {
    message.channel.send("non puoi mutare con say")
        return
}
        var utente = message.mentions.members.first();
        if (!message.member.permissions.has("MANAGE_ROLES")) {
            return message.channel.send('Non hai il permesso');
        }
        if (!utente) {
            return message.channel.send('Non hai menzionato nessun utente');
        }

        let ruolo = message.guild.roles.cache.find(x => x.name === "new role")
        if (!ruolo) {
            return message.channel.send("Il ruolo è inesistente");
        }
        if (message.author.bot) return
        utente.roles.remove(ruolo);

        var embed = new Discord.MessageEmbed()
            .setTitle(`${utente.user.username} smutato`)
            .setColor("#0000CD")
            .setDescription(`Utente smutato da ${message.author.toString()}`)

        message.channel.send({ embeds: [embed] })
    }
})



client.on("messageCreate", async message => {
    if (message.content.startsWith("m!unban")) {
if (message.author.bot) {
    message.channel.send("non puoi sbannare con say")
    return
}
        if (!message.member.permissions.has('BAN_MEMBERS')) {
            return message.channel.send('Non hai il permesso');
        }

        var args = message.content.split(/\s+/);
        var idUtente = args[1]

        if (!idUtente) {
            return message.channel.send("Non hai scritto l'id di nessun utente");
        }
        if (message.author.bot) return

        message.guild.members.unban(idUtente)
            .then(() => {
                var embed = new Discord.MessageEmbed()
                    .setTitle("Utente sbannato")
                    .setDescription("Questo utente è stato sbannato")

                message.channel.send({ embeds: [embed] })
            })
            .catch(() => { message.channel.send("Utente non valido o non bannato") })
    }
})

client.on("messageCreate", message => {
    if (message.content.startsWith("m!avatar")) {
        if (message.content.trim() == "!avatar") {
            var utente = message.member;
        }
        else {
            var utente = message.mentions.members.first();
        }
        if (!utente) {
            return message.channel.send("Utente non trovato")
        }
        var embed = new Discord.MessageEmbed()
            .setTitle(utente.user.tag)
            .setColor("#0000CD")
            .setDescription("L'avatar di questo utente")
            .setImage(utente.user.displayAvatarURL({
                dynamic: true,
                format: "png",
                size: 512
            }))
        message.channel.send({ embeds: [embed] })
    }
})

client.on("messageCreate", message => {
    if (message.content == "m!serverinfo") {
        var server = message.guild;
        var embed = new Discord.MessageEmbed()
            .setTitle(server.name)
            .setColor("#0000CD")
            .setDescription("Tutte le info su questo server")
            .setThumbnail(server.iconURL())
            .addField("Owner", client.users.cache.get(server.ownerId).username, true)
            .addField("Server id", server.id, true)
            .addField("Members", server.memberCount.toString(), false)
            .addField("Channels", server.channels.cache.size.toString(), false)
            .addField("Server created", server.createdAt.toDateString(), true)
            .addField("Boost level", "Level " + (server.premiumTier != "NONE" ? server.premiumTier : 0) + " (Boost: " + server.premiumSubscriptionCount + ")", true)
        message.channel.send({ embeds: [embed] })
    }
})

client.on("messageCreate", message => {
    if (message.content.startsWith("m!channelinfo")) {
        if (message.content == "!channelinfo") {
            var canale = message.channel;
        }
        else {
            var canale = message.mentions.channels.first();
        }
        if (!canale) {
            return message.channel.send("Canale non trovato");
        }
        switch (canale.type) {
            case "GUILD_TEXT": canale.type = "Text"; break;
            case "GUILD_VOICE": canale.type = "Voice"; break;
            case "GUILD_CATEGORY": canale.type = "Category"; break;
        }
        if (canale.type == "Voice") {
            var embed = new Discord.MessageEmbed()
                .setTitle(canale.name)
                .setColor("#0000CD")
                .setDescription("Tutte le statistiche su questo canale")
                .addField("Channel ID", canale.id, true)
                .addField("Type", canale.type, true)
                .addField("Position", canale.rawPosition.toString(), true)
                .addField("Category", `<#${canale.parentId}>`, true)
                .addField("Bitrate", canale.bitrate.toString(), true)
                .addField("User limit", canale.userLimit == 0 ? "∞" : canale.userLimit.toString(), true)
            return message.channel.send({ embeds: [embed] })
        }
        if (canale.type == "Category") {
            var embed = new Discord.MessageEmbed()
                .setTitle(canale.name)
                .setColor("#0000CD")
                .setDescription("Tutte le statistiche su questa categoria")
                .addField("Category ID", canale.id, true)
                .addField("Type", canale.type, true)
                .addField("Position", canale.rawPosition.toString(), true)
                .addField("Category created", canale.createdAt.toDateString())
            return message.channel.send({ embeds: [embed] })
        }
        var embed = new Discord.MessageEmbed()
            .setTitle(canale.name)
            .setColor("#0000CD")
            .setDescription("Tutte le statistiche su questo canale")
            .addField("Channel ID", canale.id, true)
            .addField("Type", canale.type, true)
            .addField("Position", canale.rawPosition.toString(), true)
            .addField("Category", `<#${canale.parentId}>`, true)
            .addField("Topic", !canale.topic ? "No topic" : canale.topic, true)
            .addField("NSFW", canale.nsfw ? "Yes" : "No", true)
            .addField("Channel created", canale.createdAt.toDateString())
        message.channel.send({ embeds: [embed] })
    }
})

client.on("messageCreate", message => {
    if (message.content.startsWith("m!roleinfo")) {
        var ruolo = message.mentions.roles.first()
        if (!ruolo) {
            return message.channel.send("Non ho trovato questo ruolo")
        }
        var memberCount = message.guild.members.cache.filter(member => member.roles.cache.find(role => role == ruolo)).size;
        var permessiRuolo = new Discord.Permissions(ruolo.permissions.bitfield);
        var elencoPermessi = "";
        if (permessiRuolo.has("ADMINISTRATOR")) {
            elencoPermessi = "👑ADMINISTRATOR";
        }
        else {
            var permessi = ["CREATE_INSTANT_INVITE", "KICK_MEMBERS", "BAN_MEMBERS", "MANAGE_CHANNELS", "MANAGE_GUILD", "ADD_REACTIONS", "VIEW_AUDIT_LOG", "PRIORITY_SPEAKER", "STREAM", "VIEW_CHANNEL", "SEND_MESSAGES", "SEND_TTS_MESSAGES", "MANAGE_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "READ_MESSAGE_HISTORY", "MENTION_EVERYONE", "USE_EXTERNAL_EMOJIS", "VIEW_GUILD_INSIGHTS", "CONNECT", "SPEAK", "MUTE_MEMBERS", "DEAFEN_MEMBERS", "MOVE_MEMBERS", "USE_VAD", "CHANGE_NICKNAME", "MANAGE_NICKNAMES", "MANAGE_ROLES", "MANAGE_WEBHOOKS"]
            for (var i = 0; i < permessi.length; i++) {
                if (permessiRuolo.has(permessi[i])) {
                    elencoPermessi += `- ${permessi[i]}\r`
                }
            }
        }
        var embed = new Discord.MessageEmbed()
            .setTitle(ruolo.name)
            .setColor("#0000CD")
            .setDescription("Tutte le statistiche di questo ruolo")
            .addField("Role ID", ruolo.id, true)
            .addField("Members", memberCount.toString(), true)
            .addField("Color", ruolo.hexColor, true)
            .addField("Role created", ruolo.createdAt.toDateString(), true)
            .addField("Permissions", elencoPermessi, false)            
        message.channel.send({ embeds: [embed] })
    }
})



 
    const ms = require("ms")
    client.on("messageCreate", message => {
        if (message.content.startsWith("m!slowmode")) {
            let time = message.content.split(/\s+/)[1];
            if (!time) {
                return message.channel.send("Inserire un tempo valido")
            }

            time = ms(time)
            if (!time && time != 0) {
                return message.channel.send("Inserire un tempo valido")
            }
    
            if (time > 21600000) {
                return message.channel.send("Inserire un tempo non superiore a 6 ore")
            }
    
            message.channel.setRateLimitPerUser(parseInt(time) / 1000)
            message.channel.send("Slowmode impostata")
        }
    })
           



client.on("messageCreate", message => {
    if (message.content == "m!contact")  {

            message.channel.send("<@&1003759720684855397>")
    }
})

client.on("guildMemberAdd", member => {
    if (member.user.bot) return
    let embed = new Discord.MessageEmbed()
        .setTitle("WELCOME")
        .setColor("#0000CD")
        .setTimestamp()
        .setDescription(`Ciao ${member.toString()}, benvenuto in ${member.guild.name}. Sei il **${member.guild.memberCount}° Membro**`)

    client.channels.cache.get("1003761259130392657").send({embeds: [embed]}); 
})

client.on("messageCreate", message => {
    if (message.content.startsWith("m!warn")) {
        let utente = message.mentions.members.first();
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.channel.send('Non hai il permesso');
        }
        if (!utente) {
            return message.channel.send('Non hai menzionato nessun utente');
        }
        let reason = message.content.split(/ +/).slice(2).join(" ");
        if (!reason) {
            return message.channel.send('Non hai specificato la motivazione del warn');
        }

        if (utente.roles.cache.has("999670755145035870")) {
            utente.roles.remove("999670755145035870");
            utente.roles.add("999670820051886100");

            let embed = new Discord.MessageEmbed()
                .setTitle(`${utente.user.username} warnato`)
                .setColor("#0000CD")
                .setDescription(`Utente warnato da ${message.author.toString()} per "**${reason}**"\nUn altro warn e l'utente verrà bannato`)
            message.channel.send({ embeds: [embed] })
        }
        else if (utente.roles.cache.has("999670820051886100")) {
            utente.roles.remove("999670820051886100");
            utente.ban()

            let embed = new Discord.MessageEmbed()
                .setTitle(`${utente.user.username} warnato`)
                .setColor("#0000CD")
                .setDescription(`Utente warnato da ${message.author.toString()} per "**${reason}**"\nL'utente è stato bannato poichè ha raggiunto i 3 warn`)
            message.channel.send({ embeds: [embed] })
        }
        else {
            utente.roles.add("999670755145035870");

            let embed = new Discord.MessageEmbed()
                .setTitle(`${utente.user.username} warnato`)
                .setColor("#0000CD")
                .setDescription(`Utente warnato da ${message.author.toString()} per "**${reason}**"\nAltri 2 warn e l'utente verrà bannato`)
            message.channel.send({ embeds: [embed] })
        }
    }
})


client.on("messageCreate", message => {
    if (message.content.startsWith("m!8ball")) {
const answers = [
    "È decisamente così",
    "Senza dubbio",
    "Molto probabilmente",
    "Sì",
    "I segni indicano sì",
    "La domanda è confusa, riprova",
    "Chiedi più tardi",
    "Meglio non dirtelo ora",
    "Non lo posso prevedere adesso",
    "Concentrati e chiedelo di nuovo",
    "Non contarci",
    "La mia risposta è no",
    "Le mie fonti dicono di no",
    "La prospettiva non è buona",
    "Sono molto dubbioso"
]

let embed = new Discord.MessageEmbed()
    .setTitle("LA RISPOSTA ALLA TUA DOMANDA...")
    .setColor("#0000CD")
    .setDescription(`:crystal_ball: La risposta del destino: **${answers[Math.floor(Math.random() * answers.length)]}**`)

    message.channel.send({ embeds: [embed] })

    }
})

client.on("messageCreate", async message => {
    if (message.content == "m!outrightnumber") {
        let user = db.get(message.author.id)
        if (user == null || user == undefined) db.set(message.author.id, { id: message.author.id, used: 1 })
        if (user)  db.add(`${message.author.id}.used`, 1)
        if (user?.used == 3) return message.channel.send('Hai finito i tentativi!')
        let embed1 = new Discord.MessageEmbed()
            .setTitle("👎1")
            .setColor("#0000CD")
            .setDescription("emh, non sei molto fortunato")
            .setFooter("ritenta digitando m!outrightnumber")
            .setImage("https://cdn.discordapp.com/attachments/984407134919868426/999736884269948978/no2.PNG")
        let embed2 = new Discord.MessageEmbed()
            .setTitle("👎2")
            .setColor("#0000CD")
            .setDescription("vai così AHAHAH")
            .setFooter("ritenta digitando m!outrightnumber")
            .setImage("https://cdn.discordapp.com/attachments/984407134919868426/999736884269948978/no2.PNG")
        let embed3 = new Discord.MessageEmbed()
            .setTitle("👎3")
            .setColor("#0000CD")
            .setDescription("ce la puoi fare...")
            .setFooter("ritenta digitando m!outrightnumber")
            .setImage("https://cdn.discordapp.com/attachments/984407134919868426/999736884269948978/no2.PNG")
        let embed4 = new Discord.MessageEmbed()
            .setTitle("👎4")
            .setColor("#0000CD")
            .setDescription("hai sbagliato, dajeeeee")
            .setFooter("ritenta digitando m!outrightnumber")
            .setImage("https://cdn.discordapp.com/attachments/984407134919868426/999736884269948978/no2.PNG")
        let embed5 = new Discord.MessageEmbed()
            .setTitle("👎5")
            .setColor("#0000CD")
            .setDescription("vabbè nel frattempo dormo")
            .setFooter("ritenta digitando m!outrightnumber")
            .setImage("https://cdn.discordapp.com/attachments/984407134919868426/999736884269948978/no2.PNG")
        let embed6 = new Discord.MessageEmbed()
            .setTitle("👍6")
            .setColor("#FFD700")
            .setDescription("è USCITO IL NUMERO GIUSTO, HAI VINTO!!")
            .setImage("https://th.bing.com/th/id/OIP.oR38DLkY6uy4TX4Y0hk6CQHaDb?pid=ImgDet&rs=1")
        let embed7 = new Discord.MessageEmbed()
            .setTitle("👎7")
            .setColor("#0000CD")
            .setDescription("enniente")
            .setFooter("ritenta digitando m!outrightnumber")
            .setImage("https://cdn.discordapp.com/attachments/984407134919868426/999736884269948978/no2.PNG")
        let embed8 = new Discord.MessageEmbed()
            .setTitle("👎8")
            .setColor("#0000CD")
            .setDescription("che noiaaaa")
            .setFooter("ritenta digitando m!outrightnumber")
            .setImage("https://cdn.discordapp.com/attachments/984407134919868426/999736884269948978/no2.PNG")
        let embed9 = new Discord.MessageEmbed()
            .setTitle("👎9")
            .setColor("#0000CD")
            .setDescription("qua ti fai vecchio")
            .setFooter("ritenta digitando m!outrightnumber")
            .setImage("https://cdn.discordapp.com/attachments/984407134919868426/999736884269948978/no2.PNG")
        let embed10 = new Discord.MessageEmbed()
            .setTitle("👎10")
            .setColor("#0000CD")
            .setDescription("hai indovinato!!! ||non è vero ahahaha||")
            .setFooter("ritenta digitando m!outrightnumber")
            .setImage("https://cdn.discordapp.com/attachments/984407134919868426/999736884269948978/no2.PNG")
        let messaggi = [embed1, embed2, embed3, embed4, embed5, embed6, embed7, embed8, embed9, embed10]
        message.delete()
        message.channel.send({ embeds: [messaggi[Math.floor(Math.random() * messaggi.length)]] })
        .then(msg => {
            setTimeout(() => msg.delete(), 5000)
        })
    }
})




const { DisTube } = require("distube")

const distube = new DisTube(client, {
    youtubeDL: false,
    leaveOnEmpty: true,
    leaveOnStop: true
})

client.on("messageCreate", message => {
    if (message.content.startsWith("m!play")) {
        const voiceChannel = message.member.voice.channel
        if (!voiceChannel) {
            return message.channel.send("Devi essere in un canale vocale")
        }

        const voiceChannelBot = message.guild.channels.cache.find(x => x.type == "GUILD_VOICE" && x.members.has(client.user.id))
        if (voiceChannelBot && voiceChannel.id != voiceChannelBot.id) {
            return message.channel.send("Qualun'altro sta già ascoltando della musica")
        }

        let args = message.content.split(/\s+/)
        let query = args.slice(1).join(" ")

        if (!query) {
            return message.channel.send("Inserisci la canzone che vuoi ascoltare")
        }

        distube.play(voiceChannelBot || voiceChannel, query, {
            member: message.member,
            textChannel: message.channel,
            message: message
        })
    }

    if (message.content == "m!pause") {
        const voiceChannel = message.member.voice.channel
        if (!voiceChannel) {
            return message.channel.send("Devi essere in un canale vocale")
        }

        const voiceChannelBot = message.guild.channels.cache.find(x => x.type == "GUILD_VOICE" && x.members.has(client.user.id))
        if (voiceChannelBot && voiceChannel.id != voiceChannelBot.id) {
            return message.channel.send("Qualun'altro sta già ascoltando della musica")
        }

        try {
            distube.pause(message)
        } catch {
            return message.channel.send("Nessuna canzone in riproduzione o canzone già in pausa")
        }

        message.channel.send("Song paused")
    }

    if (message.content == "m!resume") {
        const voiceChannel = message.member.voice.channel
        if (!voiceChannel) {
            return message.channel.send("Devi essere in un canale vocale")
        }

        const voiceChannelBot = message.guild.channels.cache.find(x => x.type == "GUILD_VOICE" && x.members.has(client.user.id))
        if (voiceChannelBot && voiceChannel.id != voiceChannelBot.id) {
            return message.channel.send("Qualun'altro sta già ascoltando della musica")
        }

        try {
            distube.resume(message)
        } catch {
            return message.channel.send("Nessuna canzone in riproduzione o canzone già in riproduzione")
        }

        message.channel.send("Song resumed")
    }
})

distube.on("addSong", (queue, song) => {
    let embed = new Discord.MessageEmbed()
        .setTitle("Song added")
        .addField("Song", song.name)

    queue.textChannel.send({ embeds: [embed] })
})

distube.on("playSong", (queue, song) => {
    let embed = new Discord.MessageEmbed()
        .setTitle("Playing song...")
        .setColor("#0000CD")
        .addField("Song", song.name)
        .addField("Requested by", song.user.toString())

    queue.textChannel.send({ embeds: [embed] })
})

distube.on("searchNoResult", (message, query) => {
    message.channel.send("Canzone non trovata")
})

client.on("messageCreate", message => {
    if (message.content == "m!help") {
        let embed = new Discord.MessageEmbed()
            .setTitle("🆘Help🆘")
            .setColor("#0000CD")
            .setDescription("Seleziona la pagina con il menu qua sotto")

        let select = new Discord.MessageSelectMenu()
            .setCustomId("menuHelp")
            .setPlaceholder("Seleziona una pagina")
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions([
                {
                    label: "Pagina 1",
                    description: "Vai alla pagina numero 1",
                    value: "pagina1"
                },
                {
                    label: "Pagina 2",
                    description: "Vai alla pagina numero 2",
                    value: "pagina2"
                },
                {
                    label: "Pagina 3",
                    description: "Vai alla pagina numero 3",
                    value: "pagina3"
                },
                {
                    label: "Pagina 4",
                    description: "Vai alla pagina numero 3",
                    value: "pagina4"
                },
                {
                    label: "Pagina 5",
                    description: "Vai alla pagina numero 3",
                    value: "pagina5"
                }
            ])

        let row = new Discord.MessageActionRow()
            .addComponents(select)

        message.channel.send({ embeds: [embed], components: [row] })
    }
})

client.on("interactionCreate", interaction => {
    if (!interaction.isSelectMenu()) return

    if (interaction.customId == "menuHelp") {
        interaction.deferUpdate()

        switch (interaction.values[0]) {
            case "pagina1": {
                let embed = new Discord.MessageEmbed()
                .setTitle("⚒️MODERAZIONE")
                .setColor("#0000CD")
                .setDescription("ad ogni comando aggiungi il prefisso **m!**")
                .addField("Ban", `rimuove un utente per sempre`)
                .addField("Kick", `rimuove un utente`)
                .addField("clear", `elimina i messaggi stabilita dall'utente`)
                .addField("unban", `sbanna un utente`)
                .addField("mute", `muta un utente`)
                .addField("unmute", `smuta un utente`)




                interaction.message.edit({ embeds: [embed] })
            } break
            case "pagina2": {
                let embed = new Discord.MessageEmbed()
                .setTitle("🔷UTILI")
                .setColor("#0000CD")
                .setDescription("ad ogni comando aggiungi il prefisso **m!**")
                .addField("avatar", `visualizzi l'avatar degli utenti`)
                .addField("useriinfo", `visualizzi i dati di un utente`)
                .addField("channelinfo", `visualizzi info su un canale da te scelto`)
                .addField("roleinfo", `visualizzi info su un ruolo del server da te scelto`)
                .addField("clear", `elimina i messaggi stabilita dall'utente`)
                .addField("serverifo", `visualizzi le info sul server`)
                .addField("slowmode", `imposta un tempo d'invio dei messaggi nella chat`)
                




                interaction.message.edit({ embeds: [embed] })
            } break
            case "pagina3": {
                let embed = new Discord.MessageEmbed()
                .setTitle("🎮MINIGAE")
                .setColor("#0000CD")
                .setDescription("ad ogni comando aggiungi il prefisso **m!**")
                .addField("Say", `fai scrivere qualcosa al bot`)
                .addField("outrightnumber", `hai tre tenatativi per trovare il numero misterioso`)
                .addField("8ball", `fai delle domande alla sfera magica`)



                interaction.message.edit({ embeds: [embed] })
            } break
            case "pagina4": {
                let embed = new Discord.MessageEmbed()
                    .setTitle("🎶MUSICA")
                    .setColor("#0000CD")
                    .setDescription("ad ogni comando aggiungi il prefisso **m!**")
                    .addField("play", `avvia una canzone scrivendone il nome`)
                    .addField("pause", `metti in pausa la canzone`)
                    .addField("resume", `ricomincia la canzone`)


                    interaction.message.edit({ embeds: [embed] })
            }break
            case "pagina5": {
                let embed = new Discord.MessageEmbed()
                    .setTitle("ℹ️INFO BOT")
                    .setColor("#0000CD")
                    .setDescription("ad ogni comando aggiungi il prefisso **m!**")
                    .addField("invite", `richiedi il link d'invito del bot`)
                    .addField("prefisso", `richiedi il refisso del bot`)
                    .addField("ping", `richiedi la latenza del bot`)
                    .addField("vote", `richiedi il link per votare il bot **(presto disponibile)**`)
                    

                    interaction.message.edit({ embeds: [embed] })
            } break
        }
    }
})



const CronJob = require('cron').CronJob;

client.on("ready", async () =>{
    client.user.setActivity(`m!help`,{ type: "WATCHING"})
    new CronJob('0 0 0 * * *', async function() {
        db.clear()
    })
})