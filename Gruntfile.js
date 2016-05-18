module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        uglify: {
            dist: {
                src: 'dist/**/*.js',
                dest: 'dist/index.js'
            }
        },
        clean: ['dist/'],
        babel: {
            options: {
                presets: ['babel-preset-es2015']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: ['**/*.js'],
                    dest: 'dist'
                }]
            }
        },
        watch: {
            scripts: {
                files: ['src/**/*.js'],
                tasks: ['babel'],
                options: {
                    spawn: false
                }
            }
        },
        copy: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: ['**/*.{html,css}'],
                    dest: 'dist'
                }]
            }
        },
        cssmin: {
            dist: {
                files: {
                    'dist/style.css': ['dist/style.css']
                }
            }
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'dist/index.html': ['dist/index.html']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-babel');
    
    grunt.registerTask('build', ['clean', 'copy', 'cssmin', 'htmlmin', 'babel', 'uglify']);
    grunt.registerTask('default', ['build']);
};
