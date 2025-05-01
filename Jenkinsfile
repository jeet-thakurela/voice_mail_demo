pipeline {
    agent any

    environment {
        GIT_SSH_COMMAND = 'ssh -i /var/lib/jenkins/.ssh/id_rsa -o StrictHostKeyChecking=no'
    }

    stages {
        stage('Clone Repo') {
            steps {
                script {
                    // Use SSH to clone the repository
                    sh 'git clone git@github.com:jeet-thakurela/voice_mail_demo.git'
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    // Install dependencies
                    sh 'cd voice_mail_demo && npm install'
                }
            }
        }

        stage('Build Project') {
            steps {
                script {
                    // Build the React app
                    sh 'cd voice_mail_demo && npm run build'
                }
            }
        }

        stage('Deploy to Nginx') {
            steps {
                script {
                    // Copy the build to Nginx directory
                    sh '''
                        sudo rm -rf /var/www/html/*
                        sudo cp -r voice_mail_demo/build/* /var/www/html/
                        sudo systemctl restart nginx
                    '''
                }
            }
        }
    }
}
