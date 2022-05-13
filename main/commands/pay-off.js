const { MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders');

const payer = 'payer';
const total = 'total';
const target = 'target';
const description = 'description';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pay-off')
        .setDescription('Pay off someone.')
        .addUserOption(option => option.setName(`${payer}`).setDescription('The user').setRequired(true))
        .addIntegerOption(option => option.setName(`${total}`).setDescription('The amount').setRequired(true))
        // `addUserOption`を使いたいが，複数選択できないので，`addStringOption`で代替する．
        // 最適解かは不明．
        .addStringOption(option => option.setName(`${target}`).setDescription('The user').setRequired(true))
        .addStringOption(option => option.setName(`${description}`).setDescription('Description').setRequired(true)),
    async execute(interaction) {
        console.log('pay-off');

        const members = interaction.options.getString(`${target}`).split(' ');
        const parameter = (members.length + 1);
        const amount = Math.round(interaction.options.getInteger(`${total}`) / parameter);

        const embed = new MessageEmbed()
            // orangered
            .setColor('#ff4500')
            .setTitle('Pay off')
            .setDescription(`${interaction.options.getString(`${target}`)}`)
            .addFields(
                { name: 'Payer', value: `${interaction.options.getUser(`${payer}`)}`},
                { name: 'Total amount', value: `¥ ${interaction.options.getInteger(`${total}`)}`},
                { name: 'Amount per person (**ROUNDING**)', value: `¥ ${amount}`},
                { name: 'Description', value: `${interaction.options.getString(`${description}`)}`},
                { name: 'Caution', value: 'Please press reaction.'}
            )
            .setTimestamp();
        return interaction.reply({ embeds: [embed] });
    }
};