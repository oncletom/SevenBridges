"use strict";

module.exports = function(grunt) {

	grunt.initConfig({
		typescript: {
			base: {
				src: ['**/*.ts'],
				dest: 'build',
				options: {
					module: 'commonjs',
					target: 'es5',
					sourcemap: true,
					base_path: 'src',
					fullSourceMapPath: true,
					declaration: true
				}
			}
		},
		watch: {
			typescript:{
				files: '<%= typescript.base.src %>',
				tasks: ['typescript'],
				options: {
					nospawn: true
				}
			}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-typescript');
};