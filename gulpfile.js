const gulp = require('gulp');
const options = require('gulp-options');
const inject = require('gulp-inject-string');
const exec = require('child_process').exec;
const fs = require('fs');

const name = options.get('name') || undefined;

const paths = {
  COPY_INDEX: {
    SRC: 'gulp/index.html',
    DEST: name + '/src/'
  },
  INJECT_NAME: {
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
  },
  COPY_ESSENTIALS: {
    FAV_SRC: 'gulp/favicon.ico',
    FAV_DEST: name + '/src/',
    APP_SRC: 'gulp/app/**/*',
    APP_DEST: name + '/src/app/'
  }
};

gulp.task('create-project', cb => {
  if (!fs.existsSync(name)) {
    exec(
      'ng new ' + name + ' --style=scss --routing',
      (err, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        cb(err);
      }
    );
  } else {
    cb(new Error('Project already exist! Delete the project and try again!!!'));
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

gulp.task('copy-index', ['install-material'], () => {
  const stream = gulp
    .src(paths.COPY_INDEX.SRC)
    .pipe(gulp.dest(paths.COPY_INDEX.DEST));
  return stream;
});

gulp.task('inject-name', ['copy-index'], () => {
  const stream = gulp
    .src(paths.INJECT_NAME.SRC)
    .pipe(inject.replace('<!--projectName-->', name))
    .pipe(gulp.dest(paths.INJECT_NAME.DEST));
  return stream;
});

gulp.task('inject-my-theme', ['inject-name'], () => {
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

gulp.task('copy-essentials', ['copy-main-styles'], () => {
  gulp
    .src(paths.COPY_ESSENTIALS.FAV_SRC)
    .pipe(gulp.dest(paths.COPY_ESSENTIALS.FAV_DEST));
  gulp
    .src(paths.COPY_ESSENTIALS.APP_SRC)
    .pipe(gulp.dest(paths.COPY_ESSENTIALS.APP_DEST));
});

gulp.task('default', ['copy-essentials']);
