pipeline {
    agent any
    
    environment {
        AWS_REGION = 'ap-south-1'
        ECR_REPO = '873335417559.dkr.ecr.ap-south-1.amazonaws.com/my-web-app'
        EC2_HOST = '43.204.221.219'  // Put your EC2 IP here
        IMAGE_TAG = "${BUILD_NUMBER}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/hayth31/my-cicd-project.git'
            }
        }
        
        stage('Build') {
            steps {
                bat 'npm install'
            }
        }
        
        stage('Test') {
            steps {
                bat 'npm test'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                bat "docker build -t ${ECR_REPO}:${IMAGE_TAG} ."
                bat "docker tag ${ECR_REPO}:${IMAGE_TAG} ${ECR_REPO}:latest"
            }
        }
        
        stage('Push to ECR') {
            steps {
                withCredentials([
                    string(credentialsId: 'aws-access-key-id', variable: 'AWS_ACCESS_KEY_ID'),
                    string(credentialsId: 'aws-secret-access-key', variable: 'AWS_SECRET_ACCESS_KEY')
                ]) {
                    bat """
                        aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REPO}
                        docker push ${ECR_REPO}:${IMAGE_TAG}
                        docker push ${ECR_REPO}:latest
                    """
                }
            }
        }
        
        stage('Deploy to EC2') {
            steps {
                withCredentials([
                    string(credentialsId: 'aws-access-key-id', variable: 'AWS_ACCESS_KEY_ID'),
                    string(credentialsId: 'aws-secret-access-key', variable: 'AWS_SECRET_ACCESS_KEY')
                ]) {
                    bat """
                        aws ssm send-command ^
                        --instance-ids YOUR_EC2_INSTANCE_ID ^
                        --document-name "AWS-RunShellScript" ^
                        --parameters commands="sudo yum install docker -y && sudo service docker start && aws ecr get-login-password --region ${AWS_REGION} | sudo docker login --username AWS --password-stdin ${ECR_REPO} && sudo docker pull ${ECR_REPO}:latest && sudo docker stop myapp || true && sudo docker rm myapp || true && sudo docker run -d --name myapp -p 80:3000 ${ECR_REPO}:latest" ^
                        --region ${AWS_REGION}
                    """
                }
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline succeeded!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
```

**Wait!** You need your EC2 Instance ID. Get it:

1. Go to AWS Console → EC2
2. Click on your instance
3. Copy the **Instance ID** (looks like `i-0123456789abcdef`)

Then replace in Jenkinsfile:
- `YOUR_EC2_PUBLIC_IP` with your EC2 IP
- `YOUR_EC2_INSTANCE_ID` with the instance ID you just copied

Push to GitHub:
```
git add Jenkinsfile
git commit -m "fix deployment"
git push