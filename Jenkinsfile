pipeline {
  agent any
  triggers { githubPush() }
  environment { DEPLOY_DIR = "${WORKSPACE}/deployment" }
  stages {
    stage('Checkout') {
      steps { checkout scm }
    }
    stage('Build') {
      steps {
        bat 'node --check js/validation.js'
        bat 'node --check js/customer.js'
        bat 'node --check js/vehicle.js'
        bat 'node --check js/booking.js'
        bat 'node --check js/analytics.js'
        bat 'node --check js/app.js'
        bat 'node --check js/booking-page.js'
        bat 'node --check js/admin.js'
      }
    }
    stage('Test') {
      steps { bat 'npm test' }
    }
    stage('Report Generation') {
      steps {
        publishHTML(target: [allowMissing: false, alwaysLinkToLastBuild: true, keepAll: true, reportDir: 'reports', reportFiles: 'test-report.html', reportName: 'AutoCare Test Report'])
        archiveArtifacts artifacts: 'reports/test-report.html', fingerprint: true
      }
    }
    stage('Deployment') {
      steps {
        bat 'if exist deployment rmdir /s /q deployment'
        bat 'mkdir deployment'
        bat 'copy /Y index.html deployment\index.html'
        bat 'copy /Y booking.html deployment\booking.html'
        bat 'copy /Y admin.html deployment\admin.html'
        bat 'xcopy /E /I /Y css deployment\css'
        bat 'xcopy /E /I /Y js deployment\js'
        archiveArtifacts artifacts: 'deployment/**', fingerprint: true
      }
    }
  }
  post { success { echo 'AutoCare deployed successfully.' } failure { echo 'Pipeline failed. Review the test report.' } }
}
