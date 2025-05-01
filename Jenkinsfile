pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                script {
                    // Clean up the existing directory if it exists
                    if (fileExists('voice_mail_demo')) {
                        sh 'rm -rf voice_mail_demo'
                    }
                    
                    sshagent(['github-ssh-key']) {  // This ID must match the Jenkins credential ID
                        sh 'git clone git@github.com:jeet-thakurela/voice_mail_demo.git'
                    }
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    // Check if node_modules exists in the voice_mail_demo folder
                    def nodeModulesExists = fileExists('voice_mail_demo/node_modules')
                    
                    if (!nodeModulesExists) {
                        echo 'node_modules not found. Running npm install...'
                        sh 'cd voice_mail_demo && npm install'
                    } else {
                        echo 'node_modules exists. Skipping npm install...'
                    }
                }
            }
        }

        stage('Build Project') {
            steps {
                sh 'cd voice_mail_demo && npm run build'
            }
        }

        stage('Deploy to Nginx') {
            steps {
                sh '''
                    sudo rm -rf /var/www/html/*
                    sudo cp -r voice_mail_demo/dist/* /var/www/html/
                    sudo systemctl restart nginx
                '''
            }
        }
    }
}
