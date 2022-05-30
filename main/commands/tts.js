// const fs = require('fs');
// const path = require('path');

const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders')
const { getVoiceConnection, joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tts')
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
        // .addSubcommand(subcommand =>
        //     subcommand
        //         .setName('set')
        //         .setDescription('Set Text-to-Speech channel')
        //         .addChannelOption(option => option.setName('channel').setDescription('The channel').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('help')
                .setDescription('Show help')),
    async execute(interaction) {
        
        // チャンネル指定の処理を追加する
        // BotがVCにいるかどうかを確認する処理を追加する

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
        // // テキストチャンネル設定
        // if (interaction.options._subcommand === 'set') {
        //     console.log(`${interaction}`);
        //     const ttsChannel = interaction.options.getChannel('channel');
        //     if (channel.type !== 'GUILD_TEXT') {
        //         return interaction.reply('This is not a text channel.');
        //     }
        //     const config = JSON.parse(
        //         fs.readFileSync(
        //             path.resolve(__dirname, './main/config.json')
        //         )
        //     );
        //     config.ttsChannel = ttsChannel.id;
        //     fs.writeFileSync(
        //         path.resolve(__dirname, './main/config.json'),
        //         JSON.stringify(config, null, '    '),
        //         'utf-8'
        //     );
        // }
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