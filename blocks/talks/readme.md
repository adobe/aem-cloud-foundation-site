# Talks block

This block displays a list of talks, with the respective speaker details.

## Usage

Create a Google spreadsheet named `talks` with columns named `Title`, `URL`, `Blurb`, `Date` and `Speaker`.  

Example:

| Title                                                                                            | URL                           | Blurb                                                                                                                                                           | Date     | Speaker                     |
|--------------------------------------------------------------------------------------------------|-------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|-----------------------------|
| Navigating the Technological Frontier: Smuggling Secrets, Hyperdrives, and the Millennium Falcon | https://galaxytech.io/talks/1 | Join renowned smuggler Han Solo as he shares his expertise on leveraging cutting-edge technology for intergalactic adventures and daring escapades              | Jun 2023 | Han Solo                    |
| The Dual Forces of Technology: Uniting Light and Dark for Galactic Innovation                    | https://galaxytech.io/talks/2 | Luke Skywalker and Darth Vader, once adversaries, now unite to explore the harmony of technology, bridging the gap between light and dark for galactic progress | Apr 2022 | Luke Skywalker, Darth Vader |

When a talk has several speakers, separate the speaker names with a comma. 

Create another Google spreadsheet named `speakers` with columns named `Name`, `Picture` and `Bio`. Example:

| Name           | Picture                              | Bio                                                                                                                                        |
|----------------|--------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------|
| Han Solo       | https://galaxytech.io/speakers/1.jpg | Roguish smuggler, skilled pilot, quick-witted, and resourceful.                                                                            |
| Luke Skywalker | https://galaxytech.io/speakers/2.jpg | Heroic Jedi. Rebel leader. Son of Anakin Skywalker. Guided by the Force, I bring hope to the galaxy.                                       |
| Darth Vader    | https://galaxytech.io/speakers/3.jpg | Once a Jedi Knight, now Sith Lord Darth Vader. Master of the dark side, enforcing the will of the Emperor. Embrace the power of the Force. |

Make sure the values in the `Speaker` column of the `talks` sheet match the values in the `Name` column of the `speakers` sheet, 
otherwise the speaker details will not be displayed. 

Finally, create a table in the Word document, with 1 row, with the text 
`Talks` in the cell. Example:

| Talks    |
|----------|

By default, the `talks` and `speakers` sheets are loaded from the `/talks` and 
`/speakers` paths, respectively. If you created the spreadsheets in another location,
you can specify the paths by adding 2 new rows with 2 columns to the table. Here's an example:

| Talks    |                        |
|----------|------------------------|
| talks    | /some/path/my-talks    |
| speakers | /some/path/my-speakers |

