# 变量定义
NODE = node
NPM = bun
NEXT = $(NPM) run
GIT = git

# 部署相关变量
SSH_NAME_STAGE = test
SSH_NAME_PROD = pro
TARGET_PATH = /data/apps/web-modules/web
ZIP_FILE = dist.tar.gz
WEB_URL_STAGE = http://stage.cn/irtemplate
WEB_URL_PROD = http://prod.cn/irtemplate
# 获取当前时间并格式化版本号
VERSION := $(shell date +"%y.%m%d.%H%M")

# 默认目标
.DEFAULT_GOAL := help


# 帮助信息
.PHONY: help
help:
	@echo "Available commands:"
	@echo "  make install     - Install dependencies"
	@echo "  make dev        - Start development server"
	@echo "  make build      - Build the project"
	@echo "  make lint       - Run linter"
	@echo "  make clean      - Clean build artifacts"
	@echo "  make deploy-stage - Deploy to staging environment"
	@echo "  make deploy-prod  - Deploy to production environment"
	@echo "  make git-status - Show git status"
	@echo "  make git-add    - Stage all changes"
	@echo "  make git-commit - Commit staged changes"
	@echo "  make git-push   - Push commits to remote"
	@echo "  make git-pull   - Pull changes from remote"

update-version:
	@echo "Updating package.json version to $(VERSION)"
	@node -e "const fs = require('fs'); \
		const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8')); \
		pkg.version = '$(VERSION)'; \
		fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));"
# 提交版本变更到Git
commit-version: update-version
	@echo "Committing version change"
	git add .
	git commit -m "bump version to v$(VERSION)"
	git push

# 创建并推送标签
push-tag: commit-version
	@echo "Creating and pushing tag v$(VERSION)"
	git tag v$(VERSION)
	git push origin v$(VERSION)

# 安装依赖
.PHONY: install
install:
	$(NPM) install

# 启动开发服务器
.PHONY: dev
dev:
	$(NEXT) dev

# 构建项目
.PHONY: build
build:
	$(NEXT) build

# 运行 linter
.PHONY: lint
lint:
	$(NEXT) lint

# 清理构建产物
.PHONY: clean
clean:
	rm -rf dist
	rm -f $(ZIP_FILE)

# 打包 dist 目录
.PHONY: zip-dist
zip-dist:
	tar -czf $(ZIP_FILE) dist

# 部署到测试环境
.PHONY: deploy-stage
deploy-stage: build zip-dist
	@echo "Deploying to staging environment..."
	scp $(ZIP_FILE) $(SSH_NAME_STAGE):$(TARGET_PATH)
	ssh $(SSH_NAME_STAGE) "cd $(TARGET_PATH) && \
		tar -xzf $(ZIP_FILE) && \
		rm $(ZIP_FILE)"
	rm $(ZIP_FILE)
	@echo "Staging deployment complete. Visit: $(WEB_URL_STAGE)"

# 部署到生产环境
.PHONY: deploy-prod
deploy-prod: build zip-dist
	@echo "Deploying to production environment..."
	@read -p "Are you sure you want to deploy to production? [y/N] " confirm; \
	if [ "$$confirm" = "y" ] || [ "$$confirm" = "Y" ]; then \
		scp $(ZIP_FILE) $(SSH_NAME_PROD):$(TARGET_PATH); \
		ssh $(SSH_NAME_PROD) "cd $(TARGET_PATH) && \
			tar -xzf $(ZIP_FILE) && \
			rm $(ZIP_FILE)"; \
		rm $(ZIP_FILE); \
		echo "Production deployment complete. Visit: $(WEB_URL_PROD)"; \
	else \
		echo "Deployment cancelled."; \
		rm $(ZIP_FILE); \
	fi

# Git 相关命令
.PHONY: git-status
git-status:
	$(GIT) status

.PHONY: git-add
git-add:
	$(GIT) add .

.PHONY: git-commit
git-commit:
	@read -p "Enter commit message: " message; \
	$(GIT) commit -m "$$message"

.PHONY: git-pull
git-pull:
	$(GIT) pull

# 快速提交所有更改并推送
.PHONY: push
push: git-add
	@read -p "Enter commit message: " message; \
	$(GIT) commit -m "$$message" && $(GIT) push