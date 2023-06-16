## Populate Script

### Using
> `cd scripts/populate`
> `npx tsc`
> `node ./dist/populate.mjs`

### Current State
Some tools are available for connecting to mongoDB, but this script is most useful in producing data to import manually.

Script will fetch all spreadsheet data by version.

Script will output complete json file for blueprints.

Script will output incomplete json file for furniture (includes racks, counters and trunks but needs resourceBins)

### TODO:
[] Is the current state of the database just the data or did I get the schema in there?
[] populate.mts is gathering furniture data in an awkward way. This should be improved.