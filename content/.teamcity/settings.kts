import jetbrains.buildServer.configs.kotlin.v2019_2.*
import jetbrains.buildServer.configs.kotlin.v2019_2.buildFeatures.swabra
import jetbrains.buildServer.configs.kotlin.v2019_2.buildFeatures.vcsLabeling
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.MSBuildStep
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.dotnetBuild
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.dotnetPublish
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.dotnetRestore
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.dotnetTest
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.msBuild

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

    buildType(RunTests)
    buildType(CutRelease)
    buildType(DeployToProd)
    buildType(DeployToTest)

    params {
        param("env.SolutionDir", """%teamcity.build.checkoutDir%\OrderManager""")
        param("env.ReleaseDirectory", """%env.ReleaseDirectoryRoot%\OrderManager""")
    }
}


object CutRelease : BuildType({
    name = "Cut Release"

    buildNumberPattern = "${RunTests.depParamRefs.buildNumber}"
    artifactRules = "publish/**/* => OrderManager.zip"
    
    vcs {
        root(DslContext.settingsRoot)
    }

    steps {
        dotnetPublish {
            projects = "OrderManager.Web/OrderManager.Web.csproj"
            configuration = "Release"
            outputDir = "publish"
            args = "--no-restore /p:Version=%build.number%"
            param("dotNetCoverage.dotCover.home.path", "%teamcity.tool.JetBrains.dotCover.CommandLineTools.DEFAULT%")
        }
    }

    features {
        vcsLabeling {
            vcsRootId = "${DslContext.settingsRoot.id}"
            labelingPattern = "${RunTests.depParamRefs["GitVersion.SemVer"]}"
            successfulOnly = true
            branchFilter = "+:main"
        }
    }

    dependencies {
        snapshot(RunTests) {
            onDependencyFailure = FailureAction.FAIL_TO_START
        }
    }
})

object DeployToProd : BuildType({
    name = "Deploy To Prod"

    buildNumberPattern = "${CutRelease.depParamRefs.buildNumber}"

    vcs {
        root(DslContext.settingsRoot)

        checkoutMode = CheckoutMode.MANUAL
    }

    steps {
        step {
            name = "Deploy"
            type = "CLAS_DeployCurrentToFileSystem"
            param("DeployTo", """\\itsnt2351\Webdata\apps.clas.uiowa.edu\dotNet\OrderManager""")
        }
        step {
            name = "Correct Base Href Tag"
            type = "CLAS_BaseHref"
            param("indexFilePath", """\\itsnt2351\Webdata\apps.clas.uiowa.edu\dotNet\OrderManager\wwwroot\dist\angular\index.html""")
            param("newBaseHref", "/OrderManager/")
        }
    }

    features {
        swabra {
        }
    }

    dependencies {
         dependency(CutRelease) {
            snapshot {
                runOnSameAgent = true
                onDependencyFailure = FailureAction.FAIL_TO_START
            }
        
            artifacts {
                cleanDestination = true
                artifactRules = "OrderManager.zip!**"
            }
        }
    }
})



object DeployToTest : BuildType({
    name = "Deploy To Test"

    buildNumberPattern = "${CutRelease.depParamRefs.buildNumber}"

    vcs {
        root(DslContext.settingsRoot)

        checkoutMode = CheckoutMode.MANUAL
    }

    steps {
        step {
            name = "Deploy"
            type = "CLAS_DeployCurrentToFileSystem"
            param("DeployTo", """\\itsnt2328\Webdata\apps-test.clas.uiowa.edu\dotNet\OrderManager""")
        }
        step {
            name = "Correct Base Href Tag"
            type = "CLAS_BaseHref"
            param("indexFilePath", """\\itsnt2328\Webdata\apps-test.clas.uiowa.edu\dotNet\OrderManager\wwwroot\dist\angular\index.html""")
            param("newBaseHref", "/OrderManager/")
        }
    }

    features {
        swabra {
        }
    }

    dependencies {
        dependency(CutRelease) {
            snapshot {
                runOnSameAgent = true
                onDependencyFailure = FailureAction.FAIL_TO_START
            }
        
            artifacts {
                cleanDestination = true
                artifactRules = "OrderManager.zip!**"
            }
        }
    }
})

object RunTests : BuildType({
    name = "Run Tests"

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
        dotnetRestore {
            projects = "OrderManager.sln"
            sources = "%env.NugetServer%"
            param("dotNetCoverage.dotCover.home.path", "%teamcity.tool.JetBrains.dotCover.CommandLineTools.DEFAULT%")
        }
        dotnetBuild {
            projects = "OrderManager.sln"
            configuration = "Release"
            args = "--no-restore"
            param("dotNetCoverage.dotCover.home.path", "%teamcity.tool.JetBrains.dotCover.CommandLineTools.DEFAULT%")
        }
        dotnetTest {
            name = "test"
            projects = "OrderManager.UnitTests/OrderManager.UnitTests.csproj"
            configuration = "Release"
            args = "--no-restore --no-build"
            param("dotNetCoverage.dotCover.home.path", "%teamcity.tool.JetBrains.dotCover.CommandLineTools.DEFAULT%")
            coverage = dotcover {
                toolPath = "%teamcity.tool.JetBrains.dotCover.CommandLineTools.2022.1.2%"
                assemblyFilters = "-:OrderManager.UnitTests"
                attributeFilters = ""
                args = ""
            }
        }
    }
    
    triggers {
        vcs {  
                branchFilter = """
                +:merge-requests/*
                """.trimIndent()  
        }
    }
        	
    features {  
        /* Publisher to mark pipelines status for gitlab */
        commitStatusPublisher {  
            publisher = gitlab {  
                gitlabApiUrl = "https://git.uiowa.edu/api/v4"  
                authType = personalToken {  
                    accessToken = "%GitlabToken%"  
                }  
            }  
        }
        /* Gitlab Merge Requests integration to display merge request status in teamcity */
        pullRequests {  
            provider = gitlab {  
                authType = token {  
                    token = "%GitlabToken%"  
                }  
            }  
        }  
    }  

})
