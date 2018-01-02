exports.description = "Shows information about an ability."

const request = require('request'),
    requireFromUrl = require('require-from-url/sync'),
    Matcher = require('did-you-mean'),
    footers = require('../data/footers.js'),
    func = require('../data/functions.js')
let abilities,
    tFooter;

request('https://raw.githubusercontent.com/Zarel/Pokemon-Showdown/master/data/abilities.js', (err, res, body) => {
    if (!err && res.statusCode == 200) {
        abilities = requireFromUrl('https://raw.githubusercontent.com/Zarel/Pokemon-Showdown/master/data/abilities.js').BattleAbilities;
    } else {
        console.log('Error fetching Showdown abilities; Switching to local abilities...');
        abilities = require('../data/abilities.js').BattleAbilities;
    }
    match = new Matcher(Object.keys(abilities).join(' '));
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
    tFooter = Math.floor(Math.random() * 15) == 0 ? {
        text: footers[Math.floor(Math.random() * footers.length)],
        icon_url: 'https://cdn.rawgit.com/110Percent/beheeyem/gh-pages/include/favicon.png'
    } : null;
    let abilityName = args.join(" ").toLowerCase();
    if (aliases[abilityName]) {
        abilityName = aliases[abilityName];
    }
    abilityName = abilityName.toLowerCase();
    for (var i = 0; i < Object.keys(abilities).length; i++) {
        if (abilities[Object.keys(abilities)[i]].name.toLowerCase() == abilityName) {
            var ability = abilities[Object.keys(abilities)[i]];
            break;
        }
    }
    if (ability) {
        var abilityDesc = ability.desc;
        if (!abilityDesc) {
            abilityDesc = ability.shortDesc;
        }
        msg.channel.send("\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\n\n**" + func.capitalizecapitalizeFirstLetter(ability.name) + "**", {
            embed: {
                color: 35071,
                fields: [{
                        name: "Description",
                        value: abilityDesc
                    },
                    {
                        name: "Rating (-2 to 5)",
                        value: String(ability.rating)
                    },
                    {
                        name: "External Resources",
                        value: "[Bulbapedia](http://bulbapedia.bulbagarden.net/wiki/" + func.capitalizeFirstLetter(ability.name.replace(" ", "_")) + "_(Ability\\))  |  [Smogon](http://www.smogon.com/dex/sm/abilities/" + ability.name.toLowerCase().replace(" ", "_") + ")  |  [PokémonDB](http://pokemondb.net/ability/" + ability.name.toLowerCase().replace(" ", "-") + ")"
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
        msg.channel.send("⚠ Ability not found! " + dymString);
    }
}
