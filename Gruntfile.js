module.exports = (grunt) => {
  require('load-grunt-tasks')(grunt);

  grunt.loadNpmTasks('grunt-execute');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks("grunt-ts");

  grunt.initConfig({

    clean: ['dist/*'],

    copy: {
      resources: {
        cwd: 'src',
        expand: true,
        src: ['**/*', '!**/*.js', '!**/*.ts'],
        dest: 'dist'
      },
      pluginDef: {
        expand: true,
        src: ['plugin.json', 'README.md'],
        dest: 'dist',
      },
    },

    babel: {
      options: {
        sourceMap: true,
        presets: ['es2015'],
        plugins: [
          'transform-es2015-modules-systemjs'
        ],
      },
      dist: {
        files: [{
          cwd: 'src',
          expand: true,
          src: ['*.js'],
          dest: 'dist',
          ext: '.js'
        }]
      },
    },

    ts: {
      default : {
        tsconfig: true
      }
    },

    watch: {
      rebuild_ts: {
        files: ['src/**/*.ts', 'tsconfig.json'],
        tasks: ['ts'],
        options: { spawn: false }
      },
      rebuild_babel: {
        files: ['src/**/*.js'],
        tasks: ['babel'],
        options: { spawn: false }
      },
      fetch_resources: {
        files: ['src/**/*', '!src/**/*.js', '!src/*/*.ts'],
        tasks: ['copy:resources'],
        options: { spawn: false }
      }
    }

  });

  grunt.registerTask(
    'default',
    [
      'clean',
      'copy',
      'babel',
      'ts'
    ]
  );
};
