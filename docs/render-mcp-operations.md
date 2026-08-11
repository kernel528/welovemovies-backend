# Render MCP Operations

## Purpose

Use Render's hosted MCP server for live, read-only production inspection. It
supplements the existing local refresh and HTTP smoke-test workflow; it does
not replace either process.

## Supported Read-Only Workflow

1. Select the intended Render workspace.
2. List services and retrieve service details to confirm the API, dashboard,
   and Postgres resources.
3. Review recent deploy history and deploy details.
4. Query filtered logs and service metrics when investigating a deployment or
   production issue.
5. Run only read-only SQL queries against Render Postgres for data validation.

Use the published service IDs from `Monthly_Prod_Notes.md` when the dashboard
links are still current. Confirm a service's name and URL before inspecting
logs, metrics, deploys, or database data.

## Guardrails

- Do not create resources, trigger deploys, or update environment variables
  without explicit human approval for that individual action.
- Do not request, print, commit, or place `RENDER_API_KEY` in repository files.
- Prefer filtered, time-bounded log and metric requests to avoid unnecessary
  production data exposure.
- Use `npm run refresh:prod` and `npm run smoke:prod` for production data and
  HTTP validation. The MCP server is an inspection tool, not a reseed tool.

## OpenCode Activation

Render hosts its MCP server at `https://mcp.render.com/mcp`. Set
`RENDER_API_KEY` outside this repository, then add the following entry to the
global OpenCode configuration at `~/.config/opencode/opencode.json`:

```json
{
  "mcp": {
    "render": {
      "type": "remote",
      "url": "https://mcp.render.com/mcp",
      "enabled": true,
      "oauth": false,
      "headers": {
        "Authorization": "Bearer {env:RENDER_API_KEY}"
      }
    }
  }
}
```

Merge the `render` entry with the existing configuration; do not replace other
MCP servers. Restart OpenCode after changing its configuration, then verify
access by listing workspaces and selecting the intended workspace.

## References

- `render-coding-agent-links.md` in the workspace root
- https://render.com/docs/mcp-server
- https://render.com/agents/opencode
