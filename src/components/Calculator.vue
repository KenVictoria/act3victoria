<template>
  <div :class="['calculator-container', currentTheme]">
    <div class="calculator-header">
      <div class="user-info">
        <h1>Gold Price Calculator</h1>
        <p>Welcome, {{ userName }}</p>
      </div>
      <div class="header-actions">
        <button @click="toggleTheme" class="theme-toggle">
          {{ currentTheme === 'gold-theme' ? 'Silver Theme' : 'Gold Theme' }}
        </button>
        <button @click="logout" class="logout-btn">Logout</button>
      </div>
    </div>
    
    <div class="calculator-layout">
      <div class="formula-section">
        <div class="formula-card">
          <h2>GOLD PRICE FORMULA</h2>
          <div class="formula-display">
            <div class="formula">
              <span>(GOLD RATE × GRAMS) + MAKING CHARGE + 12% VAT = FINAL PRICE</span>
            </div>
          </div>
          <div class="currency-info">
            <div class="currency-display">
              <span class="currency-label">Currency:</span>
              <span class="currency-value">Philippine Peso (₱)</span>
            </div>
            <p class="purity-info">Each calculator is for different purity levels</p>
          </div>
        </div>
      </div>
      
      <div class="purity-calculators">
        <div v-for="(data, index) in goldData" :key="index" class="purity-card">
          <div class="purity-header">
            <h3>{{ data.purity }}</h3>
            <span class="rate-label">Rate: ₱{{ formatCurrency(data.rate) }}/g</span>
          </div>
          
          <div class="calculator-inputs">
            <div class="input-row">
              <div class="input-group">
                <label><i class="icon-weight"></i> Grams</label>
                <input 
                  type="number" 
                  v-model="data.grams" 
                  min="0" 
                  step="0.01" 
                  placeholder="0.00"
                  @input="calculateGoldPrice(data)"
                >
              </div>
              
              <div class="input-group">
                <label><i class="icon-charge"></i> Making Charge</label>
                <input 
                  type="number" 
                  v-model="data.makingCharge" 
                  min="0" 
                  step="0.01" 
                  placeholder="₱0.00"
                  @input="calculateGoldPrice(data)"
                >
              </div>
            </div>
            
            <div class="price-breakdown">
              <div class="breakdown-item">
                <span>Gold Value:</span>
                <span class="amount">₱{{ formatCurrency(data.goldValue) }}</span>
              </div>
              <div class="breakdown-item">
                <span>Making Charge:</span>
                <span class="amount">₱{{ formatCurrency(data.makingCharge) }}</span>
              </div>
              <div class="breakdown-item subtotal">
                <span>Subtotal:</span>
                <span class="amount">₱{{ formatCurrency(data.subtotal) }}</span>
              </div>
              <div class="breakdown-item vat">
                <span>VAT (12%):</span>
                <span class="amount">₱{{ formatCurrency(data.vat) }}</span>
              </div>
              <div class="breakdown-item total">
                <span>Total Price:</span>
                <span class="amount total-price">₱{{ formatCurrency(data.totalPrice) }}</span>
              </div>
            </div>
            
            <div class="quick-actions" v-if="data.grams > 0">
              <small>Common weights:</small>
              <div class="quick-buttons">
                <button @click="setQuickWeight(data, 1)">1g</button>
                <button @click="setQuickWeight(data, 5)">5g</button>
                <button @click="setQuickWeight(data, 10)">10g</button>
                <button @click="setQuickWeight(data, 31.1035)">1 tola</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="disclaimer">
      <p>Disclaimer: Gold rates are indicative and may vary. Current rates as of {{ currentDate }}.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Calculator',
  data() {
    return {
      currentTheme: 'gold-theme',
      userName: '',
      currentDate: new Date().toLocaleDateString('en-PH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      goldData: [
        {
          purity: '24K (99.9% Pure)',
          rate: 3200.00,
          grams: 0,
          makingCharge: 0,
          goldValue: 0,
          subtotal: 0,
          vat: 0,
          totalPrice: 0
        },
        {
          purity: '22K (91.6% Pure)',
          rate: 2930.00,
          grams: 0,
          makingCharge: 0,
          goldValue: 0,
          subtotal: 0,
          vat: 0,
          totalPrice: 0
        },
        {
          purity: '21K (87.5% Pure)',
          rate: 2800.00,
          grams: 0,
          makingCharge: 0,
          goldValue: 0,
          subtotal: 0,
          vat: 0,
          totalPrice: 0
        },
        {
          purity: '18K (75% Pure)',
          rate: 2400.00,
          grams: 0,
          makingCharge: 0,
          goldValue: 0,
          subtotal: 0,
          vat: 0,
          totalPrice: 0
        },
        {
          purity: '14K (58.3% Pure)',
          rate: 1866.67,
          grams: 0,
          makingCharge: 0,
          goldValue: 0,
          subtotal: 0,
          vat: 0,
          totalPrice: 0
        },
        {
          purity: '10K (41.7% Pure)',
          rate: 1333.33,
          grams: 0,
          makingCharge: 0,
          goldValue: 0,
          subtotal: 0,
          vat: 0,
          totalPrice: 0
        },
        {
          purity: '8K (33.3% Pure)',
          rate: 1066.67,
          grams: 0,
          makingCharge: 0,
          goldValue: 0,
          subtotal: 0,
          vat: 0,
          totalPrice: 0
        },
        {
          purity: '6K (25% Pure)',
          rate: 800.00,
          grams: 0,
          makingCharge: 0,
          goldValue: 0,
          subtotal: 0,
          vat: 0,
          totalPrice: 0
        }
      ]
    }
  },
  created() {
    const user = JSON.parse(localStorage.getItem('currentUser'))
    if (user) {
      this.userName = user.name
    }
    
    // Load saved theme
    const savedTheme = localStorage.getItem('calculatorTheme')
    if (savedTheme) {
      this.currentTheme = savedTheme
    }
  },
  methods: {
    calculateGoldPrice(data) {
      data.goldValue = data.rate * (data.grams || 0)
      data.subtotal = data.goldValue + (Number(data.makingCharge) || 0)
      data.vat = data.subtotal * 0.12
      data.totalPrice = data.subtotal + data.vat
    },
    
    formatCurrency(value) {
      return value.toLocaleString('en-PH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    },
    
    setQuickWeight(data, grams) {
      data.grams = grams
      this.calculateGoldPrice(data)
    },
    
    toggleTheme() {
      this.currentTheme = this.currentTheme === 'gold-theme' ? 'silver-theme' : 'gold-theme'
      localStorage.setItem('calculatorTheme', this.currentTheme)
    },
    
    logout() {
      localStorage.removeItem('isAuthenticated')
      localStorage.removeItem('currentUser')
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.calculator-container {
  min-height: 100vh;
  padding: 20px;
  transition: background 0.3s;
}

.gold-theme {
  background: linear-gradient(135deg, #f8f0e3 0%, #f5e6ca 100%);
}

.silver-theme {
  background: linear-gradient(135deg, #f0f0f0 0%, #e8e8e8 100%);
}

.calculator-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid rgba(212, 175, 55, 0.3);
}

.silver-theme .calculator-header {
  border-bottom-color: rgba(192, 192, 192, 0.3);
}

.user-info h1 {
  font-size: 2rem;
  background: linear-gradient(135deg, #D4AF37 0%, #FFD700 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 8px;
}

.silver-theme .user-info h1 {
  background: linear-gradient(135deg, #C0C0C0 0%, #E8E8E8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.user-info p {
  color: #666;
  font-size: 1rem;
  font-weight: 500;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.theme-toggle, .logout-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.85rem;
}

.gold-theme .theme-toggle {
  background: linear-gradient(135deg, #D4AF37 0%, #B8860B 100%);
  color: white;
  border: 1px solid #D4AF37;
}

.silver-theme .theme-toggle {
  background: linear-gradient(135deg, #C0C0C0 0%, #A9A9A9 100%);
  color: white;
  border: 1px solid #C0C0C0;
}

.logout-btn {
  background: linear-gradient(135deg, #0052B4 0%, #003366 100%);
  color: white;
  border: none;
}

.theme-toggle:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
}

.silver-theme .theme-toggle:hover {
  box-shadow: 0 4px 12px rgba(192, 192, 192, 0.3);
}

.logout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 82, 180, 0.3);
}

.calculator-layout {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 30px;
  max-width: 1400px;
  margin: 0 auto;
}

.formula-section {
  position: sticky;
  top: 20px;
  height: fit-content;
}

.formula-card {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  border: 1px solid #D4AF37;
}

.silver-theme .formula-card {
  border-color: #C0C0C0;
}

.formula-card h2 {
  color: #333;
  margin-bottom: 20px;
  text-align: center;
  font-size: 1.2rem;
  font-weight: 700;
}

.formula-display {
  background: linear-gradient(135deg, #fff9e6 0%, #fff4d4 100%);
  border-radius: 10px;
  padding: 18px;
  margin-bottom: 20px;
  border: 1px solid #FFE992;
}

.silver-theme .formula-display {
  background: linear-gradient(135deg, #f8f8f8 0%, #f0f0f0 100%);
  border-color: #E0E0E0;
}

.formula {
  font-size: 1rem;
  font-weight: 600;
  color: #444;
  text-align: center;
  line-height: 1.4;
}

.currency-info {
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.currency-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 8px;
}

.currency-label {
  font-weight: 600;
  color: #555;
}

.currency-value {
  font-weight: 700;
  color: #0052B4;
  background: linear-gradient(135deg, #0052B4 0%, #003366 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.purity-info {
  text-align: center;
  color: #666;
  font-size: 0.85rem;
  margin-top: 10px;
  font-style: italic;
}

.purity-calculators {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.purity-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid #E8D49A;
}

.gold-theme .purity-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(212, 175, 55, 0.15);
  border-color: #D4AF37;
}

.silver-theme .purity-card {
  border-color: #E0E0E0;
}

.silver-theme .purity-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(192, 192, 192, 0.15);
  border-color: #C0C0C0;
}

.purity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.purity-header h3 {
  font-size: 1.2rem;
  color: #333;
  margin: 0;
  font-weight: 700;
}

.rate-label {
  background: linear-gradient(135deg, #D4AF37 0%, #B8860B 100%);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

.silver-theme .rate-label {
  background: linear-gradient(135deg, #C0C0C0 0%, #A9A9A9 100%);
}

.calculator-inputs {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.input-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.input-group label {
  font-weight: 600;
  margin-bottom: 6px;
  color: #555;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 6px;
}

.icon-weight:before {
  content: "⚖️";
  font-size: 0.9rem;
}

.icon-charge:before {
  content: "💼";
  font-size: 0.9rem;
}

.input-group input {
  padding: 10px 12px;
  border: 1.5px solid #ddd;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.3s;
  background: #fafafa;
}

.input-group input:focus {
  outline: none;
  border-color: #D4AF37;
  background: white;
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
}

.silver-theme .input-group input:focus {
  border-color: #C0C0C0;
  box-shadow: 0 0 0 3px rgba(192, 192, 192, 0.1);
}

.price-breakdown {
  background: #f9f9f9;
  border-radius: 10px;
  padding: 18px;
  margin-top: 5px;
  border: 1px solid #eee;
}

.breakdown-item {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  border-bottom: 1px dashed #ddd;
  font-size: 0.9rem;
}

.breakdown-item:last-child {
  border-bottom: none;
}

.breakdown-item.subtotal {
  font-weight: 600;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #ddd;
}

.breakdown-item.vat {
  color: #666;
  font-style: italic;
}

.breakdown-item.total {
  font-weight: bold;
  font-size: 1rem;
  color: #333;
  padding-top: 10px;
  margin-top: 10px;
  border-top: 2px solid #D4AF37;
}

.silver-theme .breakdown-item.total {
  border-top-color: #C0C0C0;
}

.amount {
  font-family: 'Courier New', monospace;
  font-weight: 600;
}

.total-price {
  color: #D4AF37;
  font-weight: 800;
}

.silver-theme .total-price {
  color: #666;
}

.quick-actions {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px dashed #ddd;
}

.quick-actions small {
  display: block;
  color: #777;
  margin-bottom: 8px;
  font-size: 0.8rem;
}

.quick-buttons {
  display: flex;
  gap: 8px;
}

.quick-buttons button {
  flex: 1;
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
}

.quick-buttons button:hover {
  background: #f0f0f0;
  border-color: #D4AF37;
}

.silver-theme .quick-buttons button:hover {
  border-color: #C0C0C0;
}

.disclaimer {
  margin-top: 40px;
  padding: 15px;
  text-align: center;
  color: #666;
  font-size: 0.8rem;
  border-top: 1px solid #eee;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
}

@media (max-width: 1200px) {
  .calculator-layout {
    grid-template-columns: 300px 1fr;
    gap: 25px;
  }
  
  .purity-calculators {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}

@media (max-width: 992px) {
  .calculator-layout {
    grid-template-columns: 1fr;
  }
  
  .formula-section {
    position: static;
  }
}

@media (max-width: 768px) {
  .calculator-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .header-actions {
    width: 100%;
    justify-content: center;
  }
  
  .user-info h1 {
    font-size: 1.7rem;
  }
  
  .input-row {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .purity-calculators {
    grid-template-columns: 1fr;
  }
  
  .calculator-container {
    padding: 15px;
  }
}

@media (max-width: 480px) {
  .calculator-header {
    margin-bottom: 20px;
  }
  
  .theme-toggle, .logout-btn {
    padding: 8px 16px;
    font-size: 0.8rem;
  }
  
  .purity-card {
    padding: 15px;
  }
  
  .formula-card {
    padding: 20px 15px;
  }
}
</style>