const { Client, Intents, Collection, MessageAttachment, MessageEmbed, Permissions, Constants, ApplicationCommandPermissionsManager } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_WEBHOOKS, Intents.FLAGS.GUILD_INVITES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MESSAGE_TYPING, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGE_TYPING] });
const ayarlar = require("./ayarlar.json");
const db = require("nrc.db")
const message = require("./events/message");
let prefix = ayarlar.prefix;
const Discord = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Modal, showModal } = require('discord-modals');
const { TextInputComponent, SelectMenuComponent } = require('discord-modals'); // Import all
const discordModals = require("discord-modals");
discordModals(client);
const { MessageActionRow, MessageButton, DiscordAPIError, MessageSelectMenu  } = require('discord.js');


client.commands = new Collection();
client.aliases = new Collection();

["command"].forEach(handler => {
  require(`./komutcalistirici`)(client);
});

client.on("ready", () => {
  require("./events/eventLoader")(client);
});


const freelancer_basvuru = new Modal()
  .setCustomId("freelancer_basvuru")
  .setTitle("Freelancer Başvuru Formu")
  .addComponents(
    new discordModals.TextInputComponent()
      .setCustomId("basvuru_isim")
      .setLabel("İsim ve Soyismini girmelisin.")
      .setStyle("SHORT")
      .setMinLength(1)
      .setMaxLength(32)
      .setPlaceholder("Örnek: Furkan Yılmaz...")
      .setRequired(true),
    new discordModals.TextInputComponent()
      .setCustomId("basvuru_yas")
      .setLabel("Yaşını girmelisin.")
      .setStyle("SHORT")
      .setMinLength(1)
      .setMaxLength(2)
      .setPlaceholder("Örnek: 18")
      .setRequired(true),
    new discordModals.TextInputComponent()
      .setCustomId("basvuru_alan")
      .setLabel("Hizmetini/Satışını yapmak istediğin şeyi gir.")
      .setStyle("SHORT")
      .setMinLength(4)
      .setMaxLength(32)
      .setPlaceholder("Örnek: Grafik Tasarım/Logo")
      .setRequired(true),
    new discordModals.TextInputComponent()
      .setCustomId("basvuru_tecrube")
      .setLabel("Bu konuda daha önce tecrüben oldu mu?")
      .setStyle("LONG")
      .setMinLength(0)
      .setMaxLength(160)
      .setPlaceholder("")
      .setRequired(false), 
    new discordModals.TextInputComponent()
      .setCustomId("basvuru_odeme")
      .setLabel("Kullandığın ödeme araçlarını giriniz.")
      .setStyle("SHORT")
      .setMinLength(1)
      .setMaxLength(32)
      .setPlaceholder("Örnek: Papara, İninal, Enpara, Ziraat...")
      .setRequired(true),       
  )


client.on("messageCreate", async (message, member) => {

  if (message.channel.id == db.get(`oneri-sistemi-${message.guild.id}`)) {
    if (message.author.id == "1011613532510502942") return
    message.react("<:pixel_hand_like_left:1011374970728878080>")
    message.react("<:pixel_hand_dislike_right:1011375023560339569>")
  }
})

client.on("ready", async () => {
  let commands = client.guilds.cache.get("1011316800820105246").commands;

  commands.create({
    name: "disable-buton-gönder",
    description: "Bulunduğun kanala kapalı başvurma butonu gönderir.",
  })

  commands.create({
    name: "enable-buton-gönder",
    description: "Bulunduğun kanala açık başvurma butonu gönderir.",
  })
  
  
  commands.create({
    name: "freelancer-başvur",
    description: "Freelancer olmaya başvurursun.",
  })

  commands.create({
    name: "kilit-kaldir",
    description: "İstediğin bir kanalın kilidini kaldırırsın.",
    options: [{
      name: "kanal",
      description: "Kilidini kaldırdığın kanalı seçmelisiniz.",
      type: "CHANNEL",
      channelTypes: ["GUILD_TEXT"],
      required: true
    }]
  })

  commands.create({
    name: "kilitle",
    description: "İstediğin bir kanalı kilitlersin.",
    options: [{
      name: "kanal",
      description: "Kilitlemek istediğiniz kanalı seçmelisiniz.",
      type: "CHANNEL",
      channelTypes: ["GUILD_TEXT"],
      required: true
    }]
  })

  commands.create({
    name: "öneri-sistemi-ayarla",
    description: "Öneri sistemini ayarlarsınız.",
    options: [{
      name: "kanal",
      description: "Öneri kanalını seçmelisiniz.",
      type: "CHANNEL",
      channelTypes: ["GUILD_TEXT"],
      required: true
    }]
  })



  commands.create({
    name: "yavaş-mod-ayarla",
    description: "İstediğiniz bir kanalın yavaş-mod'unu ayarlarsınız.",
    options: [{
      name: "kanal",
      description: "Yavaş-Mod'u ayarlamak istediğiniz kanalı seçmelisiniz.",
      type: "CHANNEL",
      channelTypes: ["GUILD_TEXT"],
      required: true
    },
    {
      name: "saniye",
      description: "Yavaş-Mod'un kaç saniye olarak ayarlanmasını istediğinizi yazmalısınız.  ( 10 Dakika = 600 Saniye)",
      type: "INTEGER",
      required: true
    }]
  })

  commands.create({
    name: "temizle",
    description: "Bulunduğun kanaldaki belirttiğin miktardaki mesajı siler.",
    options: [{
      name: "sayi",
      description: "Silinecek mesaj miktarını yazmalısın.",
      type: "INTEGER",
      required: true
    }]
  })
})



client.on("interactionCreate", async (interaction) => {
  const { commandName, options } = interaction;


  if(commandName == "enable-buton-gönder") {
    if(!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({content: "Bu komutu kullanabilmek için gerekli yetkiye sahip değilsin!", ephemeral: true})

    const row = new Discord.MessageActionRow()
    .addComponents(
      new MessageButton()
        .setCustomId("basvuru_buton")
        .setStyle("SUCCESS")
        .setLabel("Başvuru Formu")
        .setEmoji("<:Link_symbol:1011652711156031528>")
    )
    interaction.channel.send({content: "Başvuru için alttaki butona tıklayın.", components: [row]})

    }

    if(commandName == "disable-buton-gönder") {
      if(!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({content: "Bu komutu kullanabilmek için gerekli yetkiye sahip değilsin!", ephemeral: true})
  
      const row = new Discord.MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId("basvuru_buton")
          .setStyle("SUCCESS")
          .setLabel("Başvuru Formu")
          .setEmoji("<:Link_symbol:1011652711156031528>")
          .setDisabled(true)
      )
      interaction.channel.send({content: "Başvuru için alttaki butona tıklayın.", components: [row]})
  
      }

  if(interaction.isButton()) {
    if(interaction.customId == "basvuru_buton") {
      
      showModal(freelancer_basvuru, {
        client: client,
        interaction: interaction,
      })

    }
  }
  if(commandName == "buton-gönder") {


      if(!interaction.member.permissions.has("ADMINISTRATOR")) {
        interaction.reply({content: "Bu komutu uygulayabilmek için gerekli yetkiye sahip değilsin.", ephemeral: true})
        return
      }
    const row = new Discord.MessageActionRow()
    .addComponents(
      new MessageButton()
        .setCustomId("basvuru_buton")
        .setStyle("SUCCESS")
        .setLabel("Başvuru Formu")
        .setEmoji("<:Link_symbol:1011652711156031528>")
    )
    interaction.channel.send({content: "Başvuru için alttaki butona tıklayın.", components: [row]})


  }

  if (commandName == "freelancer-başvur") {


    showModal(freelancer_basvuru, {
      client: client,
      interaction: interaction,
    })

  }

  if (commandName == "kilit-kaldir") {

    let kanal = options.getChannel("kanal")

    if (!interaction.member.permissions.has("MANAGE_CHANNELS")) {
      await interaction.reply({ content: `Bu komutu kullanmak için gerekli yetkiye sahip değilsin.`, ephemeral: true })
      return
    }

    kanal.permissionOverwrites.edit(kanal.guild.roles.everyone, {
      SEND_MESSAGES: true
    }).catch((e) => { console.error(e) })
    await client.channels.cache.get(kanal.id).send(`Kanalın kilidi ${interaction.member} tarafından **kaldırıldı.**`)
    await interaction.reply({ content: `${kanal} Adlı kanalın kilidini **kaldırdın.**`, ephemeral: true })
  }

  if (commandName == "kilitle") {

    let kanal = options.getChannel("kanal")

    if (!interaction.member.permissions.has("MANAGE_CHANNELS")) {
      await interaction.reply({ content: `Bu komutu kullanmak için gerekli yetkiye sahip değilsin.`, ephemeral: true })
      return
    }

    kanal.permissionOverwrites.edit(kanal.guild.roles.everyone, {
      SEND_MESSAGES: false
    }).catch((e) => { console.error(e) })
    await client.channels.cache.get(kanal.id).send(`Kanal ${interaction.member} tarafından **kilitlendi.**`)
    await interaction.reply({ content: `${kanal} Adlı kanalı **kilitledin.**`, ephemeral: true })
  }

  if (commandName == "temizle") {

    if (!interaction.member.permissions.has("ADMINISTRATOR")) {
      await interaction.reply({ content: `Bu komutu kullanabilmek için gerekli yetkiye sahip değilsin!`, ephemeral: true })
      return
    }

    let sayi = options.getInteger("sayi")

    if (sayi > 100) return interaction.reply({ content: "Girdiğin sayı en 100'ü aşmamalı!", ephemeral: true })

    await interaction.channel.messages.fetch({ limit: sayi }).then(messages => {
      interaction.channel.bulkDelete(messages).catch(e => { })
    });


    setTimeout(() => {
      interaction.channel.send({ content: "<:blurple_verified:1011375962203635772> **|** `" + `${sayi}` + "` adet mesajı başarıyla sildim!" }).then(cs => {
        setTimeout(() => {
          cs.delete().catch(e => { })
        }, 5000)
      }).catch(e => { })
    }, 2000)


  }

  if (commandName == "yavaş-mod-ayarla") {
    let kanal = options.getChannel("kanal")
    let saniye = options.getInteger("saniye")

    if (!interaction.member.permissions.has("MANAGE_CHANNELS")) {
      await interaction.reply({ content: `Bu komutu kullanmak için gerekli yetkiye sahip değilsin.`, ephemeral: true })
      return
    }
    await kanal.setRateLimitPerUser(saniye);
    await interaction.reply({ content: `${kanal} Adlı kanalın yavaş-mod'u **${saniye}** saniye olarak ayarlandı.`, ephemeral: true })

  }
  if (commandName == "oneri-sistemi-ayarla") {
    let kanal = options.getChannel("kanal")

    if (!interaction.member.permissions.has("ADMINISTRATOR")) {
      await interaction.reply({ content: `Bu komutu kullanmak için gerekli yetkiye sahip değilsin.`, ephemeral: true })
      return
    }

    db.set(`öneri-sistemi-${interaction.guild.id}`, kanal.id)
    await interaction.reply({ content: `Öneri kanalı ${kanal} olarak **ayarlandı.**`, ephemeral: true })
    return
  }
})

client.on("modalSubmit", async (modal) => {
  if (modal.customId == "freelancer_basvuru") {
    const isim = modal.getTextInputValue("basvuru_isim")
    const yas = modal.getTextInputValue("basvuru_yas")
    const alan = modal.getTextInputValue("basvuru_alan")
    const odeme = modal.getTextInputValue("basvuru_odeme")
    const tecrube = modal.getTextInputValue("basvuru_tecrube")
    await modal.deferReply({ ephemeral: true })
    const embed2 = new Discord.MessageEmbed()
      .setColor("WHITE")
      .setAuthor({ name: "Freelancer Başvuru Formu", iconURL: modal.member.displayAvatarURL() })
      .addFields({ name: 'Kullanıcı', value: `${modal.member}`, inline: true })
      .addFields({ name: 'İsim', value: `**${isim}**`, inline: true })
      .addFields({ name: 'Yaş', value: `**${yas}**`, inline: true })
      .addFields({ name: 'Hizmet/Satış', value: `${alan}`, inline: true })
      .addFields({ name: 'Ödeme Araçları', value: `${odeme}`, inline: true })
      .addFields({ name: 'Tecrübe', value: `${tecrube}`, inline: false })
      .setThumbnail(modal.member.displayAvatarURL())
      .setFooter(`${modal.guild.name} `, modal.guild.iconURL())
      .setTimestamp()

    client.channels.cache.get("1011611004620251240").send({ embeds: [embed2] })
    modal.followUp({ content: "Başvuru formunuz gönderildi." })
  }
})

client.login(ayarlar.token);
