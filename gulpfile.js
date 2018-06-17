const gulp = require('gulp');
const options = require('gulp-options');
const inject = require('gulp-inject-string');

const name = options.get('name') || undefined;

const paths = {
  INJECT_MATERIAL_ICONS: {
    SRC: name + '/src/index.html',
    DEST: name + '/src/'
  },
  INJECT_MY_THEME: {
    SRC: name + '/angular.json',
    DEST: name + '/'
  },
  COPY_MY_THEME: {
    SRC: 'gulp/my-theme.scss',
    DEST: name + '/src/'
  },
  COPY_STYLESHEETS: {
    SRC: 'gulp/stylesheets/**/*',
    DEST: name + '/src/stylesheets'
  },
  COPY_MAIN_STYLES: {
    SRC: 'gulp/styles.scss',
    DEST: name + '/src/'
  }
};

gulp.task('inject-material-icons', () => {
  gulp
    .src(paths.INJECT_MATERIAL_ICONS.SRC)
    .pipe(
      inject.after(
        '<link rel="icon" type="image/x-icon" href="favicon.ico">',
        '\n  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">'
      )
    )
    .pipe(inject.replace('<body>', '<body class="mat-typography">'))
    .pipe(gulp.dest(paths.INJECT_MATERIAL_ICONS.DEST));
});

gulp.task('inject-my-theme', () => {
  gulp
    .src(paths.INJECT_MY_THEME.SRC)
    .pipe(inject.afterEach('"styles": [', '"src/my-theme.scss", '))
    .pipe(gulp.dest(paths.INJECT_MY_THEME.DEST));
});

gulp.task('copy-my-theme', () => {
  gulp.src(paths.COPY_MY_THEME.SRC).pipe(gulp.dest(paths.COPY_MY_THEME.DEST));
});

gulp.task('copy-stylesheets', () => {
  gulp
    .src(paths.COPY_STYLESHEETS.SRC)
    .pipe(gulp.dest(paths.COPY_STYLESHEETS.DEST));
});

gulp.task('copy-main-styles', () => {
  gulp
    .src(paths.COPY_MAIN_STYLES.SRC)
    .pipe(gulp.dest(paths.COPY_MAIN_STYLES.DEST));
});

gulp.task('default', [
  'inject-material-icons',
  'inject-my-theme',
  'copy-my-theme',
  'copy-main-styles',
  'copy-stylesheets'
]);
