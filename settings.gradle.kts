plugins {
    id("org.gradle.toolchains.foojay-resolver-convention") version "1.0.0"
}

include("base", "core", "load", "broker", "shipper", "carrier", "financial", "web")