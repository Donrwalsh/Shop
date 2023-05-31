For context, I initially wanted to run mongoDB through docker, but the mac I'm using for this is not able to run docker because it's so old. That's why I went the local route for prototyping. (Mac is also too old to use Compass, ffs)

I had previously installed mongoDB on this mac, so I'm going to use it to test out these scripts that I'm creating.

I'm just going to copy-paste them into the terminal to start. Haha, this works but it takes a couple minutes of scrolling. That's only going to get longer, so let's find a different approach.

There's a command `>mongosh < schema.js` which runs the script directly. It still seems to scroll through all the lines, but at least it's automatic.

I added a bit to the main.ts script itself that resets the database, adds the schema and then adds the blueprints. It seems to work just fine, and even goes pretty quick without showing each individual step. The script output doesn't show the commands being run, which I'm not the biggest fan of. It fails when document's don't adhere to the schema too which is great.

This will work for now, but it assumes that the mongo shell is available directly from the device running the script which may not always be true.

Added a single command evaluation into the script that samples a random blueprint and outputs it to give an idea of what's being added to the database.
