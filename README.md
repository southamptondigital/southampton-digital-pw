## Southampton Digital Processwire.

### Setup
- Download the latest dev version of Processwire: https://github.com/processwire/processwire/tree/dev
- go through the Processwire install, select any starter template.
- replace the new "site" folders contents in root with this repo
- go to site/config.php and add your localhost domain on line 77
- go to site/config-dev.php and fill out your db config
- use the Page Export/Import module to import data structure: https://gist.github.com/StanLindsey/e292f699601c2d75e1e8c08a62ad0759
- use ``npm run watch`` to watch scss
- success
