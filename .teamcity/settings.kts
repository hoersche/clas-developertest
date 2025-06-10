import jetbrains.buildServer.configs.kotlin.v2019_2.*
import jetbrains.buildServer.configs.kotlin.v2019_2.buildFeatures.commitStatusPublisher
import jetbrains.buildServer.configs.kotlin.v2019_2.buildFeatures.vcsLabeling
import jetbrains.buildServer.configs.kotlin.v2019_2.buildFeatures.swabra
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.DotnetNugetPushStep
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.dotnetNugetPush
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.dotnetPack
/*
The settings script is an entry point for defining a TeamCity
project hierarchy. The script should contain a single call to the
project() function with a Project instance or an init function as
an argument.

VcsRoots, BuildTypes, Templates, and subprojects can be
registered inside the project using the vcsRoot(), buildType(),
template(), and subProject() methods respectively.

To debug settings scripts in command-line, run the

    mvnDebug org.jetbrains.teamcity:teamcity-configs-maven-plugin:generate

command and attach your debugger to the port 8000.

To debug in IntelliJ Idea, open the 'Maven Projects' tool window (View
-> Tool Windows -> Maven Projects), find the generate task node
(Plugins -> teamcity-configs -> teamcity-configs:generate), the
'Debug' option is available in the context menu for the task.
*/

version = "2020.2"

project {

    buildType(DeployToNuget)
}

object DeployToNuget : BuildType({
    name = "Deploy to Nuget"

    params {
        param("env.Git_Branch", "${DslContext.settingsRoot.paramRefs.buildVcsBranch}")
    }

    vcs {
        root(DslContext.settingsRoot)
    }

    steps {
        step {
            type = "MR_GitVersion"
            param("mr.GitVersion.password", "zxx175d32bfa837dc7e")
        }
        dotnetPack {
            projects = "templatepack.csproj"
            outputDir = "nuget-pack-out"
            args = "-p:PackageVersion=%GitVersion.NuGetVersion%"
            param("dotNetCoverage.dotCover.home.path", "%teamcity.tool.JetBrains.dotCover.CommandLineTools.DEFAULT%")
        }
        dotnetNugetPush {
            name = "Publish"
            packages = """nuget-pack-out\**.nupkg"""
            serverUrl = "%env.CLASNugetServer%"
            apiKey = "credentialsJSON:5d347ed5d123310c605efe59fae5d15d602b3fc7""
            logging = DotnetNugetPushStep.Verbosity.Detailed
            param("dotNetCoverage.dotCover.home.path", "%teamcity.tool.JetBrains.dotCover.CommandLineTools.DEFAULT%")
        }
    }

    features {
        commitStatusPublisher {
            vcsRootExtId = "${DslContext.settingsRoot.id}"
            publisher = gitlab {
                gitlabApiUrl = "https://git.uiowa.edu/api/v4"
                accessToken = "credentialsJSON:8eb6ce0b-6e45-4984-a9e3-11fa992dfd0d"
            }
        }
        vcsLabeling {
            vcsRootId = "${DslContext.settingsRoot.id}"
            labelingPattern = "%GitVersion.SemVer%"
            successfulOnly = true
        }
        swabra {
        }
    }
})
