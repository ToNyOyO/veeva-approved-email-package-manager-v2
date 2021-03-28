const gulp = require('gulp');
const { series } = require('gulp');
const fs = require('fs');
const path = require('path');
const glob = require("glob");
const inject = require('gulp-inject'); // append/prepend/wrap/before/after/beforeEach/afterEach/replace
const injectString = require('gulp-inject-string'); // append/prepend/wrap/before/after/beforeEach/afterEach/replace
const rename = require('gulp-rename'); // rename a file in stream
const flatten = require('gulp-flatten'); // remove from folders
const zip = require('gulp-zip'); // make a ZIP
const rimraf = require('rimraf'); // delete a folder that contains files

const htmlFiles = glob.sync('./src/fragments/*.html'); // get list of fragments from folder
const templateFiles = glob.sync('./partial-templates/*.html'); // get list of partial templates from folder
const userPartialFiles = glob.sync('./src/template/partials/*.html'); // get list of partials from folder

const config = require('./config.json');

function defaultTask(cb) {

    gulp.watch([
        './src/**/*.*'
    ], buildForTesting).on('end', function() {console.log('test')});

    cb();
}

/************************************************************************************
 * setup the basic project structure
 * @param cb
 */
function setup(cb) {
    // create fragments folder
    gulp.src('*.*', {read: false})
        .pipe(gulp.dest('./src/fragments'));

    // create images folder
    gulp.src('*.*', {read: false})
        .pipe(gulp.dest('./src/images/template'));

    // create template folder
    gulp.src('*.*', {read: false})
        .pipe(gulp.dest('./src/template'));

    // create partials folder
    gulp.src('*.*', {read: false})
        .pipe(gulp.dest('./src/template/partials'));

    // create build folder
    gulp.src('*.*', {read: false})
        .pipe(gulp.dest('./build'));

    // create dist folder
    gulp.src('*.*', {read: false})
        .pipe(gulp.dest('./dist'))
        .on('end', function () {

            cb();
        });
}


/*************************************************************************************
 * Create new fragment
 * @param cb
 */
function fragment(cb) {

    if (arg.n === undefined) {
        console.log("\x1b[31m%s\x1b[0m", 'EXAMPLE: > gulp fragment --n "Fragment name"');
        cb();
        return;
    }

    let fragName = arg.n.replace(/ /g, "-");
    let templateID = arg.t;

    //fs.writeFile('./src/fragments/' + fragName + '.html', '<tr>\r\n    <td>[add your fragment content here]</td>\r\n</tr>', cb);

    // create fragment folder
    gulp.src('*.*', {read: false})
        .pipe(gulp.dest('./src/images/' + fragName))
        .on('end', function () {

            // insert partial inject into email template
            gulp.src('./src/template/partials/fragment-list.html')
                .pipe(injectString.before('<!-- END: FRAGMENTS -->', '<!-- inject:../fragments/' + fragName + '.html -->\n<!-- endinject -->\r\n\r\n'))
                .pipe(gulp.dest('./src/template/partials'))
                .on('end', function () {

                    let templateName = null;

                    templateFiles.forEach(function (templateFile) {

                        let tmpName = path.basename(templateFile, '.html');

                        if (templateID === tmpName.charAt(0)) {
                            templateName = tmpName;
                        }
                    });

                    // create empty fragment...
                    if (templateID === undefined || templateName === null) {
                        fs.writeFile('./src/fragments' + fragName + '.html', '<tr>\r\n    <td>[add your fragment content here]</td>\r\n</tr>', cb);
                    }
                    else
                        // ...or duplicate an existing partial template
                    {
                        console.log("\x1b[31m%s\x1b[0m", '> Copying partial template: ', templateName + '.html');

                        gulp.src('./partial-templates/' + templateName + '.html')
                            .pipe(rename(function (path) {path.basename = fragName}))
                            .pipe(gulp.dest('./src/fragments'))
                            .on('end', function () {

                                cb();
                            });
                    }
                });
        });
}

/*************************************************************************************
 * Create new partial
 * @param cb
 */
function partial(cb) {

    if (arg.n === undefined) {
        console.log("\x1b[31m%s\x1b[0m", 'EXAMPLE: > gulp partial --n "Partial name"');
        cb();
        return;
    }

    let partialName = (userPartialFiles.length - 1) + '-' + arg.n.replace(/ /g, "-");
    let templateID = arg.t;

    // create partial folder for images
    gulp.src('*.*', {read: false})
        .pipe(gulp.dest('./src/images/template/' + partialName))
        .on('end', function () {

            // insert partial inject into email template
            gulp.src('./src/template/*.html')
                .pipe(injectString.before('<!-- END: PARTIALS -->', '<!-- inject:partials/' + partialName + '.html -->\n<!-- endinject -->\r\n\r\n'))
                .pipe(gulp.dest('./src/template'))
                .on('end', function () {

                    let templateName = null;

                    templateFiles.forEach(function (templateFile) {

                        let tmpName = path.basename(templateFile, '.html');

                        if (templateID === tmpName.charAt(0)) {
                            templateName = tmpName;
                        }
                    });

                    // create empty partial...
                    if (templateID === undefined || templateName === null) {
                        fs.writeFile('./src/template/partials/' + partialName + '.html', '<tr>\r\n    <td>[add your partial content here]</td>\r\n</tr>', cb);
                    }
                    else
                        // ...or duplicate an existing partial template
                    {
                        console.log("\x1b[31m%s\x1b[0m", '> Copying partial template: ', templateName + '.html');

                        gulp.src('./partial-templates/' + templateName + '.html')
                            .pipe(rename(function (path) {path.basename = partialName}))
                            .pipe(gulp.dest('./src/template/partials'))
                            .on('end', function () {

                                cb();
                            });
                    }
                });
        });
}


/*************************************************************************************
 * Build as single html file with fragments embedded for browser-based testing
 * @param cb
 */
function buildForTesting(cb) {

    rimraf('./build', function () {  });

    setTimeout(function () {

        gulp.src('./src/template/*.html')
            .pipe(inject(gulp.src(['./src/template/partials/*.html']), {
                starttag: '<!-- inject:{{path}} -->',
                relative: true,
                transform: function(filepath, file) {
                    //console.log(filepath);
                    return file.contents.toString('utf8');
                }
            }))
            .pipe(inject(gulp.src(['./src/fragments/*.html']), {
                starttag: '<!-- inject:{{path}} -->',
                relative: true,
                transform: function(filepath, file) {
                    //console.log(filepath);
                    return file.contents.toString('utf8');
                }
            }))
            .pipe(gulp.dest('./build'))
            .on('end', function () {

                // replace all of the style tags from the config file
                const stylesToReplace = Object.entries(config);
                const tasks = stylesToReplace.map((tag) => {
                    function replaceTags() {
                        return gulp.src('./build/*.html')
                            .pipe(injectString.replace('{{' + tag[0] + '}}', tag[1]))
                            .pipe(gulp.dest('./build'));
                    }
                    // Use function.displayName to make custom task name
                    replaceTags.displayName = 'replaceTag_' + tag[0];
                    return replaceTags;
                });

                return gulp.series(...tasks, (seriesDone) => {
                    seriesDone();

                    gulp.src('./src/images/**/*')
                        .pipe(flatten())
                        .pipe(gulp.dest('./build/images/'))
                        .on('end', function () {

                            cb();

                        });

                })();

            });

    }, 500)

}

/*************************************************************************************
 * Package template and fragments ready for upload to Vault
 * @param cb
 */
function packageForDistribution(cb) {

    // delete everything in dist folder
    rimraf('./dist', function () {  });

    /******************************************************************
     * 1, main template html and images folder (inside images.zip)
     * 2, fragment and images folder (inside images.zip) for each fragment
     */

    // delay to give rimraf time to do its delete!
    setTimeout(function () {

        // #1 TEMPLATE

        console.log("\x1b[31m%s\x1b[0m", '\nProcessing template...');

        gulp.src('./src/template/*.html')
            .pipe(inject(gulp.src(['./src/template/partials/*.html']), {
                starttag: '<!-- inject:{{path}} -->',
                relative: true,
                transform: function(filepath, file) {
                    //console.log(filepath);
                    return file.contents.toString('utf8');
                }
            }))
            .pipe(rename('index.html'))
            .pipe(gulp.dest('./dist/template'))
            .on('end', function () {

                // replace all of the style tags from the config file
                const stylesToReplace = Object.entries(config);
                const tasks = stylesToReplace.map((tag) => {
                    function replaceTags() {
                        return gulp.src('./dist/template/index.html')
                            .pipe(injectString.replace('{{' + tag[0] + '}}', tag[1]))
                            .pipe(gulp.dest('./dist/template'));
                    }
                    // Use function.displayName to make custom task name
                    replaceTags.displayName = 'replaceTag_' + tag[0];
                    return replaceTags;
                });

                return gulp.series(...tasks, (seriesDone) => {
                    seriesDone();

                    // copy images temporarily to distribution folder for packaging
                    gulp.src('./src/images/template/**/*')
                        .pipe(flatten())
                        .pipe(gulp.dest('./dist/template/images'))
                        .on('end', function () {

                            // zip the images folder (folder needs to be in the zip, not just the images)
                            gulp.src(['./dist/template/**', '!./dist/template/*.html'])
                                .pipe(zip('images.zip'))
                                .pipe(gulp.dest('./dist/template'))
                                .on('end', function() {

                                    // remove dist/images folder
                                    rimraf('./dist/template/images', function () {  });

                                });
                        });

                })();

            });

        // #2 FRAGMENTS

        let fragCnt = htmlFiles.length;
        console.log("\x1b[31m%s\x1b[0m", '\nProcessing fragments (x' + fragCnt + '):');

        if (fragCnt > 0) {

            htmlFiles.forEach(function (htmlFile) {
                console.log(' - ' + path.basename(htmlFile, ''));
                // filename without extension (to name the folder) == path.basename(htmlFile, '.html')

                gulp.src(htmlFile)
                    .pipe(rename(function (path) {
                        path.basename = 'index'
                    }))
                    .pipe(gulp.dest('./dist/' + path.basename(htmlFile, '.html')))
                    .on('end', function () {

                        // replace all of the style tags from the config file
                        const stylesToReplace = Object.entries(config);
                        const tasks = stylesToReplace.map((tag) => {
                            function replaceTags() {
                                return gulp.src('./dist/' + path.basename(htmlFile, '.html') + '/*.html')
                                    .pipe(injectString.replace('{{' + tag[0] + '}}', tag[1]))
                                    .pipe(gulp.dest('./dist/' + path.basename(htmlFile, '.html')));
                            }
                            // Use function.displayName to make custom task name
                            replaceTags.displayName = 'replaceTag_' + tag[0];
                            return replaceTags;
                        });

                        return gulp.series(...tasks, (seriesDone) => {
                            seriesDone();

                            // copy images temporarily to distribution folder for packaging
                            gulp.src('./src/images/' + path.basename(htmlFile, '.html') + '/**')
                                .pipe(gulp.dest('./dist/' + path.basename(htmlFile, '.html') + '/images'))
                                .on('end', function () {

                                    // zip the images folder (folder needs to be in the zip, not just the images)
                                    gulp.src(['./dist/' + path.basename(htmlFile, '.html') + '/**', '!./dist/' + path.basename(htmlFile, '.html') + '/*.html'])
                                        .pipe(zip('images.zip'))
                                        .pipe(gulp.dest('./dist/' + path.basename(htmlFile, '.html')))
                                        .on('end', function () {

                                            // remove dist/images folder
                                            rimraf('./dist/' + path.basename(htmlFile, '.html') + '/images', function () {
                                            });

                                        });
                                });
                        })();
                    });

                fragCnt--;
                if (fragCnt === 0) {
                    console.log('');
                    cb();
                }
            });

        } else {
            cb();
        }

    }, 500)

}

exports.default = defaultTask;

exports.setup = setup;

exports.fragment = fragment;

exports.partial = partial;

exports.build = buildForTesting;

exports.dist = packageForDistribution;


// fetch command line arguments
const arg = (argList => {

    let arg = {}, a, opt, thisOpt, curOpt;
    for (a = 0; a < argList.length; a++) {

        thisOpt = argList[a].trim();
        opt = thisOpt.replace(/^\-+/, '');

        if (opt === thisOpt) {

            // argument value
            if (curOpt) arg[curOpt] = opt.replace(/([^a-z0-9_-]+)/gi, ' ').trim();
            curOpt = null;

        }
        else {

            // argument name
            curOpt = opt;
            arg[curOpt] = true;

        }

    }

    return arg;

})(process.argv);