# gulp-progeny-mtime

A gulp plugin to update the mtime of a file in a stream to the latest mtime of its progeny.

This is useful if you want to use gulp-newer to determine if you regenerate a file that itself includes other files. You need to take into account the modification times of all of the progeny of the file you're testing. This plugin uses [`progeny`](https://github.com/es128/progeny) to find decendent files, and replaces the mtime of the parent file with the latest of the decendents. This enables gulp-newer to detect changes in decendent files as if they affected the mtime of the parent.

## Gulp example

Imagine you have `main.less` that includes `components/header.less`.

```less
@import "components/header";
```

You pass `main.less` through the less plugin to compile it, and it includes the contents of `components/header.less`.
Then you modify `components/header.less`. Without `gulp-progeny-mtime`, `gulp-newer` prevents `main.less` from being 
recompiled as its mtime hasn't changed. With `gulp-progeny-mtime`, the mtime of `main.less` is updated in the stream
to match `components/header.less` and the file is recompiled.

```javascript
var gulp = require('gulp');
var less = require('gulp-less');
var newer = require('gulp-newer');
var progenyMtime = require('gulp-progeny-mtime');

gulp.src('*.less')
	.pipe(progenyMtime())
	.pipe(newer({ dest: 'build', ext: '.css'}))
	.pipe(less())
	.pipe(gulp.dest('build'));
```

## Options

You can pass an optional options object, which is passed straight to [`progeny`](https://github.com/es128/progeny).
See [`progeny`](https://github.com/es128/progeny) for documentation.

## Install

```sh
$ npm install --save-dev gulp-progeny-mtime
```
