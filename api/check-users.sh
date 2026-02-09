#!/bin/bash
# Script to check user data in Oracle database

echo "================================"
echo "CHECKING USER DATA IN DATABASE"
echo "================================"

docker exec -i oracle-db sqlplus -s ROOT/root@localhost:1521/FPAPI << 'EOF'
SET LINESIZE 200
SET PAGESIZE 100
COL email FORMAT A35
COL name FORMAT A20
COL id FORMAT A30

SELECT '=== USERS ===' as info FROM dual;
SELECT id, email, name, TO_CHAR(createdAt, 'YYYY-MM-DD HH24:MI:SS') as created 
FROM "user" 
ORDER BY createdAt DESC;

SELECT '=== SESSIONS ===' as info FROM dual;
SELECT id, userId, TO_CHAR(SUBSTR(token, 1, 30)) as token_preview, TO_CHAR(FROM_TZ(CAST((TO_DATE('1970-01-01', 'YYYY-MM-DD') + (expiresAt / 86400000)) AS TIMESTAMP), 'UTC'), 'YYYY-MM-DD HH24:MI:SS') as expires
FROM "session"
ORDER BY id DESC;

SELECT '=== ACCOUNTS ===' as info FROM dual;
SELECT id, userId, accountId, providerId, CASE WHEN password IS NOT NULL THEN 'SET' ELSE 'NULL' END as has_password
FROM account
ORDER BY id DESC;

EXIT;
EOF

