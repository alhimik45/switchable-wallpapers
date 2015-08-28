var spawn = require('child_process').spawnSync;
var fs = require('fs');
if(process.argv.length != 5){
	console.log("Invalid arguments count, must be 3: wallpapers path, input fifo and switch time");
	process.exit(1);
}
var wallappers_path = process.argv[2];
var input_fifo = process.argv[3];
var wallpapers = wallpapers_list();
var time = 1000 * 60 * process.argv[4];
var wallpaper_idx = -1;
var timeout = run_timeout();
var watcher = fs.watch(wallappers_path, function () {
	wallpapers = wallpapers_list();
});

function wallpapers_list () {
	return fs.readdirSync(wallappers_path).filter(function (file) {
		return fs.lstatSync(wallappers_path+file).isFile();
	}).map(function (file) {
		return wallappers_path+file;
	});
}

function set_wallpaper(path){
	spawn("feh", ["--bg-fill", path]);
}

function run_timeout () {
	return setTimeout(function () {
		next_wallpaper();
	}, time);
}

function next_wallpaper(){
	clearTimeout(timeout);
	wallpaper_idx = (wallpaper_idx+1)%wallpapers.length;
	set_wallpaper(wallpapers[wallpaper_idx]);
	timeout = run_timeout();
}

try{
	fs.statSync(input_fifo);
}catch(e){ // file doesn't exists
	spawn("mkfifo", [input_fifo]);
}

var reader = function () {
	fs.readFile(input_fifo, 'utf8', function (err, data) {
		next_wallpaper();
		reader();
	});
}
next_wallpaper();
reader();