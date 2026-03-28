# Kubernetes (blank)

Add manifests or Helm values when you deploy to a cluster:

- `Deployment` + `Service` for the web image built from [`infra/docker/Dockerfile`](../docker/Dockerfile)  
- `Ingress` / gateway + TLS  
- `Secret` / external secrets operator for `DATABASE_URL`, `JWT_SECRET`  
- Optional: `HorizontalPodAutoscaler`, PDBs  

Health: wire readiness/liveness to `GET /api/v1/me` or a dedicated `/health` route once you add it.
