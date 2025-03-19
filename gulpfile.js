const gulp = require(`gulp`);
const eslint = require(`gulp-eslint`);
const stylelint = require(`gulp-stylelint`);
const babel = require(`gulp-babel`);
const uglify = require(`gulp-uglify`);
const cleanCSS = require(`gulp-clean-css`);
const htmlmin = require(`gulp-htmlmin`);
const sourcemaps = require(`gulp-sourcemaps`);
// const concat = require(`gulp-concat`);
const browserSync = require(`browser-sync`).create();

// Use dynamic import for del
async function clean() {
    const { deleteAsync } = await import(`del`);
    return deleteAsync([`prod/`]);
}

gulp.task(`clean`, clean);

// Paths for files
const paths = {
    html: `*.html`,
    styles: `styles/**/*.css`,
    scripts: `js/**/*.js`,
    dist: `prod/`,
};

// Lint JavaScript (Development)
gulp.task(`lint-js`, () => {
    return gulp
        .src(paths.scripts)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

// Lint CSS (Development)
gulp.task(`lint-css`, () => {
    return gulp.src(paths.styles).pipe(
        stylelint({
            reporters: [{ formatter: `string`, console: true }],
        })
    );
});

// Transpile JavaScript to ES5 (Development)
gulp.task(`scripts-dev`, () => {
    return gulp
        .src(paths.scripts)
        .pipe(sourcemaps.init())
        .pipe(
            babel({
                presets: [`@babel/preset-env`],
            })
        )
        .pipe(sourcemaps.write(`.`))
        .pipe(gulp.dest(`/js`))
        .pipe(browserSync.stream());
});

// Watch for changes & reload (Development)
gulp.task(`serve`, () => {
    browserSync.init({
        server: {
            baseDir: `./`,
        },
    });

    gulp.watch(paths.styles, gulp.series(`lint-css`)).on(`change`, browserSync.reload);
    gulp.watch(paths.scripts, gulp.series(`lint-js`, `scripts-dev`)).on(`change`, browserSync.reload);
    gulp.watch(paths.html).on(`change`, browserSync.reload);
});

// Default Task (Development)
gulp.task(`default`, gulp.series(`lint-js`, `lint-css`, `scripts-dev`, `serve`));

// // Clean production folder
// gulp.task(`clean`, () => {
//   return del([paths.dist]);
// });

// Minify JavaScript (Production)
gulp.task(`scripts-prod`, () => {
    return gulp
        .src(paths.scripts)
        .pipe(babel({ presets: [`@babel/preset-env`] }))
        .pipe(uglify())
        .pipe(gulp.dest(`${paths.dist}/js`));
});

// Minify CSS (Production)
gulp.task(`styles-prod`, () => {
    return gulp.src(paths.styles).pipe(cleanCSS()).pipe(gulp.dest(`${paths.dist}/css`));
});

// Minify HTML (Production)
gulp.task(`html-prod`, () => {
    return gulp
        .src(paths.html)
        .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
        .pipe(gulp.dest(paths.dist));
});

// Build Production Folder
gulp.task(`build`, gulp.series(`clean`, `html-prod`, `styles-prod`, `scripts-prod`));
