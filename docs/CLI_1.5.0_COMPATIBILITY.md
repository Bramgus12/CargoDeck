# Apple Container 1.5.0 compatibility

Validated on 2026-10-01 with Apple Container **1.5.0**, release commit
`d265d669ecae041bf338cb3b39c4118316d138f0`, on Apple silicon and macOS 27.2.
The CLI and its service were upgraded from 1.3.1 using Apple's signed,
notarized installer from the [official release](https://github.com/apple/container/releases/tag/1.5.0).

## App changes

Since CLI 1.4.1, `system status --format json` includes nested `client`,
`server`, `host`, `paths`, and optional `resources` objects. CargoDeck already
recognized its `status: "running"`, but dropped the daemon version. The status
decoder now reads `server.version` as well as the older top-level `version`
and `apiServerVersion` spellings. Missing supplementary fields remain valid.
The client and server versions can differ during an upgrade.

The supported range stays **0.12.3–<2.0.0**. The 0.12 and 1.0 fixtures remain
in the suite; CLI 1.5.0's status-only `unregistered` and `not running` responses
with exit code 1 still lead to the service-start screen.

`CargoDeckTests/Fixtures/1.5.0/system-status-1.5.0.json` was captured from the
running CLI. Only the user-specific application-root path was anonymized.
The fixture covers the new payload without a `healthy` flag or a log-root path.

## Verification

- All 437 release unit tests passed, including regression tests that failed
  before the decoder change in onboarding, status decoding, and System loading.
- All 56 command help surfaces used by CargoDeck remain available.
- A real smoke test passed with a temporary container, network, and 128 MB
  volume using an already-installed Alpine 3.22 image: run, inspect, logs,
  stats, exec, copy in and out, filesystem export, stop/start, image inspection,
  network and volume inspection, volume read/write, disk usage, and properties.
  Only the temporary resources were deleted; no pruning or image deletion ran.

The smoke test verifies file copying on the container's root filesystem.
Copying a host file into a named-volume mount returned success from CLI 1.5.0
but did not make the file visible in that mount. Volume read/write through
`exec` worked. Registry credentials and remote pushes were not exercised.

The [1.5.0 command reference](https://github.com/apple/container/blob/1.5.0/docs/command-reference.md)
also adds `clean` and removes the experimental `k8s start` command. CargoDeck
does not invoke either command, so they do not require app changes.

## Upgrade and rollback

Use Apple's signed installer to replace the CLI, service, and plugins together,
then start the service and verify both components with:

```sh
container system start --disable-kernel-install
container system version --format json
container system status --format json
```

To roll back, finish running workloads, stop the service, install the signed
package from Apple's [1.3.1 release](https://github.com/apple/container/releases/tag/1.3.1),
and start it again. CargoDeck retains the older decoder paths. Replacing the
package does not require uninstalling the CLI or deleting its application data.
