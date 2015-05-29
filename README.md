# gulp-concat-modules
Concatenates files according to pattern rules.

## Usage

```js
var concatCc = require('gulp-concat-modules');

gulp.task('scripts', function() {
  return gulp.src('src/js/**')
    .pipe(concatCc({
		patterns:{
			"controllers.js": "controller/*",
			"widgets.js": ["widget/*", "lib/jqueryui/ui/*.js"]
		}
    }))
    .pipe(gulp.dest('dist/js'));
});
```