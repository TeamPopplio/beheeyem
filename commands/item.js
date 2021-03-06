exports.description = "Shows information about an item."

var request = require('request'),
    requireFromUrl = require('require-from-url/sync'),
    Matcher = require('did-you-mean'),
    func = require("../data/functions.js")
    footers = require('../data/footers.js');
let items,
    aliases,
    tFooter;


request('https://raw.githubusercontent.com/Zarel/Pokemon-Showdown/master/data/items.js', (err, res, body) => {
    if (!err && res.statusCode == 200) {
        items = requireFromUrl('https://raw.githubusercontent.com/Zarel/Pokemon-Showdown/master/data/items.js').BattleItems;
    } else {
        console.log('Error fetching Showdown items; Switching to local items...');
        items = require('../data/pokedex.js').BattleItems;
    }
    match = new Matcher(Object.keys(items).join(' '));
});
request('https://raw.githubusercontent.com/Zarel/Pokemon-Showdown/master/data/aliases.js', (err, res, body) => {
    if (!err && res.statusCode == 200) {
        aliases = requireFromUrl('https://raw.githubusercontent.com/Zarel/Pokemon-Showdown/master/data/aliases.js').BattleAliases;
    } else {
        console.log('Error fetching Showdown aliases; Switching to local aliases...');
        aliases = require('../data/aliases.js').BattleAliases;
    }
});
exports.action = (msg, args) => {
    var itemName = args.join(" ").toLowerCase();
    if (aliases[itemName]) {
        itemName = aliases[itemName];
    }
    itemName = itemName.toLowerCase();
    var item;
    for (var i = 0; i < Object.keys(items).length; i++) {
        if (items[Object.keys(items)[i]].id.toLowerCase() == itemName.replace(" ", "").replace("'", "")) {
            item = items[Object.keys(items)[i]];
            break;
        }
    }
    tFooter = Math.floor(Math.random() * 15) == 0 ? {
        text: footers[Math.floor(Math.random() * footers.length)],
        icon_url: 'https://cdn.rawgit.com/110Percent/beheeyem/gh-pages/include/favicon.png'
    } : {
        text: func.capitalizeFirstLetter(item.name),
        icon_url: "https://raw.githubusercontent.com/110Percent/beheeyem-data/master/sprites/items/" + item.name.toLowerCase().replace(" ", "-") + ".png"
    };
    if (item) {
        msg.channel.send("\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\n\n**" + func.capitalizeFirstLetter(item.name) + "**", {
            embed: {
                color: 35071,
                fields: [{
                        name: "Description",
                        value: item.desc
                    },
                    {
                        name: "Generation Introduced",
                        value: item.gen,
                        inline: true
                    },
                    {
                        name: "Item ID",
                        value: item.num,
                        inline: true
                    },
                    {
                        name: "External Resources",
                        value: "[Bulbapedia](http://bulbapedia.bulbagarden.net/wiki/" + func.capitalizeFirstLetter(item.name.replace(" ", "_").replace("'", "")) + ")  |  [Smogon](http://www.smogon.com/dex/sm/items/" + item.name.toLowerCase().replace(" ", "_").replace("'", "") + ")  |  [PokémonDB](http://pokemondb.net/item/" + item.name.toLowerCase().replace(" ", "-").replace("'", "") + ")"
                    }
                ],
                footer: tFooter
            }
        });
    } else {
        let dym = match.get(args.join(" "));
        let dymString;
        if (dym == null) {
            dymString = 'Check your spelling and try again.';
        } else {
            dymString = `Did you mean \`${dym}\`?`;
        }
        msg.channel.send("⚠ Item not found! " + dymString);
    }
}