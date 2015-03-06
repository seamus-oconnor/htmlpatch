/* jshint node:true */

var gruntConfig = {
  jshint: {
    source: {
      options: {
        jshintrc: true,
      },
      files: {
        src: ['src/**/*.js', 'Gruntfile.js', 'tests/**/*.js']
      },
    }
  },
  clean: ['dist/'],
  mkdir: {
    build: {
      options: {
        create: ['dist/']
      },
    },
  },
  copy: {
    liftjs: {
      src: 'src/htmlpatch.js',
      dest: 'dist/htmlpatch.js',
    },
  },
  mocha: {
    options: {
      log: true,
      logErrors: true,
      run: false,
    },
    test: {
      src: ['tests/*.html']
    }
  },
  connect: {
    server: {      options: {
        base: '',
        port: 80,
      }
    }
  },
  watch: {
    scripts: {
      files: ['src/**/*.js', 'tests/**/*.js', 'tests/*.html'],
      tasks: [
        'build',
        'mocha',
      ],
    },
  },
  bump: {
    options: {
      files: ['bower.json', 'package.json'],
      updateConfigs: [],
      commitFiles: ['-a'],
      pushTo: 'origin',
      push: false,
    }
  },
};

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mkdir');
  grunt.loadNpmTasks('grunt-bump');

  grunt.initConfig(gruntConfig);

  grunt.registerTask('build', [
    'jshint',
    'clean',
    'mkdir',
    'copy',
  ]);

  grunt.registerTask('test', [
    'build',
    'connect',
    'mocha',
  ]);

  grunt.registerTask('dev', [
    'build',
    'connect',
    'watch',
  ]);
};
