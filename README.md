# Database

This project uses MongoDB for storing data.

Core game data is obtained from the [Shop Titans Data Spreadsheet](https://docs.google.com/spreadsheets/d/1WLa7X8h3O0-aGKxeAlCL7bnN8-FhGd3t7pz2RCzSg8c) by the [populate script](#populate-script). These collections are in the **shopData** database.

| Collection | Spreadsheet Source                            | Populate           | Schema             |
| ---------- | --------------------------------------------- | ------------------ | ------------------ |
| blueprints | Blueprints                                    | :white_check_mark: | :white_check_mark: |
| furniture  | Racks, Counters & Trunks <br /> Resource Bins | :white_check_mark: | :white_check_mark: |
| :question: | Slots                                         |
| :question: | Merchant Levels                               |
| :question: | Shop Expansions                               |
| :question: | Basement Expansions                           |
| :question: | Guild Perks                                   |
| :question: | Guild Boosts                                  |
| :question: | Collection Book                               |

User data doesn't exist yet.
### TODO:

:incoming_envelope: Establish a protocol for applying Schemas

:incoming_envelope: Start a user data database and begin structuring things out for that.
# Scripts

## Populate Script

The populate script harvests the latest data from the [Shop Titans Data Spreadsheet](https://docs.google.com/spreadsheets/d/1WLa7X8h3O0-aGKxeAlCL7bnN8-FhGd3t7pz2RCzSg8c) and transforms it into a form that the database can consume.
### Usage

```bash
cd scripts/populate
npx tsc
node ./dist/populate.mjs
```
### Ongoing Work

Some tools are available for connecting to mongoDB, but this script is most useful in producing data to import manually.

See the [Database](#database) section for a tabular representation of the tables and source sheets that have been worked on. The list includes only those that are relevant for phase 1 (and blueprints). I'm thinking of "Phase 1" as the outline represented by the account object from `shop.js` in scripts/populate/notes.

Anyway, I've been hand-constructing a schema for the table and then using the populate script to generate the data seed for that table and so that's what is tracked in the columns on the table.

### TODO:

:incoming_envelope: oracle + seeker is fine for now, but is there a grand unifying approach that could combine the two?
