pipeline {
    agent any

    stages {
        stage('Clone Repo') {
            steps {
                git 'git@github.com:jeet-thakurela/voice_mail_demo.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build Project') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Deploy to Nginx') {
            steps {
                sh '''
                    sudo rm -rf /var/www/html/*
                    sudo cp -r build/* /var/www/html/
                    sudo systemctl restart nginx
                '''
            }
        }
    }
}
