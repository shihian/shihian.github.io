var gulp = require('gulp');
var concat = require('gulp-concat');			// 合併多個檔案
var uglify = require('gulp-uglify');			// JavaScript檔案壓縮
var clean = require('gulp-clean');				// 刪除目的端檔案

var cssclean = require('gulp-clean-css'); 		// CSS檔案壓縮
var stylus = require('gulp-stylus'); 			// Stylus 預處理器
var sourcemaps = require('gulp-sourcemaps'); 	// 前端預處理 除錯地圖
var rename = require('gulp-rename');			// 重新命名檔案
// var autoprefixer = require('autoprefixer');		// CSS相容性
var autoprefixer = require('gulp-autoprefixer');
var postcss = require('gulp-postcss');			// CSS相容性

var notify = require('gulp-notify');			// 通知
var livereload = require('gulp-livereload');	// 即時更新
var stripDebug = require('gulp-strip-debug');	// 刪除 console.log(); alert();

var babel = require('gulp-babel');              // es6（新語法） 轉譯 es5（瀏覽器可執行語法）

var browserSync = require('browser-sync').create();    // 瀏覽器同步
var ssi = require("browsersync-ssi");                  // 瀏覽器協定



gulp.task('connectSSI', function () {
	browserSync.init({
		ghostMode: false,
		server: {
			baseDir: "./",
			middleware: [
				ssi({
					baseDir: __dirname + "/",
					ext: ".html"
				})
			]
		}
	});


	gulp.watch(["css/*.css", "*.html"]).on('change', browserSync.reload);
});


// Stylus 前端編譯處理
gulp.task('stylcss', function () {
	return gulp.src(['stylus/*.styl'])
		.pipe(sourcemaps.init())
		.pipe(stylus({
			'include css': true, // include CSS合併
			compress: false // 壓縮輸出
		}))
		// .pipe(rename(function(path) {
		// 	path.basename += ".min";
		// 	path.extname = ".css";
		// }))
		// .pipe(postcss([autoprefixer({browsers: ['last 5 iOS versions']})]))
		// .pipe(postcss([autoprefixer({ browsers: ['last 2 versions', 'iOS 7'] })]))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'], // 支援瀏覽器版本
			cascade: true, // 美化屬性值 默認:true, like as
			// -webkit-transform: rotate(45deg);
			//         transform: rotate(45deg);
			remove: true // 去掉不必要的前綴 默認:true
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('css/'));
});



// js 處理
gulp.task('js', function () {
	return gulp.src(['js/**'])
		.pipe(uglify()) // 壓縮 js
		// .pipe(gulp.dest('js_compress/')) // 轉輸出 js 的目錄
		.pipe(browserSync.stream()); // 同步
});


// 監聽事件
gulp.task('watch', function () {
	// 監控 stylus
	gulp.watch('stylus/**', ['stylcss']);
	// 監控 js
	gulp.watch('js/**', ['js']);
});


gulp.task('default', ['stylcss', 'js', 'watch', 'connectSSI']); // connectSSI 開啟本機端server
gulp.task('dc', ['stylcss', 'watch']); //gulp dc....只會跑 gulp
