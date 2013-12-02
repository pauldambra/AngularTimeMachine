module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		sass: {
			dist: {
				files: {
					'public/css/style.css' : 'public/css/style.scss'
				}
			}
		},
		jshint: {
		  options: {
		  	ignores: ['public/js/libs/*.js', 'public/js/test/adapter.js'],
		  	'-W099':true
		  },
		  files: ['Gruntfile.js', 'js/**/*.js'],
		},
		watch: {
			css: {
				files: '**/*.scss',
				tasks: ['sass']
			},
			scripts: {
				files: ['js/**/*.js'],
				tasks: ['jshint'],
				options: {
				  spawn: false,
				},
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.registerTask('default',['watch', 'jshint']);
};