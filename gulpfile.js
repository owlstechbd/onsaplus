const { src, dest, series, watch } = require('gulp');
const replace = require('gulp-replace');
const fs = require('fs');
const path = require('path');
const browserSync = require('browser-sync').create();

// Function to read HTML content to inject
function readHtmlContent() {
    return fs.readFileSync(path.resolve(__dirname, 'src/installation.html'), 'utf8');
}

// Gulp task to replace the placeholder with the content of src/installation.html
function replacePlaceholder() {
    const htmlContent = readHtmlContent();
    return src('templates/index.html') // Source template file
        .pipe(replace('{$content}', htmlContent)) // Replace the placeholder
        .pipe(dest('dist')) // Output the modified file to the 'dist' directory
        .pipe(browserSync.stream()); // Stream changes to browser-sync for live reload
}

// Serve and watch task
function serveAndWatch() {
    browserSync.init({
        server: {
            baseDir: './dist'
        },
        port: 3000
    });

    // Watch both the template and the HTML content file for changes
    watch('templates/index.html', replacePlaceholder);
    watch('src/installation.html', replacePlaceholder);
    // Reload browser when there are changes in the 'dist' directory
    watch('dist/*.html').on('change', browserSync.reload);
}

// Default task to run the replacePlaceholder function and watch for changes
exports.default = series(replacePlaceholder, serveAndWatch);
