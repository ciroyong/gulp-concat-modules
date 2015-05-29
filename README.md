# gulp-concat-modules
Concatenates files according to pattern rules.

## Usage

```js
var concatModules = require('gulp-concat-modules');

gulp.task('scripts', function() {
  return gulp.src('src/js/**')
    .pipe(concatModules({
		patterns:{
			"controllers.js": "controller/*",
			"widgets.js": ["widget/*", "lib/jqueryui/ui/*.js"]
		}
    }))
    .pipe(gulp.dest('dist/js'));
});
```