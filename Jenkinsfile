pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                script {
                    sshagent(['github-ssh-key1']) {
                        dir('voice_mail_demo') {
                            if (!fileExists('package.json')) {
                                sh 'git clone git@github.com:jeet-thakurela/voice_mail_demo.git .'
                            } else {
                                sh 'git pull'
                            }
                        }
                    }
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('voice_mail_demo') {
                    script {
                        if (!fileExists('node_modules/react')) {
                            echo 'node_modules missing or incomplete. Running npm install...'
                            sh 'npm install'
                        } else {
                            echo 'Dependencies already installed. Skipping npm install.'
                        }
                    }
                }
            }
        }

        stage('Build Project') {
            steps {
                dir('voice_mail_demo') {
                    sh 'npm run build'
                }
            }
        }

        stage('Deploy to Nginx') {
            steps {
                sh '''
                    sudo rm -rf /var/www/voice_mail_demo
                    sudo mkdir -p /var/www/voice_mail_demo
                    sudo cp -r voice_mail_demo/dist/* /var/www/voice_mail_demo/
                    sudo chown -R www-data:www-data /var/www/voice_mail_demo
                    sudo chmod -R 755 /var/www/voice_mail_demo
                    sudo systemctl restart nginx
                '''
            }
        }
    }
}
