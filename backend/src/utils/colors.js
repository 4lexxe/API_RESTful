// Colores ANSI para terminal
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  
  // Colores de texto
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  
  // Colores de fondo
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m'
};

// Funciones helper para logging con colores
const colorLog = {
  info: (message) => console.log(`${colors.cyan}ℹ ${message}${colors.reset}`),
  success: (message) => console.log(`${colors.green}✓ ${message}${colors.reset}`),
  warning: (message) => console.log(`${colors.yellow}⚠ ${message}${colors.reset}`),
  error: (message) => console.log(`${colors.red}✗ ${message}${colors.reset}`),
  server: (message) => console.log(`${colors.magenta}🚀 ${message}${colors.reset}`),
  url: (message) => console.log(`${colors.blue}📍 ${message}${colors.reset}`)
};

module.exports = { colors, colorLog };
