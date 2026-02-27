const express = require('express');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// (Opcional por agora) Configuração da base de dados PostgreSQL
/*
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.connect().then(() => console.log('Ligado ao PostgreSQL')).catch(err => console.error(err));
*/

// ROTAS DA API AQUI (Ex: app.get('/api/contratos', ...))

// Servir o Frontend (React compilado)
app.use(express.static(path.join(__dirname, 'dist')));

// Qualquer outra rota não reconhecida, devolve o React (Single Page Application)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor ativo na porta ${PORT}`);
});
