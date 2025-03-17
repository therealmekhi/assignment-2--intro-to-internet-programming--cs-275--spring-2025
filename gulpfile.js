const gulp = require(`gulp`);
const eslint = require(`gulp-eslint`);
const stylelint = require(`gulp-stylelint`);
const babel = require(`gulp-babel`);
const sourcemaps = require(`gulp-sourcemaps`);
const uglify = require(`gulp-uglify`);
const cleanCSS = require(`gulp-clean-css`);
const htmlmin = require(`gulp-htmlmin`);
const connect = require(`gulp-connect`);
const { deleteAsync } = require(`del`);

const paths = {
    html: `index.html`,
    styles: `styles/main.css`,
    scripts: `js/main.js`,
    images: `img/**/*`,
    json: `json/data.json`,
    prod: `prod/`,
};

// **Validate CSS using Stylelint**
gulp.task(`lint-css`, () => {
    return gulp.src(paths.styles).pipe(
        stylelint({
            reporters: [{ formatter: `string`, console: true }],
        })
    );
});

// **Validate JS using ESLint**
gulp.task(`lint-js`, () => {
    return gulp.src(paths.scripts).pipe(eslint()).pipe(eslint.format());
});

// **Transpile JavaScript to ES5**
gulp.task(`transpile-js`, () => {
    return gulp
        .src(paths.scripts)
        .pipe(sourcemaps.init())
        .pipe(
            babel({
                presets: [`@babel/preset-env`],
            })
        )
        .pipe(sourcemaps.write(`.`))
        .pipe(gulp.dest(`dist`))
        .pipe(connect.reload());
});

// **Start Local Server and Watch for Changes**
gulp.task(`serve`, () => {
    connect.server({
        livereload: true,
    });
});

// **Watch for File Changes**
gulp.task(`watch`, () => {
    gulp.watch(paths.styles, gulp.series(`lint-css`));
    gulp.watch(paths.scripts, gulp.series(`lint-js`, `transpile-js`));
});

// **Development Workflow**
gulp.task(`default`, gulp.parallel(`lint-css`, `lint-js`, `transpile-js`, `serve`, `watch`));

// **Clean Production Folder**
gulp.task(`clean`, async () => {
    await deleteAsync([paths.prod]);
});

// **Minify HTML**
gulp.task(`minify-html`, () => {
    return gulp.src(paths.html)
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(paths.prod));
});

// **Minify JavaScript**
gulp.task(`minify-js`, () => {
    return gulp.src(paths.scripts)
        .pipe(uglify())
        .pipe(gulp.dest(paths.prod));
});

// **Minify CSS**
gulp.task(`minify-css`, () => {
    return gulp.src(paths.styles)
        .pipe(cleanCSS())
        .pipe(gulp.dest(paths.prod));
});

// **Copy Images & JSON File to Production**
gulp.task(`copy-assets`, () => {
    return gulp.src([paths.images, paths.json], { base: `.` })
        .pipe(gulp.dest(paths.prod));
});

// **Production Workflow**
gulp.task(`build`, gulp.series(`clean`, `minify-html`, `minify-js`, `minify-css`, `copy-assets`));
