For context, I initially wanted to run mongoDB through docker, but the mac I'm using for this is not able to run docker because it's so old. That's why I went the local route for prototyping. (Mac is also too old to use Compass, ffs)

I had previously installed mongoDB on this mac, so I'm going to use it to test out these scripts that I'm creating.

I'm just going to copy-paste them into the terminal to start. Haha, this works but it takes a couple minutes of scrolling. That's only going to get longer, so let's find a different approach.

There's a command `>mongosh < schema.js` which runs the script directly. It still seems to scroll through all the lines, but at least it's automatic.

I added a bit to the main.ts script itself that resets the database, adds the schema and then adds the blueprints. It seems to work just fine, and even goes pretty quick without showing each individual step. The script output doesn't show the commands being run, which I'm not the biggest fan of. It fails when document's don't adhere to the schema too which is great.

This will work for now, but it assumes that the mongo shell is available directly from the device running the script which may not always be true.

Added a single command evaluation into the script that samples a random blueprint and outputs it to give an idea of what's being added to the database.

Alright, ran into some bizarre troubles when I got to expanding the crafting section. For one thing, it was rejecting what appeared to be accurate entries for not having an array property (which must mean ascensionUpgrades) but they absollutely did, so what gives? I ended up running the following command: `config.set('inspectDepth', 100)` and now it is finding all sorts of stuff flawlessly. Turns out the default is 6? Still not clear why that was causing the array error in particular, but alas.

Next up, the goldPerCraftingSecond value caused issues because it wants to be numbers with decimal points only when it's not a rounded integer. This should be no trouble to resolve by just tacking a `.00` to the end of an integer, but since I'm temporarily holding onto these values in a javascript file that I want to be correct for formatting I've hit a wall. What I decided to do was just store them as a string for now and maybe come back through and do a bulk operation later to make them into a properly formatted double? I'm not too concerned since this is only a problem on the 'x per y' values which I don't really care about anyway.

Didn't notice until now, but I had a bug where the materials being added to every bp were always the same materials as the randomly selected bp earlier in the script (components too). I've got some awkward bits where the functions in the main script are relying on global vars declared earlier in the script which isn't great. I want to move to using a helper class that takes care of the csv data parsing, but I will do that after finishing making my way through the blueprint object structure.
