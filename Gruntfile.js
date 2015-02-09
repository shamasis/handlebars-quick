module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            options: {
                stripBanners: true,
                banner: '/*! <%= pkg.name %> v<%= pkg.version %> by <%=pkg.author%> ' +
                    '(<%= grunt.template.today("yyyy-mm-dd") %>) */\n'
            },
            dist: {
                src: ['lib/microajax.js', 'lib/handlebars.quick.js'],
                dest: 'handlebars.quick.js',
            },
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> v<%= pkg.version %> by <%=pkg.author%> ' +
                    '(<%= grunt.template.today("yyyy-mm-dd") %>) */\n'
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

            all: ['Gruntfile.js', 'lib/*.js', 'test/spec/*.js']
        },

        jasmine: {
            sanity: {
                options: {
                    vendor: [
                        'test/suite/jasmine/mock-ajax.js',
                        'test/suite/handlebars/handlebars-v2.0.0.js',
                        'handlebars.quick.js'
                    ],
                    specs: ['test/spec/*.js']
                }
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jasmine');

    // Default task(s).
    grunt.registerTask('default', ['concat', 'jshint', 'uglify', 'jasmine']);

};
