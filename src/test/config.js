test(
    "mbc config test",
    function () {

        deepEqual(
            mvc.obj("mvc-config").snapshot,
            testData.config,
            "mbc has config"
        );

        equal(
            mvc.obj("mvc-config").prop("view-builder-path"),
            testData.config["view-builder-path"],
            "config:view-builder-path"
        );

        equal(
            mvc.obj("mvc-config").prop("module-timeout-ms"),
            testData.config["module-timeout-ms"],
            "config:module-timeout-ms"
        );

        equal(
            mvc.obj("mvc-config").prop("view-timeout-ms"),
            testData.config["view-timeout-ms"],
            "config:view-timeout-ms"
        );

        equal(
            mvc.obj("mvc-config").prop("logger"),
            testData.config["logger"],
            "config:view-timeout-ms"
        );
    }
);