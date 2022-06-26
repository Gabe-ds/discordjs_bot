const { getVoiceConnection, joinVoiceChannel } = require('@discordjs/voice')
const { MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tts')
        .setDescription('Text to Speech')
        .addSubcommand(subcommand =>
            subcommand
                .setName('join')
                .setDescription('Join voice channel')
                .addChannelOption(option =>
                    option
                        .setName('channel')
                        .setDescription('The channel')
                        .setRequired(true)
                    )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('leave')
                .setDescription('Leave voice channel')
        ),
    async execute(interaction) {
        console.log(interaction.user.username);

        if (interaction.options.getSubcommand() === 'join') {
            const channel = interaction.options.getChannel('channel');

            if (channel.type !== 'GUILD_VOICE') {
                return interaction.reply(`${channel} is not a voice channel.`);
            }

            const connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
            });
            return interaction.reply(`Joined ${channel}`);
        };

        if (interaction.options.getSubcommand() === 'leave') {
            const connection = getVoiceConnection(interaction.guild.id);
            connection.destroy();
            return interaction.reply("Good bye!");
        };
    }
};