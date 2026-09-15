# Database backup and restore

The application stores accounts, products, addresses, carts, wishlists, orders, and reviews in MySQL. Back up the database before deployments, schema changes, and major admin edits.

## Development database

Start the MySQL container, then create a backup from the repository root:

```powershell
New-Item -ItemType Directory -Force -Path backups | Out-Null
docker compose -f src/main/docker/mysql.yml exec -T mysql mysqldump -uroot --single-transaction --routines --triggers project1onlineshoppingwebsite > backups/project1-backup.sql
```

Confirm that the file exists and is not empty:

```powershell
Get-Item backups/project1-backup.sql | Select-Object FullName, Length, LastWriteTime
```

## Test a restore safely

Always test against a separate database first. The following commands create `project1_restore_test` and load the backup there without changing the application's normal database:

```powershell
docker compose -f src/main/docker/mysql.yml exec -T mysql mysql -uroot -e "DROP DATABASE IF EXISTS project1_restore_test; CREATE DATABASE project1_restore_test CHARACTER SET utf8mb4;"
Get-Content -Raw backups/project1-backup.sql | docker compose -f src/main/docker/mysql.yml exec -T mysql mysql -uroot project1_restore_test
docker compose -f src/main/docker/mysql.yml exec -T mysql mysql -uroot -e "USE project1_restore_test; SHOW TABLES; SELECT COUNT(*) AS users FROM jhi_user; SELECT COUNT(*) AS products FROM product; SELECT COUNT(*) AS orders FROM customer_order;"
```

After checking the counts, the test database can be removed:

```powershell
docker compose -f src/main/docker/mysql.yml exec -T mysql mysql -uroot -e "DROP DATABASE project1_restore_test;"
```

## Hosted database

Use the same `mysqldump` approach with the host, port, database name, username, and password supplied by the hosting provider. Keep credentials in environment variables or the provider's secret manager—never put them in this repository.

Keep at least three recent backups in a private location. A backup is only trustworthy after it has been restored successfully to a separate database and the important table counts have been checked.

> Restoring over the live database replaces live records. Stop the application first and take a fresh backup before performing a live restore.
