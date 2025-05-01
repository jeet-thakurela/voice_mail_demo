pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                script {
                    sshagent(['github-ssh-key']) {
                        // If the folder exists, pull changes instead of deleting
                        if (fileExists('voice_mail_demo/.git')) {
                            dir('voice_mail_demo') {
                                sh 'git pull'
                            }
                        } else {
                            sh 'git clone git@github.com:jeet-thakurela/voice_mail_demo.git'
                        }
                    }
                }
            }
        }

        // Removed Install Dependencies stage entirely

        stage('Build Project') {
            steps {
                sh 'cd voice_mail_demo && npm run build'
            }
        }

        stage('Deploy to Nginx') {
            steps {
                sh '''
                    sudo rm -rf /var/www/html/*
                    sudo cp -r voice_mail_demo/build/* /var/www/html/
                    sudo systemctl restart nginx
                '''
            }
        }
    }
}
