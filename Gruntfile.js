module.exports = (grunt) => {
  require('load-grunt-tasks')(grunt);

  grunt.loadNpmTasks('grunt-execute');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks("grunt-ts");

  grunt.initConfig({

    clean: ['dist/*'],

    copy: {
      src_to_dist: {
        cwd: 'src',
        expand: true,
        src: ['**/*', '!**/*.js', '!**/*.ts', '!**/*.scss', '!img/**/*'],
        dest: 'dist'
      },
      externals: {
        cwd: 'src',
        expand: true,
        src: ['**/external/*'],
        dest: 'dist'
      },
      pluginDef: {
        expand: true,
        src: ['plugin.json', 'README.md'],
        dest: 'dist',
      },
      img_to_dist: {
        cwd: 'src',
        expand: true,
        src: ['img/**/*'],
        dest: 'dist/src/'
      },
    },

    babel: {
      options: {
        sourceMap: true,
        presets: ['es2015'],
        plugins: [
          'transform-es2015-modules-systemjs',
          'transform-es2015-for-of'
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
      rebuild_all: {
        files: ['src/**/*', '!src/**/*.ts', 'plugin.json', 'tsconfig.json'],
        tasks: ['default'],
        options: { spawn: false }
      },
      rebuild_ts: {
        files: ['src/**/*.ts'],
        tasks: ['ts'],
        options: { spawn: false }
      },
    }

  });

  grunt.registerTask(
    'default',
    [
      'clean',
      'copy:src_to_dist',
      'copy:externals',
      'copy:pluginDef',
      'copy:img_to_dist',
      'babel',
      'ts'
    ]
  );
};
