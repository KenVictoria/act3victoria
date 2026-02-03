cat > vue.config.js << EOF
module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/act3victoria/'
    : '/'
}
EOF