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

// 获取当前文件路径
//var PWD = process.env.PWD || process.cwd(); // 兼容windows

//路径参数
var DEST = 'public',                               // 编译目录
    DEST_CSS = './public/css',                    // css编译目录
    DEST_JS = './public/js',                      // js编译目录
    DEST_IMG = './public/img',                    // img编译目录
    DEST_HTML = './src/build/html',              // html编译目录
    WEB_PORT = 9000;                                // 服务器监听的端口

// 说明
//gulp.task('help',function () {
//    console.log('	gulp build           文件打包');
//    console.log('	gulp watch	          文件监控打包');
//    console.log('	gulp help            gulp参数说明');
//    console.log('	gulp server			测试server');
//    console.log('	gulp -p				生产环境（默认生产环境）');
//    console.log('	gulp -d				开发环境');
//    console.log('	gulp -m <module>		部分模块打包（默认全部打包）');
//});

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
        .pipe(gulp.dest(DEST_CSS));
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
        .pipe(gulp.dest(DEST_JS));
});

//gulp.task("css", function(){
//    return gulp.src("./src/common/**/*.css")
//        .pipe(gulp.dest("./src/build/common"));
//});

//gulp.task("jade", function(){
//    return gulp.src("./src/compile/**/*.jade")
//        .pipe(jade())
//        .pipe(gulp.dest(DEST_HTML));
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
        gulp.start("minifyjs");
    });
    watch("./views/**/*.js", function(){
        gulp.start("js");
        gulp.start("minifyjs");
    });
    //watch("./src/compile/**/*.jade", function(){
    //    gulp.start("jade");
    //});
});
