# LinkedIn Resume

Parse LinkedIn data export into JSON Resume format.

- [LinkedIn Resume](#linkedin-resume)
  - [Getting LinkedIn Data](#getting-linkedin-data)
  - [The Parse Script](#the-parse-script)
    - [Using the Parse Script](#using-the-parse-script)
  - [Override LinkedIn Data](#override-linkedin-data)
  - [Cleanup](#cleanup)
  - [Validate.js](#validatejs)

## Getting LinkedIn Data

Login to your LinkedIn account, then navigate here: https://www.linkedin.com/psettings/member-data

Request a copy of your data. It should take some time to prepare the archive, and you'll be given the chance to initially download the `basic` version, and a `complete` version. The `complete` version will take up to 72 hours to prepare. LinkedIn will email you a link when it's ready.

Once you have either the `basic` or `complete` version of your data, which should come in a `.zip` file, drop it into the `/DataExport` folder.

## The Parse Script

The `parseDataExport.js` script will check the `/DataExport` folder for any data export archives, and automatically extract the zipped files, parse all the CSV files, and convert the LinkedIn data into a JSON resume object. When it's complete you can find the `*_resume.json` file in the root of this project folder.

### Using the Parse Script

How to use the script:

1. `yarn install`

2. `node parseDataExport.js`

3. Optionally validate the output resume.json against the json schema

    - `node parseDataExport.js -v`

    - This does the same operation as step 2 but will let you know if there are any invalid properties or values.

## Override LinkedIn Data

Some information might be missing or can't be put into a corresponding resume.json object correctly, in that case you can specify the data in the correct/desired format in `overrides/override.json`.

The `override.json` file has the same schema as a `resume.json` file, expect it only needs the property/values that you wish to manually override. See the `overrides/example_override.json` for an example.

When the script runs, it will automatically merge the `override.json` object with the data from the LinkedIn data export.

## Cleanup

It's quite likely the output will not be valid, check the resulting output `*_resume.json` and make manual edits to fix it.

Then use the `validate.js` script to check the `resume.json` file is valid. It's recommended to rename the `*_resume.json` after making any changes, as running the `parseDataExport.js` script again will overwrite your changes.

## Validate.js

Usage:

```shell
node validate.js <your_resume.json>
```
