/**
 * Credicord Bank - Comprehensive Route & JWT Persistence Verification Test
 */
import jwt from 'jsonwebtoken';

const BASE_URL = 'http://localhost:4000/api';
const JWT_SECRET = process.env.JWT_SECRET || 'credicord_super_secret_jwt_key_2025_secure!';

interface TestResult {
  suite: string;
  name: string;
  passed: boolean;
  details?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, suite: string, name: string, details?: string) {
  results.push({
    suite,
    name,
    passed: condition,
    details: condition ? undefined : details || 'Assertion failed',
  });
  const status = condition ? '\x1b[32m✔ PASS\x1b[0m' : '\x1b[31m✖ FAIL\x1b[0m';
  console.log(`  ${status} [${suite}] ${name}${details && !condition ? ` (${details})` : ''}`);
}

async function runTests() {
  console.log('\n\x1b[1m\x1b[36m===============================================================');
  console.log('🏦 Credicord Bank - Test de Rutas y Persistencia JWT');
  console.log('===============================================================\x1b[0m\n');

  // --- SUITE 1: Rutas Públicas y Healthcheck ---
  console.log('\x1b[34m[1/6] Probando Rutas Públicas y Estado del API...\x1b[0m');
  try {
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthData = await healthRes.json();
    assert(healthRes.status === 200 && healthData.status === 'UP', 'Rutas Públicas', 'GET /api/health responde UP (200)');
    assert(healthData.database === 'CONNECTED', 'Rutas Públicas', 'Base de datos PostgreSQL reporta CONNECTED');
  } catch (err: any) {
    assert(false, 'Rutas Públicas', 'GET /api/health disponible', err.message);
  }

  // --- SUITE 2: Acceso no autorizado a rutas protegidas (Sin Token) ---
  console.log('\n\x1b[34m[2/6] Verificando Protección de Rutas (Sin Bearer Token)...\x1b[0m');
  const protectedEndpoints = [
    { method: 'GET', path: '/auth/me' },
    { method: 'GET', path: '/metrics' },
    { method: 'GET', path: '/metrics/activity' },
    { method: 'GET', path: '/users' },
    { method: 'POST', path: '/users', body: {} },
    { method: 'POST', path: '/auth/logout' },
  ];

  for (const ep of protectedEndpoints) {
    const res = await fetch(`${BASE_URL}${ep.path}`, {
      method: ep.method,
      headers: { 'Content-Type': 'application/json' },
      body: ep.body ? JSON.stringify(ep.body) : undefined,
    });
    const data = await res.json();
    assert(
      res.status === 401 && data.code === 'TOKEN_MISSING',
      'Protección de Rutas',
      `${ep.method} ${ep.path} bloqueado sin token (401 TOKEN_MISSING)`
    );
  }

  // --- SUITE 3: Autenticación, Emisión y Estructura del JWT ---
  console.log('\n\x1b[34m[3/6] Probando Flujo de Autenticación y Generación de JWT...\x1b[0m');
  
  // 3.1 Login inválido
  const invalidLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@credicordbank.com', password: 'WrongPassword999!' }),
  });
  const invalidLoginData = await invalidLoginRes.json();
  assert(
    invalidLoginRes.status === 401 && invalidLoginData.code === 'INVALID_CREDENTIALS',
    'Autenticación',
    'POST /api/auth/login rechaza credenciales erróneas (401 INVALID_CREDENTIALS)'
  );

  // 3.2 Login válido como Admin
  const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@credicordbank.com', password: 'Credicord2025!' }),
  });
  const adminLoginData = await adminLoginRes.json();
  const loginPayload = adminLoginData.data || adminLoginData;
  assert(adminLoginRes.status === 200, 'Autenticación', 'POST /api/auth/login exitoso para admin (200 OK)');
  assert(!!loginPayload?.token, 'Autenticación', 'Retorna token JWT en la respuesta');
  assert(loginPayload?.user?.role === 'ADMIN', 'Autenticación', 'Usuario devuelto tiene rol ADMIN');

  const adminToken = loginPayload?.token;

  // 3.3 Verificación de la estructura y firma del JWT
  let decodedPayload: any;
  try {
    decodedPayload = jwt.verify(adminToken, JWT_SECRET);
    assert(!!decodedPayload.id && !!decodedPayload.email, 'Estructura JWT', 'Payload contiene claims requeridos (id, email)');
    assert(decodedPayload.role === 'ADMIN', 'Estructura JWT', 'Payload contiene rol ADMIN');
    assert(decodedPayload.status === 'ACTIVE', 'Estructura JWT', 'Payload contiene estado ACTIVE');
    assert(typeof decodedPayload.exp === 'number' && decodedPayload.exp > Date.now() / 1000, 'Estructura JWT', 'JWT tiene tiempo de expiración válido en el futuro');
  } catch (err: any) {
    assert(false, 'Estructura JWT', 'Firma y decodificación de JWT', err.message);
  }

  // --- SUITE 4: Consumo de Rutas Protegidas con JWT Válido ---
  console.log('\n\x1b[34m[4/6] Verificando Rutas Protegidas con Bearer Token Válido...\x1b[0m');

  // 4.1 GET /api/auth/me
  const meRes = await fetch(`${BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const meData = await meRes.json();
  assert(meRes.status === 200 && meData.data?.email === 'admin@credicordbank.com', 'Rutas Protegidas', 'GET /api/auth/me valida sesión y entrega perfil del usuario');

  // 4.2 GET /api/metrics
  const metricsRes = await fetch(`${BASE_URL}/metrics`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const metricsData = await metricsRes.json();
  const totalBalance = metricsData.data?.accounts?.totalBalanceUSD;
  assert(
    metricsRes.status === 200 && totalBalance !== undefined,
    'Rutas Protegidas',
    `GET /api/metrics retorna balance en custodia ($${totalBalance?.toLocaleString?.() || totalBalance}) y KPIs bancarios`
  );

  // 4.3 GET /api/metrics/activity
  const activityRes = await fetch(`${BASE_URL}/metrics/activity`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const activityData = await activityRes.json();
  assert(activityRes.status === 200 && Array.isArray(activityData.data), 'Rutas Protegidas', 'GET /api/metrics/activity retorna registros de auditoría');

  // 4.4 GET /api/users (Listado paginado)
  const usersRes = await fetch(`${BASE_URL}/users?page=1&limit=5`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const usersData = await usersRes.json();
  assert(
    usersRes.status === 200 && Array.isArray(usersData.data) && usersData.pagination?.total > 0,
    'Rutas Protegidas',
    `GET /api/users responde con ${usersData.data?.length} clientes (Total en BD: ${usersData.pagination?.total})`
  );

  // 4.5 Búsqueda con query insensible
  const searchRes = await fetch(`${BASE_URL}/users?search=elena`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const searchData = await searchRes.json();
  assert(
    searchRes.status === 200 && searchData.data.some((u: any) => u.firstName.toLowerCase().includes('elena')),
    'Rutas Protegidas',
    'GET /api/users?search=elena filtra correctamente a Elena Ríos'
  );

  // --- SUITE 5: Control de Roles (RBAC) y Seguridad ---
  console.log('\n\x1b[34m[5/6] Verificando Control de Acceso Basado en Roles (RBAC)...\x1b[0m');

  // Login como usuario CLIENTE (Elena Ríos)
  const userLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'elena.rios@empresasrios.com', password: 'Credicord2025!' }),
  });
  const userLoginData = await userLoginRes.json();
  const clientToken = userLoginData.data?.token || userLoginData.token;

  // Intento de crear usuario con rol CLIENTE (Debe ser rechazado por requireRoles)
  const forbiddenCreateRes = await fetch(`${BASE_URL}/users`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${clientToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'hacker@test.com',
      password: 'Password123!',
      firstName: 'Test',
      lastName: 'User',
      role: 'USER',
    }),
  });
  const forbiddenCreateData = await forbiddenCreateRes.json();
  assert(
    forbiddenCreateRes.status === 403 && forbiddenCreateData.code === 'FORBIDDEN',
    'RBAC',
    'POST /api/users bloquea creación de usuarios para rol CLIENTE/USER (403 FORBIDDEN)'
  );

  // --- SUITE 6: Integridad, Alteración y Expiración del Token JWT ---
  console.log('\n\x1b[34m[6/6] Verificando Integridad, Expiración y Manejo de JWT Inválido...\x1b[0m');

  // 6.1 Token con firma alterada
  const tamperedToken = adminToken.slice(0, -6) + 'abc123';
  const tamperedRes = await fetch(`${BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${tamperedToken}` },
  });
  const tamperedData = await tamperedRes.json();
  assert(
    tamperedRes.status === 401 && tamperedData.code === 'TOKEN_INVALID',
    'Seguridad JWT',
    'Token con firma alterada es rechazado con 401 TOKEN_INVALID'
  );

  // 6.2 Token expirado (simulado con expiración en el pasado)
  const expiredPayload = {
    id: decodedPayload.id,
    email: decodedPayload.email,
    role: decodedPayload.role,
    status: decodedPayload.status,
  };
  const expiredToken = jwt.sign(expiredPayload, JWT_SECRET, { expiresIn: -30 }); // Expiró hace 30 segundos

  const expiredRes = await fetch(`${BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${expiredToken}` },
  });
  const expiredData = await expiredRes.json();
  assert(
    expiredRes.status === 401 && expiredData.code === 'TOKEN_EXPIRED',
    'Seguridad JWT',
    'Token con fecha vencida es detectado con 401 TOKEN_EXPIRED (activa redirección en Axios)'
  );

  // 6.3 Logout formal
  const logoutRes = await fetch(`${BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const logoutData = await logoutRes.json();
  assert(
    logoutRes.status === 200 && logoutData.success === true,
    'Persistencia y Logout',
    'POST /api/auth/logout registra el cierre de sesión en auditoría'
  );

  // --- RESUMEN FINAL ---
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = total - passed;

  console.log('\n\x1b[1m\x1b[36m===============================================================');
  console.log(`📋 RESUMEN DE PRUEBAS DE RUTAS Y JWT: ${passed}/${total} APROBADAS`);
  console.log('===============================================================\x1b[0m');
  if (failed === 0) {
    console.log('\x1b[32m✔ TODAS LAS PRUEBAS DE RUTAS Y JWT HAN PASADO SATISFACTORIAMENTE.\x1b[0m\n');
  } else {
    console.log(`\x1b[31m✖ Se encontraron ${failed} pruebas fallidas.\x1b[0m\n`);
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Error fatal durante la ejecución de pruebas:', err);
  process.exit(1);
});
