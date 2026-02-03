<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <h1>Create Account</h1>
        <p class="subtitle">Join us to access the Gold Calculator</p>
      </div>
      
      <form @submit.prevent="register" class="auth-form">
        <div class="form-row">
          <div class="form-group half">
            <label for="name">Full Name</label>
            <input 
              type="text" 
              id="name" 
              v-model="user.name" 
              required 
              placeholder="Your full name"
            >
          </div>
          
          <div class="form-group half">
            <label for="phone">Phone</label>
            <input 
              type="tel" 
              id="phone" 
              v-model="user.phone" 
              required 
              placeholder="Phone number"
            >
          </div>
        </div>
        
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="user.email" 
            required 
            placeholder="your.email@example.com"
          >
        </div>
        
        <div class="form-row">
          <div class="form-group half">
            <label for="password">Password</label>
            <input 
              type="password" 
              id="password" 
              v-model="user.password" 
              required 
              placeholder="Password"
              minlength="6"
            >
          </div>
          
          <div class="form-group half">
            <label for="confirmPassword">Confirm</label>
            <input 
              type="password" 
              id="confirmPassword" 
              v-model="user.confirmPassword" 
              required 
              placeholder="Confirm password"
            >
          </div>
        </div>
        
        <div class="password-hint">
          <small>Password must be at least 6 characters</small>
        </div>
        
        <button type="submit" class="auth-btn" :disabled="loading">
          <span v-if="loading">Creating Account...</span>
          <span v-else>Create Account</span>
        </button>
        
        <div class="auth-footer">
          <p>Already have an account? 
            <router-link to="/login" class="auth-link">Sign In</router-link>
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
  name: 'Register',
  data() {
    return {
      user: {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: ''
      },
      loading: false,
      errorMessage: ''
    }
  },
  methods: {
    register() {
      if (this.user.password !== this.user.confirmPassword) {
        this.errorMessage = 'Passwords do not match!'
        return
      }
      
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      
      if (users.some(u => u.email === this.user.email)) {
        this.errorMessage = 'Email already registered!'
        return
      }
      
      const userData = {
        name: this.user.name,
        email: this.user.email,
        password: this.user.password,
        phone: this.user.phone,
        createdAt: new Date().toISOString()
      }
      
      users.push(userData)
      localStorage.setItem('users', JSON.stringify(users))
      
      this.loading = true
      setTimeout(() => {
        this.$router.push('/login')
      }, 1000)
    }
  }
}
</script>

<style scoped>
.auth-container {
  width: 100%;
  max-width: 420px;
  padding: 15px;
}

.auth-card {
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  animation: slideUp 0.4s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.auth-header {
  text-align: center;
  margin-bottom: 25px;
}

.auth-header h1 {
  color: #333;
  font-size: 1.8rem;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  color: #666;
  font-size: 0.85rem;
}

.auth-form {
  margin-top: 10px;
}

.form-row {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group.half {
  flex: 1;
  margin-bottom: 0;
}

.form-group label {
  display: block;
  color: #444;
  font-weight: 600;
  margin-bottom: 6px;
  font-size: 0.85rem;
}

.form-group input {
  width: 100%;
  padding: 12px 14px;
  border: 1.5px solid #e1e5e9;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.2s;
  background: #f8f9fa;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group input::placeholder {
  color: #999;
  font-size: 0.85rem;
}

.password-hint {
  margin: -5px 0 20px 0;
  text-align: center;
}

.password-hint small {
  color: #888;
  font-size: 0.75rem;
}

.auth-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.auth-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
}

.auth-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.auth-footer {
  text-align: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.auth-footer p {
  color: #666;
  font-size: 0.85rem;
}

.auth-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}

.auth-link:hover {
  color: #764ba2;
  text-decoration: underline;
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 10px;
  border-radius: 6px;
  margin-top: 15px;
  font-size: 0.85rem;
  text-align: center;
  border: 1px solid #fcc;
}

@media (max-width: 480px) {
  .auth-container {
    padding: 10px;
  }
  
  .auth-card {
    padding: 25px 20px;
  }
  
  .form-row {
    flex-direction: column;
    gap: 15px;
  }
  
  .form-group.half {
    margin-bottom: 0;
  }
}
</style>