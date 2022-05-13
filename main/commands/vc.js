const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders')
const { getVoiceConnection, joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vc')
        .setDescription('Voice channel')
        .addSubcommand(subcommand =>
            subcommand
                .setName('join')
                .setDescription('Join voice channel')
                .addChannelOption(option => option.setName('channel').setDescription('The channel').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('leave')
                .setDescription('Leave voice channel'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('help')
                .setDescription('Show help')),

    async execute(interaction) {
        // 音声接続
        if (interaction.options._subcommand === 'join') {
            const channel = interaction.options.getChannel('channel');
            console.log(`${interaction}`);
            // ボイスチャンネル以外が入力された場合の処理
            if (channel.type !== 'GUILD_VOICE') {
                return interaction.reply('This is not a voice channel.');
            }
            const connection = joinVoiceChannel({
                guildId: channel.guild.id,
                channelId: channel.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
            });
            return interaction.reply(`Joined ${channel}`);
        }
        // 音声切断
        if (interaction.options._subcommand === 'leave') {
            console.log(`${interaction}`);
            const connection = getVoiceConnection(interaction.guild.id);
            connection.destroy();
            return interaction.reply('Left');
        }
        // ヘルプ
        if (interaction.options._subcommand === 'help') {
            console.log(`${interaction}`);

            const embed = new MessageEmbed()
                // orangered
                .setColor('#ff4500')
                .setTitle('Text-to-Speech')
                .setDescription('This is a voice channel command.')
                .addFields(
                    { name: 'help', value: 'Show this message.' },
                    { name: 'join <VOICE_CHANNEL>', value: 'Join voice channel.' },
                    { name: 'leave', value: 'Leave voice channel.' },
                )
                .setTimestamp();
            return interaction.reply({ embeds: [embed] });
        }
    }
};