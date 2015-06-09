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
			files: ['src/client/js/**/*.js']
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
					src: 'src/client/sass/lib.scss',
					dest: 'build/css/lib.css'
				}, {
					src: ['src/client/sass/**/*.scss', '!src/client/sass/lib.scss'],
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
					cwd: 'src/client/js',
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

		nodemon: {
			dev: {
				script: 'src/server/main.js',
				options: {
					nodeArgs: ['--debug']
				}
			},
			prod: {
				script: 'src/server/main.js'
			},
			options: {
				ignore: ['node_modules/**'],
				ext: 'js',
				watch: ['src/server'],
				// we don't need a high delay because our scripts are saved one-by-one
				delay: 100,
				// we want to trigger livereload after the server restarts
				callback: function(nodemon) {
					nodemon.on('restart', function() {
						require('fs').writeFileSync('.rebooted', 'rebooted');
					});
				}
			}
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
				files: ['src/client/sass/**/*.scss', 'src/client/sass/**/*.sass']
			},

			rebooter: {
				files: ['.rebooted'],
				options: {
					livereload: true
				}
			},

			// Live reload files
			options: {
				atBegin: true,
				livereload: true
			}
		},

		'node-inspector': {
			dev: {
				options: {
					'save-live-edit': true,
					'stack-trace-limit': 4,
					'hidden': ['bower', 'build', 'node_modules', 'src/client']
				}
			}
		},

		concurrent: {
			prod: {
				tasks: ['nodemon:prod', 'watch'],
				options: {
					logConcurrentOutput: true
				}
			},
			dev: {
				tasks: ['node-inspector', 'nodemon:dev', 'watch'],
				options: {
					logConcurrentOutput: true
				}
			}
		}
	});





	/**
	 * Default Task
	 * run `grunt`
	 */
	grunt.registerTask('build', [
		'clean', 'copy', 'update_json', 'jade', 'jshint', 'sass'
	]);
	grunt.registerTask('default', [
		'build', 'concurrent:prod'
	]);
	grunt.registerTask('dev', [
		'build', 'concurrent:dev'
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
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-node-inspector');
};