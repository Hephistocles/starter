module.exports = function(grunt) {
	/**
	 * Initialize grunt
	 */
	grunt.initConfig({

		/**
		 * JSHint
		 * @github.com/gruntjs/grunt-contrib-jshint
		 */
		jshint: {
			gruntfile: 'Gruntfile.js',
			files: ['src/client/js/src/**/*.js']
		},


		// jade
		jade: {
			compile: {
				options: {
					pretty: true,
					data: {
						debug: false
					}
				},
				files: [{
					cwd: "src/client/jade",
					src: "**/*.jade",
					dest: "build",
					expand: true,
					ext: ".html"
				}]
			}
		},

		sass: {
			dist: {
				files: [{
					src: 'src/client/css/lib.scss',
					dest: 'build/css/lib.css'
				}, {
					src: ['src/client/css/**/*.scss', '!src/client/css/lib.scss'],
					dest: 'build/css/main.css'
				}]
			}
		},

		clean: ["build/*"],

		// copy
		copy: {
			main: {
				files: [{
					expand: true,
					src: ['bower/angular/angular.js'],
					dest: 'build/js/lib/',
					flatten: true
				}, {
					expand: true,
					src: ['bower/angular-ui-bootstrap-bower/ui-bootstrap.js'],
					dest: 'build/js/lib/',
					flatten: true
				}, {
					expand: true,
					cwd: 'bower/bootstrap-sass/assets',
					src: ['fonts/**/*', 'images/**/*'],
					dest: 'build'
				}],
			},
			js: {
				files: [{
					expand: true,
					cwd: 'src/client/js/src',
					src: ['**/*.js'],
					dest: 'build/js'
				}]
			}
		},

		update_json: {
			options: {
				src: 'about.json',
				indent: "\t"
			},
			bower: {
				src: 'about.json',
				dest: 'bower.json',
				fields: ['name', 'version', 'authors', 'description', 'homepage', 'license', 'keywords', 'repository', 'bugs']
			},
			npm: {
				dest: 'package.json',
				fields: ['name', 'version', 'authors > contributors', {
					author: function(src) {
						// pull username/repo off a github url 
						return src.authors[0];
					}
				}, 'description', 'homepage', 'license', 'keywords', 'repository', 'bugs']
			},
		},

		watch: {

			// JShint Gruntfile
			gruntfile: {
				files: 'Gruntfile.js',
				tasks: ['jshint:gruntfile'],
			},

			// Compile jade templates on change
			jade: {
				tasks: ['jade'],
				files: 'src/client/jade/**/*.jade'
			},

			// JShint on change
			js: {
				tasks: ['jshint', 'copy:js'],
				files: 'src/client/js/**/*.js'
			},

			dependencies: {
				tasks: ['clean', 'copy'],
				files: ["bower"]
			},

			sass: {
				tasks: ['sass'],
				files: ['src/client/css/**/*.scss', 'src/client/css/**/*.sass']
			},

			// Live reload files
			options: {
				atBegin: true,
				livereload: true
			}
		},
	});





	/**
	 * Default Task
	 * run `grunt`
	 */
	grunt.registerTask('default', [
		'clean', 'copy', 'update_json', 'jade', 'jshint', 'sass', 'watch'
	]);



	/**
	 * Load the plugins specified in `package.json`
	 */
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-update-json');

};