# Contributing to Maxisub API

First off, thank you for considering contributing to Maxisub API! 🎉

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Guidelines](#testing-guidelines)

---

## 📜 Code of Conduct

This project adheres to a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

---

## 🤔 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce**
- **Expected vs actual behavior**
- **Environment details** (OS, Node version, etc.)
- **Screenshots** (if applicable)

**Use the bug report template** when creating an issue.

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title and description**
- **Use case and motivation**
- **Possible implementation** (optional)
- **Alternatives considered**

### Code Contributions

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Update documentation
6. Submit a pull request

---

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+
- PostgreSQL 15+
- Docker & Docker Compose
- Git

### Initial Setup
```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/maxisub-api.git
cd maxisub-api

# Add upstream remote
git remote add upstream https://github.com/SajidenOfnir/maxisub-api.git

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your settings

# Start database
docker-compose up -d postgres redis

# Run tests
npm test

# Start development server
npm run dev
```

---

## 📝 Coding Standards

### JavaScript Style Guide

We follow the **Airbnb JavaScript Style Guide** with some modifications:
```javascript
// ✅ Good
const getUserById = async (userId) => {
  const user = await User.findByPk(userId);
  return user;
};

// ❌ Bad
const getUserById = async (userId) => {
    let user = await User.findByPk(userId)
    return user
}
```

### File Structure

- **Controllers**: Handle HTTP requests/responses
- **Services**: Business logic
- **Models**: Database schemas
- **Middleware**: Request processing
- **Utils**: Helper functions

### Naming Conventions

- **Files**: `camelCase.js` (e.g., `subscriptionController.js`)
- **Classes**: `PascalCase` (e.g., `EmailService`)
- **Functions**: `camelCase` (e.g., `getUserSubscriptions`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `MAX_RETRY_ATTEMPTS`)
- **Database tables**: `snake_case` (e.g., `user_subscriptions`)

### Code Quality
```bash
# Run linter
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```

---

## 💬 Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

### Format
Types

feat: New feature<br>
fix: Bug fix<br>
docs: Documentation changes<br>
style: Code style changes (formatting, etc.)<br>
refactor: Code refactoring<br>
test: Adding/updating tests<br>
chore: Maintenance tasks<br>

# Feature
git commit -m "feat(subscriptions): add recurring billing support"<br>

# Bug fix
git commit -m "fix(auth): resolve JWT expiration issue"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Breaking change
git commit -m "feat(api): redesign subscription endpoints

BREAKING CHANGE: /api/subscriptions now requires authentication"

---

## 🔄 Pull Request Process
# Before Submitting

✅ Code follows style guidelines<br>
✅ Tests pass (npm test)<br>
✅ New tests added for new features<br>
✅ Documentation updated<br>
✅ Commits follow convention<br>
✅ No merge conflicts<br>

# PR Template
When creating a PR, include:

Description: What does this PR do?<br>
Related Issues: Link related issues<br>
Type of Change: Feature, bugfix, docs, etc.<br>
Testing: How was this tested?<br>
Screenshots: If UI changes<br>

# Review Process

At least one maintainer must review<br>
All CI checks must pass<br>
No unresolved conversations<br>
Squash and merge preferred<br>

---

## 🧪 Testing Guidelines
### Writing Tests
```
// Unit test example<br>
describe('SubscriptionController', () => {<br>
  test('should create a subscription', async () => {<br>
    const subscription = await createSubscription(mockData);<br>
    expect(subscription.name).toBe('Netflix');<br>
  });
});

// Integration test example
describe('POST /api/v1/subscriptions', () => {
  test('should return 201 on success', async () => {
    const response = await request(app)
      .post('/api/v1/subscriptions')
      .set('Authorization', `Bearer ${token}`)
      .send(mockData);
    
    expect(response.status).toBe(201);
  });
});
```

### Test Coverage

Maintain >80% code coverage<br>
Test happy paths and edge cases<br>
Mock external dependencies<br>
Use descriptive test names<br>

### Running Tests

# All tests
npm test

# With coverage
npm test -- --coverage

# Watch mode
npm run test:watch

# Specific file
npm test -- subscriptionController.test.js

---

## 📚 Documentation
### Code Comments
```
/**
 * Creates a new subscription for a user
 * @param {Object} subscriptionData - Subscription details
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Created subscription
 * @throws {AppError} If validation fails
 */
const createSubscription = async (subscriptionData, userId) => {
  // Implementation
};
API Documentation
Update Swagger annotations when adding/modifying endpoints:
javascript/**
 * @swagger
 * /api/v1/subscriptions:
 *   post:
 *     summary: Create a new subscription
 *     tags: [Subscriptions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Subscription'
 */
```
---

## 🎯 Development Workflow
# 1. Sync with upstream
git checkout main
git pull upstream main

# 2. Create feature branch
git checkout -b feature/my-feature

# 3. Make changes and commit
git add .
git commit -m "feat: add amazing feature"

# 4. Push to your fork
git push origin feature/my-feature


---

## 💡 Tips

Small PRs: Easier to review and merge<br>
One feature per PR: Focus on single concern<br>
Update tests: Always add/update tests<br>
Ask questions: Use discussions for help<br>
Be patient: Reviews take time<br>


Thank you for contributing! 🙏
