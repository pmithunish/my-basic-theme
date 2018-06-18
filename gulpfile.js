const gulp = require('gulp');
const options = require('gulp-options');
const inject = require('gulp-inject-string');
const exec = require('child_process').exec;
const fs = require('fs');

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

gulp.task('create-project', cb => {
  if (!fs.existsSync(name)) {
    exec('ng new ' + name + ' --style=scss', (err, stdout, stderr) => {
      console.log(stdout);
      console.log(stderr);
      cb(err);
    });
  } else {
    cb(new Error('project already found'));
  }
});

gulp.task('install-material', ['create-project'], cb => {
  exec(
    'cd ' + name + ' && npm install --save @angular/material @angular/cdk',
    (err, stdout, stderr) => {
      console.log(stdout);
      console.log(stderr);
      cb(err);
    }
  );
});

gulp.task('inject-material-icons', ['install-material'], () => {
  const stream = gulp
    .src(paths.INJECT_MATERIAL_ICONS.SRC)
    .pipe(
      inject.replace(
        '<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">',
        ''
      )
    )
    .pipe(
      inject.after(
        '<link rel="icon" type="image/x-icon" href="favicon.ico">',
        '\n  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">'
      )
    )
    .pipe(inject.replace('<body>', '<body class="mat-typography">'))
    .pipe(gulp.dest(paths.INJECT_MATERIAL_ICONS.DEST));
  return stream;
});

gulp.task('inject-my-theme', ['inject-material-icons'], () => {
  const stream = gulp
    .src(paths.INJECT_MY_THEME.SRC)
    .pipe(inject.replace('"src/my-theme.scss", ', ''))
    .pipe(inject.afterEach('"styles": [', '"src/my-theme.scss", '))
    .pipe(gulp.dest(paths.INJECT_MY_THEME.DEST));
  return stream;
});

gulp.task('copy-my-theme', ['inject-my-theme'], () => {
  const stream = gulp
    .src(paths.COPY_MY_THEME.SRC)
    .pipe(gulp.dest(paths.COPY_MY_THEME.DEST));
  return stream;
});

gulp.task('copy-stylesheets', ['copy-my-theme'], () => {
  const stream = gulp
    .src(paths.COPY_STYLESHEETS.SRC)
    .pipe(gulp.dest(paths.COPY_STYLESHEETS.DEST));
  return stream;
});

gulp.task('copy-main-styles', ['copy-stylesheets'], () => {
  const stream = gulp
    .src(paths.COPY_MAIN_STYLES.SRC)
    .pipe(gulp.dest(paths.COPY_MAIN_STYLES.DEST));
  return stream;
});

gulp.task('default', ['copy-main-styles']);
