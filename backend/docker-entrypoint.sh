#!/bin/sh
set -e

echo "⏳ [Credicord Backend] Iniciando servicio..."

# Ejecutar migraciones pendientes automáticamente
echo "🔄 [Prisma] Aplicando migraciones automáticas en la base de datos..."
npx prisma migrate deploy

# Ejecutar siembra de datos si es necesario
echo "🌱 [Prisma] Verificando y ejecutando seed de usuarios y métricas..."
npx prisma db seed || true

echo "🚀 [Credicord Backend] Base de datos sincronizada. Arrancando servidor..."
exec "$@"
