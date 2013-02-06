/* global module:false */
module.exports = function( grunt ) {

    /* To invoke the spirit of Doug Crockford */
    "use strict";

    var report = [],
        files  = [],
        jqueries = ["1.7.2"/*, "1.9.0", "2.0.0b1"*/],
        config = {
            pkg: "<json:package.json>",

            lint: {
                files: ["grunt.js", "dist/*.js" ]//, "test/*.js"
            },

            jshint: {

                options: "<json:.jshintrc>",

                globals: {
                    jQuery  : true,
                    window  : true,
                    document: true
                }
            },

            qunit: {
                urls: jqueries.map(
                            function(version) {
                                return "http://mbc.bogdan.lori.yandex.ru/test/qunit.test.html?jquery=" + version;
                            }
                )

                /*all: ["test/qunit.test.html"]*/
            },

            jsdoc : {
                dist : {
                    src: ["dist/*.js"],
                    dest: "doc/jsdoc"
                }
            },

            yuidoc: {
                /*pkg: "<json:package.json>",*/
                compile: {
                    name: "<%= pkg.name %>",
                    description: "<%= pkg.description %>",
                    version: "<%= pkg.version %>",
                    url: "<%= pkg.homepage %>",
                    options: {
                        paths: ["dist/"],
                        outdir: "doc/yuidoc/"
                    }
                }
            },

            watch: {
                scripts: {
                    files: ["src/**/*.js*"],
                    tasks: ["default"]
                }
            },

            server: {
                port: 8070
            }

        };

    grunt.loadNpmTasks("grunt-contrib");
    grunt.loadNpmTasks("grunt-jsdoc-plugin");






    report.push( [ "Build started", new Date() ] );

    files.push( "start"      );

    files.push( "jquery"     );
    files.push( "utils"      );

    files.push( "modulizer"  );
    files.push( "blockable"  );
    files.push( "prop"       );
    files.push( "module"     );
    files.push( "block"      );
    files.push( "obj"        );
    files.push( "set"        );
    files.push( "view"       );
    files.push( "slot"       );

    files.push( "neimenggu"  );
    files.push( "storage"    );
    files.push( "api"        );
    files.push( "config"     );

    files.push( "end"        );

    /*files = files.map(
        function( f ){
            return "src/" + f + ".js";
        }
    );*/

    // Project configuration.
    grunt.initConfig( config );




    // Default task.
    grunt.registerTask("default", "build lint qunit");


    grunt.registerTask(
        "build",
        function () {
            var compiled      = "",
                compiled_test = "/* Autogenerated Qunit tests for mbc core " + grunt.config( "pkg.version" ) + ", all sources are placed in src/test directory */\n\n\n\n",
                name      = "dist/" + grunt.config( "pkg.name" ) + "." + grunt.config( "pkg.version" ) + ".js",
                name_test = "test/" + grunt.config( "pkg.name" ) + ".test.js";

            files.forEach(
                function( module ){

                    report.push( "processing " + module );

                    var file = "",
                        test = "",
                        filepath = "/" + module + ".js";

                    /* build core */
                    try {
                        file = grunt.file.read( "src" + filepath );
                        /*compiled += " / * *\n@module " + module + "\n* * /\n\n";*/
                        compiled += file;
                        compiled += "\n\n\n\n";
                    } catch(e){
                        grunt.log.error( new Error(e) );

                        compiled += "/*!"+ e +"*/";
                    }

                    /* build core test */
                    try {
                        test = grunt.file.read( "src/test" + filepath );
                        compiled_test += "/*  "+filepath+" */\n\n";
                        compiled_test += ( module === "start" || module === "end" ) ? "" : "module(\"" + module +"\", { setup: setup(\"" + filepath + "\", \"" + module + "\"), teardown: moduleTeardown } ); \n\n";
                        compiled_test += test + "\n\n\n\n";
                        grunt.log.writeln( ("<+> ".green + ("test for " + module + " exists").yellow) );
                    } catch(e){
                        grunt.log.writeln( ("<-> need test for " + module + " (src/test" + filepath + ")").red );
                        compiled_test += "\n\n/* "+ e +"*/";
                    }
                }
            );

            compiled = compiled
                .replace(
                    /@VERSION/g,
                    grunt.config( "pkg.version" )
                )
                .replace(
                    "@DATE",
                    function () {
                        var date = new Date();

                        // YYYY-MM-DD
                        return [
                            date.getFullYear(),
                            date.getMonth() + 1,
                            date.getDate()
                        ].join( "-" );
                    }
                );


            // Fail task if errors were logged.
            if ( this.errorCount ) {
                return false;
            }



            // Write concatenated source to file
            grunt.file.write( name ,      compiled );
            grunt.file.write( name_test , compiled_test );

            /*try {
                fs.unlinkSync( name_test_link );
            } catch(e){
                grunt.log.error( "Can"t unlinkSync " + name_test_link );
            }

            fs.symlinkSync( name_test, name_test_link );*/

            // Otherwise, print a success message.
            grunt.log.writeln( ("File " + name + " created.").green );
            grunt.log.writeln( ("File " + name_test + " created.").green );
        }
    );


};