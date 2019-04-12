pipeline {
  agent any
  stages {
    stage('Build') {
      parallel {
        stage('Build') {
          agent any
          environment {
            build = 'build_true'
          }
          steps {
            script {
              try {
                sh 'docker-compose -f docker-compose.dev.yml stop'
              } catch (Exception e) {
                echo "Bla-Bla_Bla"
              }
            }

          }
        }
        stage('stop_build') {
          steps {
            sh 'echo $build'
            sh 'stop_build = docker container logs test_react_test22_frontend_1 2>&1 | grep -c "npm ERR!"\''
          }
        }
        stage('error') {
          steps {
            script {
              script {
                if (($stop_build) == '0') {
                  echo '0'
                } else {
                  sh 'docker-compose -f docker-compose.dev.yml stop'
                }
              }
            }

          }
        }
      }
    }
    stage('fill_data') {
      steps {
        sh ' docker exec sportsearch_backend_1 python pytest -v'
      }
    }
    stage('Stop containers') {
      steps {
        sh 'docker-compose -f docker-compose.dev.yml stop'
      }
    }
  }
}