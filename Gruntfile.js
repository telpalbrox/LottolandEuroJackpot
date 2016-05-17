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
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-babel');
    
    
    grunt.registerTask('build', ['clean', 'copy', 'babel', 'uglify']);
    grunt.registerTask('default', ['build']);
};
