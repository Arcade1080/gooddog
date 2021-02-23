const path = require('path');
const fs = require('fs');
const sass = require('node-sass');
const { gzip } = require('node-gzip');

const INPUT_FILE = path.resolve(__dirname, 'sass', 'main.scss');
const OUTPUT_FILE = path.resolve(__dirname, 'lib', 'main.css');
const OUTPUT_GZIP_FILE = path.resolve(__dirname, 'lib', 'main.css.gz');

sass.render(
  {
    file: INPUT_FILE,
    outputStyle: 'compressed',
  },
  (error, result) => {
    console.info('ERROR', error);
    if (error) {
      console.log(error);
      process.exit(1);
    }

    // Write uncompressed css
    fs.writeFile(OUTPUT_FILE, result.css, (error) => {
      if (error) {
        console.log(error);
        process.exit(1);
      }
    });

    // Write compressed (gzipped) file
    gzip(result.css)
      .then((compressedFile) => {
        fs.writeFile(OUTPUT_GZIP_FILE, compressedFile, (error) => {
          if (error) {
            console.log(error);
            process.exit(1);
          }

          process.exit(0);
        });
      })
      .catch((error) => {
        if (error) {
          console.log(error);
          process.exit(1);
        }
      });
  }
);
