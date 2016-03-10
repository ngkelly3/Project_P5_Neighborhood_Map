module.exports = function(grunt) {

    grunt.initConfig({
        htmlmin: { // Task
            dist: { // Target
                options: { // Target options
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: { // Dictionary of files
                    'dist/index-min.html': 'src/index.html'
                }
            },
        },

        uglify: {
            my_target: {
                options: {
                    sourceMap: true,
                    sourceMapName: 'path/to/sourcemap.map'
                },
                files: {
                    'dist/js/app.js': 'src/js/app.js'
                }
            }
        },

        cssmin: {
        	options: {
    			shorthandCompacting: false,
    			roundingPrecision: -1
  			},
  			target: {
                files: {
                'dist/css/style.css': 'src/css/style.css'
                }
            }
        }
    });

    // load tasks and have them run on "grunt" command
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.registerTask('default', ['htmlmin', 'uglify', 'cssmin']);
};