# Database

This project uses MongoDB for storing data.

Core game data is obtained from the [Shop Titans Data Spreadsheet](https://docs.google.com/spreadsheets/d/1WLa7X8h3O0-aGKxeAlCL7bnN8-FhGd3t7pz2RCzSg8c) by the [gather script](#gather-script). These collections are in the **shopData** database.

| Collection                                             | Spreadsheet Source                                      | Gather                                                               | Schema                                                         |
| ------------------------------------------------------ | ------------------------------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------- |
| blueprints                                             | Blueprints                                              | <center><p align = "center"> :white_check_mark: </p> </center>       | <center><p align = "center"> :white_check_mark: </p> </center> |
| furniture                                              | Racks, Counters & Trunks <br /> Resource Bins           | <center><p align = "center"> :white_check_mark: </p> </center>       | <center><p align = "center"> :white_check_mark: </p> </center> |
| slots                                                  | Slots <br /> Shop Expansions <br /> Basement Expansions | <center><p align = "center"> :hourglass_flowing_sand: </p> </center> | <center><p align = "center"> :white_check_mark: </p> </center> |
| <center><p align = "center"> :question: </p> </center> | Merchant Levels                                         |
| <center><p align = "center"> :question: </p> </center> | Guild Perks                                             |
| <center><p align = "center"> :question: </p> </center> | Guild Boosts                                            |
| <center><p align = "center"> :question: </p> </center> | Collection Book                                         |

User data exists in the **shopUser** database. The **account** collection represents data that must be input. The data for this collection is built manually.

| Collection |
| ---------- |
| account    |

### Ongoing Work

I haven't decided how I want the database to be deployed yet, so I am running it from a static host and connecting to that singular host from whichever device I am using at the time. I'm interested in exploring beyond a single monolithic database but for now it'll have to do. My work on the shopData side of things is built to be reproducable anyway so that'll work under either situation.

The data organization and structure I have implemented with `shopData.furniture` and `shopData.blueprints` are my best guess on how these things should be structured and so I expect they will evolve. I want the database to be the driver of these changes, so when things shift they'll shift here first.

Integration with scripts will be nice, but it's not a priority until the structure things will take is more established. Some tinkering with this is evident on the gather script and may even work with the current iteration of the database.

### TODO

- Establish a protocol for applying Schemas (I'm enjoying the lack of description used for `account.js`)

- How to store Blueprint data?

# Scripts

| Script | Language   | Status                            |
| ------ | ---------- | --------------------------------- |
| Gather | TypeScript | Runnable; Functionality expanding |

## Gather Script

The gather script harvests the latest data from the [Shop Titans Data Spreadsheet](https://docs.google.com/spreadsheets/d/1WLa7X8h3O0-aGKxeAlCL7bnN8-FhGd3t7pz2RCzSg8c) and transforms it into a form that the database can consume.

### Usage

```bash
cd scripts/gather
npx tsc
node ./dist/gather.mjs
```

### Ongoing Work

Some tools are available for connecting to mongoDB, but this script is most useful in producing data to import manually.

See the [Database](#database) section for a tabular representation of the tables and source sheets that have been worked on. The list includes only those that are relevant for phase 1 (and blueprints). I'm thinking of "Phase 1" as the outline represented by the account object from `shop.js` in scripts/gather/notes.

Anyway, I've been hand-constructing a schema for the table and then using the gather script to generate the data seed for that table and so that's what is tracked in the columns on the table.

### TODO

- oracle + seeker is fine for now, but is there a grand unifying approach that could combine the two?

- When it comes time to build the populate script: Older versions of the gather script have some functionality that will be useful.
