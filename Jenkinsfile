pipeline {
  agent any
  stages {
    stage('Pytest') {
      steps {
        sh ' docker exec sportsearch_backend_1 pytest -v'
      }
    }
  }
}