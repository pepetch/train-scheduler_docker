pipeline {
    agent any

    triggers {
        pollSCM('H/5 * * * *')   // เช็ก Git ทุก 5 นาที
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                echo '🔧 Building Docker images...'
                sh 'docker compose build'
            }
        }

        stage('Deploy') {
            steps {
                echo '🚀 Deploying with Docker Compose...'
                sh '''
                docker compose down || true
                docker compose up -d
                '''
            }
        }

        stage('Health Check') {
            steps {
                echo '🩺 Waiting for backend to be healthy...'
                sh '''
                for i in $(seq 1 10); do
                  echo "Attempt $i: checking backend health..."
                  if curl -f http://localhost:5000/health; then
                    echo "Backend is healthy"
                    exit 0
                  fi
                  echo "Backend not ready yet... retrying in 3 seconds"
                  sleep 3
                done

                echo "Backend health check failed after retries"
                exit 1
                '''
            }
        }
    }

    post {
        success {
            echo '✅ CI/CD Pipeline completed successfully'
        }
        failure {
            echo '❌ CI/CD Pipeline failed'
        }
    }
}
