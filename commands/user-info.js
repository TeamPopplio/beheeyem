exports.description = "'`-user-info <mention>`\nDisplays informaton on a user.'"

const moment = require('moment'),
    func = require("../data/functions.js");

let statusEmojis = {
    'online': '<:online:313956277808005120>',
    'offline': '<:offline:313956277237710868>',
    'idle': '<:away:313956277220802560>',
    'dnd': '<:dnd:313956276893646850>',
    'streaming': '<:streaming:313956277132853248>'
}

exports.action = (msg, args) => {

    let targetUser;

    targetUser = msg.guild.members.get(msg.author.id);
    if (args.join(" ")) {
        if (msg.mentions) {
            if (msg.mentions.users) {
                targetUser = msg.guild.members.get(msg.mentions.users.first().id);
            }
        }
    }
    let cStatus = targetUser.user.presence.status;
    if (targetUser.user.presence.game && targetUser.user.presence.game.streaming) cStatus = 'streaming';
    msg.channel.send('**' + targetUser.displayName + '**', {
        embed: {
            thumbnail: {
                url: targetUser.user.displayAvatarURL
            },
            fields: [{
                    name: 'Tag',
                    value: targetUser.user.username + '#' + targetUser.user.discriminator + (targetUser.user.bot ? '<:botTag:230105988211015680>' : ''),
                    inline: true
                },
                {
                    name: 'ID',
                    value: targetUser.user.id,
                    inline: true
                },
                {
                    name: 'Guild Join Date',
                    value: moment(targetUser.joinedTimestamp).calendar(),
                    inline: true
                },
                {
                    name: 'Account Creation Date',
                    value: moment(targetUser.user.createdTimestamp).calendar(),
                    inline: true
                },
                {
                    name: 'Last Seen',
                    value: targetUser.user.lastMessage ? moment(targetUser.user.lastMessage.createdTimestamp).calendar() + ' (Eastern)' : 'Unknown',
                    inline: true
                },
                {
                    name: 'Status',
                    value: statusEmojis[cStatus] + ' Currently **' + func.capitalizeFirstLetter(cStatus) + "**",
                    inline: true
                },
                {
                    name: 'Roles',
                    value: targetUser.roles.map(c => c.name).join(', ')
                }
            ]
        }
    });
}