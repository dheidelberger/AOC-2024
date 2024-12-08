# AOC-2024

Repo for Advent of Code, 2024

Work in progress

#### Notes regarding API queries

The scripts for downloading puzzle input/APIs are very much a work in progress. Posting this Readme before writing the code to comply with the community rules for a link. The download script will be located in Utilities/inputUtils.js

The intent is for inputUtils to follow the automation guidelines on the /r/adventofcode [community wiki](https://www.reddit.com/r/adventofcode/wiki/faqs/automation)

Specifically:

-   Once inputs are downloaded, they will be cached locally
-   While outbound calls are not throttled per se, they are manually triggered and should only happen the first time a day's code is run (after which, input will be cached).
-   User agent header will be set in setUserAgentHeader() and will refer to myself and to this Readme

Calls to the leaderboard API are, at least for now, manually triggered using the link on the website, with JSON data pasted into a local file. I have no plans to automate this part of the script at present.
