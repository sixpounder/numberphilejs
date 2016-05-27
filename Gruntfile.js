// Created by Andrea Coronese

module.exports = function(grunt) {

  var numberphilejsTargetFile = 'dist/numberphile.js';
  var numberphilejsTargetFileMin = 'dist/numberphile.min.js';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      all: ['dist']
    },
    coffee: {
      compile: {
        files: {
          'dist/numberphile.js': ['src/numberphile.engine.coffee', 'src/numberphile.coffee', 'src/numberphile.counter.coffee']
        },
        options: {
          join: true
        }
      }
    },
    coffeelint: {
      all: ['src/*.coffee'],
      options: {
        'max_line_length': {
          'level': 'ignore'
        }
      }
    },
    jshint: {
      dist: {
        options: {
          '-W041': true,
          '-W030': true,
          globals: {
            jQuery: true
          }
        },
        files: {
          src: ['dist/numberphile.js']
        }
      }
    },
    uglify: {
      js: {
        files: {
          'dist/numberphile.min.js': [numberphilejsTargetFile]
        }
      }
    },
    simplemocha: {
       all: { src: 'test/*.js' }
    },
    compress: {
      js: {
        options: {
          archive: 'dist/numberphilejs.zip'
        },
        files: [
          { flatten: true, src: ['dist/*.js'], dest: 'javascripts/', filter: 'isFile' }
        ]
      }
    }
  });


  grunt.loadNpmTasks('grunt-coffeelint');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Default task(s).
  var distTasks = ['clean', 'coffeelint', 'coffee', 'jshint', 'uglify', 'simplemocha'];
  var buildTasks = ['clean', 'coffeelint', 'coffee', 'jshint', 'uglify'];
  var devTasks = ['clean', 'coffeelint', 'coffee', 'simplemocha'];
  var testTasks = ['simplemocha'];

  grunt.registerTask('default', distTasks);
  grunt.registerTask('dist', distTasks);
  grunt.registerTask('dev', devTasks);
  grunt.registerTask('build', buildTasks);
  grunt.registerTask('test', testTasks);

};
