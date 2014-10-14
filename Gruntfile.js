module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> v<%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd") %>) */\n'
            },
            build: {
                src: 'handlebars.quick.js',
                dest: 'handlebars.quick.min.js'
            }
        },

        jshint: {
            options: {
                jshintrc: true
            },

            all: ['Gruntfile.js', 'handlebars.quick.js', 'test/spec/*.js']
        },

        jasmine: {
            sanity: {
                options: {
                    vendor: [
                        'test/suite/jasmine/mock-ajax.js',
                        'test/suite/handlebars/handlebars-v2.0.0.js',
                        'handlebars.quick.min.js'
                    ],
                    specs: ['test/spec/*.js']
                }
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jasmine');

    // Default task(s).
    grunt.registerTask('default', ['jshint', 'uglify', 'jasmine']);

};
