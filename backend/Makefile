include .env
export

run_server:
	cd api && uvicorn main:app --host 0.0.0.0 --port 8000 --reload

generate_requirements:
	poetry export -f requirements.txt --output requirements.txt

generate_dev_requirements:
	poetry export -f requirements.txt --output requirements-dev.txt --dev

run_tests_with_coverage:
	pytest tests -x -vv --cov=. --cov-report=term-missing --cov-fail-under=95

lint:
	ruff .

format:
	ruff check --fix

push-check:
	@echo "Checking if the code is ready to be pushed"
	@echo "Running tests"
	@make run_tests_with_coverage
	@echo "Running linter"
	@make lint
	@echo "Running formatter"
	@make format
	@echo "All checks passed"

synth_cdk:
	cd infra && cdk synth

deploy_cdk:
	cd infra && cdk deploy

aws_ecr_login:
	aws ecr get-login-password --region ap-southeast-2 | docker login --username AWS --password-stdin $$ECR_URL

update_lambda_docker:
	docker build --platform linux/arm64 -t mint-choccy-api:latest . -f docker/Dockerfile.lambda
	docker tag mint-choccy-api:latest $$ECR_URL/mint-choccy-api:latest
	docker push $$ECR_URL/mint-choccy-api:latest

update_lambda_image:
	aws lambda update-function-code --function-name MintApiLambda --image-uri $$ECR_URL/mint-choccy-api:latest

build_and_update_lambda:
	make update_lambda_docker
	make update_lambda_image