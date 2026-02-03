<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <h1>Welcome Back</h1>
        <p class="subtitle">Sign in to access the Gold Calculator</p>
      </div>
      
      <form @submit.prevent="login" class="auth-form">
        <div class="form-group">
          <label for="email">Email Address</label>
          <input 
            type="email" 
            id="email" 
            v-model="credentials.email" 
            required 
            placeholder="Enter your email"
          >
        </div>
        
        <div class="form-group">
          <label for="password">Password</label>
          <div class="password-input">
            <input 
              :type="showPassword ? 'text' : 'password'" 
              id="password" 
              v-model="credentials.password" 
              required 
              placeholder="Enter your password"
            >
            <button 
              type="button" 
              class="toggle-password"
              @click="showPassword = !showPassword"
            >
              {{ showPassword ? '👁️' : '👁️‍🗨️' }}
            </button>
          </div>
        </div>
        
        <div class="form-group remember">
          <label class="checkbox-label">
            <input type="checkbox" v-model="rememberMe">
            <span>Remember me</span>
          </label>
          <a href="#" class="forgot-link">Forgot Password?</a>
        </div>
        
        <button type="submit" class="auth-btn" :disabled="loading">
          <span v-if="loading">Signing In...</span>
          <span v-else>Sign In</span>
        </button>
        
        <div class="auth-footer">
          <p>Don't have an account? 
            <router-link to="/register" class="auth-link">Create Account</router-link>
          </p>
        </div>
      </form>
      
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      credentials: {
        email: '',
        password: ''
      },
      rememberMe: false,
      showPassword: false,
      loading: false,
      errorMessage: ''
    }
  },
  methods: {
    login() {
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const user = users.find(u => 
        u.email === this.credentials.email && 
        u.password === this.credentials.password
      )
      
      if (user) {
        localStorage.setItem('isAuthenticated', 'true')
        localStorage.setItem('currentUser', JSON.stringify({
          name: user.name,
          email: user.email
        }))
        
        this.loading = true
        setTimeout(() => {
          this.$router.push('/calculator')
        }, 1000)
      } else {
        this.errorMessage = 'Invalid email or password!'
      }
    }
  }
}
</script>

<style scoped>
.auth-container {
  width: 100%;
  max-width: 450px;
  padding: 20px;
}

.auth-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.5s ease;
}

.auth-header {
  text-align: center;
  margin-bottom: 30px;
}

.auth-header h1 {
  color: #333;
  font-size: 2.2rem;
  margin-bottom: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  color: #666;
  font-size: 0.95rem;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  color: #444;
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.form-group input {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s;
  background: #f8f9fa;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.password-input {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 5px;
}

.remember {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #444;
  font-size: 0.9rem;
}

.checkbox-label input {
  width: auto;
  margin-right: 8px;
}

.forgot-link {
  color: #667eea;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
}

.forgot-link:hover {
  text-decoration: underline;
}

.auth-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  margin-top: 10px;
}

.auth-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
}

.auth-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.auth-footer {
  text-align: center;
  margin-top: 25px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.auth-footer p {
  color: #666;
  font-size: 0.9rem;
}

.auth-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s;
}

.auth-link:hover {
  color: #764ba2;
  text-decoration: underline;
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 12px;
  border-radius: 8px;
  margin-top: 20px;
  font-size: 0.9rem;
  text-align: center;
  border: 1px solid #fcc;
}
</style>