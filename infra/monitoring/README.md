# Monitoring & observability (placeholder)

Yahan apna stack wire karo — template sirf hooks chhodta hai.

| Area | Typical tools |
|------|----------------|
| Errors / crashes | Sentry, Bugsnag, Rollbar |
| APM / traces | OpenTelemetry → Grafana Tempo, Datadog, New Relic |
| Logs | structured JSON → Loki, CloudWatch, Datadog logs |
| Metrics | Prometheus + Grafana, OTEL metrics |
| Uptime | Better Stack, Pingdom, platform health checks |

**App wiring**

- Client + server: `apps/web/instrumentation.ts` — `register()` mein Node runtime par SDK bootstrap.
- Env keys: root [`.env.example`](../../.env.example) mein optional variables.

**Infra**

- Docker: healthcheck + `EXPOSE` already `Dockerfile` mein; add `HEALTHCHECK` when you pick a path.
- Kubernetes: `infra/k8s/` (add manifests) or Helm chart in your deploy repo.
