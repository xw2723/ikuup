/**
 * gulp 构建工具
 */

var gulp = require("gulp"),
    sass = require("gulp-sass"),
    //jade = require('gulp-jade'),
    watch = require("gulp-watch"),
    connect = require("gulp-connect"),
    autoprefixer = require("gulp-autoprefixer"),
    //压缩css
    minifycss = require('gulp-minify-css'),
    //合并
    concat = require('gulp-concat'),
    //压缩
    uglify = require('gulp-uglify'),
    //重命名
    rename = require('gulp-rename'),
    //gzip压缩
    //gzip = require('gulp-gzip'),
    //删除
    del = require('del');


//default task
gulp.task("default", ["sass", "js", "watch", "minifyjs"]);
//gulp.task("default", ["commonSass", "sass", "commonJs", "js", "css", "jade", "watch"]);

//使用connect启动一个Web服务器
gulp.task('connect', function () {
    connect.server({
        root: 'www',
        livereload: true
    });
});

gulp.task("sass", function(){
    return gulp.src("./views/**/*.sass")
        .pipe(sass().on('error', sass.logError))
        //处理sass中的浏览器前缀
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0'],
            cascade: true, //是否美化属性值 默认：true 像这样：
            //-webkit-transform: rotate(45deg);
            //        transform: rotate(45deg);
            remove:true //是否去掉不必要的前缀 默认：true
        }))
        .pipe(gulp.dest("./public/css"));
        //.pipe(connect.reload())
});

//gulp.task("commonSass", function(){
//    return gulp.src("./src/common/**/*.sass")
//        .pipe(sass().on('error', sass.logError))
//        .pipe(gulp.dest("./src/build/common"));
//});

//gulp.task("commonJs", function(){
//    return gulp.src("./src/common/**/*.js")
//        .pipe(gulp.dest("./src/build/common"));
//});

gulp.task("js", function(){
    return gulp.src("./views/**/*.js")
        .pipe(gulp.dest("./public/js"));
});

//gulp.task("css", function(){
//    return gulp.src("./src/common/**/*.css")
//        .pipe(gulp.dest("./src/build/common"));
//});

//gulp.task("jade", function(){
//    return gulp.src("./src/compile/**/*.jade")
//        .pipe(jade())
//        .pipe(gulp.dest("./src/build/html"));
//});

gulp.task('minifyjs', function() {
    return gulp.src('./public/piwik/_xwpk.js')
        //.pipe(concat('main.js'))    //合并所有js到main.js
        //.pipe(gulp.dest('./public/piwik'))    //输出main.js到文件夹
        //.pipe(rename({suffix: '-xwpk'}))   //rename压缩后的文件名
        .pipe(rename('xwpk.js'))   //rename压缩后的文件名
        .pipe(uglify())    //压缩
        //.pipe(gzip())       //gzip
        .pipe(gulp.dest('./public/piwik'));  //输出
});

gulp.task("watch", function(){
    watch("./views/**/*.sass", function(){
        gulp.start("sass");
        gulp.start("js");
        gulp.start("minifyjs");
    });
    //watch("./src/compile/**/*.jade", function(){
    //    gulp.start("jade");
    //});
});
