# Backend

Used `>nest new backend` to create the files on this branch. Run app with `npm run start` in the `backend` folder. Navigate to http://localhost:3000/ for a Hello World! message.

Used `>npm install --save @nestjs/swagger` because I love Swagger. Visit http://localhost:3000/swagger for the Swagger interface.

Run in hot reload mode using `>npm run start:local`. `>npm run server` is better because it includes an initial clean command.

This guide has been super helpful for basic Mongoose connection into MongoDB: https://medium.com/globant/crud-application-using-nestjs-and-mongodb-99a0756adb76. Hooked into MongoDB and made successful get all and get by id blueprint endpoints.

Merchant level data makes for a good actual starting point since that'll likely be the first entry for a user data form.

Dockerfile example from https://www.tomray.dev/nestjs-docker-production. `>docker build -t shop-api .` and then `>docker run -p3000:3000 shop-api` to run it.

### TODO

- Need some furniture data to the frontend!

- Enhance the Level model to cover all attributes. Use this data as a model for readonly data.

- How to share the Blueprint (and others) model between the backend and scripts and beyond? (Currently I just duplicated the file across both)

- I have account data in a different database (non shopData) but the Mongoose for root hooks into a single database.

# Database

This project uses MongoDB for storing data.

Core game data is obtained from the [Shop Titans Data Spreadsheet](https://docs.google.com/spreadsheets/d/1WLa7X8h3O0-aGKxeAlCL7bnN8-FhGd3t7pz2RCzSg8c) by the [gather script](#gather-script). These collections are in the **shopData** database.

| Collection                                             | Spreadsheet Source                                      | Gather                                                         | Schema                                                         |
| ------------------------------------------------------ | ------------------------------------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------- |
| blueprints                                             | Blueprints                                              | <center><p align = "center"> :white_check_mark: </p> </center> | <center><p align = "center"> :white_check_mark: </p> </center> |
| furniture                                              | Racks, Counters & Trunks <br /> Resource Bins           | <center><p align = "center"> :white_check_mark: </p> </center> | <center><p align = "center"> :white_check_mark: </p> </center> |
| slots                                                  | Slots <br /> Shop Expansions <br /> Basement Expansions | <center><p align = "center"> :white_check_mark: </p> </center> | <center><p align = "center"> :white_check_mark: </p> </center> |
| levels                                                 | Merchant Levels                                         | <center><p align = "center"> :white_check_mark: </p> </center> | <center><p align = "center"> :white_check_mark: </p> </center> |
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

- How to store Blueprint data? - first iteration in `database/data/account.json`

- I need to store slots data and then guild perks data in the account data structure.

# Frontend

`>npm init @angular frontend`

Basic data service connecting to the API. The `proxy.conf.json` file and related updates to the `angular.json` file are important for resolving CORS errors.

Using bootstrap for ease of frontend. Working with a single input field for level which returns info based on data from API.

`>npm install @swimlane/ngx-datatable`

Working on NgRx. I'm using it to store spreadsheet data for the whole application which is a bit of a different pattern than I'm used to (account data will be more standard). So where I landed on this is I will do an initial grab of all the spreadsheet data from the backend (this can be avoided if the data already exists, and since I hooked up the rehydration from localStorage this is expected) (Also, this is where I would implement some sort of version check. Record the current version of the data in the store and then rely on the API to know if a newer collection of data is available.) and then I get access into the specific insight that I care about by using selectors. The advantage with this is that the component gets to enjoy the data it wants and the selector gets to be a location where the logic resides for this sort of thing. I'm not used to this and have generally used selectors as just outright lookup of data (so under my usual approach, I would have a reducer write the min/max furniture values to distinct attributes and just read those) which I'm excited to continue playing with because it feels like a really cool plan. But even then, I'm not sure what the reducer will get up to. Hm, not sure. Read this: https://timdeschryver.dev/blog/parameterized-selectors#memoization

Anyway, I added NgRx store, effects and devtools to get the ball rolling. All ss data goes into the `data` slice in the raw and account stuff will be managed in a separate `account` slice.

### TODO

- Next up is getting the `levels` call to behave like the `slots` one does. Account is after, but that's a whole different ballgame.

- FURNITURE AS A DATA TABLE WOOO. But don't change the database structure. I should only need an array of integers representing table levels to show data table stuff (and manage data that way too)

- Proper formatting and commas on xp tnl input field.

- NgRx and level input connected to account data in database.

- Number inputs, level and xp tnl with validation based on values driven by level data.

- Naturally, changes to these values need to persist to the database

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

# User Stories

**As a user, I want the ability to save information about my Shop Titans account and be presented with insights backed by spreadsheet game data. For example I would enter my furniture collection details and be able to explore loadouts and costs to upgrade milestones.**

This user story has been rolling around in my brain for a while. You don't have to try too hard to find offhand references to it throughout this project. Sometimes I would call it "Phase 1". In any case, the basic core of an application is outlined in the above sentence and example.

Because what's described here sounds a lot like a fully functional app, one of the earliest things I'm considering is the stack. I've landed on the following setup:

| Thing    | Language     | Comfort Level                                           |
| -------- | ------------ | ------------------------------------------------------- |
| Database | MongoDB      | New to MongoDB, some experience with other NoSQL DBs.   |
| API      | NestJS       | Pretty comfortable.                                     |
| Frontend | Angular      | Extremely comfortable.                                  |
| Build    | Jenkins      | Pretty comfortable.                                     |
| Hosting  | Raspberry Pi | (I have one sitting around that I want to use for this) |

I've spent more time working on the frontend than the backend in my career so a big focus of this project is to get some experience from the backend perspective. MongoDB was the first choice that was locked in and the rest were obvious picks after that. So the database is the first-class citizen in this application and the order I'm building things demonstrates that.

The first order of business is populating the database. It will hold scraped data from the data spreadsheet, so I built a script that pulls data from the spreadsheet and then transforms that data from csv form into a document that can be added to a MongoDB collection. At this point in time I'm more comfortable taking the raw file that is output by my script and manually applying it to the database but this is a step that will certainly be automated at a later time.

I'm learning the basics of MongoDB at this time, so I'm making decisions about the structure of these documents that may need to change later. That's ok. We're in a sort of version 0 right now where things might shift as necessary but will be more solidified once the database becomes integrated with other parts of the app. Even then, I'd prefer to be comfortable changing document structure if it makes sense to do so.

I'm working in this space for now, continuing through the table of data I've flagged as necessary for this user story in the [Database](#database) section. From there I need to work the frontend and API and then hook the three of them together with the build server automatically sending updated builds to my Pi when I push new code.
