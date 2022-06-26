const fs = require('node:fs');
const { Client, Collection, Intents } = require('discord.js');
const { token, ttsChannelId } = require('./config.json');
const { createQueue } = require('./queue');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();
const commandFiles = fs.readdirSync('./tts/main/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.on('message', async message => {
	if (message.channel.id === ttsChannelId ){
		const messageList = createQueue();

		messageList.put(message);
		
	}
})

client.login(token);