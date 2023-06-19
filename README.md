## Populate Script

### Using
> `cd scripts/populate`
> `npx tsc`
> `node ./dist/populate.mjs`

### Current State
Some tools are available for connecting to mongoDB, but this script is most useful in producing data to import manually.

Script will fetch all spreadsheet data by version.

Script will output complete json file for blueprints.

Script will output complete json file for furniture (includes racks, counters, trunks and resource bins)

### TODO:
[] Is the current state of the database just the data or did I get the schema in there?
[] oracle + seeker is fine for now, but is there a grand unifying approach that could combine the two?