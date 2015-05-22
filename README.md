# gulp-concat-cc
Concatenates files according to pattern rules.

## Usage

```js
var concatCc = require('gulp-concat-cc');

gulp.task('scripts', function() {
  return gulp.src('src/js/**')
    .pipe(concatCc({
		patterns:{
			"controllers.js": ["controller/**"],
			""
		}
    }))
    .pipe(gulp.dest('dist/js'));
});
```