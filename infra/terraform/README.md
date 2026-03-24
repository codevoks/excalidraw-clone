# Terraform / IaC (blank)

Yahan apna cloud foundation add karo:

- VPC / subnets / security groups  
- Managed Postgres / RDS (prod) — local dev ke liye [`docker-compose`](../docker/docker-compose.yml) use karo  
- Secrets manager references for `DATABASE_URL`, `JWT_SECRET`  
- IAM roles for CI deploy, runtime task roles  

State: remote backend (S3 + DynamoDB, Terraform Cloud, etc.) team ke hisaab se configure karna.

No `.tf` files ship with this template on purpose — copy from your org’s module library or provider docs.
