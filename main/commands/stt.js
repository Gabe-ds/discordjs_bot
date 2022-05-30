const { SlashCommandBuilder } = require('@discordjs/builders')
const { getVoiceConnection, joinVoiceChannel, EndBehaviorType, entersState, VoiceConnectionStatus } = require('@discordjs/voice');
const { createWriteStream } = require('fs');
const { pipeline } = require('stream');
const prism = require('prism-media');

// ▽▽ from gcp official
const speech = require('@google-cloud/speech');
const speechClient = new speech.SpeechClient();
const sttRequest = {
    config: {
        encoding: 'LINEAR16',
        sampleRateHertz: 48000,
        languageCode: 'ja-JP',
    }
};
// △△ from gcp official

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stt')
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
                .setName('record')
                .setDescription('Record voice channel')),

    async execute(interaction) {
        // 音声接続
        if (interaction.options._subcommand === 'join') {


            const channel = interaction.options.getChannel('channel');
            console.log(`${interaction}(${channel.name})`);
            // ボイスチャンネル以外が入力された場合の処理
            if (channel.type !== 'GUILD_VOICE') {
                return interaction.reply('This is not a voice channel.');
            }
            const connection = joinVoiceChannel({
                guildId: channel.guild.id,
                channelId: channel.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
            });
            console.log(connection)
            return interaction.reply(`Joined ${channel.name}`);
        };

        // 音声切断
        if (interaction.options._subcommand === 'leave') {
            console.log(`${interaction}`);
            
            const connection = getVoiceConnection(interaction.guild.id);
            connection.destroy();
            return interaction.reply('Left');
        };

        // 録音
        if (interaction.options._subcommand === 'record') {
            console.log(`${interaction}`);

            const connection = getVoiceConnection(interaction.guild.id);
            const receiver = connection.receiver;
            const userId = interaction.user;

            if (connection.receiver.speaking.users.has(userId)) {
                const opusStream = receiver.subscribe(userId, {
                    end: {
                        behavior: EndBehaviorType.AfterSilence,
                        duration: 100,
                    },
                });

                const oggStream = new prism.opus.OggLogicalBitstream({
                    opusHead: new prism.opus.OpusHead({
                        channelCount: 2,
                        sampleRate: 48000,
                    }),
                    pageSizeControl: {
                        maxPageSize: 10,
                    },
                });

                const filename = `./main/recordings/${Date.now()}.ogg`;

                const out = createWriteStream(filename);

                console.log(`Started recording ${filename}`);

                pipeline(opusStream, oggStream, out, (err) => {
                    if (err) {
                        console.warn(`Error recording file ${filename} - ${err.message}`);
                    } else {
                        console.log(`Recorded ${filename}`);
                    }
                });

                await interaction.reply('Listening...');
            } else {
                await interaction.reply('Join a voice channel and then try that again!');
            }
        };
    }
};